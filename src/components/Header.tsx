import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-navy">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-lg font-extrabold text-white">
          Aus<span className="text-gold">Tradie</span>
        </Link>
        <nav className="flex items-center gap-2 text-sm font-medium text-white sm:gap-4">
          <Link to="/" className="hidden hover:text-gold sm:inline">
            Home
          </Link>
          <Link
            to="/claim?tab=add"
            className="rounded-md border border-white/30 px-3 py-1.5 hover:border-gold hover:text-gold"
          >
            Add Your Business
          </Link>
          <Link to="/claim?tab=claim" className="rounded-md bg-gold px-3 py-1.5 text-navy hover:bg-gold-light">
            Claim / Upgrade
          </Link>
        </nav>
      </div>
    </header>
  );
}
