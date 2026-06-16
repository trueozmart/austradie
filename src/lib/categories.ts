export interface Category {
  slug: string;
  label: string;
  pluralLabel: string;
  category: string;
  icon: string;
}

export const CATEGORIES: Category[] = [
  { slug: 'painters', label: 'Painter', pluralLabel: 'Painters', category: 'Painter', icon: '🖌️' },
  { slug: 'plumbers', label: 'Plumber', pluralLabel: 'Plumbers', category: 'Plumber', icon: '🔧' },
  { slug: 'roofers', label: 'Roofer', pluralLabel: 'Roofers', category: 'Roofer', icon: '🏠' },
  { slug: 'builders', label: 'Builder', pluralLabel: 'Builders', category: 'Builder', icon: '🏗️' },
  { slug: 'handymen', label: 'Handyman', pluralLabel: 'Handymen', category: 'Handyman', icon: '🛠️' },
  { slug: 'electricians', label: 'Electrician', pluralLabel: 'Electricians', category: 'Electrician', icon: '⚡' },
  { slug: 'carpenters', label: 'Carpenter', pluralLabel: 'Carpenters', category: 'Carpenter', icon: '🪚' },
  { slug: 'tilers', label: 'Tiler', pluralLabel: 'Tilers', category: 'Tiler', icon: '🧱' },
  { slug: 'plasterers', label: 'Plasterer', pluralLabel: 'Plasterers', category: 'Plasterer', icon: '🧰' },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getCategoryByName(category: string): Category | undefined {
  return CATEGORIES.find((c) => c.category.toLowerCase() === category.toLowerCase());
}

export const STATES = [
  { slug: 'nsw', label: 'NSW', name: 'New South Wales' },
  { slug: 'vic', label: 'VIC', name: 'Victoria' },
  { slug: 'qld', label: 'QLD', name: 'Queensland' },
  { slug: 'wa', label: 'WA', name: 'Western Australia' },
  { slug: 'sa', label: 'SA', name: 'South Australia' },
  { slug: 'tas', label: 'TAS', name: 'Tasmania' },
  { slug: 'act', label: 'ACT', name: 'Australian Capital Territory' },
  { slug: 'nt', label: 'NT', name: 'Northern Territory' },
];

export function getStateBySlug(slug: string) {
  return STATES.find((s) => s.slug === slug.toLowerCase());
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
