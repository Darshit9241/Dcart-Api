import React, { useEffect, useState } from 'react';
import { useAdminTheme, AdminThemeProvider } from '../../component/admin/AdminThemeContext';
import DashboardOverview from '../../component/admin/DashboardOverview';
import AdminLayout from './AdminLayout';
import { useSelector } from 'react-redux';

const AdminDashboardMain = () => {
  const { isDarkMode } = useAdminTheme();
  const currentCurrency = useSelector((state) => state.currency.currentCurrency);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Custom hooks for data
  const useOrders = () => {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    return orders;
  };

  const useUsers = () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    return users;
  };
  
  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // First try to get products from localStorage
        const savedProducts = JSON.parse(localStorage.getItem('products')) || [];
        
        if (savedProducts.length > 0) {
          setProducts(savedProducts);
        } else {
          // Fetch products from API if localStorage is empty
          const response = await fetch('https://6812f392129f6313e20fe2b3.mockapi.io/getproduct/product');
          if (!response.ok) {
            throw new Error('Failed to fetch products');
          }
          
          const apiProducts = await response.json();
          
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
          // Optionally save to localStorage
          localStorage.setItem('products', JSON.stringify(formattedProducts));
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

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