import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center bg-white p-10 rounded-2xl shadow-lg max-w-md">
        <h1 className="text-6xl font-bold text-orange-600">404</h1>

        <h2 className="text-2xl font-bold mt-4">Page Not Found</h2>

        <p className="text-gray-600 mt-3">
          The page you are looking for does not exist.
        </p>

        <Link
          to="/"
          className="inline-block mt-6 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;