import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <p className="text-2xl text-gray-700 mb-6">Oops! Page Not Found</p>
      <Link to="/" className="bg-primary text-white px-6 py-2 rounded hover:bg-red-700 text-lg">
        Go Back Home
      </Link>
    </div>
  );
}