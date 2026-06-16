// Parses the n8n scrape CSV, maps to our category set, extracts suburb/state/postcode
// from the address, dedupes against existing listings (by place_id), and writes a
// clean CSV ready for import-listings.mjs.
//
// Usage:
//   node scripts/build-n8n-import.mjs "/path/to/N8n testing - Sheet14.csv" /tmp/n8n_clean.csv

import { readFileSync, writeFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const [, , srcPath, outPath] = process.argv;
if (!srcPath || !outPath) {
  console.error('Usage: node scripts/build-n8n-import.mjs <src.csv> <out.csv>');
  process.exit(1);
}

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, serviceRoleKey);

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && next === '\n') i++;
      row.push(field);
      field = '';
      if (row.some((f) => f !== '')) rows.push(row);
      row = [];
    } else {
      field += char;
    }
  }
  if (field !== '' || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function rowsToObjects(rows) {
  const [header, ...rest] = rows;
  return rest.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ''])));
}

function toCsv(rows) {
  const header = [
    'name',
    'category',
    'address',
    'suburb',
    'state',
    'postcode',
    'phone',
    'phone_raw',
    'image_url',
    'place_id',
    'has_website',
    'website_url',
  ];
  const esc = (v) => {
    const s = v === null || v === undefined ? '' : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [header.join(',')];
  for (const r of rows) {
    lines.push(header.map((h) => esc(r[h])).join(','));
  }
  return lines.join('\n');
}

const CATEGORY_MAP = {
  painter: 'Painter',
  painting: 'Painter',
  plumber: 'Plumber',
  'roofing contractor': 'Roofer',
  roofer: 'Roofer',
  'home builder': 'Builder',
  'custom home builder': 'Builder',
  builder: 'Builder',
  'building firm': 'Builder',
  'general contractor': 'Builder',
  'construction company': 'Builder',
  'shed builder': 'Builder',
  'handyman/handywoman/handyperson': 'Handyman',
  handyman: 'Handyman',
  electrician: 'Electrician',
  'electrical installation service': 'Electrician',
  carpenter: 'Carpenter',
  'deck builder': 'Carpenter',
  'cabinet maker': 'Carpenter',
  'tile contractor': 'Tiler',
  tiler: 'Tiler',
  plasterer: 'Plasterer',
  'dry wall contractor': 'Plasterer',
};

const ADDR_PAT = /(?:,\s*)?([A-Za-z\s'-]+?)\s+(NSW|VIC|QLD|WA|SA|TAS|ACT|NT)\s+(\d{4}),\s*Australia/;

function formatPhone(phoneKey, phoneUnformatted) {
  const digits = (phoneKey || phoneUnformatted.replace(/^\+61/, '')).replace(/\D/g, '');
  if (!digits) return { phone: null, phone_raw: null };
  const national = '0' + digits;
  const formatted = national.replace(/^(\d{4})(\d{3})(\d{3})$/, '$1 $2 $3');
  return { phone: formatted, phone_raw: national };
}

const csvText = readFileSync(srcPath, 'utf-8');
const rows = rowsToObjects(parseCsv(csvText));
console.log(`Parsed ${rows.length} source rows`);

const { data: existing, error } = await supabase.from('listings').select('place_id');
if (error) {
  console.error('Failed to fetch existing place_ids:', error.message);
  process.exit(1);
}
const existingPlaceIds = new Set(existing.map((r) => r.place_id).filter(Boolean));
console.log(`${existingPlaceIds.size} existing place_ids`);

const seen = new Set();
const out = [];
let noCat = 0;
let noAddr = 0;
let noPhone = 0;
let dupe = 0;

for (const row of rows) {
  const category = CATEGORY_MAP[row['categories/0']?.trim().toLowerCase()];
  if (!category) {
    noCat++;
    continue;
  }

  const m = ADDR_PAT.exec(row.address || '');
  if (!m) {
    noAddr++;
    continue;
  }

  const placeId = row.placeId?.trim() || null;
  if (placeId && (existingPlaceIds.has(placeId) || seen.has(placeId))) {
    dupe++;
    continue;
  }

  const { phone, phone_raw } = formatPhone(row['Phone Key']?.trim(), row.phoneUnformatted?.trim() || '');
  if (!phone) {
    noPhone++;
    continue;
  }

  if (placeId) seen.add(placeId);

  out.push({
    name: row['Business name']?.trim(),
    category,
    address: row.address.trim(),
    suburb: m[1].trim(),
    state: m[2],
    postcode: m[3],
    phone,
    phone_raw,
    image_url: row.imageUrl?.trim() || null,
    place_id: placeId,
    has_website: false,
    website_url: null,
  });
}

console.log(`Skipped: no category match=${noCat}, no parseable address=${noAddr}, no phone=${noPhone}, dupe place_id=${dupe}`);
console.log(`Writing ${out.length} rows to ${outPath}`);
writeFileSync(outPath, toCsv(out));
