import React, { useState, useEffect } from 'react';
import { useAdminTheme, AdminThemeProvider } from './AdminThemeContext';
import { 
  FiBell, FiShoppingBag, FiPackage, 
  FiUser, FiInfo, FiTrash2, FiCheck, 
  FiFilter, FiCalendar, FiSearch
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import AdminLayout from '../../pages/admin/AdminLayout';

const AdminNotifications = () => {
  const { isDarkMode } = useAdminTheme();
  
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMarkingAllAsRead, setIsMarkingAllAsRead] = useState(false);
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' or 'oldest'
  
  // Load mock notifications
  useEffect(() => {
    // In a real app, this would be an API call
    const mockNotifications = [
      { id: 1, type: 'order', message: 'New order #1234 has been placed', time: '10 minutes ago', read: false, timestamp: new Date(Date.now() - 10 * 60 * 1000) },
      { id: 2, type: 'user', message: 'New user registered: John Doe', time: '1 hour ago', read: false, timestamp: new Date(Date.now() - 60 * 60 * 1000) },
      { id: 3, type: 'system', message: 'System update completed successfully', time: '3 hours ago', read: true, timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000) },
      { id: 4, type: 'product', message: 'Low stock alert: iPhone 13 Pro (2 left)', time: '5 hours ago', read: true, timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) },
      { id: 5, type: 'order', message: 'Order #1001 has been shipped', time: '1 day ago', read: true, timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      { id: 6, type: 'user', message: 'User Sarah Johnson updated their profile', time: '2 days ago', read: true, timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
      { id: 7, type: 'system', message: 'Database backup completed successfully', time: '3 days ago', read: true, timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
      { id: 8, type: 'product', message: 'New product added: Samsung Galaxy S23', time: '4 days ago', read: true, timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
      { id: 9, type: 'order', message: 'Order #999 has been canceled', time: '5 days ago', read: true, timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
      { id: 10, type: 'system', message: 'Scheduled maintenance completed', time: '1 week ago', read: true, timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    ];
    
    setNotifications(mockNotifications);
    applyFilters(mockNotifications, selectedFilter, searchQuery, sortOrder);
  }, []);
  
  // Apply filters and search
  const applyFilters = (notifs, filter, query, order) => {
    let filtered = [...notifs];
    
    // Apply type filter
    if (filter !== 'all') {
      filtered = filtered.filter(notif => notif.type === filter);
    }
    
    // Apply search
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(notif => notif.message.toLowerCase().includes(lowerQuery));
    }
    
    // Apply sort
    filtered = filtered.sort((a, b) => {
      if (order === 'newest') {
        return b.timestamp - a.timestamp;
      } else {
        return a.timestamp - b.timestamp;
      }
    });
    
    setFilteredNotifications(filtered);
  };
  
  // Filter change handler
  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    applyFilters(notifications, filter, searchQuery, sortOrder);
  };
  
  // Search handler
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    applyFilters(notifications, selectedFilter, query, sortOrder);
  };
  
  // Sort order change handler
  const handleSortChange = () => {
    const newOrder = sortOrder === 'newest' ? 'oldest' : 'newest';
    setSortOrder(newOrder);
    applyFilters(notifications, selectedFilter, searchQuery, newOrder);
  };
  
  // Mark notification as read
  const markAsRead = (id) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === id 
        ? { ...notification, read: true } 
        : notification
    );
    
    setNotifications(updatedNotifications);
    applyFilters(updatedNotifications, selectedFilter, searchQuery, sortOrder);
    toast.success("Notification marked as read");
  };
  
  // Mark all as read
  const markAllAsRead = () => {
    setIsMarkingAllAsRead(true);
    
    // Simulate API delay
    setTimeout(() => {
      const updatedNotifications = notifications.map(notification => ({
        ...notification, 
        read: true
      }));
      
      setNotifications(updatedNotifications);
      applyFilters(updatedNotifications, selectedFilter, searchQuery, sortOrder);
      setIsMarkingAllAsRead(false);
      toast.success("All notifications marked as read");
    }, 800);
  };
  
  // Delete notification
  const deleteNotification = (id) => {
    const updatedNotifications = notifications.filter(notification => notification.id !== id);
    setNotifications(updatedNotifications);
    applyFilters(updatedNotifications, selectedFilter, searchQuery, sortOrder);
    toast.success("Notification deleted");
  };
  
  // Clear all notifications
  const clearAllNotifications = () => {
    if (window.confirm("Are you sure you want to clear all notifications?")) {
      setNotifications([]);
      setFilteredNotifications([]);
      toast.success("All notifications cleared");
    }
  };

  // Helper for notification icon
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return <FiShoppingBag className="w-5 h-5" />;
      case 'user':
        return <FiUser className="w-5 h-5" />;
      case 'product':
        return <FiPackage className="w-5 h-5" />;
      case 'system':
      default:
        return <FiInfo className="w-5 h-5" />;
    }
  };
  
  // Helper for notification color
  const getNotificationColor = (type) => {
    switch (type) {
      case 'order':
        return 'bg-green-100 text-green-500';
      case 'user':
        return 'bg-blue-100 text-blue-500';
      case 'product':
        return 'bg-orange-100 text-orange-500';
      case 'system':
      default:
        return 'bg-purple-100 text-purple-500';
    }
  };
  
  // Count unread notifications
  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <AdminLayout activeTab="notifications">
      <div className="pb-4 md:pb-8 px-2 sm:px-4 md:px-6">
        <div className="mb-4 md:mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">Notifications</h1>
            <p className={`text-sm md:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              You have <span className="font-medium">{unreadCount}</span> unread notification{unreadCount !== 1 && 's'}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={markAllAsRead}
              disabled={unreadCount === 0 || isMarkingAllAsRead}
              className={`px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm ${
                unreadCount === 0 
                  ? `${isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'} cursor-not-allowed` 
                  : `${isDarkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white`
              } focus:outline-none transition-colors`}
            >
              {isMarkingAllAsRead ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-3 w-3 md:h-4 md:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center">
                  <FiCheck className="mr-1 md:mr-1.5" /> Mark all as read
                </span>
              )}
            </button>
            
            <button
              onClick={clearAllNotifications}
              disabled={notifications.length === 0}
              className={`px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm ${
                notifications.length === 0 
                  ? `${isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'} cursor-not-allowed` 
                  : `${isDarkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-600 hover:bg-red-700'} text-white`
              } focus:outline-none transition-colors`}
            >
              <span className="flex items-center">
                <FiTrash2 className="mr-1 md:mr-1.5" /> Clear all
              </span>
            </button>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="mb-4 md:mb-6 flex flex-col gap-3">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={handleSearch}
              className={`pl-10 w-full py-2 px-3 text-sm md:text-base rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
          </div>
          
          <div className="grid grid-cols-2 sm:flex gap-2 overflow-x-auto">
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm flex items-center justify-center md:justify-start whitespace-nowrap ${
                selectedFilter === 'all'
                  ? `${isDarkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-600 text-white'}`
                  : `${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
              }`}
            >
              <FiFilter className="mr-1 md:mr-1.5" /> All
            </button>
            <button
              onClick={() => handleFilterChange('order')}
              className={`px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm flex items-center justify-center md:justify-start whitespace-nowrap ${
                selectedFilter === 'order'
                  ? `${isDarkMode ? 'bg-green-600 text-white' : 'bg-green-600 text-white'}`
                  : `${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
              }`}
            >
              <FiShoppingBag className="mr-1 md:mr-1.5" /> Orders
            </button>
            <button
              onClick={() => handleFilterChange('user')}
              className={`px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm flex items-center justify-center md:justify-start whitespace-nowrap ${
                selectedFilter === 'user'
                  ? `${isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'}`
                  : `${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
              }`}
            >
              <FiUser className="mr-1 md:mr-1.5" /> Users
            </button>
            <button
              onClick={() => handleFilterChange('product')}
              className={`px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm flex items-center justify-center md:justify-start whitespace-nowrap ${
                selectedFilter === 'product'
                  ? `${isDarkMode ? 'bg-orange-600 text-white' : 'bg-orange-600 text-white'}`
                  : `${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
              }`}
            >
              <FiPackage className="mr-1 md:mr-1.5" /> Products
            </button>
          </div>
          
          <div className="flex justify-between items-center">
            <button
              onClick={() => handleFilterChange('system')}
              className={`px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm flex items-center whitespace-nowrap ${
                selectedFilter === 'system'
                  ? `${isDarkMode ? 'bg-purple-600 text-white' : 'bg-purple-600 text-white'}`
                  : `${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
              }`}
            >
              <FiInfo className="mr-1 md:mr-1.5" /> System
            </button>
            
            <button
              onClick={handleSortChange}
              className={`px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm flex items-center whitespace-nowrap ${
                isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FiCalendar className="mr-1 md:mr-1.5" /> 
              {sortOrder === 'newest' ? 'Newest first' : 'Oldest first'}
            </button>
          </div>
        </div>
        
        {/* Notifications list */}
        {filteredNotifications.length === 0 ? (
          <div className={`rounded-lg p-4 md:p-8 text-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <FiBell className="mx-auto h-8 w-8 md:h-12 md:w-12 text-gray-400 mb-3 md:mb-4" />
            <h3 className="text-md md:text-lg font-medium">No notifications found</h3>
            <p className={`mt-1 md:mt-2 text-xs md:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {notifications.length === 0 
                ? "You don't have any notifications yet" 
                : "No notifications match your current filters"}
            </p>
            {notifications.length > 0 && (
              <button
                onClick={() => {
                  setSelectedFilter('all');
                  setSearchQuery('');
                  applyFilters(notifications, 'all', '', sortOrder);
                }}
                className={`mt-3 md:mt-4 px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm ${
                  isDarkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-600 hover:bg-indigo-700'
                } text-white focus:outline-none transition-colors`}
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className={`rounded-lg overflow-hidden shadow-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-3 md:p-4 lg:p-5 flex ${
                    !notification.read 
                      ? (isDarkMode ? 'bg-indigo-900/10' : 'bg-indigo-50/70') 
                      : ''
                  }`}
                >
                  <div className={`flex-shrink-0 rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center mr-3 md:mr-4 ${getNotificationColor(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <p className={`text-xs sm:text-sm break-words pr-2 ${!notification.read ? 'font-semibold' : ''}`}>
                        {notification.message}
                      </p>
                      <div className="flex-shrink-0 flex ml-1 md:ml-4">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className={`p-1 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} text-gray-400 hover:text-indigo-500`}
                            title="Mark as read"
                          >
                            <FiCheck className="w-3 h-3 md:w-4 md:h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className={`p-1 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} text-gray-400 hover:text-red-500 ml-1`}
                          title="Delete notification"
                        >
                          <FiTrash2 className="w-3 h-3 md:w-4 md:h-4" />
                        </button>
                      </div>
                    </div>
                    <p className={`text-2xs md:text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                      {notification.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

// Wrapper with ThemeProvider
const AdminNotificationsWithTheme = () => {
  return (
    <AdminThemeProvider>
      <AdminNotifications />
    </AdminThemeProvider>
  );
};

export default AdminNotificationsWithTheme; 