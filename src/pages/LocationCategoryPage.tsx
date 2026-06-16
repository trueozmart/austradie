import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getCategoryBySlug, getStateBySlug, slugify } from '../lib/categories';
import { usePaginatedListings } from '../lib/usePaginatedListings';
import ListingCard from '../components/ListingCard';
import Pagination from '../components/Pagination';
import Seo from '../components/Seo';
import NotFound from './NotFound';

export default function LocationCategoryPage() {
  const { state: stateSlug, suburb: suburbSlug, category: categorySlug } = useParams<{
    state: string;
    suburb?: string;
    category: string;
  }>();
  const [page, setPage] = useState(1);
  const [searchParams] = useSearchParams();
  const search = searchParams.get('q') || undefined;

  const category = categorySlug ? getCategoryBySlug(categorySlug) : undefined;
  const state = stateSlug ? getStateBySlug(stateSlug) : undefined;

  const { listings, total, totalPages, loading } = usePaginatedListings(
    {
      category: category?.category,
      state: state?.label,
      suburbSlug,
      search: suburbSlug ? undefined : search,
    },
    page
  );

  if (!category || !state) return <NotFound />;

  const suburbLabel = suburbSlug
    ? listings.find((l) => l.suburb && slugify(l.suburb) === suburbSlug)?.suburb ??
      suburbSlug.replace(/-/g, ' ')
    : undefined;

  const locationLabel = suburbLabel
    ? `${toTitleCase(suburbLabel)}, ${state.label}`
    : state.name;

  const title = suburbLabel
    ? `${category.pluralLabel} in ${toTitleCase(suburbLabel)}, ${state.label}`
    : `${category.pluralLabel} in ${state.name}`;

  const description = suburbLabel
    ? `Find ${category.pluralLabel.toLowerCase()} in ${toTitleCase(suburbLabel)}, ${state.label} — ${total} listed.`
    : `Find ${category.pluralLabel.toLowerCase()} in ${state.name} — ${total} ${category.pluralLabel.toLowerCase()} listed in ${state.label}.`;

  const path = suburbSlug
    ? `/location/${state.slug}/${suburbSlug}/${category.slug}`
    : `/location/${state.slug}/${category.slug}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Seo title={title} description={description} path={path} />

      <h1 className="text-3xl font-extrabold text-navy">{title}</h1>
      <p className="mt-1 text-gray-600">
        {total} {category.pluralLabel.toLowerCase()} listed in {locationLabel}
      </p>

      <div className="mt-6">
        {loading ? (
          <p className="text-gray-500">Loading…</p>
        ) : listings.length === 0 ? (
          <p className="text-gray-500">
            No {category.pluralLabel.toLowerCase()} found in {locationLabel} yet.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}

function toTitleCase(str: string): string {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}
