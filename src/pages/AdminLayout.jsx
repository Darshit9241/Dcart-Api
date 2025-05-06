import React, { useState, useEffect } from 'react';
import { useTheme } from '../component/header/ThemeContext';
import { 
  FiPackage, FiX, FiAlertCircle, FiInfo, FiShoppingBag, 
  FiMenu, FiLogOut, FiSettings, FiBarChart2 
} from 'react-icons/fi';
import { FaUser, FaSearch, FaKey, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

// Import modals
import CancelOrderModal from '../component/admin/modals/CancelOrderModal';
import OrderDetailsModal from '../component/admin/modals/OrderDetailsModal';
import UserDetailsModal from '../component/admin/modals/UserDetailsModal';
import ProductDetailsModal from '../component/admin/modals/ProductDetailsModal';
import { useSelector } from 'react-redux';

const AdminLayout = ({ children, activeTab }) => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
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
  }, [navigate]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileDropdown && !event.target.closest('.profile-dropdown')) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown]);

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

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <FiBarChart2 className="w-5 h-5" />, path: '/admin-dashboard' },
    { id: 'products', label: 'Products', icon: <FiPackage className="w-5 h-5" />, path: '/admin-products' },
    { id: 'orders', label: 'Orders', icon: <FiShoppingBag className="w-5 h-5" />, path: '/admin-orders' },
    { id: 'customers', label: 'Customers', icon: <FaUser className="w-5 h-5" />, path: '/admin-customers' },
    { id: 'settings', label: 'Settings', icon: <FiSettings className="w-5 h-5" />, path: '/admin-settings' },
  ];

  // Quick stats for sidebar
  const quickStats = [
    { label: "Products", value: localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')).length : 0 },
    { label: "Orders", value: localStorage.getItem('orders') ? JSON.parse(localStorage.getItem('orders')).length : 0 },
    { label: "Customers", value: localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')).length : 0 }
  ];

  const handleTabClick = (tabPath) => {
    setIsMobileMenuOpen(false);
    navigate(tabPath);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Top Navigation Bar */}
      <header className={`fixed top-0 left-0 right-0 z-30 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm py-[8px] flex items-center px-4`}>
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              className="p-1.5 rounded-full md:hidden focus:outline-none focus:ring-1 focus:ring-orange-500"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
            
            <h1 className="text-lg md:text-xl font-bold flex items-center">
              <span className="text-orange-500">D</span>Cart Admin
            </h1>
          </div>
          
          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative hidden sm:block">
              <input 
                type="text" 
                placeholder="Search..." 
                className={`w-36 sm:w-40 md:w-56 py-1.5 pl-8 pr-2 rounded-lg text-sm ${
                  isDarkMode 
                    ? 'bg-gray-700 text-white border-gray-600 focus:border-orange-500' 
                    : 'bg-gray-100 text-gray-800 border-gray-200 focus:border-orange-500'
                } border focus:outline-none`}
              />
              <FaSearch className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
            </div>
            
            <button 
              className="sm:hidden p-1.5 rounded-full focus:outline-none"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Toggle search"
            >
              <FaSearch className="w-5 h-5" />
            </button>
            
            <button 
              className={`p-1.5 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} relative hidden sm:block`}
              aria-label="Notifications"
            >
              <FiAlertCircle className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="relative profile-dropdown">
              <button 
                className={`flex items-center gap-1 md:gap-2 p-1 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                aria-expanded={showProfileDropdown}
                aria-haspopup="true"
              >
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
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
                <span className="hidden md:block text-sm font-medium truncate max-w-[100px]">
                  {adminProfile.name}
                </span>
                <svg className="w-4 h-4 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Profile Dropdown */}
              {showProfileDropdown && (
                <div 
                  className={`absolute right-0 mt-2 w-56 rounded-md shadow-lg z-50 ${
                    isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                  }`}
                >
                  <div 
                    className="rounded-md ring-1 ring-black ring-opacity-5 py-1"
                    role="menu"
                    aria-orientation="vertical"
                  >
                    <div className={`px-4 py-3 ${isDarkMode ? 'border-b border-gray-700' : 'border-b border-gray-200'}`}>
                      <p className="text-sm font-medium truncate">{adminProfile.name}</p>
                      <p className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {adminProfile.email}
                      </p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                        {adminProfile.role}
                      </p>
                    </div>
                    
                    <div className="py-1">
                      <button
                        className={`w-full text-left block px-4 py-2 text-sm ${
                          isDarkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-100 text-gray-700'
                        }`}
                        onClick={() => {
                          navigate('/admin-settings');
                          setShowProfileDropdown(false);
                        }}
                      >
                        <div className="flex items-center">
                          <FaUserCircle className="mr-3 h-4 w-4" />
                          Profile Settings
                        </div>
                      </button>
                      
                      <button
                        className={`w-full text-left block px-4 py-2 text-sm ${
                          isDarkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center">
                          <FaKey className="mr-3 h-4 w-4" />
                          Change Password
                        </div>
                      </button>
                    </div>
                    
                    <div className={`py-1 ${isDarkMode ? 'border-t border-gray-700' : 'border-t border-gray-200'}`}>
                      <button
                        className={`w-full text-left block px-4 py-2 text-sm ${
                          isDarkMode ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-gray-100 text-red-600'
                        }`}
                        onClick={handleLogout}
                      >
                        <div className="flex items-center">
                          <FiLogOut className="mr-3 h-4 w-4" />
                          Sign out
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className={`fixed top-[60px] left-0 right-0 z-20 p-2 shadow-md sm:hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search..." 
              className={`w-full py-2 pl-9 pr-3 rounded-lg text-sm ${
                isDarkMode 
                  ? 'bg-gray-700 text-white border-gray-600 focus:border-orange-500' 
                  : 'bg-gray-100 text-gray-800 border-gray-200 focus:border-orange-500'
              } border focus:outline-none`}
              autoFocus
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={() => setIsSearchOpen(false)}
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
        
        {/* Sidebar */}
        <aside 
          className={`fixed md:sticky top-16 left-0 z-20 h-[calc(100vh-4rem)] transition-transform duration-300 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          } w-64 border-r ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          } overflow-y-auto`}
        >
          <div className="p-4 flex flex-col h-full">
            <nav className="mt-2 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.path)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? `${isDarkMode ? 'bg-gray-700' : 'bg-orange-50'} text-orange-500`
                      : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700/50' : 'text-gray-700 hover:bg-gray-100'}`
                  }`}
                >
                  <span className="mr-3">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
            
            {/* Quick Stats */}
            <div className={`mt-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
              <h3 className="text-sm font-medium text-gray-500 mb-3">Quick Stats</h3>
              <div className="space-y-2">
                {quickStats.map((stat, index) => (
                  <div key={index} className="flex justify-between">
                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</span>
                    <span className="text-xs font-medium">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Admin Actions */}
            <div className="mt-auto pb-6">
              <button 
                onClick={() => navigate('/')}
                className={`w-full flex items-center px-4 py-2.5 rounded-lg transition-colors ${
                  isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <FiLogOut className="mr-3 w-5 h-5" />
                <span>Back to Store</span>
              </button>
              
              <button 
                onClick={handleLogout}
                className={`w-full flex items-center px-4 py-2.5 rounded-lg transition-colors mt-2 ${
                  isDarkMode ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-gray-100 text-red-600'
                }`}
              >
                <FiLogOut className="mr-3 w-5 h-5" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 pb-12 overflow-x-hidden mt-16">
          <div className="max-w-6xl mx-auto">
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