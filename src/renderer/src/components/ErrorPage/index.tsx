import { Link } from 'react-router-dom'

export const ErrorPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-lg w-full bg-gray-100 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-red-600 mb-4">Oops! Something went wrong.</h2>
        <p className="text-gray-700 mb-8">
          We apologize for the inconvenience. Please try again later.
        </p>
        <Link to="/" className="text-blue-500 hover:text-blue-600 hover:underline">
          Go back to home page
        </Link>
      </div>
    </div>
  )
}
