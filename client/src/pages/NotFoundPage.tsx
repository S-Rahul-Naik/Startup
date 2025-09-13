import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-blue-100 to-purple-100 py-12 px-2">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-white rounded-3xl shadow-2xl border border-pink-200 p-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center mb-4">
            <span className="inline-block bg-pink-200 rounded-full p-4 shadow-lg">
              <svg
                width="48"
                height="48"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#ec4899"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
                />
              </svg>
            </span>
          </div>
          <div className="text-8xl font-extrabold text-pink-600 mb-6 drop-shadow-lg">
            404
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="space-y-4">
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg transition-colors transform hover:scale-105 shadow-md"
            >
              <HomeIcon className="w-5 h-5 mr-2" />
              Go Home
            </Link>
            <div className="text-sm text-gray-500">
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center text-pink-600 hover:text-pink-700 transition-colors"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-1" />
                Go Back
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;
