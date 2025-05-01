import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const AdminProtectedRoute = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is logged in
    const checkAdminAuth = () => {
      const adminToken = localStorage.getItem('adminToken');
      const isAdmin = localStorage.getItem('isAdmin') === 'true';
      
      if (!adminToken || !isAdmin) {
        toast.error('Please login as admin to access this page', {
          icon: '🔒',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
        setIsAuthorized(false);
      } else {
        setIsAuthorized(true);
      }
      setLoading(false);
    };
    
    checkAdminAuth();
  }, []);

  if (loading) {
    // You could render a loading spinner here
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return isAuthorized ? <Outlet /> : <Navigate to="/admin-login" />;
};

export default AdminProtectedRoute; 