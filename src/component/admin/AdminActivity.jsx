import React, { useState, useEffect, useRef } from 'react';
import { FiActivity, FiCalendar, FiFilter, FiSearch, FiUser, FiPackage, FiShoppingBag, FiDollarSign, FiSettings, FiTrash2, FiEdit, FiEye, FiPlus, FiChevronDown } from 'react-icons/fi';
import { useAdminTheme } from './AdminThemeContext';

const AdminActivity = () => {
  const { isDarkMode } = useAdminTheme();
  
  // States
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterUser, setFilterUser] = useState('all');
  const [dateRange, setDateRange] = useState({
    from: '',
    to: ''
  });
  const [detailedActivity, setDetailedActivity] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Custom dropdown states
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  
  // Refs for dropdown click outside detection
  const typeDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  // Theme classes based on dark/light mode
  const themeClasses = {
    container: isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    title: isDarkMode ? 'text-white' : 'text-gray-800',
    text: isDarkMode ? 'text-gray-300' : 'text-gray-700',
    subtext: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    highlight: isDarkMode ? 'text-indigo-400' : 'text-indigo-600',
    input: isDarkMode 
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400',
    card: isDarkMode ? 'bg-gray-700 hover:bg-gray-650' : 'bg-white hover:bg-gray-50',
    button: {
      primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      secondary: isDarkMode 
        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
        : 'bg-gray-100 hover:bg-gray-200 text-gray-700',
      danger: 'bg-red-600 hover:bg-red-700 text-white'
    },
    dropdown: {
      button: isDarkMode 
        ? 'bg-gray-700 border-gray-600 text-white' 
        : 'bg-white border-gray-300 text-gray-900',
      menu: isDarkMode 
        ? 'bg-gray-700 border-gray-600' 
        : 'bg-white border-gray-300',
      item: isDarkMode 
        ? 'hover:bg-gray-600' 
        : 'hover:bg-gray-100',
      selectedItem: isDarkMode 
        ? 'bg-gray-600' 
        : 'bg-gray-100'
    }
  };

  // Mock activity types for icon mapping
  const activityTypeIcons = {
    user: <FiUser className="text-blue-500" />,
    product: <FiPackage className="text-green-500" />,
    order: <FiShoppingBag className="text-orange-500" />,
    payment: <FiDollarSign className="text-purple-500" />,
    system: <FiSettings className="text-red-500" />,
    login: <FiUser className="text-indigo-500" />
  };

  // Mock activity actions for icon mapping
  const activityActionIcons = {
    create: <FiPlus className="text-green-500" />,
    update: <FiEdit className="text-blue-500" />,
    delete: <FiTrash2 className="text-red-500" />,
    view: <FiEye className="text-indigo-500" />
  };

  // Generate mock activities data - in a real application, this would come from an API
  useEffect(() => {
    const generateMockActivities = () => {
      setLoading(true);
      try {
        const mockActivities = [];
        const users = ['Admin', 'John Doe', 'Jane Smith', 'Robert Brown', 'System'];
        const types = ['user', 'product', 'order', 'payment', 'system', 'login'];
        const actions = ['create', 'update', 'delete', 'view'];
        const now = new Date();

        // Generate 50 random activities
        for (let i = 0; i < 50; i++) {
          const user = users[Math.floor(Math.random() * users.length)];
          const type = types[Math.floor(Math.random() * types.length)];
          const action = actions[Math.floor(Math.random() * actions.length)];
          const date = new Date(now);
          date.setDate(date.getDate() - Math.floor(Math.random() * 30)); // Random date within last 30 days
          date.setHours(Math.floor(Math.random() * 24));
          date.setMinutes(Math.floor(Math.random() * 60));

          let target = '';
          let details = {};

          switch (type) {
            case 'user':
              target = ['John Doe', 'Jane Smith', 'Robert Brown', 'Emily Wilson'][Math.floor(Math.random() * 4)];
              details = {
                userId: `USR${Math.floor(Math.random() * 1000)}`,
                email: `${target.toLowerCase().replace(' ', '.')}@example.com`,
                role: ['Admin', 'Customer', 'Manager'][Math.floor(Math.random() * 3)]
              };
              break;
            case 'product':
              target = ['Smartphone X Pro', 'Wireless Earbuds', 'Smart Watch', 'Laptop Ultra', 'Bluetooth Speaker'][Math.floor(Math.random() * 5)];
              details = {
                productId: `PRD${Math.floor(Math.random() * 1000)}`,
                price: (Math.random() * 1000).toFixed(2),
                category: ['Electronics', 'Clothing', 'Home', 'Beauty'][Math.floor(Math.random() * 4)]
              };
              break;
            case 'order':
              target = `Order #${Math.floor(Math.random() * 10000)}`;
              details = {
                orderId: `ORD${Math.floor(Math.random() * 1000)}`,
                customer: users[Math.floor(Math.random() * (users.length - 1))],
                amount: (Math.random() * 1000).toFixed(2),
                status: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'][Math.floor(Math.random() * 5)]
              };
              break;
            case 'payment':
              target = `Payment #${Math.floor(Math.random() * 10000)}`;
              details = {
                paymentId: `PAY${Math.floor(Math.random() * 1000)}`,
                amount: (Math.random() * 1000).toFixed(2),
                method: ['Credit Card', 'PayPal', 'Bank Transfer', 'Apple Pay'][Math.floor(Math.random() * 4)],
                status: ['Successful', 'Failed', 'Pending', 'Refunded'][Math.floor(Math.random() * 4)]
              };
              break;
            case 'system':
              target = ['System Update', 'Database Backup', 'Settings Change', 'Security Alert'][Math.floor(Math.random() * 4)];
              details = {
                component: ['Database', 'Server', 'API', 'Frontend', 'Admin Dashboard'][Math.floor(Math.random() * 5)],
                ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
                status: ['Success', 'Failure', 'Warning'][Math.floor(Math.random() * 3)]
              };
              break;
            case 'login':
              target = 'Account';
              details = {
                ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
                browser: ['Chrome', 'Firefox', 'Safari', 'Edge'][Math.floor(Math.random() * 4)],
                device: ['Desktop', 'Mobile', 'Tablet'][Math.floor(Math.random() * 3)],
                location: ['New York', 'London', 'Paris', 'Tokyo'][Math.floor(Math.random() * 4)]
              };
              break;
            default:
              target = 'Unknown';
          }

          const description = generateDescription(user, action, type, target);

          mockActivities.push({
            id: `ACT${i}`,
            user,
            type,
            action,
            target,
            date,
            description,
            details
          });
        }

        // Sort by date (newest first)
        mockActivities.sort((a, b) => b.date - a.date);
        
        setActivities(mockActivities);
        setFilteredActivities(mockActivities);
        setError(null);
      } catch (err) {
        console.error('Error generating mock activities:', err);
        setError('Failed to load activity data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    generateMockActivities();
  }, []);

  // Function to generate descriptive text for activities
  const generateDescription = (user, action, type, target) => {
    switch (action) {
      case 'create':
        return `${user} created a new ${type}: ${target}`;
      case 'update':
        return `${user} updated ${type}: ${target}`;
      case 'delete':
        return `${user} deleted ${type}: ${target}`;
      case 'view':
        return `${user} viewed ${type}: ${target}`;
      default:
        return `${user} performed an action on ${type}: ${target}`;
    }
  };

  // Filter activities based on search, type and date range
  useEffect(() => {
    const filterResults = () => {
      let results = [...activities];
      
      // Filter by search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        results = results.filter(activity => 
          activity.user.toLowerCase().includes(term) ||
          activity.target.toLowerCase().includes(term) ||
          activity.description.toLowerCase().includes(term)
        );
      }
      
      // Filter by activity type
      if (filterType !== 'all') {
        results = results.filter(activity => activity.type === filterType);
      }
      
      // Filter by user
      if (filterUser !== 'all') {
        results = results.filter(activity => activity.user === filterUser);
      }
      
      // Filter by date range
      if (dateRange.from) {
        const fromDate = new Date(dateRange.from);
        results = results.filter(activity => new Date(activity.date) >= fromDate);
      }
      
      if (dateRange.to) {
        const toDate = new Date(dateRange.to);
        toDate.setHours(23, 59, 59, 999); // Set to end of day
        results = results.filter(activity => new Date(activity.date) <= toDate);
      }
      
      setFilteredActivities(results);
    };
    
    filterResults();
  }, [activities, searchTerm, filterType, filterUser, dateRange]);

  // Get unique users for filter dropdown
  const uniqueUsers = ['all', ...new Set(activities.map(activity => activity.user))];

  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle viewing activity details
  const handleViewDetails = (activity) => {
    setDetailedActivity(activity);
    setShowDetailModal(true);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('all');
    setFilterUser('all');
    setDateRange({ from: '', to: '' });
  };

  // Click outside handler for dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target)) {
        setTypeDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Add touch events for better mobile experience on dropdowns
  useEffect(() => {
    const handleTouchStart = (e) => {
      // Only handle touch events outside dropdowns
      if (typeDropdownOpen && 
          typeDropdownRef.current && 
          !typeDropdownRef.current.contains(e.target)) {
        setTypeDropdownOpen(false);
      }
      if (userDropdownOpen && 
          userDropdownRef.current && 
          !userDropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, [typeDropdownOpen, userDropdownOpen]);

  return (
    <div className="animate-fadeIn space-y-4 md:space-y-6 p-2.5 md:p-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500/10 to-blue-500/5 rounded-lg p-4 md:p-6 mb-5">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 sm:gap-4">
          <div>
            <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold ${themeClasses.title} flex items-center`}>
              <span className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg mr-3">
                <FiActivity className="h-6 w-6 sm:h-7 sm:w-7 text-indigo-600 dark:text-indigo-400" />
              </span>
              Activity Log
            </h1>
            <p className={`mt-1.5 text-sm ${themeClasses.subtext} hidden sm:block`}>
              Track all user and system activities across your platform
            </p>
          </div>
          
          <div className="flex items-center gap-3 mt-3 sm:mt-0">
            <div className={`px-3 py-1.5 rounded-md text-xs ${isDarkMode ? 'bg-indigo-900/20 text-indigo-300' : 'bg-indigo-50 text-indigo-700'}`}>
              {filteredActivities.length} Activities
            </div>
            <button 
              onClick={clearFilters}
              className={`text-xs sm:text-sm px-3 py-1.5 rounded-md flex items-center ${themeClasses.button.secondary}`}
            >
              <FiFilter className="mr-1.5" /> Clear Filters
            </button>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className={`rounded-lg border shadow-sm ${themeClasses.container} overflow-hidden`}>
        {/* Filter header */}
        <div className={`px-5 py-3 border-b ${isDarkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'} flex items-center justify-between`}>
          <div className="flex items-center">
            <FiFilter className={`mr-2 ${themeClasses.highlight}`} />
            <h2 className={`text-sm font-medium ${themeClasses.title}`}>Filter Activities</h2>
          </div>
          <button 
            onClick={clearFilters}
            className={`text-xs flex items-center ${themeClasses.subtext} hover:${themeClasses.text} transition-colors`}
          >
            <span>Reset</span>
          </button>
        </div>
        
        <div className="p-4 md:p-5">
          {/* Search */}
          <div className="mb-5">
            <label className={`block text-xs font-medium mb-1.5 ${themeClasses.title}`}>Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiSearch className={themeClasses.subtext} />
              </div>
              <input
                type="text"
                className={`pl-10 pr-4 py-2.5 w-full rounded-lg border ${themeClasses.input}`}
                placeholder="Search by user, description, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Filter Controls - 2 columns on small devices, 3 columns on larger screens, with visual groups */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Activity Type Group */}
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${themeClasses.title}`}>Activity Type</label>
              <div className="relative" ref={typeDropdownRef}>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FiActivity className={themeClasses.subtext} />
                </div>
                <button
                  type="button"
                  className={`flex items-center justify-between pl-10 pr-4 py-2.5 w-full rounded-lg border ${themeClasses.dropdown.button} ${typeDropdownOpen ? 'ring-2 ring-indigo-500 ring-opacity-50' : ''}`}
                  onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
                >
                  <span className="truncate">{filterType === 'all' ? 'All Activity Types' : filterType.charAt(0).toUpperCase() + filterType.slice(1)}</span>
                  <FiChevronDown className={`ml-2 transition-transform ${typeDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {typeDropdownOpen && (
                  <div className={`absolute z-30 mt-1 w-full rounded-md shadow-lg border ${themeClasses.dropdown.menu}`}>
                    <div className="py-1 max-h-56 overflow-auto">
                      <button
                        onClick={() => {
                          setFilterType('all');
                          setTypeDropdownOpen(false);
                        }}
                        className={`flex items-center w-full px-4 py-2 text-left ${themeClasses.text} ${filterType === 'all' ? themeClasses.dropdown.selectedItem : themeClasses.dropdown.item}`}
                      >
                        All Activity Types
                      </button>
                      <button
                        onClick={() => {
                          setFilterType('user');
                          setTypeDropdownOpen(false);
                        }}
                        className={`flex items-center w-full px-4 py-2 text-left ${themeClasses.text} ${filterType === 'user' ? themeClasses.dropdown.selectedItem : themeClasses.dropdown.item}`}
                      >
                        <FiUser className="mr-2 text-blue-500" />
                        User
                      </button>
                      <button
                        onClick={() => {
                          setFilterType('product');
                          setTypeDropdownOpen(false);
                        }}
                        className={`flex items-center w-full px-4 py-2 text-left ${themeClasses.text} ${filterType === 'product' ? themeClasses.dropdown.selectedItem : themeClasses.dropdown.item}`}
                      >
                        <FiPackage className="mr-2 text-green-500" />
                        Product
                      </button>
                      <button
                        onClick={() => {
                          setFilterType('order');
                          setTypeDropdownOpen(false);
                        }}
                        className={`flex items-center w-full px-4 py-2 text-left ${themeClasses.text} ${filterType === 'order' ? themeClasses.dropdown.selectedItem : themeClasses.dropdown.item}`}
                      >
                        <FiShoppingBag className="mr-2 text-orange-500" />
                        Order
                      </button>
                      <button
                        onClick={() => {
                          setFilterType('payment');
                          setTypeDropdownOpen(false);
                        }}
                        className={`flex items-center w-full px-4 py-2 text-left ${themeClasses.text} ${filterType === 'payment' ? themeClasses.dropdown.selectedItem : themeClasses.dropdown.item}`}
                      >
                        <FiDollarSign className="mr-2 text-purple-500" />
                        Payment
                      </button>
                      <button
                        onClick={() => {
                          setFilterType('system');
                          setTypeDropdownOpen(false);
                        }}
                        className={`flex items-center w-full px-4 py-2 text-left ${themeClasses.text} ${filterType === 'system' ? themeClasses.dropdown.selectedItem : themeClasses.dropdown.item}`}
                      >
                        <FiSettings className="mr-2 text-red-500" />
                        System
                      </button>
                      <button
                        onClick={() => {
                          setFilterType('login');
                          setTypeDropdownOpen(false);
                        }}
                        className={`flex items-center w-full px-4 py-2 text-left ${themeClasses.text} ${filterType === 'login' ? themeClasses.dropdown.selectedItem : themeClasses.dropdown.item}`}
                      >
                        <FiUser className="mr-2 text-indigo-500" />
                        Login
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* User Group */}
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${themeClasses.title}`}>User</label>
              <div className="relative" ref={userDropdownRef}>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FiUser className={themeClasses.subtext} />
                </div>
                <button
                  type="button"
                  className={`flex items-center justify-between pl-10 pr-4 py-2.5 w-full rounded-lg border ${themeClasses.dropdown.button} ${userDropdownOpen ? 'ring-2 ring-indigo-500 ring-opacity-50' : ''}`}
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                >
                  <span className="truncate">{filterUser === 'all' ? 'All Users' : filterUser}</span>
                  <FiChevronDown className={`ml-2 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {userDropdownOpen && (
                  <div className={`absolute z-30 mt-1 w-full rounded-md shadow-lg border ${themeClasses.dropdown.menu}`}>
                    <div className="py-1 max-h-56 overflow-auto">
                      <button
                        onClick={() => {
                          setFilterUser('all');
                          setUserDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-left ${themeClasses.text} ${filterUser === 'all' ? themeClasses.dropdown.selectedItem : themeClasses.dropdown.item}`}
                      >
                        All Users
                      </button>
                      {uniqueUsers.filter(user => user !== 'all').map((user) => (
                        <button
                          key={user}
                          onClick={() => {
                            setFilterUser(user);
                            setUserDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-2 text-left ${themeClasses.text} ${filterUser === user ? themeClasses.dropdown.selectedItem : themeClasses.dropdown.item}`}
                        >
                          {user}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Date Range Group */}
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${themeClasses.title}`}>Date Range</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={`block text-xs mb-1 ${themeClasses.subtext}`}>From</label>
                  <input
                    type="date"
                    className={`px-2 sm:px-3 py-2.5 w-full rounded-lg border text-sm ${themeClasses.input}`}
                    value={dateRange.from}
                    onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                  />
                </div>
                <div>
                  <label className={`block text-xs mb-1 ${themeClasses.subtext}`}>To</label>
                  <input
                    type="date"
                    className={`px-2 sm:px-3 py-2.5 w-full rounded-lg border text-sm ${themeClasses.input}`}
                    value={dateRange.to}
                    onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Applied Filters */}
          {(filterType !== 'all' || filterUser !== 'all' || dateRange.from || dateRange.to || searchTerm) && (
            <div className="mt-5 pt-5 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-2 items-center">
                <span className={`text-xs ${themeClasses.subtext}`}>Applied filters:</span>
                
                {searchTerm && (
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'}`}>
                    Search: {searchTerm.length > 15 ? searchTerm.substring(0, 15) + '...' : searchTerm}
                    <button 
                      type="button"
                      className="ml-1 hover:text-red-500"
                      onClick={() => setSearchTerm('')}
                    >
                      ×
                    </button>
                  </span>
                )}
                
                {filterType !== 'all' && (
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'}`}>
                    Type: {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                    <button 
                      type="button"
                      className="ml-1 hover:text-red-500"
                      onClick={() => setFilterType('all')}
                    >
                      ×
                    </button>
                  </span>
                )}
                
                {filterUser !== 'all' && (
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'}`}>
                    User: {filterUser}
                    <button 
                      type="button"
                      className="ml-1 hover:text-red-500"
                      onClick={() => setFilterUser('all')}
                    >
                      ×
                    </button>
                  </span>
                )}
                
                {dateRange.from && (
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'}`}>
                    From: {dateRange.from}
                    <button 
                      type="button"
                      className="ml-1 hover:text-red-500"
                      onClick={() => setDateRange({...dateRange, from: ''})}
                    >
                      ×
                    </button>
                  </span>
                )}
                
                {dateRange.to && (
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'}`}>
                    To: {dateRange.to}
                    <button 
                      type="button"
                      className="ml-1 hover:text-red-500"
                      onClick={() => setDateRange({...dateRange, to: ''})}
                    >
                      ×
                    </button>
                  </span>
                )}
                
                <button 
                  onClick={clearFilters}
                  className={`ml-auto text-xs px-3 py-1 rounded-md flex items-center ${themeClasses.button.secondary}`}
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Activity List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-48 md:h-64 rounded-lg border shadow-sm overflow-hidden bg-opacity-50 p-4 md:p-6 text-center">
          <div className="animate-spin rounded-full h-10 w-10 md:h-14 md:w-14 border-2 border-t-2 border-b-2 border-indigo-500 mb-3"></div>
          <span className={`${themeClasses.text} text-sm md:text-base`}>Loading activity data...</span>
          <p className={`${themeClasses.subtext} text-xs mt-2 max-w-md`}>This may take a moment while we retrieve the most recent activities</p>
        </div>
      ) : error ? (
        <div className={`p-6 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-red-900/10 text-red-300' : 'bg-red-50 text-red-800'}`}>
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-lg font-medium mb-1">{error}</p>
            <p className="text-sm opacity-80">Please try refreshing the page or contact support if the issue persists.</p>
          </div>
        </div>
      ) : filteredActivities.length === 0 ? (
        <div className={`p-8 sm:p-10 text-center rounded-lg border shadow-sm ${themeClasses.container}`}>
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <FiActivity className={`h-8 w-8 ${themeClasses.subtext}`} />
          </div>
          <h3 className={`mt-4 text-lg md:text-xl font-medium ${themeClasses.title}`}>No activities found</h3>
          <p className={`mt-2 ${themeClasses.subtext} max-w-md mx-auto`}>Try adjusting your filters or search term to find what you're looking for</p>
          <button 
            onClick={clearFilters}
            className={`mt-4 px-4 py-2 text-sm rounded-md ${themeClasses.button.primary}`}
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className={`rounded-lg border shadow-sm overflow-hidden ${themeClasses.container}`}>
          {/* Mobile view for smaller screens */}
          <div className="md:hidden">
            {filteredActivities.map((activity) => (
              <div 
                key={activity.id} 
                className={`p-3.5 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} ${themeClasses.card} last:border-b-0`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5 flex-1 min-w-0">
                    <div className="mt-0.5 flex-shrink-0">
                      {activityActionIcons[activity.action] || <FiActivity className="text-gray-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm leading-tight ${themeClasses.text} line-clamp-2`}>{activity.description}</p>
                      <p className={`text-xs mt-1 ${themeClasses.subtext}`}>ID: {activity.id}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <div className="flex items-center">
                          <span className="mr-1.5 flex-shrink-0">
                            {activityTypeIcons[activity.type] || <FiActivity className="text-gray-500 h-3 w-3" />}
                          </span>
                          <span className={`capitalize text-xs ${themeClasses.text}`}>{activity.type}</span>
                        </div>
                        <span className={`text-xs ${themeClasses.subtext}`}>•</span>
                        <span className={`text-xs truncate ${themeClasses.subtext}`}>{formatDate(activity.date)}</span>
                      </div>
                      <div className="mt-1.5">
                        <span className={`text-xs font-medium ${themeClasses.text}`}>{activity.user}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleViewDetails(activity)}
                    className={`text-xs px-2.5 py-1.5 rounded flex-shrink-0 ${themeClasses.button.secondary}`}
                    aria-label="View details"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Table for larger screens */}
          <div className="hidden md:block">
            <div className="overflow-x-auto -mx-4 sm:-mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                      <th scope="col" className={`px-4 py-3 text-left text-xs font-medium ${themeClasses.subtext} uppercase tracking-wider`}>Activity</th>
                      <th scope="col" className={`px-4 py-3 text-left text-xs font-medium ${themeClasses.subtext} uppercase tracking-wider`}>User</th>
                      <th scope="col" className={`px-4 py-3 text-left text-xs font-medium ${themeClasses.subtext} uppercase tracking-wider`}>Date</th>
                      <th scope="col" className={`px-4 py-3 text-left text-xs font-medium ${themeClasses.subtext} uppercase tracking-wider`}>Type</th>
                      <th scope="col" className={`px-4 py-3 text-right text-xs font-medium ${themeClasses.subtext} uppercase tracking-wider`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredActivities.map((activity) => (
                      <tr key={activity.id} className={themeClasses.card}>
                        <td className={`px-4 py-3 ${themeClasses.text}`}>
                          <div className="flex items-start gap-3">
                            <div className="mt-1 flex-shrink-0">
                              {activityActionIcons[activity.action] || <FiActivity className="text-gray-500" />}
                            </div>
                            <div className="min-w-0 max-w-xs lg:max-w-md">
                              <p className={`font-medium truncate ${themeClasses.text}`}>{activity.description}</p>
                              <p className={`text-xs ${themeClasses.subtext}`}>ID: {activity.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className={`px-4 py-3 ${themeClasses.text}`}>{activity.user}</td>
                        <td className={`px-4 py-3 ${themeClasses.subtext} whitespace-nowrap`}>{formatDate(activity.date)}</td>
                        <td className={`px-4 py-3`}>
                          <div className="flex items-center">
                            <span className="mr-2">
                              {activityTypeIcons[activity.type] || <FiActivity className="text-gray-500" />}
                            </span>
                            <span className={`capitalize ${themeClasses.text}`}>{activity.type}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleViewDetails(activity)}
                            className={`text-xs px-2.5 py-1.5 rounded ${themeClasses.button.secondary}`}
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Activity Detail Modal */}
      {showDetailModal && detailedActivity && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end sm:items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
              aria-hidden="true" 
              onClick={() => setShowDetailModal(false)}
            ></div>
            
            {/* Modal position trick - centers vertically on desktop, slides from bottom on mobile */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className={`inline-block align-bottom sm:align-middle w-full max-w-md sm:max-w-lg rounded-t-lg sm:rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 relative ${themeClasses.container}`}>
              {/* Close button for mobile - more touch friendly */}
              <button 
                type="button"
                onClick={() => setShowDetailModal(false)}
                className={`absolute right-2 top-2 rounded-md p-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <svg className={`h-5 w-5 ${themeClasses.subtext}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 ${isDarkMode ? 'bg-indigo-900/20' : 'bg-indigo-100'}`}>
                    {activityTypeIcons[detailedActivity.type] || <FiActivity className={themeClasses.highlight} />}
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className={`text-lg leading-6 font-medium ${themeClasses.title}`} id="modal-title">
                      Activity Details
                    </h3>
                    <div className="mt-4 space-y-3.5 max-h-[60vh] sm:max-h-[70vh] overflow-y-auto pr-1 pb-1">
                      <div>
                        <p className={`text-sm ${themeClasses.subtext}`}>ID</p>
                        <p className={`text-sm font-medium ${themeClasses.text}`}>{detailedActivity.id}</p>
                      </div>
                      <div>
                        <p className={`text-sm ${themeClasses.subtext}`}>Description</p>
                        <p className={`text-sm font-medium ${themeClasses.text}`}>{detailedActivity.description}</p>
                      </div>
                      <div>
                        <p className={`text-sm ${themeClasses.subtext}`}>Date & Time</p>
                        <p className={`text-sm font-medium ${themeClasses.text}`}>{formatDate(detailedActivity.date)}</p>
                      </div>
                      <div>
                        <p className={`text-sm ${themeClasses.subtext}`}>User</p>
                        <p className={`text-sm font-medium ${themeClasses.text}`}>{detailedActivity.user}</p>
                      </div>
                      <div>
                        <p className={`text-sm ${themeClasses.subtext}`}>Type</p>
                        <div className="flex items-center">
                          <span className="mr-2">
                            {activityTypeIcons[detailedActivity.type] || <FiActivity className="text-gray-500" />}
                          </span>
                          <span className={`capitalize text-sm font-medium ${themeClasses.text}`}>{detailedActivity.type}</span>
                        </div>
                      </div>
                      <div>
                        <p className={`text-sm ${themeClasses.subtext}`}>Action</p>
                        <div className="flex items-center">
                          <span className="mr-2">
                            {activityActionIcons[detailedActivity.action] || <FiActivity className="text-gray-500" />}
                          </span>
                          <span className={`capitalize text-sm font-medium ${themeClasses.text}`}>{detailedActivity.action}</span>
                        </div>
                      </div>
                      <div>
                        <p className={`text-sm ${themeClasses.subtext}`}>Target</p>
                        <p className={`text-sm font-medium ${themeClasses.text}`}>{detailedActivity.target}</p>
                      </div>
                      <div>
                        <p className={`text-sm ${themeClasses.subtext}`}>Additional Details</p>
                        <div className={`mt-2 p-2 sm:p-3 rounded text-sm ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <pre className={`whitespace-pre-wrap font-mono text-xs overflow-x-auto ${themeClasses.text}`}>
                            {JSON.stringify(detailedActivity.details, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse sm:pb-6">
                <button
                  type="button"
                  className={`w-full inline-flex justify-center rounded-md shadow-sm px-4 py-2.5 text-base font-medium sm:ml-3 sm:w-auto sm:text-sm ${themeClasses.button.primary}`}
                  onClick={() => setShowDetailModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminActivity;