import React, { useEffect } from 'react';
import { useTheme, ThemeProvider } from '../component/header/ThemeContext';
import DashboardOverview from '../component/admin/DashboardOverview';
import AdminLayout from './AdminLayout';
import { useSelector } from 'react-redux';

const AdminDashboardMain = () => {
  const { isDarkMode } = useTheme();
  const currentCurrency = useSelector((state) => state.currency.currentCurrency);

  // Custom hooks for data
  const useOrders = () => {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    return orders;
  };

  const useUsers = () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    return users;
  };
  
  const useProducts = () => {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    return products;
  };

  const orders = useOrders();
  const users = useUsers();
  const products = useProducts();

  return (
    <AdminLayout activeTab="dashboard">
      <DashboardOverview 
        orders={orders}
        users={users}
        products={products}
        isDarkMode={isDarkMode}
        currentCurrency={currentCurrency}
      />
    </AdminLayout>
  );
};

// Wrap with ThemeProvider
const AdminDashboardMainWithTheme = () => {
  return (
    <ThemeProvider>
      <AdminDashboardMain />
    </ThemeProvider>
  );
};

export default AdminDashboardMainWithTheme; 