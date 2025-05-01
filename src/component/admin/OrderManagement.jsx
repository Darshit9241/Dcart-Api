import React, { useMemo } from 'react';
import { FiPackage, FiAlertCircle, FiInfo, FiShoppingBag, FiX, FiCheck, FiDollarSign, FiClock } from 'react-icons/fi';
import { FaSearch, FaUser } from 'react-icons/fa';
import { getCurrencySymbol } from '../../utils/currencyUtils';

const OrderManagement = ({
  orders,
  loading,
  error,
  isDarkMode,
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  handleViewDetailPage,
  setSelectedOrder,
  handleCompleteOrder,
  setViewOrderDetails,
  getStatusColor,
  currentCurrency
}) => {
  // Status badge component for reuse
  const StatusBadge = ({ status }) => (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(status || '')}`}>
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
    </span>
  );
  
  // Calculate statistics for the dashboard
  const stats = useMemo(() => {
    if (!orders || orders.length === 0) return { 
      totalOrders: 0, 
      processingOrders: 0, 
      completedOrders: 0, 
      cancelledOrders: 0,
      totalRevenue: 0 
    };
    
    const totalOrders = orders.length;
    const processingOrders = orders.filter(order => order.status === 'processing').length;
    const completedOrders = orders.filter(order => order.status === 'completed').length;
    const cancelledOrders = orders.filter(order => order.status === 'cancelled').length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    
    return { totalOrders, processingOrders, completedOrders, cancelledOrders, totalRevenue };
  }, [orders]);
  
  // Stat card component
  const StatCard = ({ icon, title, value, color }) => (
    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} shadow-sm`}>
      <div className="flex items-center">
        <div className={`p-3 rounded-full mr-4 ${color}`}>
          {icon}
        </div>
        <div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{title}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header Section - Improved responsive layout */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Order Dashboard</h1>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-auto">
            <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full sm:w-56 md:w-60 pl-10 py-2 border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'} rounded-lg`}
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={`px-3 py-2 border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'} rounded-lg`}
          >
            <option value="all">All Status</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      
      {/* Dashboard Stats */}
      {!loading && !error && (
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard 
            icon={<FiShoppingBag className="h-6 w-6 text-white" />} 
            title="Total Orders" 
            value={stats.totalOrders} 
            color="bg-blue-500"
          />
          <StatCard 
            icon={<FiClock className="h-6 w-6 text-white" />} 
            title="Processing" 
            value={stats.processingOrders} 
            color="bg-yellow-500"
          />
          <StatCard 
            icon={<FiCheck className="h-6 w-6 text-white" />} 
            title="Completed" 
            value={stats.completedOrders} 
            color="bg-green-500"
          />
          <StatCard 
            icon={<FiDollarSign className="h-6 w-6 text-white" />} 
            title="Total Revenue" 
            value={`${getCurrencySymbol(currentCurrency)}${stats.totalRevenue.toFixed(2)}`} 
            color="bg-purple-500"
          />
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center py-10">
          <div className={`animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 ${isDarkMode ? 'border-orange-500' : 'border-orange-600'}`}></div>
        </div>
      ) : error ? (
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-red-50'} flex items-center`}>
          <FiAlertCircle className={`h-5 w-5 ${isDarkMode ? 'text-red-400' : 'text-red-500'} mr-3`} />
          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{error}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} text-center`}>
          <FiPackage className={`mx-auto h-10 w-10 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mb-2`} />
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
            {searchTerm || filterStatus !== 'all' 
              ? 'No orders match your search criteria.' 
              : 'No orders available.'}
          </p>
        </div>
      ) : (
        /* Desktop/Tablet View - Hide on extra small screens */
        <div className="hidden sm:block rounded-lg overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm">
          <div className={`px-4 py-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} border-b border-gray-200 dark:border-gray-700`}>
            <h2 className="font-semibold">Recent Orders</h2>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {orders.map((order) => (
              <div key={order.id} className="p-4 transition-colors">
                <div className="flex flex-wrap md:flex-nowrap items-center justify-between">
                  <div className="flex items-center space-x-4 w-full md:w-auto mb-3 md:mb-0">
                    <div className={`p-2 rounded-full ${
                      order.status === 'processing' ? 'bg-yellow-100 dark:bg-yellow-900' : 
                      order.status === 'completed' ? 'bg-green-100 dark:bg-green-900' :
                      'bg-red-100 dark:bg-red-900'
                    }`}>
                      {order.status === 'processing' ? 
                        <FiClock className={`h-5 w-5 ${
                          order.status === 'processing' ? 'text-yellow-500' : 
                          order.status === 'completed' ? 'text-green-500' :
                          'text-red-500'
                        }`} /> :
                        order.status === 'completed' ?
                        <FiCheck className="h-5 w-5 text-green-500" /> :
                        <FiX className="h-5 w-5 text-red-500" />
                      }
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">Order #{order.id}</span>
                        <StatusBadge status={order.status} />
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1 flex-wrap">
                        <div className="flex items-center">
                          <FaUser className="h-3 w-3 mr-1" />
                          <span>{order.userInfo.name}</span>
                        </div>
                        <span className="mx-2 hidden md:inline">•</span>
                        <span>{new Date(order.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between md:justify-end w-full md:w-auto space-x-3">
                    <span className="font-bold order-last md:order-first">
                      {getCurrencySymbol(currentCurrency)}{order.totalPrice?.toFixed(2)}
                    </span>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setViewOrderDetails(order)}
                        className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                        title="View Details"
                      >
                        <FiInfo className="h-5 w-5 text-blue-500" />
                      </button>
                      <button
                        onClick={() => handleViewDetailPage(order)}
                        className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                        title="Full Details"
                      >
                        <FiPackage className="h-5 w-5 text-orange-500" />
                      </button>
                      
                      {order.status === 'processing' && (
                        <>
                          <button
                            onClick={() => handleCompleteOrder(order.id)}
                            className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                            title="Mark as Completed"
                          >
                            <FiCheck className="h-5 w-5 text-green-500" />
                          </button>
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                            title="Cancel Order"
                          >
                            <FiX className="h-5 w-5 text-red-500" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Mobile view for smaller screens */}
      <div className="sm:hidden mt-4 space-y-4">
        {!loading && !error && orders.length > 0 && orders.map((order) => (
          <div key={order.id} className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} shadow`}>
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium">#{order.id}</span>
              <StatusBadge status={order.status} />
            </div>
            
            <div className="space-y-2 mb-3">
              <div className="flex items-center text-sm">
                <FaUser className="h-4 w-4 mr-2 text-gray-400" />
                <span>{order.userInfo.name}</span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(order.date).toLocaleDateString()}
              </div>
              <div className="flex justify-between">
                <div className="flex items-center text-sm">
                  <FiShoppingBag className="h-4 w-4 mr-1 text-gray-400" />
                  <span>{order.cartItems.length} items</span>
                </div>
                <span className="font-bold">
                  {getCurrencySymbol(currentCurrency)}{order.totalPrice?.toFixed(2)}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-200 dark:border-gray-600">
              <button
                onClick={() => setViewOrderDetails(order)}
                className="text-blue-500 hover:text-blue-700 text-sm py-1"
              >
                View Details
              </button>
              <button
                onClick={() => handleViewDetailPage(order)}
                className="text-orange-500 hover:text-orange-700 text-sm py-1"
              >
                Full Details
              </button>
              
              {order.status === 'processing' && (
                <>
                  <button
                    onClick={() => handleCompleteOrder(order.id)}
                    className="text-green-500 hover:text-green-700 text-sm py-1"
                  >
                    Complete
                  </button>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-red-500 hover:text-red-700 text-sm py-1"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderManagement; 