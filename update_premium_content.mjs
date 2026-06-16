import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import 'dotenv/config';

const supabase = createClient(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const testimonials = JSON.parse(readFileSync('/tmp/clientsites/testimonials.json', 'utf-8'));

const updates = [
  {
    name: 'Moon Lounge Flooring',
    summary:
      "Moon Lounge Flooring is a premium carpet and flooring specialist based in Port Melbourne, Victoria. The team supplies and installs carpet, carpet tiles and commercial flooring, plus professional carpet cleaning, for homes and businesses across inner Melbourne.",
    services: [
      'Carpet Supply & Installation',
      'Carpet Tile Supply & Installation',
      'Commercial Flooring',
      'Residential Flooring Upgrades',
      'Professional Carpet Cleaning',
      'Floor Preparation & Fitting',
    ],
    gallery_images: ['gallery-1.jpg', 'gallery-2.jpg', 'gallery-3.jpg', 'gallery-4.jpg'].map(
      (f) => `/images/clients/moon-lounge-flooring/${f}`
    ),
    testimonials: testimonials['moonlounge.au'],
  },
  {
    name: 'Top Roofing',
    summary:
      'Top Roofing Pty Ltd are metal roofing specialists based in Brookvale, NSW, serving the Northern Beaches and Greater Sydney. They handle residential, commercial and industrial metal roofing, tile-to-metal re-roofs, skylight installation and repairs.',
    services: [
      'Metal Roofing',
      'New Installations',
      'Tile to Metal Re-Roofs',
      'Skylight Installation',
      'Commercial Roofing',
      'Repairs & Maintenance',
      'Gutters & Fascia',
      'Cladding',
    ],
    gallery_images: ['gallery-1.jpg', 'gallery-2.jpg', 'gallery-3.jpg', 'gallery-4.jpg'].map(
      (f) => `/images/clients/top-roofing/${f}`
    ),
    testimonials: testimonials['toproofing.com.au'],
  },
  {
    name: 'Ezy Rock Tops',
    summary:
      'Ezy Rock Tops are stone benchtop and fabrication specialists based in Orange, NSW. They supply silica-free engineered stone with precision CNC and waterjet cutting for kitchen and bathroom benchtops, outdoor kitchens and custom stone projects across the Central West.',
    services: ['Kitchen & Bathroom Benchtops', 'Outdoor & Custom Stone', 'CNC Stone Cutting', 'Waterjet Cutting'],
    gallery_images: ['gallery-1.jpg', 'gallery-2.jpg', 'gallery-3.jpg', 'gallery-4.jpg'].map(
      (f) => `/images/clients/ezy-rocktops/${f}`
    ),
    testimonials: testimonials['ezyrocktops.com.au'],
  },
  {
    name: 'Chatfield Constructions',
    summary:
      'Chatfield Constructions is a licensed building, civil and playground contractor serving government, education and commercial clients across the Atherton Tablelands and Cairns region, with strong in-house capability and a focus on safe, on-time delivery.',
    services: [
      'Playground Design & Construction',
      'School & Government Works',
      'Commercial Fit-Outs',
      'Civil Works',
      'Concreting',
      'Fencing & External Works',
      'Re-Roofing & Bathroom Renovations',
      'Timber Construction',
      'Landscaping',
    ],
    gallery_images: ['gallery-1.jpg', 'gallery-2.jpg', 'gallery-3.jpg', 'gallery-4.jpg'].map(
      (f) => `/images/clients/chatfield-constructions/${f}`
    ),
    testimonials: testimonials['chatfieldconstructions.com.au'],
  },
  {
    name: 'Home Trade Doctor',
    summary:
      'Home Trade Doctor is a home maintenance concierge serving the Illawarra, including Thirroul, Austinmer, Coledale, Scarborough, Clifton and Wombarra. Not sure who to call? They diagnose home issues and connect you with the right trade, first time.',
    services: [
      'Problem Diagnosis',
      'Trade Matching',
      'Plumbing Issues',
      'Electrical Faults',
      'Roofing Problems',
      'Handyman Services',
      'Landlord Support',
      'Airbnb Management',
      'NDIS Home Modifications',
    ],
    gallery_images: ['gallery-1.jpg', 'gallery-2.jpg', 'gallery-3.jpg', 'gallery-4.jpg'].map(
      (f) => `/images/clients/home-trade-doctor/${f}`
    ),
    testimonials: testimonials['hometradedoctor.com.au'],
  },
  {
    name: 'Monckton Constructions',
    summary:
      'Monckton Constructions provides concrete slabs and concreting services based in Cobar, NSW, with local soil and climate knowledge across the Central West. They pour shed slabs, house slabs, driveways, farm infrastructure, footings and industrial pads.',
    services: [
      'Shed Slabs',
      'House Slabs',
      'Driveways',
      'Farm Infrastructure',
      'Industrial Pads',
      'Footings & Foundations',
      'Hardstand Areas',
      'Custom Concrete Projects',
    ],
    gallery_images: ['gallery-1.jpg', 'gallery-2.jpg', 'gallery-3.jpg', 'gallery-4.jpg'].map(
      (f) => `/images/clients/monckton-constructions/${f}`
    ),
    testimonials: testimonials['moncktonconstructions.com.au'],
  },
  {
    name: 'MB Roller Doors & Sheds',
    summary:
      'MB Roller Doors & Sheds supplies, installs and repairs roller doors, garage doors and custom sheds across Adelaide and South Australia, offering free on-site quotes and local expertise on carports, steel structures and security roller shutters.',
    services: [
      'Roller Door Installation',
      'Custom Shed Construction',
      'Roller Door Repairs & Maintenance',
      'Carports & Steel Structures',
      'Security Roller Shutters',
    ],
    gallery_images: ['gallery-1.png', 'gallery-2.png', 'gallery-3.png', 'gallery-4.png'].map(
      (f) => `/images/clients/mb-roller-doors-and-sheds/${f}`
    ),
    testimonials: testimonials['mbrollerdoorsandsheds.com.au'],
  },
  {
    name: 'CG Painting',
    summary:
      'CG Painting are trusted local painters delivering high-quality residential and commercial painting across Mudgee and the Central West NSW, covering interior and exterior painting, surface preparation, repairs, colour consultation and feature walls.',
    services: [
      'Interior Residential Painting',
      'Exterior Residential Painting',
      'Commercial Painting',
      'Surface Preparation',
      'Repairs & Maintenance',
      'Colour Consultation',
      'Custom Finishes',
      'Feature Walls',
    ],
    gallery_images: ['gallery-1.png', 'gallery-2.png', 'gallery-3.png', 'gallery-4.png'].map(
      (f) => `/images/clients/cg-painting/${f}`
    ),
    testimonials: testimonials['cgpainting.com.au'],
  },
  {
    name: 'Matt Hadley Painting',
    summary:
      'Matt Hadley Painting and Decorating brings over 30 years of experience painting homes in Bathurst and surrounds, covering interior, exterior, decorative and commercial painting with a strong track record of client satisfaction.',
    services: [
      'Interior Painting',
      'Exterior Painting',
      'Decorative Finishes',
      'Mould Removal',
      'High Pressure Cleaning',
      'Repairs & Patching',
      'Residential Painting',
      'Commercial Painting',
    ],
    gallery_images: ['gallery-1.jpg', 'gallery-2.jpg', 'gallery-3.jpg', 'gallery-4.jpg'].map(
      (f) => `/images/clients/matt-hadley-painting/${f}`
    ),
    testimonials: testimonials['matthadleypainting.com.au'],
  },
  {
    name: 'Stoneman Group',
    summary:
      'Stoneman Welding and Fabrication provides custom welding, metal fabrication, agricultural repairs, structural steel and mobile welding services based in Trangie, servicing the Central West NSW.',
    services: [
      'Custom Welding',
      'Agricultural Repairs',
      'Structural Steel',
      'Mobile Welding',
      'Metal Finishing',
      'General Fabrication',
    ],
    gallery_images: ['gallery-1.jpg', 'gallery-2.jpg', 'gallery-3.jpg', 'gallery-4.jpg'].map(
      (f) => `/images/clients/stoneman-group/${f}`
    ),
    testimonials: testimonials['stonemangroup.au'],
  },
  {
    name: 'PRIMR Painting',
    summary:
      'PRIMR Painting delivers premium interior and exterior painting for homes and small businesses across Sunbury, Diggers Rest, Gisborne and the Macedon Ranges.',
    services: [
      'Interior Painting',
      'Exterior Painting',
      'Surface Preparation',
      'Repairs & Touch-Ups',
      'Commercial Painting',
      'Colour Consultation',
      'Spray Finishes',
      'Feature Walls',
    ],
    gallery_images: ['gallery-1.jpg', 'gallery-2.jpg', 'gallery-3.jpg', 'gallery-4.jpg'].map(
      (f) => `/images/clients/primr-painting/${f}`
    ),
    testimonials: testimonials['primrpainting.com.au'],
  },
  {
    name: 'Justin Bowe Building',
    summary:
      'Justin Bowe Building is a trusted local builder based in North Toowoomba, QLD, specialising in new home construction and custom builds across the Toowoomba region with a focus on quality craftsmanship and personal service.',
    services: [
      'Custom Home Design',
      'Site & Planning',
      'Project Management',
      'Quality Construction',
      'Interior Finishing',
      'Handover & Support',
    ],
    gallery_images: ['gallery-1.jpg', 'gallery-2.jpg', 'gallery-3.jpg', 'gallery-4.jpg'].map(
      (f) => `/images/clients/justin-bowe-building/${f}`
    ),
    testimonials: testimonials['justinbowebuilding.com.au'],
  },
];

for (const u of updates) {
  const { error, count } = await supabase
    .from('listings')
    .update({
      summary: u.summary,
      services: u.services,
      gallery_images: u.gallery_images,
      testimonials: u.testimonials,
    })
    .eq('name', u.name)
    .eq('is_corepages_client', true)
    .select('id', { count: 'exact' });

  if (error) {
    console.error(`Failed for ${u.name}:`, error.message);
  } else {
    console.log(`Updated ${u.name}`);
  }
}
