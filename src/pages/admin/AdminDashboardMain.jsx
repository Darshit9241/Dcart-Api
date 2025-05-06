import React, { useEffect, useState } from 'react';
import { useAdminTheme, AdminThemeProvider } from '../../component/admin/AdminThemeContext';
import DashboardOverview from '../../component/admin/DashboardOverview';
import AdminLayout from './AdminLayout';
import { useSelector } from 'react-redux';
import { fetchProducts } from '../../utils/api';
import defaultProducts from '../../component/ProductData';

const AdminDashboardMain = () => {
  const { isDarkMode } = useAdminTheme();
  const currentCurrency = useSelector((state) => state.currency.currentCurrency);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const reduxProducts = useSelector((state) => state.products);

  // Custom hooks for data
  const useOrders = () => {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    return orders;
  };

  const useUsers = () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    return users;
  };
  
  // Fetch products - single unified useEffect
  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        // First try to fetch from API
        const formattedProducts = await fetchProducts();
        setProducts(formattedProducts);
        // Save to localStorage for future use
        localStorage.setItem('products', JSON.stringify(formattedProducts));
      } catch (err) {
        console.error('Error fetching products from API:', err);
        
        try {
          // Try to get products from localStorage as fallback
          const savedProducts = JSON.parse(localStorage.getItem('products')) || [];
          
          if (savedProducts.length > 0) {
            console.log('Using products from localStorage');
            setProducts(savedProducts);
          } else if (reduxProducts && reduxProducts.length > 0) {
            // Use Redux products as second fallback
            console.log('Using products from Redux store');
            setProducts(reduxProducts);
          } else {
            // Use default products as final fallback
            console.log('Using default products');
            setProducts(defaultProducts);
          }
        } catch (localError) {
          console.error('Error loading fallback products:', localError);
          setProducts(defaultProducts);
        }
      } finally {
        setLoading(false);
      }
    };
    
    getProducts();
  }, [reduxProducts]);

  const orders = useOrders();
  const users = useUsers();

  return (
    <AdminLayout activeTab="dashboard">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <span className={`ml-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Loading dashboard data...</span>
        </div>
      ) : (
        <DashboardOverview 
          orders={orders}
          users={users}
          products={products}
          isDarkMode={isDarkMode}
          currentCurrency={currentCurrency}
        />
      )}
    </AdminLayout>
  );
};

// Wrap with AdminThemeProvider
const AdminDashboardMainWithTheme = () => {
  return (
    <AdminThemeProvider>
      <AdminDashboardMain />
    </AdminThemeProvider>
  );
};

export default AdminDashboardMainWithTheme; 