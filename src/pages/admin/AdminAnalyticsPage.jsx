import React, { useState, useEffect, useCallback } from 'react';
import { useAdminTheme, AdminThemeProvider } from '../../component/admin/AdminThemeContext';
import AdminAnalytics from '../../component/admin/AdminAnalytics';
import AdminLayout from './AdminLayout';
import { useSelector } from 'react-redux';
import { fetchProducts } from '../../utils/api';
import defaultProducts from '../../component/ProductData';

const AdminAnalyticsPage = () => {
  const { isDarkMode } = useAdminTheme();
  const currentCurrency = useSelector((state) => state.currency.currentCurrency) || 'USD';
  const reduxProducts = useSelector((state) => state.products);

  // States for data
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data using useCallback to memoize the function
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch products from the API using api.js
      const formattedProducts = await fetchProducts();
      setProducts(formattedProducts);
      
      // Get orders from localStorage
      const savedOrders = JSON.parse(localStorage.getItem('orders')) || [];
      setOrders(savedOrders);
      
      // Get users from localStorage
      const savedUsers = JSON.parse(localStorage.getItem('users')) || [];
      setUsers(savedUsers);
      
    } catch (err) {
      console.error('Error fetching data:', err);
      
      // Fallback to Redux products or default products
      if (reduxProducts && reduxProducts.length > 0) {
        setProducts(reduxProducts);
      } else {
        setProducts(defaultProducts);
      }
    } finally {
      setLoading(false);
    }
  }, [reduxProducts]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Debug
  console.log("AdminAnalyticsPage rendering with:", { 
    isDarkMode, 
    currentCurrency,
    ordersCount: orders.length,
    usersCount: users.length,
    productsCount: products.length
  });

  return (
    <AdminLayout activeTab="analytics">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <span className={`ml-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Loading analytics data...</span>
        </div>
      ) : error ? (
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-red-900/10 text-red-300' : 'bg-red-50 text-red-800'}`}>
          <p>{error}</p>
          <button 
            onClick={fetchData}
            className="mt-2 px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      ) : (
        <AdminAnalytics
          isDarkMode={isDarkMode}
          orders={orders}
          users={users}
          products={products}
          currentCurrency={currentCurrency}
        />
      )}
    </AdminLayout>
  );
};

// Wrap with ThemeProvider
const AdminAnalyticsPageWithTheme = () => {
  return (
    <AdminThemeProvider>
      <AdminAnalyticsPage />
    </AdminThemeProvider>
  );
};

export default AdminAnalyticsPageWithTheme; 