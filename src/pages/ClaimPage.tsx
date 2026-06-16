import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CATEGORIES, STATES } from '../lib/categories';
import { buildMailto } from '../lib/contact';
import Seo from '../components/Seo';

type Tab = 'claim' | 'add' | 'website';

function isTab(value: string | null): value is Tab {
  return value === 'claim' || value === 'add' || value === 'website';
}

export default function ClaimPage() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab');
  const [tab, setTab] = useState<Tab>(isTab(initialTab) ? initialTab : 'claim');
  const business = searchParams.get('business') || '';
  const category = searchParams.get('category') || '';
  const suburb = searchParams.get('suburb') || '';
  const state = searchParams.get('state') || '';

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Seo
        title="Claim Your Business Listing"
        description="Claim your free trades business listing, add a new business, or enquire about a CorePages website."
        path="/claim"
      />

      <h1 className="text-3xl font-extrabold text-navy">Get Listed on AusTradie</h1>
      <p className="mt-2 text-gray-600">
        Already listed? Claim and verify your business. New to the directory? Add your
        business for free. Want a professional website? Get in touch.
      </p>

      <div className="mt-6 flex gap-2 rounded-lg border border-gray-200 bg-gray-50 p-1">
        <button
          onClick={() => setTab('claim')}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition ${
            tab === 'claim' ? 'bg-navy text-white' : 'text-navy hover:bg-gray-100'
          }`}
        >
          Claim a listing
        </button>
        <button
          onClick={() => setTab('add')}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition ${
            tab === 'add' ? 'bg-navy text-white' : 'text-navy hover:bg-gray-100'
          }`}
        >
          Add your business
        </button>
        <button
          onClick={() => setTab('website')}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition ${
            tab === 'website' ? 'bg-navy text-white' : 'text-navy hover:bg-gray-100'
          }`}
        >
          Get a website
        </button>
      </div>

      {tab === 'claim' && <ClaimForm />}
      {tab === 'add' && <AddBusinessForm />}
      {tab === 'website' && (
        <WebsiteForm
          initialBusiness={business}
          initialCategory={category}
          initialSuburb={suburb}
          initialState={state}
        />
      )}

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-navy">1. Free basic listing</h2>
          <p className="mt-2 text-sm text-gray-600">
            Get your business name, trade, suburb and phone number listed for free, forever.
          </p>
        </div>
        <div className="rounded-lg border border-gold bg-gold-light/30 p-6">
          <h2 className="text-lg font-bold text-navy">2. Get a website + enhanced listing</h2>
          <p className="mt-2 text-sm text-gray-600">
            We build a professional website for your business and upgrade your listing
            with a website link and priority placement, from $50/month.
          </p>
          <button
            onClick={() => setTab('website')}
            className="mt-3 inline-block rounded-md bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-light"
          >
            Enquire now
          </button>
        </div>
      </div>
    </div>
  );
}

function SuccessMessage({ name }: { name: string }) {
  return (
    <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
      <p className="font-semibold text-navy">Thanks{name ? `, ${name}` : ''}!</p>
      <p className="mt-2 text-sm text-gray-600">
        Your email app should have opened with the details filled in — just hit send and
        we'll be in touch.
      </p>
    </div>
  );
}

function ClaimForm() {
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const mailto = buildMailto(`Listing Claim - ${form.name}`, [
      `Business name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Email: ${form.email}`,
    ]);
    window.location.href = mailto;
    setSubmitted(true);
  }

  if (submitted) return <SuccessMessage name={form.name} />;

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-navy">Business name</label>
        <input
          name="name"
          type="text"
          required
          value={form.name}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-navy">Phone</label>
        <input
          name="phone"
          type="tel"
          required
          value={form.phone}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-navy">Email</label>
        <input
          name="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>
      <button
        type="submit"
        className="mt-2 rounded-md bg-navy px-6 py-3 font-semibold text-white hover:bg-navy-light"
      >
        Submit Claim Request
      </button>
    </form>
  );
}

function AddBusinessForm() {
  const [form, setForm] = useState({
    name: '',
    category: '',
    suburb: '',
    state: '',
    phone: '',
    email: '',
    website_url: '',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const mailto = buildMailto(`New Business Listing - ${form.name}`, [
      `Business name: ${form.name}`,
      `Trade: ${form.category}`,
      `Suburb: ${form.suburb}`,
      `State: ${form.state}`,
      `Phone: ${form.phone}`,
      `Email: ${form.email}`,
      form.website_url && `Website: ${form.website_url}`,
      form.notes && `Notes: ${form.notes}`,
    ]);
    window.location.href = mailto;
    setSubmitted(true);
  }

  if (submitted) return <SuccessMessage name={form.name} />;

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-navy">Business name</label>
        <input
          name="name"
          type="text"
          required
          value={form.name}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-navy">Trade</label>
        <select
          name="category"
          required
          value={form.category}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
        >
          <option value="">Select a trade</option>
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.category}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-navy">Suburb</label>
          <input
            name="suburb"
            type="text"
            value={form.suburb}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy">State</label>
          <select
            name="state"
            value={form.state}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="">Select a state</option>
            {STATES.map((s) => (
              <option key={s.slug} value={s.label}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-navy">Phone</label>
        <input
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-navy">Email</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-navy">Website (optional)</label>
        <input
          name="website_url"
          type="text"
          value={form.website_url}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-navy">Anything else? (optional)</label>
        <textarea
          name="notes"
          rows={3}
          value={form.notes}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>
      <button
        type="submit"
        className="mt-2 rounded-md bg-navy px-6 py-3 font-semibold text-white hover:bg-navy-light"
      >
        Add My Business
      </button>
    </form>
  );
}

function WebsiteForm({
  initialBusiness,
  initialCategory,
  initialSuburb,
  initialState,
}: {
  initialBusiness: string;
  initialCategory: string;
  initialSuburb: string;
  initialState: string;
}) {
  const [form, setForm] = useState({
    name: '',
    business: initialBusiness,
    category: initialCategory,
    suburb: initialSuburb,
    state: initialState,
    phone: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const mailto = buildMailto(`Website Enquiry - ${form.business || form.name}`, [
      `Name: ${form.name}`,
      `Business name: ${form.business}`,
      form.category && `Trade: ${form.category}`,
      (form.suburb || form.state) && `Location: ${[form.suburb, form.state].filter(Boolean).join(', ')}`,
      `Phone: ${form.phone}`,
      `Email: ${form.email}`,
      form.message && `Message: ${form.message}`,
    ]);
    window.location.href = mailto;
    setSubmitted(true);
  }

  if (submitted) return <SuccessMessage name={form.name} />;

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-navy">Your name</label>
        <input
          name="name"
          type="text"
          required
          value={form.name}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-navy">Business name</label>
        <input
          name="business"
          type="text"
          required
          value={form.business}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-navy">Phone</label>
        <input
          name="phone"
          type="tel"
          required
          value={form.phone}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-navy">Email</label>
        <input
          name="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-navy">Anything else? (optional)</label>
        <textarea
          name="message"
          rows={3}
          value={form.message}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>
      <button
        type="submit"
        className="mt-2 rounded-md bg-gold px-6 py-3 font-semibold text-navy hover:bg-gold-light"
      >
        Send Enquiry
      </button>
    </form>
  );
}
