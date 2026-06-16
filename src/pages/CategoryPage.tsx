import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getCategoryBySlug, STATES, slugify } from '../lib/categories';
import { usePaginatedListings } from '../lib/usePaginatedListings';
import { useLocationBreakdown } from '../lib/useLocationBreakdown';
import ListingCard from '../components/ListingCard';
import LocationAutocomplete from '../components/LocationAutocomplete';
import Pagination from '../components/Pagination';
import Seo from '../components/Seo';
import NotFound from './NotFound';

export default function CategoryPage() {
  const { category: categorySlug } = useParams<{ category: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [stateFilter, setStateFilter] = useState<string | undefined>(undefined);
  const [locationQuery, setLocationQuery] = useState('');

  const category = categorySlug ? getCategoryBySlug(categorySlug) : undefined;
  const search = searchParams.get('q') || undefined;

  const { listings, total, totalPages, loading } = usePaginatedListings(
    { category: category?.category, state: stateFilter, search },
    page
  );
  const locations = useLocationBreakdown(category?.category ?? '', stateFilter);

  if (!category) return <NotFound />;

  const title = `${category.pluralLabel} in Australia`;
  const description = `Find ${category.pluralLabel.toLowerCase()} across Australia — ${total} ${category.pluralLabel.toLowerCase()} listed. Compare local trades businesses by suburb and state.`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: title,
    itemListElement: listings.map((l, i) => ({
      '@type': 'ListItem',
      position: (page - 1) * 20 + i + 1,
      url: `https://www.austradie.com.au/listing/${l.id}/${slugify(l.name)}`,
      name: l.name,
    })),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Seo title={title} description={description} path={`/trades/${category.slug}`} jsonLd={jsonLd} />

      <h1 className="text-3xl font-extrabold text-navy">{title}</h1>
      <p className="mt-1 text-gray-600">
        {total} {category.pluralLabel.toLowerCase()} listed
      </p>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row">
        <aside className="lg:w-48">
          <h2 className="mb-2 text-sm font-semibold text-navy">Search by suburb</h2>
          <LocationAutocomplete
            value={locationQuery}
            onChange={setLocationQuery}
            onSelect={(entry) => {
              const stateMatch = STATES.find(
                (s) => s.label.toLowerCase() === entry.state.toLowerCase()
              );
              if (stateMatch) {
                navigate(`/location/${stateMatch.slug}/${slugify(entry.suburb)}/${category.slug}`);
              }
            }}
            placeholder="Suburb or postcode"
            inputClassName="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-navy placeholder:text-gray-400"
            stateFilter={stateFilter}
          />

          <h2 className="mb-2 mt-4 text-sm font-semibold text-navy">Filter by state</h2>
          <ul className="flex flex-col gap-1 text-sm">
            <li>
              <button
                onClick={() => {
                  setStateFilter(undefined);
                  setPage(1);
                }}
                className={`w-full rounded px-2 py-1 text-left ${
                  !stateFilter ? 'bg-navy text-white' : 'hover:bg-gray-100'
                }`}
              >
                All states
              </button>
            </li>
            {STATES.map((s) => (
              <li key={s.slug}>
                <button
                  onClick={() => {
                    setStateFilter(s.label);
                    setPage(1);
                  }}
                  className={`w-full rounded px-2 py-1 text-left ${
                    stateFilter === s.label ? 'bg-navy text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="flex-1">
          {loading ? (
            <p className="text-gray-500">Loading…</p>
          ) : listings.length === 0 ? (
            <p className="text-gray-500">No {category.pluralLabel.toLowerCase()} found.</p>
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

        <aside className="lg:w-72">
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-navy">
              Are you a {category.label.toLowerCase()}?
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Get listed for free, or get a professional website built and live in 48 hours.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Link
                to="/claim?tab=add"
                className="w-full rounded-md bg-navy px-3 py-2 text-center text-sm font-medium text-white hover:bg-navy-light"
              >
                Add Your Business
              </Link>
              <Link
                to={`/claim?tab=website&category=${encodeURIComponent(category.category)}`}
                className="w-full rounded-md bg-gold px-3 py-2 text-center text-sm font-semibold text-navy hover:bg-gold-light"
              >
                Get a Website →
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {locations.length > 0 && (
        <section className="mt-12 border-t border-gray-200 pt-6">
          <h2 className="text-lg font-bold text-navy">
            {category.pluralLabel} by location
          </h2>
          <div className="mt-3 flex flex-wrap gap-x-2 gap-y-1 text-sm text-gray-600">
            {locations.map((loc, i) => (
              <span key={`${loc.suburb}-${loc.state}`}>
                {loc.state ? (
                  <Link
                    to={`/location/${loc.state.toLowerCase()}/${slugify(loc.suburb)}/${category.slug}`}
                    className="hover:text-navy hover:underline"
                  >
                    {category.pluralLabel} in {loc.suburb}
                  </Link>
                ) : (
                  <span>{category.pluralLabel} in {loc.suburb}</span>
                )}
                {i < locations.length - 1 && ' | '}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
