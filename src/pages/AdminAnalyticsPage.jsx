import React, { useState, useEffect, useCallback } from 'react';
import { useAdminTheme, AdminThemeProvider } from '../component/admin/AdminThemeContext';
import AdminAnalytics from '../component/admin/AdminAnalytics';
import AdminLayout from './AdminLayout';
import { useSelector } from 'react-redux';

const AdminAnalyticsPage = () => {
  const { isDarkMode } = useAdminTheme();
  const currentCurrency = useSelector((state) => state.currency.currentCurrency) || 'USD';
  
  // States for data
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data on component mount
  const fetchData = useCallback(() => {
    setLoading(true);
    try {
      // Fetch orders from localStorage
      const savedOrders = JSON.parse(localStorage.getItem('orders')) || [];
      setOrders(savedOrders);
      
      // Fetch users from localStorage
      const savedUsers = JSON.parse(localStorage.getItem('users')) || [];
      setUsers(savedUsers);
      
      // Try to get products from localStorage or Redux
      const savedProducts = JSON.parse(localStorage.getItem('products')) || [];
      
      if (savedProducts.length > 0) {
        setProducts(savedProducts);
      } else {
        // Fetch products from the API if none in localStorage
        fetch('https://6812f392129f6313e20fe2b3.mockapi.io/getproduct/product')
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to fetch products from API');
            }
            return response.json();
          })
          .then(apiProducts => {
            // Process API products to match expected format
            const formattedProducts = apiProducts.map(item => ({
              id: item.id,
              name: item.productname || item.name,
              imgSrc: item.productimage,
              image: item.productimage,
              price: parseFloat(item.newprice) || 0,
              oldPrice: parseFloat(item.oldprice) || 0,
              description: item.discription,
              discount: item.discount,
              email: item.email
            }));
            
            setProducts(formattedProducts);
          })
          .catch(err => {
            console.error('Error fetching products:', err);
            // If API fails, use empty array
            setProducts([]);
          });
      }
      
      setError(null);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

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