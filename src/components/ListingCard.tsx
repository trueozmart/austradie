import { Link } from 'react-router-dom';
import type { Listing } from '../lib/types';
import { getCategoryByName, slugify } from '../lib/categories';

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="408" height="240" viewBox="0 0 408 240"%3E%3Crect width="408" height="240" fill="%23e5e4e7"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-family="sans-serif" font-size="20"%3ENo photo available%3C/text%3E%3C/svg%3E';

export default function ListingCard({ listing }: { listing: Listing }) {
  const category = getCategoryByName(listing.category);
  const detailUrl = `/listing/${listing.id}/${slugify(listing.name)}`;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative h-44 w-full overflow-hidden bg-gray-100">
        <img
          src={listing.image_url || PLACEHOLDER_IMAGE}
          alt={listing.name}
          loading="lazy"
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.src = PLACEHOLDER_IMAGE;
          }}
        />
        {listing.is_corepages_client && (
          <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-navy px-2.5 py-1 text-xs font-semibold text-gold-light shadow">
            ✓ Enhanced Listing
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-navy">
          {listing.name}
        </h3>
        <p className="text-sm text-gray-600">
          {category ? `${category.icon} ${category.label}` : listing.category}
        </p>
        {(listing.suburb || listing.state) && (
          <p className="truncate text-sm text-gray-600">
            📍 {[listing.suburb, listing.state].filter(Boolean).join(', ')}
          </p>
        )}
        {listing.phone && (
          <a
            href={`tel:${listing.phone_raw || listing.phone}`}
            className="truncate text-sm text-gray-600 hover:text-navy"
          >
            📞 {listing.phone}
          </a>
        )}

        <div className="mt-4 flex flex-col gap-2">
          {listing.is_corepages_client && listing.website_url ? (
            <a
              href={
                listing.website_url.startsWith('http')
                  ? listing.website_url
                  : `https://${listing.website_url}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-md bg-navy px-3 py-2 text-center text-sm font-medium text-white hover:bg-navy-light"
            >
              Visit Website
            </a>
          ) : (
            <Link
              to={`/claim?tab=website&business=${encodeURIComponent(listing.name)}&category=${encodeURIComponent(
                listing.category
              )}&suburb=${encodeURIComponent(listing.suburb || '')}&state=${encodeURIComponent(listing.state || '')}`}
              className="w-full rounded-md bg-gold px-3 py-2 text-center text-sm font-semibold text-navy hover:bg-gold-light"
            >
              Get a Website →
            </Link>
          )}
          <Link
            to={detailUrl}
            className="w-full rounded-md border border-navy px-3 py-2 text-center text-sm font-medium text-navy hover:bg-navy hover:text-white"
          >
            View Listing
          </Link>
        </div>
      </div>
    </div>
  );
}
