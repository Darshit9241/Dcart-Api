import React, { useState, useEffect, useCallback } from 'react';
import { useAdminTheme, AdminThemeProvider } from '../../component/admin/AdminThemeContext';
import OrderManagement from '../../component/admin/OrderManagement';
import AdminLayout from './AdminLayout';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const AdminOrders = () => {
  const { isDarkMode } = useAdminTheme();
  const navigate = useNavigate();
  const currentCurrency = useSelector((state) => state.currency.currentCurrency);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Orders state
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewOrderDetails, setViewOrderDetails] = useState(null);
  
  // Fetch orders
  const fetchOrders = useCallback(() => {
    setLoading(true);
    try {
      const savedOrders = JSON.parse(localStorage.getItem('orders')) || [];
      
      // Ensure all orders have a valid totalPrice
      const validatedOrders = savedOrders.map(order => ({
        ...order,
        totalPrice: order.totalPrice || 0,
      }));
      
      // Sort orders by status and date
      const sortedOrders = validatedOrders.sort((a, b) => {
        if (a.status === 'cancelled' && b.status !== 'cancelled') return 1;
        if (a.status !== 'cancelled' && b.status === 'cancelled') return -1;
        if (a.status === 'completed' && b.status !== 'completed') return 1;
        if (a.status !== 'completed' && b.status === 'completed') return -1;
        
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA; // Newest first
      });
      
      setOrders(sortedOrders);
      setError(null);
    } catch (err) {
      setError('Failed to load orders. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load orders on component mount
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Order status update function
  const updateOrderStatus = useCallback((id, status) => {
    try {
      const updatedOrders = orders.map(order =>
        order.id === id ? { ...order, status } : order
      );
      setOrders(updatedOrders);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      return true;
    } catch (err) {
      setError(`Failed to update order to ${status}. Please try again.`);
      return false;
    }
  }, [orders]);

  // Delete all orders function
  const deleteAllOrders = () => {
    try {
      // Clear orders from localStorage
      localStorage.setItem('orders', JSON.stringify([]));
      setOrders([]);
      toast.success('All orders have been deleted');
    } catch (error) {
      console.error('Error deleting all orders:', error);
      toast.error('Failed to delete all orders');
    }
  };

  // Event handlers
  const handleCancelOrder = (id) => {
    const success = updateOrderStatus(id, 'cancelled');
    if (success) setSelectedOrder(null);
  };

  const handleCompleteOrder = (id) => {
    updateOrderStatus(id, 'completed');
  };

  const handleViewDetailPage = (order) => {
    navigate('/order-detail', { state: order });
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id && order.id.toString().includes(searchTerm) ||
      (order.userInfo && order.userInfo.name && order.userInfo.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout activeTab="orders">
      <OrderManagement
        orders={filteredOrders}
        loading={loading}
        error={error}
        isDarkMode={isDarkMode}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        handleViewDetailPage={handleViewDetailPage}
        setSelectedOrder={setSelectedOrder}
        handleCompleteOrder={handleCompleteOrder}
        setViewOrderDetails={setViewOrderDetails}
        getStatusColor={getStatusColor}
        currentCurrency={currentCurrency}
        handleDeleteAllOrders={deleteAllOrders}
      />
    </AdminLayout>
  );
};

// Wrap with ThemeProvider
const AdminOrdersWithTheme = () => {
  return (
    <AdminThemeProvider>
      <AdminOrders />
    </AdminThemeProvider>
  );
};

export default AdminOrdersWithTheme; 