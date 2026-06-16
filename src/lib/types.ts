export interface Listing {
  id: string;
  name: string;
  category: string;
  address: string | null;
  suburb: string | null;
  state: string | null;
  postcode: string | null;
  phone: string | null;
  phone_raw: string | null;
  image_url: string | null;
  place_id: string | null;
  has_website: boolean;
  website_url: string | null;
  is_corepages_client: boolean;
  created_at: string;
  summary: string | null;
  services: string[] | null;
  gallery_images: string[] | null;
  testimonials: { text: string; author: string; location: string }[] | null;
}
