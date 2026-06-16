import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getCategoryByName, slugify } from '../lib/categories';
import type { Listing } from '../lib/types';
import Seo, { SITE_URL } from '../components/Seo';
import NotFound from './NotFound';

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"%3E%3Crect width="800" height="450" fill="%23e5e4e7"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-family="sans-serif" font-size="28"%3ENo photo available%3C/text%3E%3C/svg%3E';

export default function ListingPage() {
  const { id, slug } = useParams<{ id: string; slug: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!id) return;
      const { data, error } = await supabase.from('listings').select('*').eq('id', id).single();
      if (!active) return;

      if (error || !data) {
        setNotFound(true);
      } else {
        setListing(data);
      }
      setLoading(false);
    }

    load();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return <div className="mx-auto max-w-3xl px-4 py-12 text-gray-500">Loading…</div>;
  }

  if (notFound || !listing) return <NotFound />;

  const category = getCategoryByName(listing.category);
  const correctSlug = slugify(listing.name);
  const path = `/listing/${listing.id}/${slug ?? correctSlug}`;

  const title = `${listing.name} - ${category?.label ?? listing.category}${
    listing.suburb ? ` in ${listing.suburb}, ${listing.state}` : ''
  }`;
  const description = `${listing.name} is a ${category?.label.toLowerCase() ?? listing.category.toLowerCase()} based in ${
    [listing.suburb, listing.state].filter(Boolean).join(', ') || 'Australia'
  }. Contact details, address and reviews.`;

  // Map category to the most specific schema.org type
  const SCHEMA_TYPE: Record<string, string> = {
    Painter: 'HousePainter',
    Plumber: 'Plumber',
    Electrician: 'Electrician',
    Roofer: 'RoofingContractor',
    Builder: 'GeneralContractor',
    Handyman: 'HomeAndConstructionBusiness',
    Carpenter: 'Carpenter',
    Plasterer: 'HomeAndConstructionBusiness',
    Tiler: 'HomeAndConstructionBusiness',
    Landscaper: 'LandscapeService',
    Concreter: 'HomeAndConstructionBusiness',
  };

  const websiteUrl = listing.website_url
    ? listing.website_url.startsWith('http') ? listing.website_url : `https://${listing.website_url}`
    : undefined;

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': SCHEMA_TYPE[listing.category] ?? 'LocalBusiness',
    name: listing.name,
    image: listing.image_url ? `https://www.austradie.com.au${listing.image_url}` : undefined,
    telephone: listing.phone || undefined,
    description: listing.summary || description,
    url: websiteUrl ?? `${SITE_URL}${path}`,
    ...(websiteUrl ? { sameAs: [`${SITE_URL}${path}`] } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: listing.address || undefined,
      addressLocality: listing.suburb || undefined,
      addressRegion: listing.state || undefined,
      postalCode: listing.postcode || undefined,
      addressCountry: 'AU',
    },
    areaServed: {
      '@type': 'State',
      name: listing.state || 'Australia',
    },
    ...(listing.testimonials?.length ? {
      review: listing.testimonials.map(t => ({
        '@type': 'Review',
        author: { '@type': 'Person', name: t.author },
        reviewBody: t.text,
      })),
    } : {}),
    ...(listing.services?.length ? {
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Services',
        itemListElement: listing.services.map(s => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: s },
        })),
      },
    } : {}),
  };

  const isPremium = listing.is_corepages_client;
  const hasGallery = isPremium && listing.gallery_images && listing.gallery_images.length > 0;
  const maxWidth = isPremium ? 'max-w-5xl' : 'max-w-3xl';

  return (
    <div className={`mx-auto ${maxWidth} px-4 py-8`}>
      <Seo title={title} description={description} path={path} jsonLd={jsonLd} />

      <nav className="mb-4 flex flex-wrap items-center gap-1 text-sm text-gray-500">
        <Link to="/" className="hover:text-navy">Home</Link>
        <span>/</span>
        {category && (
          <>
            <Link to={`/trades/${category.slug}`} className="hover:text-navy">{category.pluralLabel}</Link>
            <span>/</span>
          </>
        )}
        {listing.state && (
          <>
            <Link to={`/location/${listing.state.toLowerCase()}${category ? `/${category.slug}` : ''}`} className="hover:text-navy capitalize">{listing.state}</Link>
            <span>/</span>
          </>
        )}
        <span className="text-gray-800 font-medium">{listing.name}</span>
      </nav>

      <img
        src={listing.image_url || PLACEHOLDER_IMAGE}
        alt={listing.name}
        className="h-64 w-full rounded-lg object-cover sm:h-80"
        onError={(e) => {
          e.currentTarget.src = PLACEHOLDER_IMAGE;
        }}
      />

      {hasGallery && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {listing.gallery_images!.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={`${listing.name} - photo ${i + 1}`}
              className="h-20 w-full rounded-md object-cover sm:h-28"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ))}
        </div>
      )}

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy">{listing.name}</h1>
          <p className="mt-1 text-gray-600">
            {category ? `${category.icon} ${category.label}` : listing.category}
            {(listing.suburb || listing.state) &&
              ` · ${[listing.suburb, listing.state].filter(Boolean).join(', ')}`}
          </p>
        </div>
        {listing.is_corepages_client && (
          <span className="shrink-0 rounded-full bg-navy px-3 py-1 text-xs font-semibold text-gold-light">
            ✓ Enhanced Listing
          </span>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {listing.phone && (
          <div className="rounded-lg border border-gray-200 p-4">
            <h2 className="text-sm font-semibold text-navy">Phone</h2>
            <a href={`tel:${listing.phone_raw || listing.phone}`} className="mt-1 block text-gray-700 hover:text-navy">
              📞 {listing.phone}
            </a>
          </div>
        )}
        {listing.address && (
          <div className="rounded-lg border border-gray-200 p-4">
            <h2 className="text-sm font-semibold text-navy">Address</h2>
            <p className="mt-1 text-gray-700">📍 {listing.address}</p>
          </div>
        )}
      </div>

      {listing.is_corepages_client && listing.website_url ? (
        <div className="relative mt-6 overflow-hidden rounded-2xl bg-navy px-6 py-8 text-center sm:px-10">
          <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-gold/20 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-gold/10 blur-2xl" />
          <p className="relative text-xs font-semibold uppercase tracking-widest text-gold-light">Official Website</p>
          <p className="relative mt-2 text-xl font-extrabold text-white">{listing.name}</p>
          <p className="relative mt-1 text-sm text-gray-400">
            See their full portfolio, photos and get in touch directly.
          </p>
          <a
            href={
              listing.website_url.startsWith('http')
                ? listing.website_url
                : `https://${listing.website_url}`
            }
            target="_blank"
            rel="noopener"
            className="relative mt-5 inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3 font-semibold text-navy transition hover:bg-gold-light"
          >
            Visit Website
            <span aria-hidden="true">→</span>
          </a>
        </div>
      ) : (
        <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
          <p className="font-semibold text-navy">This business doesn't have a website yet</p>
          <p className="mt-2 text-sm text-gray-600">
            This tradie doesn't have a website yet. We build professional websites
            for tradies from $50/month, live in 48 hours.
          </p>
          <Link
            to={`/claim?tab=website&business=${encodeURIComponent(listing.name)}&category=${encodeURIComponent(
              listing.category
            )}&suburb=${encodeURIComponent(listing.suburb || '')}&state=${encodeURIComponent(listing.state || '')}`}
            className="mt-3 inline-block rounded-md bg-gold px-6 py-3 font-semibold text-navy hover:bg-gold-light"
          >
            Get a Website Built
          </Link>
        </div>
      )}

      {isPremium && listing.summary && (
        <div className="mt-8">
          <h2 className="text-lg font-bold text-navy">About {listing.name}</h2>
          <p className="mt-2 leading-relaxed text-gray-700">{listing.summary}</p>
        </div>
      )}

      {isPremium && listing.services && listing.services.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-bold text-navy">Services</h2>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {listing.services.map((service) => (
              <div
                key={service}
                className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
              >
                {service}
              </div>
            ))}
          </div>
        </div>
      )}

      {isPremium && listing.testimonials && listing.testimonials.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-bold text-navy">What clients say</h2>
          <p className="mt-1 text-xs text-gray-500">Testimonials shared on {listing.name}'s website.</p>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {listing.testimonials.map((t, i) => (
              <div key={i} className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-sm italic text-gray-700">"{t.text}"</p>
                <p className="mt-2 text-sm font-semibold text-navy">
                  {t.author}
                  {t.location && <span className="font-normal text-gray-500"> — {t.location}</span>}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isPremium && (
        <div className="mt-8 border-t border-gray-200 pt-4 text-center text-sm text-gray-500">
          Is this your business?{' '}
          <Link to="/claim" className="text-navy underline hover:no-underline">
            Claim this listing
          </Link>{' '}
          or request removal.
        </div>
      )}
    </div>
  );
}
