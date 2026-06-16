// One-off: set image_url for the 3 CorePages client listings to their
// real project photos (copied into public/images/clients/<slug>/hero.jpg).
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY env vars.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const UPDATES = [
  { name: 'Goat Painter', image_url: '/images/clients/goat-painter/hero.jpg' },
  { name: 'James Mills Roofing', image_url: '/images/clients/james-mills-roofing/hero.jpg' },
  { name: 'Odd Job Bloke', image_url: '/images/clients/odd-job-bloke/hero.jpg' },
];

for (const { name, image_url } of UPDATES) {
  const { error, count } = await supabase
    .from('listings')
    .update({ image_url }, { count: 'exact' })
    .eq('name', name)
    .eq('is_corepages_client', true);

  if (error) {
    console.error(`${name}: failed -`, error.message);
  } else {
    console.log(`${name}: updated (${count} row${count === 1 ? '' : 's'})`);
  }
}
