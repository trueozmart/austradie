import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const rows = [
  {
    name: 'Moon Lounge Flooring',
    category: 'Tiler',
    address: null,
    suburb: 'Port Melbourne',
    state: 'VIC',
    postcode: '3207',
    phone: '0439 974 299',
    phone_raw: '0439974299',
    image_url: '/images/clients/moon-lounge-flooring/hero.jpg',
    place_id: null,
    has_website: true,
    website_url: 'moonlounge.au',
    is_corepages_client: true,
  },
  {
    name: 'Top Roofing',
    category: 'Roofer',
    address: null,
    suburb: 'Brookvale',
    state: 'NSW',
    postcode: '2100',
    phone: '0410 794 188',
    phone_raw: '0410794188',
    image_url: '/images/clients/top-roofing/hero.jpg',
    place_id: null,
    has_website: true,
    website_url: 'toproofing.com.au',
    is_corepages_client: true,
  },
  {
    name: 'Ezy Rock Tops',
    category: 'Builder',
    address: null,
    suburb: 'Orange',
    state: 'NSW',
    postcode: '2800',
    phone: '0413 645 501',
    phone_raw: '0413645501',
    image_url: '/images/clients/ezy-rocktops/hero.png',
    place_id: null,
    has_website: true,
    website_url: 'ezyrocktops.com.au',
    is_corepages_client: true,
  },
  {
    name: 'Chatfield Constructions',
    category: 'Builder',
    address: null,
    suburb: 'Atherton',
    state: 'QLD',
    postcode: '4883',
    phone: '0437 831 423',
    phone_raw: '0437831423',
    image_url: '/images/clients/chatfield-constructions/hero.jpg',
    place_id: null,
    has_website: true,
    website_url: 'chatfieldconstructions.com.au',
    is_corepages_client: true,
  },
  {
    name: 'Home Trade Doctor',
    category: 'Handyman',
    address: null,
    suburb: 'Wollongong',
    state: 'NSW',
    postcode: '2500',
    phone: '0422 830 115',
    phone_raw: '0422830115',
    image_url: '/images/clients/home-trade-doctor/hero.png',
    place_id: null,
    has_website: true,
    website_url: 'hometradedoctor.com.au',
    is_corepages_client: true,
  },
  {
    name: 'Monckton Constructions',
    category: 'Builder',
    address: null,
    suburb: 'Cobar',
    state: 'NSW',
    postcode: '2835',
    phone: '0400 754 862',
    phone_raw: '0400754862',
    image_url: '/images/clients/monckton-constructions/hero.png',
    place_id: null,
    has_website: true,
    website_url: 'moncktonconstructions.com.au',
    is_corepages_client: true,
  },
  {
    name: 'MB Roller Doors & Sheds',
    category: 'Builder',
    address: null,
    suburb: 'Adelaide',
    state: 'SA',
    postcode: '5000',
    phone: '0422 652 987',
    phone_raw: '0422652987',
    image_url: '/images/clients/mb-roller-doors-and-sheds/hero.jpg',
    place_id: null,
    has_website: true,
    website_url: 'mbrollerdoorsandsheds.com.au',
    is_corepages_client: true,
  },
  {
    name: 'CG Painting',
    category: 'Painter',
    address: null,
    suburb: 'Mudgee',
    state: 'NSW',
    postcode: '2850',
    phone: '0497 396 790',
    phone_raw: '0497396790',
    image_url: '/images/clients/cg-painting/hero.png',
    place_id: null,
    has_website: true,
    website_url: 'cgpainting.com.au',
    is_corepages_client: true,
  },
  {
    name: 'Matt Hadley Painting',
    category: 'Painter',
    address: null,
    suburb: 'Bathurst',
    state: 'NSW',
    postcode: '2795',
    phone: '0447 020 873',
    phone_raw: '0447020873',
    image_url: '/images/clients/matt-hadley-painting/hero.jpg',
    place_id: null,
    has_website: true,
    website_url: 'matthadleypainting.com.au',
    is_corepages_client: true,
  },
  {
    name: 'Stoneman Group',
    category: 'Builder',
    address: null,
    suburb: 'Trangie',
    state: 'NSW',
    postcode: '2823',
    phone: '0458 089 440',
    phone_raw: '0458089440',
    image_url: '/images/clients/stoneman-group/hero.png',
    place_id: null,
    has_website: true,
    website_url: 'stonemangroup.au',
    is_corepages_client: true,
  },
  {
    name: 'PRIMR Painting',
    category: 'Painter',
    address: null,
    suburb: 'Sunbury',
    state: 'VIC',
    postcode: '3429',
    phone: '0478 154 304',
    phone_raw: '0478154304',
    image_url: '/images/clients/primr-painting/hero.png',
    place_id: null,
    has_website: true,
    website_url: 'primrpainting.com.au',
    is_corepages_client: true,
  },
];

const { error } = await supabase.from('listings').insert(rows);
if (error) {
  console.error('Insert failed:', error.message);
  process.exit(1);
}
console.log(`Inserted ${rows.length} listings.`);

// Update existing Justin Bowe Building row with website + image
const { error: updateError, data: updated } = await supabase
  .from('listings')
  .update({
    website_url: 'justinbowebuilding.com.au',
    has_website: true,
    image_url: '/images/clients/justin-bowe-building/hero.png',
    is_corepages_client: true,
  })
  .eq('id', '4c572f3e-8787-4253-925e-4d8fa18ae1d6')
  .select();

if (updateError) {
  console.error('Update failed:', updateError.message);
  process.exit(1);
}
console.log('Updated Justin Bowe Building:', updated);

const { count } = await supabase.from('listings').select('*', { count: 'exact', head: true });
console.log(`Total listings now: ${count}`);
