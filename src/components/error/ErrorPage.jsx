import { useRouteError, Link } from 'react-router';

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-6xl font-bold text-red-500 mb-4">Oops!</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {error.statusText || error.message || 'Something went wrong'}
        </h2>
        <p className="text-gray-600 mb-8">
          We're sorry, but the page you're looking for couldn't be found or an error occurred.
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage; 