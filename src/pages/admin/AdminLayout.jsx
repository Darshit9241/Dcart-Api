import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAdminTheme } from '../../component/admin/AdminThemeContext';
import { 
  FiPackage, FiX, FiAlertCircle, FiInfo, FiShoppingBag, 
  FiMenu, FiLogOut, FiSettings, FiBarChart2, FiChevronDown, 
  FiUser as FiUserIcon, FiCalendar, FiBell, FiGlobe, FiFilter, FiGrid,
  FiActivity
} from 'react-icons/fi';
import { FaUser, FaSearch, FaKey, FaUserCircle, FaTachometerAlt, FaChartPie } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

// Import modals
import CancelOrderModal from '../../component/admin/modals/CancelOrderModal';
import OrderDetailsModal from '../../component/admin/modals/OrderDetailsModal';
import UserDetailsModal from '../../component/admin/modals/UserDetailsModal';
import ProductDetailsModal from '../../component/admin/modals/ProductDetailsModal';
import { useSelector } from 'react-redux';

const AdminLayout = ({ children, activeTab }) => {
  const { isDarkMode, toggleTheme } = useAdminTheme();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  const [recentActivities, setRecentActivities] = useState([]);
  const [layoutView, setLayoutView] = useState('default'); // 'default', 'compact', 'expanded'
  
  const profileDropdownRef = useRef(null);
  const notificationsPanelRef = useRef(null);
  
  // Admin profile data with default values
  const [adminProfile, setAdminProfile] = useState({
    name: 'Admin User',
    email: 'admin@dcartstore.com',
    role: 'Administrator',
    avatar: null,
    lastLogin: new Date().toLocaleString()
  });
  
  // Modals state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewOrderDetails, setViewOrderDetails] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  
  const currentCurrency = useSelector((state) => state.currency.currentCurrency);

  // Check for authentication and load admin profile data
  useEffect(() => {
    // Check if admin is logged in
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin-login');
      return;
    }
    
    // Load admin profile data from localStorage
    const adminName = localStorage.getItem('adminName');
    const adminEmail = localStorage.getItem('adminEmail');
    const adminRole = localStorage.getItem('adminRole');
    const adminPhoto = localStorage.getItem('adminPhoto');
    
    setAdminProfile(prev => ({
      ...prev,
      name: adminName || prev.name,
      email: adminEmail || prev.email,
      role: adminRole || prev.role,
      avatar: adminPhoto || prev.avatar
    }));
    
    // Load mock notifications
    setNotifications([
      { id: 1, type: 'order', message: 'New order #1234 has been placed', time: '10 minutes ago', read: false },
      { id: 2, type: 'user', message: 'New user registered: John Doe', time: '1 hour ago', read: false },
      { id: 3, type: 'system', message: 'System update completed successfully', time: '3 hours ago', read: true },
      { id: 4, type: 'product', message: 'Low stock alert: iPhone 13 Pro (2 left)', time: '5 hours ago', read: true },
      { id: 5, type: 'order', message: 'Order #1001 has been shipped', time: '1 day ago', read: true }
    ]);
    
    // Load mock recent activities
    setRecentActivities([
      { id: 1, user: 'Admin', action: 'Updated product inventory', target: 'Samsung Galaxy S22', time: '15 minutes ago' },
      { id: 2, user: 'John', action: 'Added new product', target: 'MacBook Pro M2', time: '2 hours ago' },
      { id: 3, user: 'Admin', action: 'Processed order', target: '#1098', time: '4 hours ago' },
      { id: 4, user: 'System', action: 'Performed backup', target: 'Database', time: '6 hours ago' }
    ]);
  }, [navigate]);
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileDropdown && profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      
      if (showNotificationsPanel && notificationsPanelRef.current && !notificationsPanelRef.current.contains(event.target)) {
        setShowNotificationsPanel(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown, showNotificationsPanel]);

  // Handle search
  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      // Implement search functionality
      toast.success(`Searching for: ${searchQuery}`, {
        duration: 2000,
        style: {
          borderRadius: '10px',
          background: isDarkMode ? '#333' : '#fff',
          color: isDarkMode ? '#fff' : '#333',
        },
      });
    }
  };

  // Handle logout
  const handleLogout = () => {
    // Show loading toast
    const loadingToast = toast.loading("Logging out...", {
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
    
    // Clear admin data from localStorage
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminName');
    localStorage.removeItem('adminPhoto');
    localStorage.removeItem('adminRole');
    localStorage.removeItem('isAdmin');
    
    // Show success toast
    toast.dismiss(loadingToast);
    toast.success("Logged out successfully", {
      icon: '👋',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
      duration: 2000,
    });
    
    // Navigate to login page after a short delay
    setTimeout(() => {
      navigate('/admin-login');
    }, 1000);
  };
  
  // Mark notification as read
  const markNotificationAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };
  
  // Mark all notifications as read
  const markAllNotificationsAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    toast.success("All notifications marked as read");
  };
  
  // Toggle sidebar collapse
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  // Toggle layout view
  const changeLayoutView = (view) => {
    setLayoutView(view);
    toast.success(`Layout changed to ${view} view`);
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaTachometerAlt className="w-5 h-5" />, path: '/admin-dashboard' },
    { id: 'products', label: 'Products', icon: <FiPackage className="w-5 h-5" />, path: '/admin-products' },
    { id: 'orders', label: 'Orders', icon: <FiShoppingBag className="w-5 h-5" />, path: '/admin-orders' },
    { id: 'customers', label: 'Customers', icon: <FiUserIcon className="w-5 h-5" />, path: '/admin-customers' },
    { id: 'analytics', label: 'Analytics', icon: <FaChartPie className="w-5 h-5" />, path: '/admin-analytics' },
    { id: 'activity', label: 'Activity', icon: <FiActivity className="w-5 h-5" />, path: '/admin-activity' },
    { id: 'notifications', label: 'Notifications', icon: <FiBell className="w-5 h-5" />, path: '/admin-notifications' },
    { id: 'settings', label: 'Settings', icon: <FiSettings className="w-5 h-5" />, path: '/admin-settings' },
  ];

  // Quick stats for sidebar with improved data
  const quickStats = useMemo(() => [
    { 
      label: "Products", 
      value: localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')).length : 0,
      icon: <FiPackage className="w-4 h-4 text-blue-500" />,
      change: "+12%",
      trend: "up"
    },
    { 
      label: "Orders", 
      value: localStorage.getItem('orders') ? JSON.parse(localStorage.getItem('orders')).length : 0,
      icon: <FiShoppingBag className="w-4 h-4 text-green-500" />,
      change: "+5%",
      trend: "up"
    },
    { 
      label: "Customers", 
      value: localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')).length : 0,
      icon: <FiUserIcon className="w-4 h-4 text-purple-500" />,
      change: "+8%",
      trend: "up"
    },
    { 
      label: "Revenue", 
      value: `$${Math.floor(Math.random() * 10000)}`,
      icon: <FiBarChart2 className="w-4 h-4 text-orange-500" />,
      change: "+15%",
      trend: "up"
    }
  ], []);

  const handleTabClick = (tabPath) => {
    setIsMobileMenuOpen(false);
    navigate(tabPath);
  };
  
  // Count unread notifications
  const unreadNotificationsCount = notifications.filter(notification => !notification.read).length;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Top Navigation Bar */}
      <header className={`fixed top-0 left-0 right-0 z-30 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm py-1.5 flex items-center px-4`}>
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              className={`p-2 rounded-full md:hidden focus:outline-none focus:ring-2 ${isDarkMode ? 'focus:ring-indigo-500 hover:bg-gray-700' : 'focus:ring-indigo-500 hover:bg-gray-100'}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
            
            <button
              className={`hidden md:block p-2 rounded-full focus:outline-none focus:ring-2 ${isDarkMode ? 'focus:ring-indigo-500 hover:bg-gray-700' : 'focus:ring-indigo-500 hover:bg-gray-100'}`}
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <FiMenu className="w-5 h-5" />
            </button>
            
            <h1 className="text-lg md:text-xl font-bold flex items-center">
              <span className={`text-indigo-500 mr-1`}>D</span>Cart
              <span className={`ml-1 text-sm font-normal px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-indigo-900/40 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}`}>
                Admin
              </span>
            </h1>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative hidden sm:block">
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className={`w-40 sm:w-48 md:w-64 py-2 pl-9 pr-3 rounded-lg text-sm transition-all duration-300 focus:w-52 sm:focus:w-60 md:focus:w-72 ${
                  isDarkMode 
                    ? 'bg-gray-700 text-white border-gray-600 focus:border-indigo-500' 
                    : 'bg-gray-100 text-gray-800 border-gray-200 focus:border-indigo-500'
                } border focus:outline-none focus:ring-2 focus:ring-indigo-500/50`}
                aria-label="Search"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              {searchQuery && (
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  <FiX className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            
            <button 
              className={`sm:hidden p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Toggle search"
            >
              <FaSearch className="w-5 h-5" />
            </button>
            
            {/* Theme toggle button */}
            <button 
              className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} focus:outline-none focus:ring-2 focus:ring-indigo-500/50`}
              onClick={toggleTheme}
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"></path>
                  <path d="M10 4a1 1 0 011 1v1a1 1 0 11-2 0V5a1 1 0 011-1zm0 8a1 1 0 100 2 1 1 0 000-2zm-5-2a1 1 0 110 2H4a1 1 0 110-2h1zm10 0a1 1 0 110 2h-1a1 1 0 110-2h1zM7.05 6.464a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 010-1.414zM12.95 6.464a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM7.05 13.536a1 1 0 010-1.414l.707-.707a1 1 0 011.414 1.414l-.707.707a1 1 0 01-1.414 0zM12.95 13.536a1 1 0 01-1.414 0l-.707-.707a1 1 0 011.414-1.414l.707.707a1 1 0 010 1.414z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                </svg>
              )}
            </button>
            
            {/* Layout view toggle */}
            <div className="hidden md:flex items-center gap-1">
              <button 
                className={`p-1.5 rounded-md ${layoutView === 'default' ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-200') : ''} focus:outline-none`}
                onClick={() => changeLayoutView('default')}
                aria-label="Default view"
              >
                <FiGrid className="w-4 h-4" />
              </button>
              <button 
                className={`p-1.5 rounded-md ${layoutView === 'compact' ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-200') : ''} focus:outline-none`}
                onClick={() => changeLayoutView('compact')}
                aria-label="Compact view"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4" y="4" width="16" height="4" rx="1" fill="currentColor" />
                  <rect x="4" y="10" width="16" height="4" rx="1" fill="currentColor" />
                  <rect x="4" y="16" width="16" height="4" rx="1" fill="currentColor" />
                </svg>
              </button>
              <button 
                className={`p-1.5 rounded-md ${layoutView === 'expanded' ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-200') : ''} focus:outline-none`}
                onClick={() => changeLayoutView('expanded')}
                aria-label="Expanded view"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4" y="4" width="7" height="7" rx="1" fill="currentColor" />
                  <rect x="13" y="4" width="7" height="7" rx="1" fill="currentColor" />
                  <rect x="4" y="13" width="7" height="7" rx="1" fill="currentColor" />
                  <rect x="13" y="13" width="7" height="7" rx="1" fill="currentColor" />
                </svg>
              </button>
            </div>
            
            {/* Notifications button */}
            <div className="relative" ref={notificationsPanelRef}>
              <button 
                className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} relative focus:outline-none focus:ring-2 focus:ring-indigo-500/50`}
                onClick={() => setShowNotificationsPanel(!showNotificationsPanel)}
                aria-label="Notifications"
              >
                <FiBell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                    {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                  </span>
                )}
              </button>
              
              {/* Notifications Panel */}
              {showNotificationsPanel && (
                <div 
                  className={`absolute right-0 mt-2 w-80 rounded-lg shadow-lg z-50 ${
                    isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                  } max-h-[80vh] overflow-hidden`}
                >
                  <div className="p-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-medium">Notifications</h3>
                    <button 
                      className={`text-xs ${isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}
                      onClick={markAllNotificationsAsRead}
                    >
                      Mark all as read
                    </button>
                  </div>
                  
                  <div className="overflow-y-auto max-h-[60vh] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
                    {notifications.length === 0 ? (
                      <div className="py-8 px-4 text-center text-gray-500">
                        <FiBell className="w-8 h-8 mx-auto mb-2 opacity-40" />
                        <p>No notifications yet</p>
                      </div>
                    ) : (
                      <div>
                        {notifications.map(notification => (
                          <div 
                            key={notification.id}
                            className={`p-3 border-b last:border-b-0 ${
                              isDarkMode 
                                ? 'border-gray-700 hover:bg-gray-700/50' 
                                : 'border-gray-100 hover:bg-gray-50'
                            } ${!notification.read ? (isDarkMode ? 'bg-gray-700/30' : 'bg-indigo-50/50') : ''}`}
                            onClick={() => markNotificationAsRead(notification.id)}
                          >
                            <div className="flex">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                                notification.type === 'order' 
                                  ? 'bg-green-100 text-green-500'
                                  : notification.type === 'user'
                                    ? 'bg-blue-100 text-blue-500'
                                    : notification.type === 'product'
                                      ? 'bg-orange-100 text-orange-500'
                                      : 'bg-purple-100 text-purple-500'
                              }`}>
                                {notification.type === 'order' 
                                  ? <FiShoppingBag className="w-4 h-4" />
                                  : notification.type === 'user'
                                    ? <FiUserIcon className="w-4 h-4" />
                                    : notification.type === 'product'
                                      ? <FiPackage className="w-4 h-4" />
                                      : <FiInfo className="w-4 h-4" />
                                }
                              </div>
                              <div className="flex-1">
                                <p className={`text-sm ${!notification.read ? 'font-medium' : ''}`}>
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {notification.time}
                                </p>
                              </div>
                              {!notification.read && (
                                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                    <button 
                      className={`w-full py-2 text-sm rounded-lg ${
                        isDarkMode 
                          ? 'hover:bg-gray-700 text-gray-300' 
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                      onClick={() => {
                        navigate('/admin-notifications');
                        setShowNotificationsPanel(false);
                      }}
                    >
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative profile-dropdown" ref={profileDropdownRef}>
              <button 
                className={`flex items-center gap-1 md:gap-2 p-1.5 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} focus:outline-none focus:ring-2 focus:ring-indigo-500/50`}
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                aria-expanded={showProfileDropdown}
                aria-haspopup="true"
              >
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {adminProfile.avatar ? (
                    <img 
                      src={adminProfile.avatar} 
                      alt={adminProfile.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="w-full h-full text-gray-500" />
                  )}
                </div>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium truncate max-w-[120px]">
                    {adminProfile.name}
                  </span>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {adminProfile.role}
                  </span>
                </div>
                <FiChevronDown className="w-4 h-4 hidden md:block" />
              </button>
              
              {/* Profile Dropdown - Enhanced Version */}
              {showProfileDropdown && (
                <div 
                  className={`absolute right-0 mt-2 w-64 rounded-lg shadow-lg z-50 ${
                    isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                  } transition-opacity duration-200 ease-in-out overflow-hidden`}
                >
                  <div className={`px-4 py-4 ${isDarkMode ? 'bg-gray-750 border-b border-gray-700' : 'bg-indigo-50 border-b border-gray-200'} text-center`}>
                    <div className="w-16 h-16 mx-auto rounded-full overflow-hidden bg-gray-200 mb-2 ring-2 ring-indigo-500/50">
                      {adminProfile.avatar ? (
                        <img 
                          src={adminProfile.avatar} 
                          alt={adminProfile.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FaUserCircle className="w-full h-full text-gray-500" />
                      )}
                    </div>
                    <p className="text-base font-medium">{adminProfile.name}</p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                      {adminProfile.email}
                    </p>
                    <div className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
                      isDarkMode ? 'bg-indigo-900/40 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
                    }`}>
                      {adminProfile.role}
                    </div>
                  </div>
                  
                  <div className="py-2">
                    <button
                      className={`w-full text-left block px-4 py-2.5 text-sm ${
                        isDarkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-100 text-gray-700'
                      } transition-colors duration-150`}
                      onClick={() => {
                        navigate('/admin-profile');
                        setShowProfileDropdown(false);
                      }}
                    >
                      <div className="flex items-center">
                        <FaUserCircle className="mr-3 h-4 w-4" />
                        View Profile
                      </div>
                    </button>
                    <button
                      className={`w-full text-left block px-4 py-2.5 text-sm ${
                        isDarkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-100 text-gray-700'
                      } transition-colors duration-150`}
                      onClick={() => {
                        navigate('/admin-settings');
                        setShowProfileDropdown(false);
                      }}
                    >
                      <div className="flex items-center">
                        <FiSettings className="mr-3 h-4 w-4" />
                        Account Settings
                      </div>
                    </button>
                    <button
                      className={`w-full text-left block px-4 py-2.5 text-sm ${
                        isDarkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-100 text-gray-700'
                      } transition-colors duration-150`}
                      onClick={() => {
                        navigate('/');
                        setShowProfileDropdown(false);
                      }}
                    >
                      <div className="flex items-center">
                        <FiGlobe className="mr-3 h-4 w-4" />
                        View Store
                      </div>
                    </button>
                  </div>
                  
                  <div className={`py-2 ${isDarkMode ? 'border-t border-gray-700' : 'border-t border-gray-200'}`}>
                    <button
                      className={`w-full text-left block px-4 py-2.5 text-sm ${
                        isDarkMode ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-red-50 text-red-600'
                      } transition-colors duration-150`}
                      onClick={handleLogout}
                    >
                      <div className="flex items-center">
                        <FiLogOut className="mr-3 h-4 w-4" />
                        Sign out
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className={`fixed top-[56px] left-0 right-0 z-20 p-3 shadow-md sm:hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className={`w-full py-2.5 pl-10 pr-10 rounded-lg text-sm ${
                isDarkMode 
                  ? 'bg-gray-700 text-white border-gray-600 focus:border-indigo-500' 
                  : 'bg-gray-100 text-gray-800 border-gray-200 focus:border-indigo-500'
              } border focus:outline-none focus:ring-2 focus:ring-indigo-500/50`}
              autoFocus
              aria-label="Search"
            />
            <FaSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <button 
              className="absolute right-3.5 top-1/2 transform -translate-y-1/2 p-1 rounded-full"
              onClick={() => {
                setSearchQuery('');
                setIsSearchOpen(false);
              }}
              aria-label="Close search"
            >
              <FiX className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          ></div>
        )}
        
        {/* Sidebar - Modernized */}
        <aside 
          className={`fixed md:sticky top-14 md:top-16 left-0 z-20 h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)] transition-all duration-300 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          } ${isCollapsed ? 'w-20' : 'w-64 md:w-72'} border-r ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          } overflow-y-auto scrollbar-thin ${
            isDarkMode ? 'scrollbar-thumb-gray-600 scrollbar-track-gray-800' : 'scrollbar-thumb-gray-300 scrollbar-track-gray-100'
          }`}
        >
          <div className={`p-4 flex flex-col h-full ${isCollapsed ? 'items-center' : ''}`}>
            {/* User avatar in collapsed view */}
            {isCollapsed && (
              <div className="mb-6 mt-2">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center ring-2 ring-indigo-500/30">
                  {adminProfile.avatar ? (
                    <img 
                      src={adminProfile.avatar} 
                      alt={adminProfile.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="w-full h-full text-gray-500" />
                  )}
                </div>
              </div>
            )}
            
            <nav className="mt-2 space-y-1.5">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.path)}
                  className={`w-full flex ${isCollapsed ? 'justify-center' : ''} items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? `${isDarkMode ? 'bg-indigo-500/20' : 'bg-indigo-50'} text-indigo-500 font-medium`
                      : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700/50' : 'text-gray-700 hover:bg-gray-100'}`
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500/40`}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                >
                  <span className={`${isCollapsed ? '' : 'mr-3'} ${activeTab === tab.id ? 'text-indigo-500' : ''}`}>{tab.icon}</span>
                  {!isCollapsed && <span>{tab.label}</span>}
                </button>
              ))}
            </nav>
            
            {/* Quick Stats */}
            {!isCollapsed && (
              <div className={`mt-8 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-indigo-50/50'}`}>
                <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>Quick Stats</h3>
                <div className="space-y-3">
                  {quickStats.map((stat, index) => (
                    <div key={index} className="flex items-center">
                      <div className="mr-3">{stat.icon}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</span>
                          <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                            isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
                          }`}>{stat.value}</span>
                        </div>
                        <div className="mt-1">
                          <span className={`text-xs ${
                            stat.trend === 'up' 
                              ? 'text-green-500' 
                              : 'text-red-500'
                          }`}>
                            {stat.trend === 'up' ? '↑' : '↓'} {stat.change}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Recent Activity Section */}
            {!isCollapsed && (
              <div className="mt-6">
                <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} px-4 mb-2`}>Recent Activity</h3>
                <div className={`space-y-1 mt-1 max-h-40 overflow-y-auto scrollbar-thin ${
                  isDarkMode ? 'scrollbar-thumb-gray-600 scrollbar-track-transparent' : 'scrollbar-thumb-gray-300 scrollbar-track-transparent'
                }`}>
                  {recentActivities.slice(0, 3).map((activity, index) => (
                    <div 
                      key={index} 
                      className={`px-4 py-2 text-xs ${
                        isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100'
                      } rounded-lg cursor-pointer`}
                    >
                      <div className="flex items-start">
                        <span className={`w-2 h-2 mt-1 mr-2 rounded-full flex-shrink-0 ${
                          activity.action.includes('Added') 
                            ? 'bg-green-500' 
                            : activity.action.includes('Updated')
                              ? 'bg-blue-500'
                              : activity.action.includes('Processed')
                                ? 'bg-purple-500'
                                : 'bg-orange-500'
                        }`}></span>
                        <div>
                          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                            <span className="font-medium">{activity.user}</span> {activity.action} <span className="font-medium">{activity.target}</span>
                          </p>
                          <p className={`mt-0.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{activity.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {recentActivities.length > 3 && (
                    <button 
                      className={`w-full text-center text-xs py-1 mt-1 ${
                        isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'
                      }`}
                      onClick={() => navigate('/admin-activity')}
                    >
                      View all activity
                    </button>
                  )}
                </div>
              </div>
            )}
            
            {/* Admin Actions - Redesigned */}
            <div className={`mt-auto pb-6 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
              <button 
                onClick={() => navigate('/')}
                className={`w-full flex ${isCollapsed ? 'justify-center' : ''} items-center px-4 py-2.5 rounded-lg transition-colors ${
                  isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500/40`}
              >
                <FiGlobe className={`${isCollapsed ? '' : 'mr-3'} w-5 h-5`} />
                {!isCollapsed && <span>Store Front</span>}
              </button>
              
              <button 
                onClick={handleLogout}
                className={`w-full flex ${isCollapsed ? 'justify-center' : ''} items-center px-4 py-2.5 rounded-lg transition-colors mt-2 ${
                  isDarkMode ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-red-50 text-red-600'
                } focus:outline-none focus:ring-2 focus:ring-red-500/40`}
              >
                <FiLogOut className={`${isCollapsed ? '' : 'mr-3'} w-5 h-5`} />
                {!isCollapsed && <span>Sign out</span>}
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content - Redesigned */}
        <main className={`flex-1 p-4 md:p-6 pb-12 overflow-x-hidden mt-14 md:mt-16 ${
          isCollapsed ? 'md:ml-20' : 'md:ml-0'
        } transition-all duration-300`}>
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumbs */}
            <div className={`mb-5 flex items-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <span>Dashboard</span>
              {activeTab !== 'dashboard' && (
                <>
                  <span className="mx-2">/</span>
                  <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                    {tabs.find(tab => tab.id === activeTab)?.label || ''}
                  </span>
                </>
              )}
            </div>
            
            <div className="animate-fadeIn">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      {selectedOrder && (
        <CancelOrderModal
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
          handleCancelOrder={() => {}}
          isDarkMode={isDarkMode}
        />
      )}

      {viewOrderDetails && (
        <OrderDetailsModal
          order={viewOrderDetails}
          setViewOrderDetails={setViewOrderDetails}
          handleViewDetailPage={() => {}}
          getStatusColor={() => {}}
          isDarkMode={isDarkMode}
          currentCurrency={currentCurrency}
        />
      )}

      {showUserModal && selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          setShowUserModal={setShowUserModal}
          handleToggleUserStatus={() => {}}
          handleDeleteUser={() => {}}
          handleRevealPassword={() => {}}
          isDarkMode={isDarkMode}
        />
      )}

      {showProductModal && selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          setShowProductModal={setShowProductModal}
          handleEditProduct={() => {}}
          handleDeleteProduct={() => {}}
          isDarkMode={isDarkMode}
          currentCurrency={currentCurrency}
          calculateDiscountPercentage={() => {}}
        />
      )}
    </div>
  );
};

export default AdminLayout; 