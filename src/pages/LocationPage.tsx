import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getStateBySlug } from '../lib/categories';
import { usePaginatedListings } from '../lib/usePaginatedListings';
import ListingCard from '../components/ListingCard';
import LocationAutocomplete from '../components/LocationAutocomplete';
import Pagination from '../components/Pagination';
import Seo from '../components/Seo';
import NotFound from './NotFound';

export default function LocationPage() {
  const { state: stateSlug } = useParams<{ state: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const state = stateSlug ? getStateBySlug(stateSlug) : undefined;

  const { listings, total, totalPages, loading } = usePaginatedListings(
    { state: state?.label, search: search.trim() || undefined },
    page
  );

  if (!state) return <NotFound />;

  const title = `Trade Businesses in ${state.name}`;
  const description = `Browse ${total} trades businesses across ${state.name} — search by suburb to find local painters, plumbers, electricians, builders and more.`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Seo title={title} description={description} path={`/location/${state.slug}`} />

      <h1 className="text-3xl font-extrabold text-navy">{title}</h1>
      <p className="mt-1 text-gray-600">
        {total} business{total === 1 ? '' : 'es'} listed in {state.name}
      </p>

      <div className="mt-4 max-w-sm">
        <LocationAutocomplete
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          onSelect={(entry) => {
            setSearch(entry.suburb);
            setPage(1);
          }}
          placeholder="Search by suburb"
          inputClassName="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-navy placeholder:text-gray-400"
          stateFilter={state.label}
          autoFocus
        />
      </div>

      <div className="mt-6">
        {loading ? (
          <p className="text-gray-500">Loading…</p>
        ) : listings.length === 0 ? (
          <p className="text-gray-500">No businesses found{search ? ` for "${search}"` : ''}.</p>
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

      <p className="mt-2 text-xs text-gray-400">
        Looking for a specific trade?{' '}
        <button
          type="button"
          onClick={() => navigate('/')}
          className="underline hover:text-navy"
        >
          Search by trade
        </button>
      </p>
    </div>
  );
}
