import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Grid3x3,
  HardHat,
  Hammer,
  Home as HomeIcon,
  MapPin,
  Paintbrush,
  PaintRoller,
  Ruler,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CATEGORIES, STATES } from '../lib/categories';
import type { Listing } from '../lib/types';
import ListingCard from '../components/ListingCard';
import Seo from '../components/Seo';

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  painters: PaintRoller,
  plumbers: Wrench,
  roofers: HomeIcon,
  builders: HardHat,
  handymen: Hammer,
  electricians: Zap,
  carpenters: Ruler,
  tilers: Grid3x3,
  plasterers: Paintbrush,
};

export default function Home() {
  const navigate = useNavigate();
  const [trade, setTrade] = useState('');
  const [featured, setFeatured] = useState<Listing[]>([]);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      const [{ data: featuredData }, { count }] = await Promise.all([
        supabase
          .from('listings')
          .select('*')
          .eq('is_corepages_client', true),
        supabase.from('listings').select('*', { count: 'exact', head: true }),
      ]);

      if (!active) return;
      setFeatured(featuredData || []);
      setTotalCount(count ?? null);
      setLoading(false);
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const category = CATEGORIES.find((c) => c.slug === trade) ?? CATEGORIES[0];
    navigate(`/trades/${category.slug}`);
  }

  return (
    <div>
      <Seo
        title="Find a Tradie Near You"
        description="Search Australia's directory of local trades businesses — painters, plumbers, electricians, builders and more. Free to browse, easy to contact."
        path="/"
      />

      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-20 text-center text-white">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/image-1781428816227.webp')" }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-navy/90 via-navy/85 to-navy-light/80" />
        {/* decorative glow */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-gold/10 blur-3xl" />

        <div className="relative mx-auto max-w-3xl">
          <span className="inline-block rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-gold-light">
            Australia's Trade Directory
          </span>
          <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl">
            Find a <span className="text-gold-light">tradie</span> near you
          </h1>
          <p className="mt-3 text-lg text-gray-300">
            Search hundreds of trusted trades businesses across Australia
          </p>

          <form
            onSubmit={handleSearch}
            className="mx-auto mt-8 flex max-w-2xl flex-col gap-2 rounded-2xl bg-white p-2 shadow-2xl sm:flex-row sm:items-center sm:rounded-full"
          >
            <div className="flex flex-1 items-center gap-2 rounded-full px-4 py-2 text-left">
              <Wrench className="h-5 w-5 shrink-0 text-navy/60" strokeWidth={1.75} />
              <select
                value={trade}
                onChange={(e) => setTrade(e.target.value)}
                className="w-full border-0 bg-transparent py-1 text-navy focus:outline-none focus:ring-0"
              >
                <option value="">Select a trade</option>
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.pluralLabel}
                  </option>
                ))}
              </select>
            </div>
            <div className="hidden h-8 w-px bg-gray-200 sm:block" />
            <div className="flex flex-1 items-center gap-2 rounded-full px-4 py-2 text-left">
              <MapPin className="h-5 w-5 shrink-0 text-navy/60" strokeWidth={1.75} />
              <select
                value=""
                onChange={(e) => {
                  const slug = e.target.value;
                  if (slug) navigate(`/location/${slug}`);
                }}
                className="w-full border-0 bg-transparent py-1 text-navy focus:outline-none focus:ring-0"
              >
                <option value="">Select a state</option>
                {STATES.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="rounded-full bg-gold px-8 py-3 font-semibold text-navy transition hover:bg-gold-light sm:ml-1"
            >
              Search
            </button>
          </form>

          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-300">
            <span>✓ Free to browse</span>
            <span>✓ Verified local businesses</span>
            <span>✓ Trusted by tradies nationwide</span>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-gold-light px-4 py-3 text-center text-sm font-medium text-navy">
        {totalCount !== null
          ? `${totalCount}+ businesses listed across Australia`
          : '500+ businesses listed across Australia'}
      </section>

      {/* Category grid */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-center text-2xl font-bold text-navy">Browse by Trade</h2>
        <p className="mx-auto mt-2 max-w-md text-center text-sm text-gray-500">
          Pick a trade to see local businesses near you
        </p>
        <div className="mt-8 grid grid-cols-3 gap-4">
          {CATEGORIES.map((c) => {
            const Icon = CATEGORY_ICONS[c.slug];
            return (
              <Link
                key={c.slug}
                to={`/trades/${c.slug}`}
                className="group relative flex flex-col items-center gap-4 overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-transparent hover:shadow-xl"
              >
                <span className="absolute inset-0 -z-10 bg-gradient-to-br from-navy to-navy-light opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-navy/5 shadow-sm transition-colors duration-200 group-hover:bg-white/10">
                  <Icon className="h-7 w-7 text-navy transition-colors group-hover:text-gold-light" strokeWidth={1.75} />
                </span>
                <span className="text-sm font-semibold text-navy transition-colors group-hover:text-white">
                  {c.pluralLabel}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-center text-2xl font-bold text-navy">How it works</h2>
        <div className="mt-6 grid grid-cols-3 gap-4">
          {[
            {
              step: '1',
              title: 'Search',
              body: 'Pick a trade and your state to find local businesses near you.',
            },
            {
              step: '2',
              title: 'Compare',
              body: 'Browse profiles, photos and contact details to find the right fit.',
            },
            {
              step: '3',
              title: 'Contact Directly',
              body: 'Call or visit their website directly — no middleman, no waiting on quotes.',
            },
          ].map((s) => (
            <div key={s.step} className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
              <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-navy text-lg font-bold text-gold-light">
                {s.step}
              </span>
              <h3 className="mt-3 text-lg font-bold text-navy">{s.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats / trust row */}
      <section className="bg-navy/5 px-4 py-12">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 text-center sm:grid-cols-3">
          <div>
            <p className="text-3xl font-extrabold text-navy">{totalCount ?? '233'}+</p>
            <p className="mt-1 text-sm text-gray-600">Businesses listed</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-navy">{CATEGORIES.length}</p>
            <p className="mt-1 text-sm text-gray-600">Trades covered</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-navy">100%</p>
            <p className="mt-1 text-sm text-gray-600">Free to browse</p>
          </div>
        </div>
      </section>

      {/* Business owners CTA */}
      <section className="bg-navy px-4 py-12 text-center text-white">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-bold">Are you a tradie?</h2>
          <p className="mt-2 text-gray-300">
            Get listed for free, or get a professional website built and live in 48 hours.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/claim?tab=add"
              className="rounded-md bg-white px-6 py-3 font-semibold text-navy hover:bg-gray-100"
            >
              Add Your Business
            </Link>
            <Link
              to="/claim?tab=website"
              className="rounded-md bg-gold px-6 py-3 font-semibold text-navy hover:bg-gold-light"
            >
              Get a Website →
            </Link>
          </div>
        </div>
      </section>

      {/* Featured listings */}
      {!loading && featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-center text-2xl font-bold text-navy">Featured Listings</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
