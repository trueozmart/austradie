-- Run this in the Supabase SQL editor before importing data.

create extension if not exists pgcrypto;

create table if not exists listings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  address text,
  suburb text,
  state text,
  postcode text,
  phone text,
  phone_raw text,
  image_url text,
  place_id text,
  has_website boolean default false,
  website_url text,
  is_corepages_client boolean default false,
  created_at timestamptz default now(),
  summary text,
  services jsonb,
  gallery_images jsonb,
  testimonials jsonb
);

-- Premium listing content (run if columns don't already exist on an existing table):
-- alter table listings add column if not exists summary text;
-- alter table listings add column if not exists services jsonb;
-- alter table listings add column if not exists gallery_images jsonb;
-- alter table listings add column if not exists testimonials jsonb;

create index if not exists listings_category_idx on listings (category);
create index if not exists listings_suburb_idx on listings (suburb);
create index if not exists listings_state_idx on listings (state);
create index if not exists listings_category_state_idx on listings (category, state);
create index if not exists listings_has_website_idx on listings (has_website);

-- Allow the public (anon) frontend to read listings.
alter table listings enable row level security;

create policy "Public read access" on listings
  for select
  using (true);

-- Lead capture (quote requests) — anon can submit, only admins (service role) read.
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references listings(id),
  category text,
  suburb text,
  state text,
  name text not null,
  phone text not null,
  email text,
  message text,
  created_at timestamptz default now()
);

alter table leads enable row level security;

create policy "Public insert access" on leads
  for insert
  with check (true);

-- Self-serve "add your business" submissions — anon can submit, reviewed before going live.
create table if not exists pending_listings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  suburb text,
  state text,
  phone text,
  email text,
  website_url text,
  notes text,
  created_at timestamptz default now()
);

alter table pending_listings enable row level security;

create policy "Public insert access" on pending_listings
  for insert
  with check (true);
