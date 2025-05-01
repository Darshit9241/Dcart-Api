import React from 'react';
import { FiX, FiShoppingBag } from 'react-icons/fi';
import { FaUser, FaUserCircle, FaImage, FaKey } from 'react-icons/fa';

const UserDetailsModal = ({
  user,
  setShowUserModal,
  handleToggleUserStatus,
  handleDeleteUser,
  handleRevealPassword,
  isDarkMode
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-hidden`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
            User Details: {user.id}
          </h3>
          <button
            onClick={() => setShowUserModal(false)}
            className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col items-center mb-6">
          <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-orange-500">
            {user.photo ? (
              <img 
                src={user.photo} 
                alt={user.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className={`w-full h-full flex items-center justify-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <FaUserCircle className="text-gray-400 text-5xl" />
              </div>
            )}
          </div>
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</p>
          <span className={`mt-2 px-4 py-1 rounded-full text-xs font-semibold ${
            user.status === 'active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {user.status === 'active' ? 'Active Account' : 'Inactive Account'}
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <h4 className={`flex items-center text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
              <FaUser className="mr-2 text-orange-500" /> Account Information
            </h4>
            <div className={`space-y-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">User ID</p>
                <p className="font-medium">{user.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Date Joined</p>
                <p className="font-medium">{new Date(user.dateJoined).toLocaleDateString()}</p>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Password</p>
                  <button
                    onClick={() => handleRevealPassword(user.id)}
                    className="text-xs text-orange-500 hover:text-orange-600"
                  >
                    {user.password === '●●●●●●' ? 'Show' : 'Hide'}
                  </button>
                </div>
                <p className="font-mono bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded mt-1">{user.password}</p>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <h4 className={`flex items-center text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
              <FiShoppingBag className="mr-2 text-orange-500" /> Activity
            </h4>
            <div className={`space-y-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
                <p className="font-medium">{user.orders}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Last Login</p>
                <p className="font-medium">2 days ago</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Account Status</p>
                <p className={`font-medium ${user.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>
                  {user.status === 'active' ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-orange-50 dark:bg-gray-700'} mb-6`}>
          <h4 className={`flex items-center text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
            <FaImage className="mr-2 text-orange-500" /> Profile Image
          </h4>
          <div className="flex items-center">
            <div className="w-24 h-24 rounded-lg overflow-hidden mr-6">
              {user.photo ? (
                <img 
                  src={user.photo} 
                  alt={user.name} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className={`w-full h-full flex items-center justify-center ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                  <FaUserCircle className="text-gray-400 text-3xl" />
                </div>
              )}
            </div>
            <div>
              <p className={`mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Profile image URL:</p>
              <div className="font-mono text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto max-w-xs">
                {user.photo || 'No image URL available'}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-end">
          <button
            onClick={() => handleToggleUserStatus(user.id)}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              user.status === 'active'
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {user.status === 'active' ? 'Deactivate User' : 'Activate User'}
          </button>
          <button
            onClick={() => handleDeleteUser(user.id)}
            className="px-4 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
          >
            Delete User
          </button>
          <button
            onClick={() => setShowUserModal(false)}
            className={`px-4 py-2 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'} rounded-xl font-medium transition-colors`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal; 