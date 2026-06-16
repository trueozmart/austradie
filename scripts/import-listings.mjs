// Imports clean_listings.csv into the Supabase `listings` table and adds the
// known CorePages client records.
//
// Usage:
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/import-listings.mjs /path/to/clean_listings.csv
//
// The service role key is required because RLS only allows public reads.
// Find it in Supabase: Project Settings -> API -> service_role key.

import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const csvPath = process.argv[2];
if (!csvPath) {
  console.error('Usage: node scripts/import-listings.mjs <path-to-clean_listings.csv>');
  process.exit(1);
}

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY env vars.');
  process.exit(1);
}

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

const CSV_TO_DB = (row) => ({
  name: row.name,
  category: row.category,
  address: row.address || null,
  suburb: row.suburb || null,
  state: row.state || null,
  postcode: row.postcode || null,
  phone: row.phone || null,
  phone_raw: row.phone_raw || null,
  image_url: row.image_url || null,
  place_id: row.place_id || null,
  has_website: row.has_website === 'True' || row.has_website === 'true',
  website_url: row.website_url || null,
  is_corepages_client: false,
});

const COREPAGES_CLIENTS = [
  {
    name: 'Goat Painter',
    category: 'Painter',
    suburb: 'Bendigo',
    state: 'VIC',
    website_url: 'goathousepainter.com.au',
  },
  {
    name: 'James Mills Roofing',
    category: 'Roofer',
    suburb: 'Yinnar',
    state: 'VIC',
    website_url: 'jmillsroofing.com.au',
  },
  {
    name: 'Odd Job Bloke',
    category: 'Handyman',
    suburb: 'Dingley Village',
    state: 'VIC',
    website_url: 'oddjobbloke.com.au',
  },
].map((c) => ({
  name: c.name,
  category: c.category,
  address: null,
  suburb: c.suburb,
  state: c.state,
  postcode: null,
  phone: null,
  phone_raw: null,
  image_url: null,
  place_id: null,
  has_website: true,
  website_url: c.website_url,
  is_corepages_client: true,
}));

async function insertInBatches(rows, batchSize = 50) {
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const { error } = await supabase.from('listings').insert(batch);
    if (error) {
      console.error(`Batch ${i / batchSize + 1} failed:`, error.message);
      process.exit(1);
    }
    console.log(`Inserted rows ${i + 1}-${i + batch.length}`);
  }
}

const csvText = readFileSync(csvPath, 'utf-8');
const rows = rowsToObjects(parseCsv(csvText));
console.log(`Parsed ${rows.length} listings from CSV`);

const dbRows = rows.map(CSV_TO_DB);

await insertInBatches(dbRows);
console.log('Imported CSV listings.');

await insertInBatches(COREPAGES_CLIENTS);
console.log('Imported CorePages client listings.');

console.log('Done.');
