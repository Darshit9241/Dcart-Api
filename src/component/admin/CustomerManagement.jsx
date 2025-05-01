import React from 'react';
import { FiAlertCircle, FiTrash2, FiRefreshCw, FiEye, FiEyeOff } from 'react-icons/fi';
import { FaSearch, FaUser, FaUserCircle, FaKey, FaShoppingBag } from 'react-icons/fa';

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
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Customer Management</h1>
        
        {/* Search Bar */}
        <div className="relative w-1/2">
          <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          <input
            type="text"
            placeholder="Search customers..."
            value={userSearchTerm}
            onChange={(e) => setUserSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-3 py-2 text-sm border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'} rounded-lg`}
          />
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
      ) : users.length === 0 ? (
        <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} text-center`}>
          <FaUser className={`mx-auto h-8 w-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mb-2`} />
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
            {userSearchTerm ? 'No matching customers found.' : 'No customers registered.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
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
                <span className={`px-2 py-1 rounded-full text-xs ${
                  user.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Content */}
              <div className="p-3">
                <div className="flex justify-between text-xs mb-2">
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>ID: {user.id}</span>
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                    Joined: {new Date(user.dateJoined).toLocaleDateString()}
                  </span>
                </div>
                
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
                  <code className={`text-xs block px-2 py-1 rounded ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
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
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleViewUserDetails(user)}
                    className="flex-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white text-xs py-1 rounded"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => handleToggleUserStatus(user.id)}
                    className={`flex-1 text-white text-xs py-1 rounded flex items-center justify-center ${
                      user.status === 'active' 
                        ? 'bg-red-500' 
                        : 'bg-green-500'
                    }`}
                  >
                    <FiRefreshCw className="h-3 w-3 mr-1" />
                    {user.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="flex-none bg-red-500 text-white text-xs p-1 rounded"
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