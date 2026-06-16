import { Link } from 'react-router-dom';
import { CATEGORIES } from '../lib/categories';

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-gray-200 bg-navy text-gray-300">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <p className="text-lg font-extrabold text-white">
              Aus<span className="text-gold">Tradie</span>
            </p>
            <p className="mt-2 text-sm">
              Find trusted local tradies across Australia.
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold text-white">Browse Trades</h3>
            <ul className="space-y-1 text-sm">
              {CATEGORIES.slice(0, 5).map((c) => (
                <li key={c.slug}>
                  <Link to={`/trades/${c.slug}`} className="hover:text-gold">
                    {c.pluralLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold text-white">More Trades</h3>
            <ul className="space-y-1 text-sm">
              {CATEGORIES.slice(5).map((c) => (
                <li key={c.slug}>
                  <Link to={`/trades/${c.slug}`} className="hover:text-gold">
                    {c.pluralLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold text-white">Business Owners</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link to="/claim?tab=add" className="hover:text-gold">
                  Add your business
                </Link>
              </li>
              <li>
                <Link to="/claim?tab=claim" className="hover:text-gold">
                  Claim your listing
                </Link>
              </li>
              <li>
                <Link to="/claim?tab=website" className="hover:text-gold">
                  Get a website built
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6">
          <h3 className="mb-2 text-sm font-semibold text-white">Popular Searches</h3>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-400">
            {['qld', 'vic', 'nsw', 'sa'].flatMap((state) =>
              CATEGORIES.map((c) => (
                <Link
                  key={`${state}-${c.slug}`}
                  to={`/location/${state}/${c.slug}`}
                  className="hover:text-gold"
                >
                  {c.pluralLabel} in {state.toUpperCase()}
                </Link>
              ))
            )}
          </div>
        </div>

        <p className="mt-8 text-xs text-gray-400">
          &copy; {new Date().getFullYear()} AusTradie. All business
          information is sourced from publicly available listings.
        </p>
      </div>
    </footer>
  );
}
