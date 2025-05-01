import React, { useState, useEffect, useCallback } from 'react';
import { useTheme, ThemeProvider } from '../component/header/ThemeContext';
import { 
  FiPackage, FiX, FiAlertCircle, FiInfo, FiShoppingBag, 
  FiMenu, FiLogOut, FiSettings, FiBarChart2 
} from 'react-icons/fi';
import { FaUser, FaSearch, FaKey, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import defaultProducts from '../component/ProductData';
import { removeProduct } from '../redux/productSlice';
import { toast } from 'react-hot-toast';

// Component imports
import DashboardOverview from '../component/admin/DashboardOverview';
import ProductManagement from '../component/admin/ProductManagement';
import OrderManagement from '../component/admin/OrderManagement';
import CustomerManagement from '../component/admin/CustomerManagement';
import AdminSettings from '../component/admin/AdminSettings';
import CancelOrderModal from '../component/admin/modals/CancelOrderModal';
import OrderDetailsModal from '../component/admin/modals/OrderDetailsModal';
import UserDetailsModal from '../component/admin/modals/UserDetailsModal';
import ProductDetailsModal from '../component/admin/modals/ProductDetailsModal';

// Custom hooks
const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(() => {
    setLoading(true);
    try {
      const savedOrders = JSON.parse(localStorage.getItem('orders')) || [];
      
      // Ensure all orders have a valid totalPrice
      const validatedOrders = savedOrders.map(order => ({
        ...order,
        totalPrice: order.totalPrice || 0,
      }));
      
      // Sort orders by status and date
      const sortedOrders = validatedOrders.sort((a, b) => {
        if (a.status === 'cancelled' && b.status !== 'cancelled') return 1;
        if (a.status !== 'cancelled' && b.status === 'cancelled') return -1;
        if (a.status === 'completed' && b.status !== 'completed') return 1;
        if (a.status !== 'completed' && b.status === 'completed') return -1;
        
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA; // Newest first
      });
      
      setOrders(sortedOrders);
      setError(null);
    } catch (err) {
      setError('Failed to load orders. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrderStatus = useCallback((id, status) => {
    try {
      const updatedOrders = orders.map(order =>
        order.id === id ? { ...order, status } : order
      );
      setOrders(updatedOrders);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      return true;
    } catch (err) {
      setError(`Failed to update order to ${status}. Please try again.`);
      return false;
    }
  }, [orders]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { 
    orders, 
    loading, 
    error, 
    setError,
    updateOrderStatus
  };
};

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(() => {
    setLoading(true);
    try {
      // Try to get saved users from localStorage
      const savedUsers = JSON.parse(localStorage.getItem('users')) || [];
      
      if (savedUsers.length === 0) {
        // Create mock users if none exist
        const mockUsers = [
          {
            id: 'USR001',
            name: 'John Doe',
            email: 'john@example.com',
            password: '●●●●●●',
            realPassword: 'password123',
            photo: 'https://randomuser.me/api/portraits/men/1.jpg',
            dateJoined: '2023-01-15',
            orders: 5,
            status: 'active'
          },
          {
            id: 'USR002',
            name: 'Jane Smith',
            email: 'jane@example.com',
            password: '●●●●●●●',
            realPassword: 'securepass',
            photo: 'https://randomuser.me/api/portraits/women/2.jpg',
            dateJoined: '2023-02-20',
            orders: 3,
            status: 'active'
          },
          {
            id: 'USR003',
            name: 'Michael Johnson',
            email: 'michael@example.com',
            password: '●●●●●●●●',
            realPassword: 'michael2023',
            photo: 'https://randomuser.me/api/portraits/men/3.jpg',
            dateJoined: '2023-03-10',
            orders: 0,
            status: 'inactive'
          },
          {
            id: 'USR004',
            name: 'Emily Wilson',
            email: 'emily@example.com',
            password: '●●●●●●',
            realPassword: 'emilyw',
            photo: 'https://randomuser.me/api/portraits/women/4.jpg',
            dateJoined: '2023-04-05',
            orders: 7,
            status: 'active'
          },
          {
            id: 'USR005',
            name: 'Robert Brown',
            email: 'robert@example.com',
            password: '●●●●●●●●',
            realPassword: 'robert1234',
            photo: 'https://randomuser.me/api/portraits/men/5.jpg',
            dateJoined: '2023-05-12',
            orders: 2,
            status: 'active'
          }
        ];
        
        localStorage.setItem('users', JSON.stringify(mockUsers));
        setUsers(mockUsers);
      } else {
        setUsers(savedUsers);
      }
      setError(null);
    } catch (err) {
      setError('Failed to load user data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleUserStatus = useCallback((userId) => {
    setUsers(prevUsers => {
      const updatedUsers = prevUsers.map(user => 
        user.id === userId 
          ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' } 
          : user
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      return updatedUsers;
    });
  }, []);

  const deleteUser = useCallback((userId) => {
    setUsers(prevUsers => {
      const updatedUsers = prevUsers.filter(user => user.id !== userId);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      return updatedUsers;
    });
  }, []);

  const togglePasswordVisibility = useCallback((userId) => {
    setUsers(prevUsers => {
      const updatedUsers = prevUsers.map(user => 
        user.id === userId 
          ? { 
              ...user, 
              password: user.password === '●●●●●●' ? user.realPassword : '●●●●●●' 
            } 
          : user
      );
      return updatedUsers;
    });
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    toggleUserStatus,
    deleteUser,
    togglePasswordVisibility
  };
};

const useSettings = () => {
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'DCart Store',
    storeEmail: 'info@dcartstore.com',
    storePhone: '+1 234 567 8901',
    storeAddress: '123 Shopping Street, E-Commerce City',
    taxRate: 8.5,
    shippingFee: 15,
    freeShippingThreshold: 100
  });
  
  const [adminSettings, setAdminSettings] = useState({
    adminEmail: 'admin@dcartstore.com',
    notificationEmails: true,
    dailyReports: true,
    weeklyReports: true,
    monthlyReports: true,
    alertLowStock: true,
    lowStockThreshold: 10
  });

  useEffect(() => {
    // Load saved settings if they exist
    const savedStoreSettings = localStorage.getItem('storeSettings');
    const savedAdminSettings = localStorage.getItem('adminSettings');
    
    if (savedStoreSettings) {
      setStoreSettings(JSON.parse(savedStoreSettings));
    }
    
    if (savedAdminSettings) {
      setAdminSettings(JSON.parse(savedAdminSettings));
    }
  }, []);

  const updateStoreSettings = (newSettings) => {
    setStoreSettings(newSettings);
    localStorage.setItem('storeSettings', JSON.stringify(newSettings));
  };

  const updateAdminSettings = (newSettings) => {
    setAdminSettings(newSettings);
    localStorage.setItem('adminSettings', JSON.stringify(newSettings));
  };

  return {
    storeSettings,
    adminSettings,
    updateStoreSettings,
    updateAdminSettings
  };
};

const useProducts = () => {
  const reduxProducts = useSelector((state) => state.products);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    try {
      // If Redux store has products, use those
      if (reduxProducts && reduxProducts.length > 0) {
        setProducts(reduxProducts);
      } else {
        // Otherwise use default products from the data file
        setProducts(defaultProducts);
      }
      setError(null);
    } catch (err) {
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [reduxProducts]);

  const deleteProduct = useCallback((productId) => {
    dispatch(removeProduct(productId));
  }, [dispatch]);

  return {
    products,
    loading,
    error,
    deleteProduct
  };
};

const AdminDashboardContent = () => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });
  const [activeSettingsTab, setActiveSettingsTab] = useState('store');
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
  
  // Check for authentication and load admin profile data
  const navigate = useNavigate();
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
  
  // Modals state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewOrderDetails, setViewOrderDetails] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  
  // Use custom hooks
  const { 
    orders, 
    loading: ordersLoading, 
    error: ordersError, 
    updateOrderStatus 
  } = useOrders();
  
  const {
    users,
    loading: usersLoading,
    error: usersError,
    toggleUserStatus,
    deleteUser,
    togglePasswordVisibility
  } = useUsers();
  
  const {
    products,
    loading: productsLoading,
    error: productsError,
    deleteProduct
  } = useProducts();
  
  const {
    storeSettings,
    adminSettings,
    updateStoreSettings,
    updateAdminSettings
  } = useSettings();
  
  const currentCurrency = useSelector((state) => state.currency.currentCurrency);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <FiBarChart2 className="w-5 h-5" /> },
    { id: 'products', label: 'Products', icon: <FiPackage className="w-5 h-5" /> },
    { id: 'orders', label: 'Orders', icon: <FiShoppingBag className="w-5 h-5" /> },
    { id: 'customers', label: 'Customers', icon: <FaUser className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <FiSettings className="w-5 h-5" /> },
  ];

  // Event handlers
  const handleCancelOrder = (id) => {
    const success = updateOrderStatus(id, 'cancelled');
    if (success) setSelectedOrder(null);
  };

  const handleCompleteOrder = (id) => {
    updateOrderStatus(id, 'completed');
  };

  const handleViewDetailPage = (order) => {
    navigate('/order-detail', { state: order });
  };

  const handleViewUserDetails = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleDeleteUser = (userId) => {
    deleteUser(userId);
    
    // Close the modal if the deleted user was being viewed
    if (selectedUser && selectedUser.id === userId) {
      setShowUserModal(false);
      setSelectedUser(null);
    }
  };

  const handleToggleUserStatus = (userId) => {
    toggleUserStatus(userId);
    
    // Update the selected user if it's the one being modified
    if (selectedUser && selectedUser.id === userId) {
      const updatedUser = users.find(user => user.id === userId);
      setSelectedUser(updatedUser);
    }
  };

  const handleRevealPassword = (userId) => {
    togglePasswordVisibility(userId);
    
    // Update the selected user if it's the one being modified
    if (selectedUser && selectedUser.id === userId) {
      const updatedUser = users.find(user => user.id === userId);
      setSelectedUser(updatedUser);
    }
  };

  const handleViewProductDetails = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleDeleteProduct = (productId) => {
    deleteProduct(productId);
    
    // Close the modal if the deleted product was being viewed
    if (selectedProduct && selectedProduct.id === productId) {
      setShowProductModal(false);
      setSelectedProduct(null);
    }
  };

  const handleAddProduct = () => {
    navigate('/addproduct');
  };

  const handleEditProduct = (product) => {
    navigate('/edit-product', { state: { product } });
  };

  // Utility functions
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const calculateDiscountPercentage = (oldPrice, price) => {
    if (!oldPrice || !price || oldPrice <= price) return 0;
    return Math.round(((oldPrice - price) / oldPrice) * 100);
  };

  const handleStoreSettingsChange = (e) => {
    const { name, value, type } = e.target;
    const parsedValue = type === 'number' ? (value === '' ? '' : parseFloat(value)) : value;
    updateStoreSettings({
      ...storeSettings,
      [name]: parsedValue
    });
  };

  const handleAdminSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : 
                     type === 'number' ? (value === '' ? '' : parseFloat(value)) : 
                     value;
    updateAdminSettings({
      ...adminSettings,
      [name]: newValue
    });
  };

  const saveStoreSettings = () => {
    alert('Store settings saved successfully!');
  };

  const saveAdminSettings = () => {
    alert('Admin settings saved successfully!');
  };

  const getSystemInformation = () => {
    return {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalUsers: users.length,
      activeUsers: users.filter(user => user.status === 'active').length,
      totalRevenue: orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0),
      averageOrderValue: orders.length > 0 
        ? orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0) / orders.length 
        : 0,
      pendingOrders: orders.filter(order => order.status === 'processing').length,
      completedOrders: orders.filter(order => order.status === 'completed').length,
      cancelledOrders: orders.filter(order => order.status === 'cancelled').length,
      systemVersion: '1.0.0',
      lastUpdated: new Date().toLocaleString()
    };
  };

  // Filter functions
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id && order.id.toString().includes(searchTerm) ||
      (order.userInfo && order.userInfo.name && order.userInfo.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredUsers = users.filter(user => {
    return (
      user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(userSearchTerm.toLowerCase())
    );
  });

  const filteredProducts = products.filter(product => {
    return (
      (product.name && product.name.toLowerCase().includes(productSearchTerm.toLowerCase())) ||
      (product.id && product.id.toString().includes(productSearchTerm))
    );
  }).sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    if (sortConfig.key === 'price' || sortConfig.key === 'oldPrice') {
      const aValue = parseFloat(a[sortConfig.key]) || 0;
      const bValue = parseFloat(b[sortConfig.key]) || 0;
      
      if (sortConfig.direction === 'ascending') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    } else {
      const aValue = a[sortConfig.key] || '';
      const bValue = b[sortConfig.key] || '';
      
      if (sortConfig.direction === 'ascending') {
        return aValue.toString().localeCompare(bValue.toString());
      } else {
        return bValue.toString().localeCompare(aValue.toString());
      }
    }
  });

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  // Loading states for each tab
  const getLoading = () => {
    switch (activeTab) {
      case 'products': return productsLoading;
      case 'orders': return ordersLoading;
      case 'customers': return usersLoading;
      default: return false;
    }
  };

  // Error states for each tab
  const getError = () => {
    switch (activeTab) {
      case 'products': return productsError;
      case 'orders': return ordersError;
      case 'customers': return usersError;
      default: return null;
    }
  };

  // Quick stats for sidebar
  const quickStats = [
    { label: "Products", value: products.length },
    { label: "Orders", value: orders.length },
    { label: "Customers", value: users.length }
  ];

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
                          setActiveTab('settings');
                          setActiveSettingsTab('admin');
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
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMobileMenuOpen(false);
                  }}
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
        <main className="flex-1 p-6 pb-12 overflow-x-hidden">
          <div className="max-w-6xl mx-auto">
            {/* Loading indicator */}
            {getLoading() && (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
              </div>
            )}
            
            {/* Error message */}
            {getError() && (
              <div className={`p-4 rounded-lg mb-6 ${isDarkMode ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-700'}`}>
                <p>{getError()}</p>
              </div>
            )}
            
            {/* Content based on active tab */}
            {!getLoading() && !getError() && (
              <div className="animate-fadeIn">
                {activeTab === 'dashboard' && (
                  <DashboardOverview 
                    orders={orders}
                    users={users}
                    products={products}
                    isDarkMode={isDarkMode}
                    currentCurrency={currentCurrency}
                  />
                )}
                
                {activeTab === 'products' && (
                  <ProductManagement
                    products={filteredProducts}
                    loading={getLoading()}
                    error={getError()}
                    isDarkMode={isDarkMode}
                    productSearchTerm={productSearchTerm}
                    setProductSearchTerm={setProductSearchTerm}
                    handleAddProduct={handleAddProduct}
                    handleViewProductDetails={handleViewProductDetails}
                    handleEditProduct={handleEditProduct}
                    handleDeleteProduct={handleDeleteProduct}
                    requestSort={requestSort}
                    sortConfig={sortConfig}
                    calculateDiscountPercentage={calculateDiscountPercentage}
                    currentCurrency={currentCurrency}
                  />
                )}
                
                {activeTab === 'orders' && (
                  <OrderManagement
                    orders={filteredOrders}
                    loading={getLoading()}
                    error={getError()}
                    isDarkMode={isDarkMode}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filterStatus={filterStatus}
                    setFilterStatus={setFilterStatus}
                    handleViewDetailPage={handleViewDetailPage}
                    setSelectedOrder={setSelectedOrder}
                    handleCompleteOrder={handleCompleteOrder}
                    setViewOrderDetails={setViewOrderDetails}
                    getStatusColor={getStatusColor}
                    currentCurrency={currentCurrency}
                  />
                )}
                
                {activeTab === 'customers' && (
                  <CustomerManagement
                    users={filteredUsers}
                    loading={getLoading()}
                    error={getError()}
                    isDarkMode={isDarkMode}
                    userSearchTerm={userSearchTerm}
                    setUserSearchTerm={setUserSearchTerm}
                    handleViewUserDetails={handleViewUserDetails}
                    handleToggleUserStatus={handleToggleUserStatus}
                    handleDeleteUser={handleDeleteUser}
                    handleRevealPassword={handleRevealPassword}
                  />
                )}
                
                {activeTab === 'settings' && (
                  <AdminSettings
                    isDarkMode={isDarkMode}
                    activeSettingsTab={activeSettingsTab}
                    setActiveSettingsTab={setActiveSettingsTab}
                    storeSettings={storeSettings}
                    adminSettings={adminSettings}
                    handleStoreSettingsChange={handleStoreSettingsChange}
                    handleAdminSettingsChange={handleAdminSettingsChange}
                    saveStoreSettings={saveStoreSettings}
                    saveAdminSettings={saveAdminSettings}
                    getSystemInformation={getSystemInformation}
                    currentCurrency={currentCurrency}
                  />
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      {selectedOrder && (
        <CancelOrderModal
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
          handleCancelOrder={handleCancelOrder}
          isDarkMode={isDarkMode}
        />
      )}

      {viewOrderDetails && (
        <OrderDetailsModal
          order={viewOrderDetails}
          setViewOrderDetails={setViewOrderDetails}
          handleViewDetailPage={handleViewDetailPage}
          getStatusColor={getStatusColor}
          isDarkMode={isDarkMode}
          currentCurrency={currentCurrency}
        />
      )}

      {showUserModal && selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          setShowUserModal={setShowUserModal}
          handleToggleUserStatus={handleToggleUserStatus}
          handleDeleteUser={handleDeleteUser}
          handleRevealPassword={handleRevealPassword}
          isDarkMode={isDarkMode}
        />
      )}

      {showProductModal && selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          setShowProductModal={setShowProductModal}
          handleEditProduct={handleEditProduct}
          handleDeleteProduct={handleDeleteProduct}
          isDarkMode={isDarkMode}
          currentCurrency={currentCurrency}
          calculateDiscountPercentage={calculateDiscountPercentage}
        />
      )}
    </div>
  );
};

// Wrap with ThemeProvider
const AdminDashboard = () => {
  return (
    <ThemeProvider>
      <AdminDashboardContent />
    </ThemeProvider>
  );
};

export default AdminDashboard; 