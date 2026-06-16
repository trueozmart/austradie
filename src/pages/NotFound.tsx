import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="text-3xl font-extrabold text-navy">Page not found</h1>
      <p className="mt-2 text-gray-600">
        We couldn't find what you were looking for.
      </p>
      <Link to="/" className="mt-6 inline-block rounded-md bg-navy px-6 py-3 font-semibold text-white">
        Back to homepage
      </Link>
    </div>
  );
}
