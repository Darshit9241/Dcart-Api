import React, { useState, useEffect } from 'react';
import { useTheme, ThemeProvider } from '../component/header/ThemeContext';
import AdminSettings from '../component/admin/AdminSettings';
import AdminLayout from './AdminLayout';
import { useSelector } from 'react-redux';

const AdminSettingsPage = () => {
  const { isDarkMode } = useTheme();
  const currentCurrency = useSelector((state) => state.currency.currentCurrency);
  const [activeSettingsTab, setActiveSettingsTab] = useState('store');
  
  // Store settings state
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'DCart Store',
    storeEmail: 'info@dcartstore.com',
    storePhone: '+1 234 567 8901',
    storeAddress: '123 Shopping Street, E-Commerce City',
    taxRate: 8.5,
    shippingFee: 15,
    freeShippingThreshold: 100
  });
  
  // Admin settings state
  const [adminSettings, setAdminSettings] = useState({
    adminEmail: 'admin@dcartstore.com',
    notificationEmails: true,
    dailyReports: true,
    weeklyReports: true,
    monthlyReports: true,
    alertLowStock: true,
    lowStockThreshold: 10
  });

  // Load saved settings
  useEffect(() => {
    // Load saved settings if they exist
    const savedStoreSettings = localStorage.getItem('storeSettings');
    const savedAdminSettings = localStorage.getItem('adminSettings');
    
    if (savedStoreSettings) {
      setStoreSettings(JSON.parse(savedStoreSettings));
    }
    
    if (savedAdminSettings) {
      setAdminSettings(JSON.parse(savedAdminSettings));
    }
  }, []);

  // Store settings update function
  const updateStoreSettings = (newSettings) => {
    setStoreSettings(newSettings);
    localStorage.setItem('storeSettings', JSON.stringify(newSettings));
  };

  // Admin settings update function
  const updateAdminSettings = (newSettings) => {
    setAdminSettings(newSettings);
    localStorage.setItem('adminSettings', JSON.stringify(newSettings));
  };

  // Event handlers
  const handleStoreSettingsChange = (e) => {
    const { name, value, type } = e.target;
    const parsedValue = type === 'number' ? (value === '' ? '' : parseFloat(value)) : value;
    updateStoreSettings({
      ...storeSettings,
      [name]: parsedValue
    });
  };

  const handleAdminSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : 
                     type === 'number' ? (value === '' ? '' : parseFloat(value)) : 
                     value;
    updateAdminSettings({
      ...adminSettings,
      [name]: newValue
    });
  };

  const saveStoreSettings = () => {
    alert('Store settings saved successfully!');
  };

  const saveAdminSettings = () => {
    alert('Admin settings saved successfully!');
  };

  // System information for the settings page
  const getSystemInformation = () => {
    // Get orders, users, and products from localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    return {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalUsers: users.length,
      activeUsers: users.filter(user => user.status === 'active').length,
      totalRevenue: orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0),
      averageOrderValue: orders.length > 0 
        ? orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0) / orders.length 
        : 0,
      pendingOrders: orders.filter(order => order.status === 'processing').length,
      completedOrders: orders.filter(order => order.status === 'completed').length,
      cancelledOrders: orders.filter(order => order.status === 'cancelled').length,
      systemVersion: '1.0.0',
      lastUpdated: new Date().toLocaleString()
    };
  };

  return (
    <AdminLayout activeTab="settings">
      <AdminSettings
        isDarkMode={isDarkMode}
        activeSettingsTab={activeSettingsTab}
        setActiveSettingsTab={setActiveSettingsTab}
        storeSettings={storeSettings}
        adminSettings={adminSettings}
        handleStoreSettingsChange={handleStoreSettingsChange}
        handleAdminSettingsChange={handleAdminSettingsChange}
        saveStoreSettings={saveStoreSettings}
        saveAdminSettings={saveAdminSettings}
        getSystemInformation={getSystemInformation}
        currentCurrency={currentCurrency}
      />
    </AdminLayout>
  );
};

// Wrap with ThemeProvider
const AdminSettingsPageWithTheme = () => {
  return (
    <ThemeProvider>
      <AdminSettingsPage />
    </ThemeProvider>
  );
};

export default AdminSettingsPageWithTheme; 