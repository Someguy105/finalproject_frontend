import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Unauthorized: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <div className="mb-6">
          <svg 
            className="mx-auto h-16 w-16 text-red-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
            />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Access Denied
        </h1>
        
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page.
        </p>

        {user && (
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Logged in as:</span> {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Role:</span> {user.role}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <Link
            to="/"
            className="block w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Go to Home
          </Link>
          
          {user?.role === 'customer' && (
            <Link
              to="/products"
              className="block w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Browse Products
            </Link>
          )}

          <button
            onClick={logout}
            className="block w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout and Login as Different User
          </button>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          If you believe this is an error, please contact the administrator.
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
