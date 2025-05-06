import React, { useState } from 'react';
import { FiAlertCircle, FiTrash2, FiRefreshCw, FiEye, FiEyeOff, FiClock, FiFilter, FiDownload, FiMenu, FiChevronDown } from 'react-icons/fi';
import { FaSearch, FaUser, FaUserCircle, FaKey, FaShoppingBag, FaSignInAlt, FaHistory, FaMapMarkerAlt, FaLaptop } from 'react-icons/fa';

const CustomerManagement = ({
  users,
  loading,
  error,
  isDarkMode,
  userSearchTerm,
  setUserSearchTerm,
  handleViewUserDetails,
  handleToggleUserStatus,
  handleDeleteUser,
  handleRevealPassword
}) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  
  // Status options
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'locked', label: 'Locked' }
  ];
  
  // Apply filters
  const filteredUsers = users.filter(user => {
    if (statusFilter !== 'all' && user.status !== statusFilter) {
      return false;
    }
    return true;
  });
  
  // Export users as CSV
  const exportUsersCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Status', 'Joined Date', 'Orders'];
    const csvData = filteredUsers.map(user => [
      user.id,
      user.name,
      user.email,
      user.status,
      new Date(user.dateJoined).toLocaleDateString(),
      user.orders
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'customer_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setShowStatusDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle status selection
  const handleStatusSelect = (status) => {
    setStatusFilter(status);
    setShowStatusDropdown(false);
  };

  return (
    <div className="max-w-full">
      {/* Mobile Search Toggle */}
      <div className="md:hidden flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Customers</h1>
        <button
          onClick={() => setShowMobileSearch(!showMobileSearch)}
          className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
        >
          <FaSearch className="h-4 w-4" />
        </button>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Customer Management</h1>
        
        {/* Search Bar */}
        <div className="flex items-center gap-2 w-2/3">
          <div className="relative flex-1">
            <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search customers..."
              value={userSearchTerm}
              onChange={(e) => setUserSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-3 py-2 text-sm border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'} rounded-lg`}
            />
          </div>
          
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            title="Filter"
          >
            <FiFilter />
          </button>
          
          <button 
            onClick={exportUsersCSV}
            className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            title="Export CSV"
          >
            <FiDownload />
          </button>
        </div>
      </div>
      
      {/* Mobile Search Bar (Conditional) */}
      {showMobileSearch && (
        <div className="md:hidden mb-4">
          <div className="relative">
            <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search customers..."
              value={userSearchTerm}
              onChange={(e) => setUserSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-3 py-2 text-sm border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'} rounded-lg`}
              autoFocus
            />
          </div>
          <div className="flex justify-between mt-2">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex-1 mr-1 p-2 rounded-lg text-xs flex items-center justify-center ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
            >
              <FiFilter className="mr-1" /> Filters
            </button>
            <button 
              onClick={exportUsersCSV}
              className={`flex-1 ml-1 p-2 rounded-lg text-xs flex items-center justify-center ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
            >
              <FiDownload className="mr-1" /> Export
            </button>
          </div>
        </div>
      )}
      
      {/* Enhanced Filters */}
      {showFilters && (
        <div className={`p-4 mb-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="flex flex-wrap items-center gap-4">
            <div className="w-full sm:w-auto">
              <label className={`text-sm block mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status</label>
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowStatusDropdown(!showStatusDropdown);
                  }}
                  className={`w-full sm:w-48 px-3 py-2 rounded text-sm flex items-center justify-between ${
                    isDarkMode 
                      ? 'bg-gray-800 text-white border border-gray-600' 
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <span>{statusOptions.find(option => option.value === statusFilter)?.label || 'All Statuses'}</span>
                  <FiChevronDown className={`transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showStatusDropdown && (
                  <div 
                    className={`absolute z-10 mt-1 w-full sm:w-48 rounded-md shadow-lg ${
                      isDarkMode ? 'bg-gray-800 border border-gray-600' : 'bg-white border border-gray-200'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ul className="py-1 max-h-60 overflow-y-auto">
                      {statusOptions.map(option => (
                        <li key={option.value}>
                          <button
                            onClick={() => handleStatusSelect(option.value)}
                            className={`w-full text-left px-4 py-2 text-sm ${
                              statusFilter === option.value
                                ? isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                                : isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
                            } flex items-center`}
                          >
                            <span 
                              className={`w-2 h-2 rounded-full mr-2 ${
                                option.value === 'active' ? 'bg-green-500' :
                                option.value === 'inactive' ? 'bg-red-500' :
                                option.value === 'pending' ? 'bg-yellow-500' :
                                option.value === 'suspended' ? 'bg-orange-500' :
                                option.value === 'locked' ? 'bg-gray-500' :
                                'bg-blue-500'
                              }`}
                            ></span>
                            {option.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Status Filter Pills - Mobile friendly */}
      <div className="flex flex-wrap gap-2 mb-4 overflow-x-auto pb-2">
        {statusOptions.map(option => (
          <button
            key={option.value}
            onClick={() => setStatusFilter(option.value)}
            className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${
              statusFilter === option.value
                ? isDarkMode 
                  ? 'bg-orange-500 text-white'
                  : 'bg-orange-500 text-white'
                : isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      
      {/* Stats Summary */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4`}>
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} shadow`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Customers</p>
              <p className="text-xl font-bold">{users.length}</p>
            </div>
            <div className={`p-3 rounded-full ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
              <FaUser className="h-5 w-5 text-blue-500" />
            </div>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} shadow`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Active Customers</p>
              <p className="text-xl font-bold">{users.filter(u => u.status === 'active').length}</p>
            </div>
            <div className={`p-3 rounded-full ${isDarkMode ? 'bg-green-900/30' : 'bg-green-100'}`}>
              <FaUser className="h-5 w-5 text-green-500" />
            </div>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} shadow sm:col-span-2 lg:col-span-1`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Online Now</p>
              <p className="text-xl font-bold">{users.filter(u => u.isLoggedIn).length}</p>
            </div>
            <div className={`p-3 rounded-full ${isDarkMode ? 'bg-orange-900/30' : 'bg-orange-100'}`}>
              <FaSignInAlt className="h-5 w-5 text-orange-500" />
            </div>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-6">
          <div className={`animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 ${isDarkMode ? 'border-orange-500' : 'border-orange-600'}`}></div>
        </div>
      ) : error ? (
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700 text-red-400' : 'bg-red-50 text-red-800'} flex items-center`}>
          <FiAlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} text-center`}>
          <FaUser className={`mx-auto h-8 w-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mb-2`} />
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
            {userSearchTerm || statusFilter !== 'all' ? 'No matching customers found.' : 'No customers registered.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <div key={user.id} className={`rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} shadow overflow-hidden`}>
              {/* Header */}
              <div className="p-3 flex justify-between items-center border-b border-gray-600">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                    {user.photo ? (
                      <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                        <FaUserCircle className="text-gray-400 text-xl" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{user.name}</h4>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : user.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : user.status === 'suspended'
                      ? 'bg-orange-100 text-orange-800'
                      : user.status === 'locked'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>
                  {user.isLoggedIn && (
                    <span className="text-xs text-green-500 mt-1 flex items-center">
                      <span className="h-2 w-2 rounded-full bg-green-500 mr-1 animate-pulse"></span>
                      Online
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-3">
                <div className="flex justify-between text-xs mb-2">
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>ID: {user.id}</span>
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                    Joined: {new Date(user.dateJoined).toLocaleDateString()}
                  </span>
                </div>
                
                {/* Login Information Section */}
                <div className={`text-xs p-2 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} mb-2`}>
                  <div className="flex items-center mb-1">
                    <FaSignInAlt className="h-3 w-3 mr-1 text-orange-500" />
                    <span>Login Information</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                    <div className={`p-1 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <div className="flex items-center mb-1">
                        <FiClock className="h-3 w-3 mr-1 text-blue-500" />
                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Last Login</span>
                      </div>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never logged in'}
                      </p>
                    </div>
                    <div className={`p-1 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <div className="flex items-center mb-1">
                        <FaUser className="h-3 w-3 mr-1 text-blue-500" />
                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Login Status</span>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs inline-block ${
                        user.isLoggedIn 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.isLoggedIn ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Session Information - Collapsible on Mobile */}
                {user.isLoggedIn && user.sessionInfo && (
                  <div className={`text-xs p-2 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} mb-2`}>
                    <div className="flex items-center mb-1">
                      <FaLaptop className="h-3 w-3 mr-1 text-orange-500" />
                      <span>Current Session</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                      <div className={`p-1 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <div className="flex items-center mb-1">
                          <FaMapMarkerAlt className="h-3 w-3 mr-1 text-blue-500" />
                          <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Location</span>
                        </div>
                        <p className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {user.sessionInfo?.location || 'Unknown'}
                        </p>
                      </div>
                      <div className={`p-1 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <div className="flex items-center mb-1">
                          <FaLaptop className="h-3 w-3 mr-1 text-blue-500" />
                          <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Device</span>
                        </div>
                        <p className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {user.sessionInfo?.device || 'Unknown'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Login History - Hidden on Mobile by Default */}
                {user.loginHistory && user.loginHistory.length > 0 && (
                  <div className={`text-xs p-2 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} mb-2 hidden sm:block`}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center">
                        <FaHistory className="h-3 w-3 mr-1 text-orange-500" />
                        <span>Login History</span>
                      </div>
                    </div>
                    <div className={`max-h-20 overflow-y-auto ${isDarkMode ? 'scrollbar-dark' : 'scrollbar-light'}`}>
                      {user.loginHistory.slice(0, 3).map((login, index) => (
                        <div key={index} className={`p-1 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} mb-1 flex justify-between`}>
                          <span>{new Date(login.date).toLocaleDateString()}</span>
                          <span className="truncate ml-2 max-w-[100px]">{login.ip || 'Unknown IP'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Password Section */}
                <div className={`text-xs p-2 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} mb-2`}>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      <FaKey className="h-3 w-3 mr-1 text-orange-500" />
                      <span>Password</span>
                    </div>
                    <button
                      onClick={() => handleRevealPassword(user.id)}
                      className="text-xs text-orange-500 hover:text-orange-600 flex items-center"
                    >
                      {user.password.includes('●') ? (
                        <>
                          <FiEye className="h-3 w-3 mr-1" /> Show
                        </>
                      ) : (
                        <>
                          <FiEyeOff className="h-3 w-3 mr-1" /> Hide
                        </>
                      )}
                    </button>
                  </div>
                  <code className={`text-xs block px-2 py-1 rounded overflow-x-auto ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                    {user.password}
                  </code>
                </div>
                
                {/* Orders */}
                <div className="flex items-center justify-between text-xs mb-3">
                  <div className="flex items-center">
                    <FaShoppingBag className="h-3 w-3 mr-1 text-orange-500" />
                    <span>Orders</span>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    user.orders > 0 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.orders}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap sm:flex-nowrap gap-2 mt-2">
                  <button
                    onClick={() => handleViewUserDetails(user)}
                    className="flex-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white text-xs py-1 rounded flex items-center justify-center"
                  >
                    <FiMenu className="mr-1 h-3 w-3" /> Details
                  </button>
                  <button
                    onClick={() => handleToggleUserStatus(user.id)}
                    className={`flex-1 text-white text-xs py-1 rounded flex items-center justify-center ${
                      user.status === 'active' 
                        ? 'bg-red-500 hover:bg-red-600' 
                        : 'bg-green-500 hover:bg-green-600'
                    }`}
                  >
                    <FiRefreshCw className="h-3 w-3 mr-1" />
                    {user.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="flex-none bg-red-500 hover:bg-red-600 text-white text-xs p-1 rounded"
                    title="Delete User"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerManagement; 