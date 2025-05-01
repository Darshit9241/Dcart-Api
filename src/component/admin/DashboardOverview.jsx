import React from 'react';
import { FiShoppingBag, FiUsers, FiDollarSign, FiPackage } from 'react-icons/fi';
import StatCard from './StatCard';
import { getCurrencySymbol } from '../../utils/currencyUtils';

const DashboardOverview = ({products, orders, users, isDarkMode, currentCurrency = 'USD' }) => {
  // Calculate statistics
  const totalProducts = products.length; // This should be dynamic in a real app
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
  const activeUsers = users.filter(user => user.status === 'active').length;
  
  // Most recent orders for activity feed (last 5)
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
  
  // Get status color for order badges
  const getStatusColor = (status) => {
    switch (status) {
      case 'cancelled':
        return isDarkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-700';
      case 'completed':
        return isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700';
      case 'processing':
      default:
        return isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700';
    }
  };

  const themeClasses = {
    container: isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    title: isDarkMode ? 'text-white' : 'text-gray-800',
    subtext: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    card: isDarkMode ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100',
    button: isDarkMode ? 'border-gray-700 text-orange-400 hover:bg-gray-700' : 'border-gray-200 text-orange-600 hover:bg-gray-50'
  };

  return (
    <div className="animate-fadeIn space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className={`text-2xl font-bold ${themeClasses.title}`}>Dashboard</h1>
        <div className={`text-sm px-3 py-1.5 rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
          {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Products" value={totalProducts.toString()} icon={<FiPackage />} trend={3.2} color="blue" />
        <StatCard title="Orders" value={totalOrders.toString()} icon={<FiShoppingBag />} trend={7.1} color="orange" />
        <StatCard title="Revenue" value={`${getCurrencySymbol(currentCurrency)}${totalRevenue.toFixed(2)}`} icon={<FiDollarSign />} trend={12.3} color="green" />
        <StatCard title="Users" value={activeUsers.toString()} icon={<FiUsers />} trend={-2.5} color="purple" />
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Orders Status */}
        <div className={`rounded-xl p-4 ${themeClasses.container} shadow-sm`}>
          <h2 className={`text-lg font-semibold mb-3 ${themeClasses.title}`}>Order Status</h2>
          <div className="grid grid-cols-3 gap-2">
            <div className={`text-center p-3 rounded-lg ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
              <p className="text-xl font-bold text-blue-500">{orders.filter(order => order.status === 'processing').length}</p>
              <p className={`text-xs ${themeClasses.subtext}`}>Processing</p>
            </div>
            <div className={`text-center p-3 rounded-lg ${isDarkMode ? 'bg-green-900/20' : 'bg-green-50'}`}>
              <p className="text-xl font-bold text-green-500">{orders.filter(order => order.status === 'completed').length}</p>
              <p className={`text-xs ${themeClasses.subtext}`}>Completed</p>
            </div>
            <div className={`text-center p-3 rounded-lg ${isDarkMode ? 'bg-red-900/20' : 'bg-red-50'}`}>
              <p className="text-xl font-bold text-red-500">{orders.filter(order => order.status === 'cancelled').length}</p>
              <p className={`text-xs ${themeClasses.subtext}`}>Cancelled</p>
            </div>
          </div>
        </div>
        
        {/* Sales Chart */}
        <div className={`rounded-xl p-4 ${themeClasses.container} shadow-sm lg:col-span-2`}>
          <h2 className={`text-lg font-semibold mb-3 ${themeClasses.title}`}>Sales Overview</h2>
          <div className="h-40 flex items-center justify-center">
            <p className={themeClasses.subtext}>Sales chart will appear here</p>
          </div>
        </div>
      </div>
      
      {/* Recent Orders */}
      <div className={`rounded-xl p-4 ${themeClasses.container} shadow-sm`}>
        <div className="flex justify-between items-center mb-3">
          <h2 className={`text-lg font-semibold ${themeClasses.title}`}>Recent Orders</h2>
          <button className={`text-sm font-medium ${themeClasses.button} px-3 py-1 rounded-lg border`}>View All</button>
        </div>
        
        {recentOrders.length > 0 ? (
          <div className="space-y-2">
            {recentOrders.map((order) => (
              <div key={order.id} className={`p-3 rounded-lg ${themeClasses.card} transition-colors`}>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{order.userInfo?.name || 'Unknown'}</span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(order.status)}`}>{order.status}</span>
                    </div>
                    <span className={`text-xs ${themeClasses.subtext}`}>
                      #{order.id} • {new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <span className="font-semibold">{getCurrencySymbol(currentCurrency)}{order.totalPrice?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={`text-center py-4 ${themeClasses.subtext}`}>No recent orders</p>
        )}
      </div>
    </div>
  );
};

export default DashboardOverview; 