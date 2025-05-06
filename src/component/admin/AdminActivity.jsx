import React, { useState, useEffect, useRef } from 'react';
import { FiActivity, FiFilter, FiSearch, FiUser, FiPackage, FiShoppingBag, FiDollarSign, FiSettings, FiTrash2, FiEdit, FiEye, FiPlus, FiChevronDown, FiCalendar, FiClock, FiX, FiInfo } from 'react-icons/fi';
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

  // Theme classes based on dark/light mode - enhanced for modern UI
  const themeClasses = {
    container: isDarkMode 
      ? 'bg-gray-800 border-gray-700' 
      : 'bg-white border-gray-200',
    title: isDarkMode ? 'text-white' : 'text-gray-800',
    text: isDarkMode ? 'text-gray-300' : 'text-gray-700',
    subtext: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    highlight: isDarkMode ? 'text-violet-400' : 'text-violet-600',
    input: isDarkMode 
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-violet-500 focus:ring-violet-500/20' 
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-violet-500 focus:ring-violet-500/20',
    card: isDarkMode 
      ? 'bg-gray-750 hover:bg-gray-700' 
      : 'bg-white hover:bg-gray-50',
    button: {
      primary: 'bg-violet-600 hover:bg-violet-700 text-white transition-colors duration-200',
      secondary: isDarkMode 
        ? 'bg-gray-700 hover:bg-gray-600 text-white transition-colors duration-200' 
        : 'bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors duration-200',
      outline: isDarkMode
        ? 'border border-gray-600 hover:bg-gray-700 text-gray-300 transition-colors duration-200'
        : 'border border-gray-300 hover:bg-gray-100 text-gray-700 transition-colors duration-200',
      danger: 'bg-red-600 hover:bg-red-700 text-white transition-colors duration-200'
    },
    dropdown: {
      button: isDarkMode 
        ? 'bg-gray-700 border-gray-600 text-white' 
        : 'bg-white border-gray-300 text-gray-900',
      menu: isDarkMode 
        ? 'bg-gray-750 border-gray-600' 
        : 'bg-white border-gray-300',
      item: isDarkMode 
        ? 'hover:bg-gray-700' 
        : 'hover:bg-gray-100',
      selectedItem: isDarkMode 
        ? 'bg-violet-900/40 text-violet-300' 
        : 'bg-violet-50 text-violet-700'
    },
    badge: {
      violet: isDarkMode ? 'bg-violet-900/40 text-violet-300' : 'bg-violet-50 text-violet-700',
      blue: isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-700',
      green: isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-700',
      red: isDarkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-700',
      orange: isDarkMode ? 'bg-orange-900/30 text-orange-300' : 'bg-orange-50 text-orange-700',
      purple: isDarkMode ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-50 text-purple-700',
      gray: isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700',
    }
  };

  // Mock activity types for icon mapping with updated styling
  const activityTypeIcons = {
    user: <FiUser className="text-blue-500" />,
    product: <FiPackage className="text-green-500" />,
    order: <FiShoppingBag className="text-orange-500" />,
    payment: <FiDollarSign className="text-purple-500" />,
    system: <FiSettings className="text-red-500" />,
    login: <FiUser className="text-violet-500" />
  };

  // Mock activity actions for icon mapping
  const activityActionIcons = {
    create: <FiPlus className="text-green-500" />,
    update: <FiEdit className="text-blue-500" />,
    delete: <FiTrash2 className="text-red-500" />,
    view: <FiEye className="text-violet-500" />
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
    <div className="animate-fadeIn space-y-5 md:space-y-6 p-2.5 md:p-4">
      {/* Enhanced Header with Glass Morphism */}
      <div className={`relative rounded-xl p-5 md:p-6 overflow-hidden ${isDarkMode ? 'bg-gradient-to-r from-violet-900/20 to-indigo-900/20 shadow-lg' : 'bg-gradient-to-r from-violet-50 to-indigo-50'}`}>
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className={`absolute right-0 bottom-0 w-64 h-64 rounded-full ${isDarkMode ? 'bg-violet-600/5' : 'bg-violet-200/30'} blur-3xl -m-32`}></div>
          <div className={`absolute left-1/4 top-0 w-32 h-32 rounded-full ${isDarkMode ? 'bg-indigo-500/5' : 'bg-indigo-200/40'} blur-3xl -m-10`}></div>
        </div>

        <div className="relative flex flex-col sm:flex-row justify-between sm:items-center gap-4 md:gap-6">
          <div>
            <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold ${themeClasses.title} flex items-center`}>
              <span className={`${isDarkMode ? 'bg-violet-900/30' : 'bg-violet-100'} p-2.5 rounded-xl mr-4 shadow-sm`}>
                <FiActivity className="h-6 w-6 sm:h-7 sm:w-7 text-violet-600 dark:text-violet-400" />
              </span>
              Activity Log
            </h1>
            <p className={`mt-2 text-sm ${themeClasses.subtext} max-w-xl hidden sm:block`}>
              Monitor and track all user and system activities across your platform in real-time
            </p>
          </div>
          
          <div className="flex items-center gap-3 mt-2 sm:mt-0">
            <div className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center ${themeClasses.badge.violet}`}>
              <FiActivity className="mr-1.5 h-3.5 w-3.5" />
              {filteredActivities.length} Activities
            </div>
            <button 
              onClick={clearFilters}
              className={`text-xs sm:text-sm px-3 py-1.5 rounded-lg flex items-center transition-all ${themeClasses.button.outline}`}
            >
              <FiFilter className="mr-1.5" /> Clear Filters
            </button>
          </div>
        </div>
      </div>
      
      {/* Modern Filter Panel with better spacing */}
      <div className={`rounded-xl border shadow-sm ${themeClasses.container} overflow-visible`}>
        {/* Filter header */}
        <div className={`px-5 py-3.5 border-b ${isDarkMode ? 'border-gray-700 bg-gray-800/70' : 'border-gray-200 bg-gray-50/80'} flex items-center justify-between`}>
          <div className="flex items-center">
            <FiFilter className={`mr-2.5 ${themeClasses.highlight}`} />
            <h2 className={`text-sm font-medium ${themeClasses.title}`}>Filter Activities</h2>
          </div>
          <button 
            onClick={clearFilters}
            className={`text-xs flex items-center ${themeClasses.subtext} hover:${themeClasses.text} transition-colors`}
          >
            <span>Reset</span>
          </button>
        </div>
        
        <div className="p-5 overflow-visible">
          {/* Enhanced Search with modern style */}
          <div className="mb-5">
            <label className={`block text-xs font-medium mb-2 ${themeClasses.title}`}>Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <FiSearch className={themeClasses.subtext} />
              </div>
              <input
                type="text"
                className={`pl-10 pr-4 py-2.5 w-full rounded-lg border shadow-sm ${themeClasses.input} focus:ring focus:outline-none transition-all duration-200`}
                placeholder="Search by user, description, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5"
                  onClick={() => setSearchTerm('')}
                >
                  <FiX className={`${themeClasses.subtext} hover:text-red-500 transition-colors`} />
                </button>
              )}
            </div>
          </div>
          
          {/* Filter Controls - Improved with better spacing and aesthetics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Activity Type Group */}
            <div>
              <label className={`block text-xs font-medium mb-2 ${themeClasses.title}`}>Activity Type</label>
              <div className="relative" ref={typeDropdownRef}>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <FiActivity className={themeClasses.subtext} />
                </div>
                <button
                  type="button"
                  className={`flex items-center justify-between pl-10 pr-4 py-2.5 w-full rounded-lg border shadow-sm ${themeClasses.dropdown.button} ${typeDropdownOpen ? 'ring-2 ring-violet-500 ring-opacity-50' : ''} focus:outline-none transition-all duration-200`}
                  onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
                >
                  <span className="truncate">{filterType === 'all' ? 'All Activity Types' : filterType.charAt(0).toUpperCase() + filterType.slice(1)}</span>
                  <FiChevronDown className={`ml-2 transition-transform duration-200 ${typeDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {typeDropdownOpen && (
                  <div className={`fixed z-[100] mt-1 w-full rounded-lg shadow-lg border ${themeClasses.dropdown.menu}`} style={{
                    maxHeight: '300px', 
                    width: typeDropdownRef.current ? typeDropdownRef.current.offsetWidth + 'px' : 'auto',
                    left: typeDropdownRef.current ? typeDropdownRef.current.getBoundingClientRect().left + 'px' : 'auto',
                    top: typeDropdownRef.current ? typeDropdownRef.current.getBoundingClientRect().bottom + 5 + 'px' : 'auto'
                  }}>
                    <div className="py-1 max-h-60 overflow-y-auto scrollbar-thin scrollbar-hidden">
                      <button
                        onClick={() => {
                          setFilterType('all');
                          setTypeDropdownOpen(false);
                        }}
                        className={`flex items-center w-full px-4 py-2.5 text-left ${themeClasses.text} ${filterType === 'all' ? themeClasses.dropdown.selectedItem : themeClasses.dropdown.item}`}
                      >
                        All Activity Types
                      </button>
                      <button
                        onClick={() => {
                          setFilterType('user');
                          setTypeDropdownOpen(false);
                        }}
                        className={`flex items-center w-full px-4 py-2.5 text-left ${themeClasses.text} ${filterType === 'user' ? themeClasses.dropdown.selectedItem : themeClasses.dropdown.item}`}
                      >
                        <FiUser className="mr-2.5 text-blue-500" />
                        User
                      </button>
                      <button
                        onClick={() => {
                          setFilterType('product');
                          setTypeDropdownOpen(false);
                        }}
                        className={`flex items-center w-full px-4 py-2.5 text-left ${themeClasses.text} ${filterType === 'product' ? themeClasses.dropdown.selectedItem : themeClasses.dropdown.item}`}
                      >
                        <FiPackage className="mr-2.5 text-green-500" />
                        Product
                      </button>
                      <button
                        onClick={() => {
                          setFilterType('order');
                          setTypeDropdownOpen(false);
                        }}
                        className={`flex items-center w-full px-4 py-2.5 text-left ${themeClasses.text} ${filterType === 'order' ? themeClasses.dropdown.selectedItem : themeClasses.dropdown.item}`}
                      >
                        <FiShoppingBag className="mr-2.5 text-orange-500" />
                        Order
                      </button>
                      <button
                        onClick={() => {
                          setFilterType('payment');
                          setTypeDropdownOpen(false);
                        }}
                        className={`flex items-center w-full px-4 py-2.5 text-left ${themeClasses.text} ${filterType === 'payment' ? themeClasses.dropdown.selectedItem : themeClasses.dropdown.item}`}
                      >
                        <FiDollarSign className="mr-2.5 text-purple-500" />
                        Payment
                      </button>
                      <button
                        onClick={() => {
                          setFilterType('system');
                          setTypeDropdownOpen(false);
                        }}
                        className={`flex items-center w-full px-4 py-2.5 text-left ${themeClasses.text} ${filterType === 'system' ? themeClasses.dropdown.selectedItem : themeClasses.dropdown.item}`}
                      >
                        <FiSettings className="mr-2.5 text-red-500" />
                        System
                      </button>
                      <button
                        onClick={() => {
                          setFilterType('login');
                          setTypeDropdownOpen(false);
                        }}
                        className={`flex items-center w-full px-4 py-2.5 text-left ${themeClasses.text} ${filterType === 'login' ? themeClasses.dropdown.selectedItem : themeClasses.dropdown.item}`}
                      >
                        <FiUser className="mr-2.5 text-violet-500" />
                        Login
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* User Group */}
            <div>
              <label className={`block text-xs font-medium mb-2 ${themeClasses.title}`}>User</label>
              <div className="relative" ref={userDropdownRef}>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <FiUser className={themeClasses.subtext} />
                </div>
                <button
                  type="button"
                  className={`flex items-center justify-between pl-10 pr-4 py-2.5 w-full rounded-lg border shadow-sm ${themeClasses.dropdown.button} ${userDropdownOpen ? 'ring-2 ring-violet-500 ring-opacity-50' : ''} focus:outline-none transition-all duration-200`}
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                >
                  <span className="truncate">{filterUser === 'all' ? 'All Users' : filterUser}</span>
                  <FiChevronDown className={`ml-2 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {userDropdownOpen && (
                  <div className={`fixed z-[100] mt-1 w-full rounded-lg shadow-lg border ${themeClasses.dropdown.menu}`} style={{
                    maxHeight: '300px',
                    width: userDropdownRef.current ? userDropdownRef.current.offsetWidth + 'px' : 'auto',
                    left: userDropdownRef.current ? userDropdownRef.current.getBoundingClientRect().left + 'px' : 'auto',
                    top: userDropdownRef.current ? userDropdownRef.current.getBoundingClientRect().bottom + 5 + 'px' : 'auto'
                  }}>
                    <div className="py-1 max-h-60 overflow-y-auto scrollbar-thin scrollbar-hidden">
                      <button
                        onClick={() => {
                          setFilterUser('all');
                          setUserDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left ${themeClasses.text} ${filterUser === 'all' ? themeClasses.dropdown.selectedItem : themeClasses.dropdown.item}`}
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
                          className={`w-full px-4 py-2.5 text-left ${themeClasses.text} ${filterUser === user ? themeClasses.dropdown.selectedItem : themeClasses.dropdown.item}`}
                        >
                          {user}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Date Range Group - Enhanced with better icon indicators */}
            <div>
              <label className={`block text-xs font-medium mb-2 ${themeClasses.title}`}>Date Range</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FiCalendar className={`h-4 w-4 ${themeClasses.subtext}`} />
                    </div>
                    <input
                      type="date"
                      className={`pl-9 pr-3 py-2.5 w-full rounded-lg border shadow-sm text-sm ${themeClasses.input} focus:ring focus:outline-none transition-all duration-200`}
                      placeholder="From"
                      value={dateRange.from}
                      onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                    />
                  </div>
                  <label className={`block text-xs mt-1 ${themeClasses.subtext}`}>From</label>
                </div>
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FiCalendar className={`h-4 w-4 ${themeClasses.subtext}`} />
                    </div>
                    <input
                      type="date"
                      className={`pl-9 pr-3 py-2.5 w-full rounded-lg border shadow-sm text-sm ${themeClasses.input} focus:ring focus:outline-none transition-all duration-200`}
                      placeholder="To"
                      value={dateRange.to}
                      onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                    />
                  </div>
                  <label className={`block text-xs mt-1 ${themeClasses.subtext}`}>To</label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Applied Filters - Modern Design with Pills */}
          {(filterType !== 'all' || filterUser !== 'all' || dateRange.from || dateRange.to || searchTerm) && (
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-2 items-center">
                <span className={`text-xs font-medium ${themeClasses.subtext} mr-1`}>Active filters:</span>
                
                {searchTerm && (
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${themeClasses.badge.violet} shadow-sm`}>
                    <FiSearch className="mr-1.5 h-3 w-3" />
                    {searchTerm.length > 15 ? searchTerm.substring(0, 15) + '...' : searchTerm}
                    <button 
                      type="button"
                      className="ml-1.5 hover:text-red-500 transition-colors"
                      onClick={() => setSearchTerm('')}
                    >
                      <FiX className="h-3.5 w-3.5" />
                    </button>
                  </span>
                )}
                
                {filterType !== 'all' && (
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium shadow-sm ${themeClasses.badge.blue}`}>
                    <span className="mr-1.5">{activityTypeIcons[filterType]}</span>
                    {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                    <button 
                      type="button"
                      className="ml-1.5 hover:text-red-500 transition-colors"
                      onClick={() => setFilterType('all')}
                    >
                      <FiX className="h-3.5 w-3.5" />
                    </button>
                  </span>
                )}
                
                {filterUser !== 'all' && (
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium shadow-sm ${themeClasses.badge.green}`}>
                    <FiUser className="mr-1.5 h-3 w-3" />
                    {filterUser}
                    <button 
                      type="button"
                      className="ml-1.5 hover:text-red-500 transition-colors"
                      onClick={() => setFilterUser('all')}
                    >
                      <FiX className="h-3.5 w-3.5" />
                    </button>
                  </span>
                )}
                
                {dateRange.from && (
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium shadow-sm ${themeClasses.badge.orange}`}>
                    <FiCalendar className="mr-1.5 h-3 w-3" />
                    From: {dateRange.from}
                    <button 
                      type="button"
                      className="ml-1.5 hover:text-red-500 transition-colors"
                      onClick={() => setDateRange({...dateRange, from: ''})}
                    >
                      <FiX className="h-3.5 w-3.5" />
                    </button>
                  </span>
                )}
                
                {dateRange.to && (
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium shadow-sm ${themeClasses.badge.orange}`}>
                    <FiCalendar className="mr-1.5 h-3 w-3" />
                    To: {dateRange.to}
                    <button 
                      type="button"
                      className="ml-1.5 hover:text-red-500 transition-colors"
                      onClick={() => setDateRange({...dateRange, to: ''})}
                    >
                      <FiX className="h-3.5 w-3.5" />
                    </button>
                  </span>
                )}
                
                <button 
                  onClick={clearFilters}
                  className={`ml-auto text-xs px-3 py-1.5 rounded-lg flex items-center ${themeClasses.button.outline}`}
                >
                  <FiX className="mr-1.5" />
                  Clear All 
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Activity List with Modern Design */}
      {loading ? (
        <div className={`flex flex-col items-center justify-center h-60 md:h-72 rounded-xl border shadow-sm ${themeClasses.container} p-4 md:p-6 text-center`}>
          <div className="relative">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border-4 border-gray-300 dark:border-gray-600 opacity-20"></div>
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border-4 border-t-violet-500 animate-spin absolute top-0 left-0"></div>
          </div>
          <span className={`${themeClasses.text} text-sm md:text-base mt-4 font-medium`}>Loading activity data...</span>
          <p className={`${themeClasses.subtext} text-xs mt-2 max-w-md`}>Retrieving the most recent platform activities</p>
        </div>
      ) : error ? (
        <div className={`p-6 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-red-900/10 text-red-300' : 'bg-red-50 text-red-800'}`}>
          <div className="text-center">
            <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
              <FiX className="h-7 w-7 text-red-600 dark:text-red-400" />
            </div>
            <p className="text-lg font-medium mb-2">{error}</p>
            <p className={`text-sm ${isDarkMode ? 'text-red-300/70' : 'text-red-600/70'} max-w-md mx-auto`}>
              Please try refreshing the page or contact support if the issue persists.
            </p>
          </div>
        </div>
      ) : filteredActivities.length === 0 ? (
        <div className={`p-8 sm:p-10 text-center rounded-xl border shadow-sm ${themeClasses.container}`}>
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <FiActivity className={`h-8 w-8 ${themeClasses.subtext}`} />
          </div>
          <h3 className={`mt-4 text-lg md:text-xl font-medium ${themeClasses.title}`}>No activities found</h3>
          <p className={`mt-2 ${themeClasses.subtext} max-w-md mx-auto`}>Try adjusting your filters or search term to find what you're looking for</p>
          <button 
            onClick={clearFilters}
            className={`mt-5 px-4 py-2.5 text-sm rounded-lg ${themeClasses.button.primary}`}
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className={`rounded-xl border shadow-sm overflow-hidden ${themeClasses.container}`}>
          {/* Mobile view for smaller screens - Modern Card Style */}
          <div className="md:hidden">
            {filteredActivities.map((activity, index) => (
              <div 
                key={activity.id} 
                className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} ${index % 2 === 0 ? (isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50/50') : ''} last:border-b-0`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`mt-0.5 flex-shrink-0 p-2 rounded-lg ${
                      activity.action === 'create' ? themeClasses.badge.green :
                      activity.action === 'update' ? themeClasses.badge.blue :
                      activity.action === 'delete' ? themeClasses.badge.red :
                      themeClasses.badge.violet
                    }`}>
                      {activityActionIcons[activity.action] || <FiActivity className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm leading-tight ${themeClasses.text} line-clamp-2`}>{activity.description}</p>
                      <div className="flex items-center flex-wrap gap-x-3 gap-y-1.5 mt-2">
                        <div className={`flex items-center px-2 py-0.5 rounded-full text-xs ${themeClasses.badge[
                          activity.type === 'user' ? 'blue' :
                          activity.type === 'product' ? 'green' :
                          activity.type === 'order' ? 'orange' :
                          activity.type === 'payment' ? 'purple' :
                          activity.type === 'system' ? 'red' : 'violet'
                        ]}`}>
                          <span className="mr-1.5 flex-shrink-0">
                            {activityTypeIcons[activity.type] || <FiActivity className="h-3 w-3" />}
                          </span>
                          <span className="capitalize">{activity.type}</span>
                        </div>
                        <div className="flex items-center">
                          <FiClock className={`mr-1.5 h-3 w-3 ${themeClasses.subtext}`} />
                          <span className={`text-xs truncate ${themeClasses.subtext}`}>{formatDate(activity.date)}</span>
                        </div>
                        <div className="flex items-center">
                          <FiUser className={`mr-1.5 h-3 w-3 ${themeClasses.subtext}`} />
                          <span className={`text-xs font-medium ${themeClasses.text}`}>{activity.user}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleViewDetails(activity)}
                    className={`text-xs px-3 py-1.5 rounded-lg flex-shrink-0 ${themeClasses.button.outline}`}
                    aria-label="View details"
                  >
                    <FiInfo className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Table for larger screens - Modern Styling */}
          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr className={isDarkMode ? 'bg-gray-750' : 'bg-gray-50'}>
                    <th scope="col" className={`px-4 py-3.5 text-left text-xs font-medium ${themeClasses.subtext} uppercase tracking-wider`}>Activity</th>
                    <th scope="col" className={`px-4 py-3.5 text-left text-xs font-medium ${themeClasses.subtext} uppercase tracking-wider`}>User</th>
                    <th scope="col" className={`px-4 py-3.5 text-left text-xs font-medium ${themeClasses.subtext} uppercase tracking-wider`}>Date</th>
                    <th scope="col" className={`px-4 py-3.5 text-left text-xs font-medium ${themeClasses.subtext} uppercase tracking-wider`}>Type</th>
                    <th scope="col" className={`px-4 py-3.5 text-right text-xs font-medium ${themeClasses.subtext} uppercase tracking-wider`}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredActivities.map((activity, index) => (
                    <tr key={activity.id} className={index % 2 === 0 ? (isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50/50') : themeClasses.card}>
                      <td className={`px-4 py-3.5 ${themeClasses.text}`}>
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 p-1.5 rounded-lg flex-shrink-0 ${
                            activity.action === 'create' ? themeClasses.badge.green :
                            activity.action === 'update' ? themeClasses.badge.blue :
                            activity.action === 'delete' ? themeClasses.badge.red :
                            themeClasses.badge.violet
                          }`}>
                            {activityActionIcons[activity.action] || <FiActivity className="h-4 w-4" />}
                          </div>
                          <div className="min-w-0 max-w-sm lg:max-w-md">
                            <p className={`font-medium truncate ${themeClasses.text}`}>{activity.description}</p>
                            <p className={`text-xs mt-1 ${themeClasses.subtext}`}>ID: {activity.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className={`px-4 py-3.5 ${themeClasses.text}`}>
                        <div className="flex items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${themeClasses.badge.gray} mr-2`}>
                            <FiUser className="h-3 w-3" />
                          </div>
                          {activity.user}
                        </div>
                      </td>
                      <td className={`px-4 py-3.5 ${themeClasses.subtext} whitespace-nowrap`}>
                        <div className="flex items-center">
                          <FiCalendar className="mr-1.5 h-3.5 w-3.5" />
                          {formatDate(activity.date)}
                        </div>
                      </td>
                      <td className={`px-4 py-3.5`}>
                        <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${themeClasses.badge[
                          activity.type === 'user' ? 'blue' :
                          activity.type === 'product' ? 'green' :
                          activity.type === 'order' ? 'orange' :
                          activity.type === 'payment' ? 'purple' :
                          activity.type === 'system' ? 'red' : 'violet'
                        ]}`}>
                          <span className="mr-1.5">
                            {activityTypeIcons[activity.type] || <FiActivity className="h-3 w-3" />}
                          </span>
                          <span className="capitalize">{activity.type}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => handleViewDetails(activity)}
                          className={`text-xs px-3 py-1.5 rounded-lg ${themeClasses.button.outline}`}
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
      )}
      
      {/* Activity Detail Modal - Modern Design */}
      {showDetailModal && detailedActivity && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end sm:items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm transition-opacity" 
              aria-hidden="true" 
              onClick={() => setShowDetailModal(false)}
            ></div>
            
            {/* Modal position trick - centers vertically on desktop, slides from bottom on mobile */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className={`inline-block align-bottom sm:align-middle w-full max-w-md sm:max-w-lg rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 relative ${themeClasses.container} animate-fadeIn animate-slideUp`}>
              {/* Close button - modernized */}
              <button 
                type="button"
                onClick={() => setShowDetailModal(false)}
                className={`absolute right-3 top-3 rounded-full p-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
              >
                <FiX className={`h-5 w-5 ${themeClasses.subtext}`} />
              </button>
              
              {/* Header with colored badge based on activity type */}
              <div className={`px-6 pt-6 pb-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="sm:flex sm:items-start">
                  <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-xl sm:mx-0 sm:h-10 sm:w-10 ${
                    detailedActivity.type === 'user' ? themeClasses.badge.blue :
                    detailedActivity.type === 'product' ? themeClasses.badge.green :
                    detailedActivity.type === 'order' ? themeClasses.badge.orange :
                    detailedActivity.type === 'payment' ? themeClasses.badge.purple :
                    detailedActivity.type === 'system' ? themeClasses.badge.red : 
                    themeClasses.badge.violet
                  }`}>
                    {activityTypeIcons[detailedActivity.type] || <FiActivity className="h-5 w-5" />}
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className={`text-lg leading-6 font-medium ${themeClasses.title}`} id="modal-title">
                      Activity Details
                    </h3>
                    <p className={`mt-1 text-sm ${themeClasses.subtext}`}>
                      Detailed information about this activity record
                    </p>
                  </div>
                </div>
              </div>
                  
              {/* Content area with better spacing and organization */}
              <div className="px-6 py-4">
                <div className="space-y-4 max-h-[60vh] sm:max-h-[70vh] overflow-y-auto pr-1 pb-1 custom-scrollbar">
                  {/* Description section */}
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-750' : 'bg-gray-50'}`}>
                    <p className={`text-sm font-medium ${themeClasses.text}`}>{detailedActivity.description}</p>
                  </div>
                  
                  {/* Main details grid */}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <p className={`text-xs font-medium mb-1 ${themeClasses.subtext}`}>ID</p>
                      <p className={`text-sm font-medium ${themeClasses.text} bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded`}>{detailedActivity.id}</p>
                    </div>
                    
                    <div>
                      <p className={`text-xs font-medium mb-1 ${themeClasses.subtext}`}>User</p>
                      <div className="flex items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${themeClasses.badge.gray} mr-2`}>
                          <FiUser className="h-3 w-3" />
                        </div>
                        <p className={`text-sm font-medium ${themeClasses.text}`}>{detailedActivity.user}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className={`text-xs font-medium mb-1 ${themeClasses.subtext}`}>Date & Time</p>
                      <div className="flex items-center">
                        <FiCalendar className={`mr-2 ${themeClasses.subtext}`} />
                        <p className={`text-sm ${themeClasses.text}`}>{formatDate(detailedActivity.date)}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className={`text-xs font-medium mb-1 ${themeClasses.subtext}`}>Type</p>
                      <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${themeClasses.badge[
                        detailedActivity.type === 'user' ? 'blue' :
                        detailedActivity.type === 'product' ? 'green' :
                        detailedActivity.type === 'order' ? 'orange' :
                        detailedActivity.type === 'payment' ? 'purple' :
                        detailedActivity.type === 'system' ? 'red' : 'violet'
                      ]}`}>
                        <span className="mr-1.5">
                          {activityTypeIcons[detailedActivity.type] || <FiActivity className="h-3 w-3" />}
                        </span>
                        <span className="capitalize">{detailedActivity.type}</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className={`text-xs font-medium mb-1 ${themeClasses.subtext}`}>Action</p>
                      <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${
                        detailedActivity.action === 'create' ? themeClasses.badge.green :
                        detailedActivity.action === 'update' ? themeClasses.badge.blue :
                        detailedActivity.action === 'delete' ? themeClasses.badge.red :
                        themeClasses.badge.violet
                      }`}>
                        <span className="mr-1.5">
                          {activityActionIcons[detailedActivity.action] || <FiActivity className="h-3 w-3" />}
                        </span>
                        <span className="capitalize">{detailedActivity.action}</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className={`text-xs font-medium mb-1 ${themeClasses.subtext}`}>Target</p>
                      <p className={`text-sm font-medium ${themeClasses.text} truncate`}>{detailedActivity.target}</p>
                    </div>
                  </div>
                  
                  {/* JSON Details with modern code styling */}
                  <div>
                    <p className={`text-xs font-medium mb-2 ${themeClasses.subtext}`}>Additional Details</p>
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800/80' : 'bg-gray-50'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <pre className={`whitespace-pre-wrap font-mono text-xs overflow-x-auto ${themeClasses.text} custom-scrollbar`}>
                        {JSON.stringify(detailedActivity.details, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Footer with primary action button */}
              <div className={`px-6 py-4 sm:flex sm:flex-row-reverse border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <button
                  type="button"
                  className={`w-full inline-flex justify-center items-center rounded-lg shadow-sm px-4 py-2.5 text-sm font-medium sm:ml-3 sm:w-auto ${themeClasses.button.primary}`}
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