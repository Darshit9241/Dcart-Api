// src/components/NotFoundPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500">404</h1>
        <p className="text-xl mt-4 text-gray-700">Page Not Found</p>
        <p className="text-lg mt-2 text-gray-500">Sorry, the page you are looking for does not exist.</p>
        <button
          onClick={() => navigate('/')} // Redirect to home or another route
          className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
        >
          Go Back to Home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
