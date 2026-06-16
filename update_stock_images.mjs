import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const CATEGORY_STOCK = {
  'Painter':                       '/images/stock/painter.jpg',
  'Builder':                       '/images/stock/builder.jpg',
  'Plumber':                       '/images/stock/plumber.jpg',
  'Roofer':                        '/images/stock/roofer.jpg',
  'Electrician':                   '/images/stock/electrician.jpg',
  'Handyman':                      '/images/stock/handyman.jpg',
  'Carpenter':                     '/images/stock/carpenter.jpg',
  'Plasterer':                     '/images/stock/plasterer.jpg',
  'Tiler':                         '/images/stock/tiler.jpg',
  'Landscaper':                    '/images/stock/landscaper.jpg',
  'Interior designer':             '/images/stock/interior-designer.jpg',
  'Concreter':                     '/images/stock/concreter.jpg',
  'Deck builder':                  '/images/stock/deck-builder.jpg',
  'Air Conditioning':              '/images/stock/generic-trade.jpg',
  'Air conditioning repair service': '/images/stock/generic-trade.jpg',
  'Property Maintenance':          '/images/stock/handyman.jpg',
  'Waterproofer':                  '/images/stock/generic-trade.jpg',
  'Insulation contractor':         '/images/stock/generic-trade.jpg',
  'Cabinet maker':                 '/images/stock/carpenter.jpg',
  'Dry wall contractor':           '/images/stock/plasterer.jpg',
  'Garage door supplier':          '/images/stock/generic-trade.jpg',
  'Solar energy company':          '/images/stock/generic-trade.jpg',
  'Building restoration service':  '/images/stock/builder.jpg',
  'Metal fabricator':              '/images/stock/generic-trade.jpg',
  'Welder':                        '/images/stock/generic-trade.jpg',
  'Rug store':                     '/images/stock/interior-designer.jpg',
  'Real estate agency':            '/images/stock/builder.jpg',
  'Janitorial service':            '/images/stock/generic-trade.jpg',
  'Moving and storage service':    '/images/stock/generic-trade.jpg',
  'Lawn care service':             '/images/stock/landscaper.jpg',
};

for (const [category, imageUrl] of Object.entries(CATEGORY_STOCK)) {
  const { error, count } = await supabase
    .from('listings')
    .update({ image_url: imageUrl })
    .eq('category', category)
    .like('image_url', 'https://%')
    .select('id', { count: 'exact' });

  if (error) {
    console.error(`❌ ${category}:`, error.message);
  } else {
    console.log(`✅ ${category}: updated rows`);
  }
}

// Final check
const { data } = await supabase.from('listings').select('category').like('image_url', 'https://%');
console.log(`\nRemaining Google URLs: ${data.length}`);
