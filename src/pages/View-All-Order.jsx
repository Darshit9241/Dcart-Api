import React, { useEffect, useState } from 'react';
import { FiPackage, FiX, FiCheck, FiAlertCircle, FiInfo, FiShoppingBag } from 'react-icons/fi';
import { MdCancel } from 'react-icons/md';
import { FaBox, FaMapMarkerAlt, FaUser, FaCreditCard, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getCurrencySymbol } from '../utils/currencyUtils';
import { useSelector } from 'react-redux';

const ViewAllOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewOrderDetails, setViewOrderDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');
  const currentCurrency = useSelector((state) => state.currency.currentCurrency);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    try {
      // Get raw data from localStorage for debugging
      const rawOrdersData = localStorage.getItem('orders');
      let debugMessage = '';
      
      if (!rawOrdersData || rawOrdersData === 'null' || rawOrdersData === 'undefined') {
        debugMessage = 'No orders found in localStorage.';
        console.error('No orders data found in localStorage');
        setOrders([]);
        setDebugInfo(debugMessage);
        setLoading(false);
        return;
      }
      
      // Try parsing the orders data
      let savedOrders;
      try {
        savedOrders = JSON.parse(rawOrdersData);
        debugMessage = `Found ${savedOrders ? savedOrders.length : 0} total orders in localStorage.`;
      } catch (parseError) {
        console.error('Error parsing orders data:', parseError);
        debugMessage = `Error parsing orders: ${parseError.message}. Raw data: ${rawOrdersData.substring(0, 100)}...`;
        setError('Could not parse order data. Please try refreshing the page.');
        setDebugInfo(debugMessage);
        setLoading(false);
        return;
      }
      
      if (!Array.isArray(savedOrders)) {
        console.error('Orders data is not an array:', savedOrders);
        debugMessage += ' Orders data is not in array format.';
        savedOrders = [];
      }

      // Log user info for debugging
      debugMessage += ` Current user email: ${userEmail || 'No user email found'}`;
      console.log('Current user email:', userEmail);
      console.log('All orders:', savedOrders);
      
      // Filter orders for the current user
      const userOrders = userEmail 
        ? savedOrders.filter(order => {
            // Check if order has userInfo
            if (!order || !order.userInfo) {
              console.log('Order missing userInfo:', order);
              return false;
            }
            
            const orderEmail = order.userInfo.email;
            const isMatch = orderEmail === userEmail;
            console.log(`Order ${order.id} email: ${orderEmail}, matches current user: ${isMatch}`);
            return isMatch;
          }) 
        : savedOrders;
      
      debugMessage += ` Found ${userOrders.length} orders for current user.`;
      console.log('Filtered user orders:', userOrders);

      // Ensure all orders have a valid totalPrice, default to 0 if missing
      const validatedOrders = userOrders.map(order => ({
        ...order,
        totalPrice: order.totalPrice || 0, // If totalPrice is null or undefined, set it to 0
      }));

      // Sort orders: by status first (non-cancelled first), then by date (newest first within each status)
      const sortedOrders = validatedOrders.sort((a, b) => {
        // First, apply the status-based sorting logic
        if (a.status === 'cancelled' && b.status !== 'cancelled') {
          return 1;
        } else if (a.status !== 'cancelled' && b.status === 'cancelled') {
          return -1;
        } else if (a.status === 'completed' && b.status !== 'completed') {
          return 1;
        } else if (a.status !== 'completed' && b.status === 'completed') {
          return -1;
        }

        // Then, within each status category, sort by date (newest first)
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA; // Descending order (newest first)
      });

      setDebugInfo(debugMessage);
      setOrders(sortedOrders);
    } catch (err) {
      console.error('Error loading orders:', err);
      setError('Failed to load orders. Please try again later.');
      setDebugInfo(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const confirmCancelOrder = (orderId) => {
    setOrderToCancel(orderId);
    setShowCancelModal(true);
  };

  const handleCancelOrder = () => {
    try {
      const updatedOrders = orders.map(order =>
        order.id === orderToCancel ? { ...order, status: 'cancelled' } : order
      );
      setOrders(updatedOrders);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      setShowCancelModal(false);
      setOrderToCancel(null);
    } catch (err) {
      setError('Failed to cancel order. Please try again.');
    }
  };

  const handleCompleteOrder = (id) => {
    try {
      const updatedOrders = orders.map(order =>
        order.id === id ? { ...order, status: 'completed' } : order
      );
      setOrders(updatedOrders);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
    } catch (err) {
      setError('Failed to mark order as completed. Please try again.');
    }
  };

  const calculateItemTotal = (item) => {
    const price = parseFloat(item.price || 0);
    const discount = Math.abs(parseFloat(item.discount || 0));
    const quantity = parseInt(item.quantity || 0);
    const discountedPrice = price * (1 - discount / 100);
    return discountedPrice * quantity;
  };

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

  const handleViewDetailPage = (order) => {
    navigate('/order-detail', { state: order });
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toString().includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleViewLocalStorage = () => {
    try {
      const rawData = localStorage.getItem('orders');
      const allOrders = JSON.parse(rawData || '[]');
      console.log('All orders in localStorage:', allOrders);
      
      // Display info about orders in an alert for easy debugging
      const orderSummary = `Found ${allOrders.length} total orders in localStorage.
      
User orders: ${userEmail ? allOrders.filter(o => o.userInfo?.email === userEmail).length : 'N/A'}

Current user email: ${userEmail || 'Not logged in'}

Orders data structure check:
- Has orders array: ${Array.isArray(allOrders)}
- Empty array: ${allOrders.length === 0}
- First order has email: ${allOrders.length > 0 ? (allOrders[0].userInfo?.email ? 'Yes' : 'No') : 'N/A'}`;

      alert(orderSummary);

    } catch (err) {
      console.error('Error checking localStorage:', err);
      alert(`Error reading orders from localStorage: ${err.message}`);
    }
  };

  const handleClearLocalStorage = () => {
    if (window.confirm('Are you sure you want to clear all orders from localStorage? This cannot be undone.')) {
      localStorage.removeItem('orders');
      alert('All orders have been cleared from localStorage. Refreshing page...');
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full mx-4">
          <FiAlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-10 px-4 sm:px-6 lg:px-8">
      {/* Cancel confirmation modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
            <button 
              onClick={() => setShowCancelModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <FiX className="text-xl" />
            </button>
            <div className="text-center mb-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <FiAlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Cancel Order?</h3>
              <p className="text-gray-500 mt-2">
                Are you sure you want to cancel this order? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                No, Keep It
              </button>
              <button
                onClick={handleCancelOrder}
                className="flex-1 py-2 bg-red-600 rounded-lg text-white hover:bg-red-700 focus:outline-none"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                My Orders
              </h1>
              <p className="text-gray-500 mt-1">Track and manage all your orders in one place</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-50 px-4 py-2 rounded-xl flex items-center">
                <FiPackage className="h-6 w-6 text-indigo-600" />
                <span className="ml-2 font-semibold text-indigo-600">{orders.length} {orders.length === 1 ? 'Order' : 'Orders'}</span>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-xl appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                <option value="all">All Status</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Debug info section - only visible if there's an issue */}
        {debugInfo && orders.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-orange-300">
            <h3 className="font-semibold text-orange-600 mb-2">Troubleshooting Information</h3>
            <p className="text-gray-700 text-sm mb-3">{debugInfo}</p>
            <div className="bg-gray-50 p-3 rounded-lg text-sm">
              <p className="mb-2">If your order isn't showing, please check:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Make sure you're logged in with the same email used when placing the order</li>
                <li>Current email: <span className="font-mono">{userEmail || 'Not logged in'}</span></li>
                <li>If you just placed an order, try refreshing the page</li>
              </ul>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        )}

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <FiShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Orders Found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'You haven\'t placed any orders yet'}
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate('/product')}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Start Shopping
              </button>
              
              {/* Add a check order button */}
              <button
                onClick={() => {
                  // Check if localStorage has orders and add a test order if needed
                  try {
                    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
                    console.log('All orders in localStorage:', allOrders);
                    
                    if (userEmail) {
                      const testOrder = {
                        id: Date.now().toString(),
                        date: new Date().toISOString(),
                        status: 'processing',
                        totalPrice: 99.99,
                        shippingCost: 5.99,
                        discount: 0,
                        paymentMethod: 'card',
                        userInfo: {
                          name: 'Test User',
                          email: userEmail,
                          city: 'Test City',
                          state: 'Test State',
                          pincode: '123456',
                          shippingAddress: 'Test Address'
                        },
                        cartItems: [
                          {
                            id: '1',
                            name: 'Test Product',
                            price: 99.99,
                            discount: 0,
                            quantity: 1,
                            imgSrc: 'https://via.placeholder.com/100'
                          }
                        ]
                      };
                      
                      // Add test order to localStorage
                      localStorage.setItem('orders', JSON.stringify([...allOrders, testOrder]));
                      alert('Test order created! Refreshing page...');
                      window.location.reload();
                    } else {
                      alert('Please log in first to create a test order.');
                      navigate('/login');
                    }
                  } catch (err) {
                    console.error('Error creating test order:', err);
                    alert('Error creating test order: ' + err.message);
                  }
                }}
                className="px-6 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                Create Test Order
              </button>
              
              {/* Add debug buttons */}
              <button
                onClick={handleViewLocalStorage}
                className="px-6 py-2 border border-amber-600 text-amber-600 rounded-lg hover:bg-amber-50 transition-colors"
              >
                Check Orders Data
              </button>
              <button
                onClick={handleClearLocalStorage}
                className="px-6 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                Clear All Orders
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800">
                      Order #{order.id}
                    </h2>
                    <span className={`px-4 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status || 'Processing'}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center text-gray-600">
                      <FiPackage className="h-5 w-5 mr-2 text-indigo-600" />
                      <span>{new Date(order.date).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <FaUser className="h-5 w-5 mr-2 text-indigo-600" />
                      <span>{order.userInfo.name}</span>
                    </div>

                    <div className="flex items-start text-gray-600">
                      <FaMapMarkerAlt className="h-5 w-5 mt-1 mr-2 text-indigo-600 flex-shrink-0" />
                      <span className="line-clamp-1">{order.userInfo.shippingAddress}</span>
                    </div>
                    
                    {order.status !== 'cancelled' && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <div className="flex items-center">
                          <div className="w-full">
                            <div className="relative">
                              <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                                <div
                                  style={{
                                    width: order.status === 'processing' ? '50%' : '100%'
                                  }}
                                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                                    order.status === 'completed' ? 'bg-green-500' : 'bg-indigo-600'
                                  }`}
                                />
                              </div>
                              <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>Order Placed</span>
                                <span>Processing</span>
                                <span>Completed</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-4 flex justify-between items-center">
                      <p className="font-bold text-gray-800">{getCurrencySymbol(currentCurrency)}{order.totalPrice.toFixed(2)}</p>
                      <div className="flex space-x-2">
                        {order.status !== 'cancelled' && order.status !== 'completed' && (
                          <button
                            onClick={() => confirmCancelOrder(order.id)}
                            className="px-3 py-1.5 border border-red-300 text-red-600 text-sm rounded-lg hover:bg-red-50 transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          onClick={() => handleViewDetailPage(order)}
                          className="px-4 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleViewDetailPage(order)}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition duration-300 flex items-center justify-center"
                    >
                      Full Details
                    </button>

                    {order.status !== 'cancelled' && order.status !== 'completed' && (
                      <>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="w-full bg-red-500 text-white font-semibold px-4 py-2 rounded-xl hover:bg-red-600 transition duration-300 flex items-center justify-center"
                        >
                          Cancel Order
                        </button>
                        <button
                          onClick={() => handleCompleteOrder(order.id)}
                          className="col-span-2 w-full bg-green-500 text-white font-semibold px-4 py-2 rounded-xl hover:bg-green-600 transition duration-300 flex items-center justify-center"
                        >
                          Mark as Completed
                        </button>
                      </>
                    )}
                    {order.status === 'cancelled' && (
                      <button
                        disabled
                        className="w-full bg-gray-200 text-gray-500 font-semibold px-4 py-2 rounded-xl cursor-not-allowed flex items-center justify-center"
                      >
                        <FiX className="mr-2" /> Cancelled
                      </button>
                    )}
                    {order.status === 'completed' && (
                      <button
                        disabled
                        className="w-full bg-gray-200 text-gray-500 font-semibold px-4 py-2 rounded-xl cursor-not-allowed flex items-center justify-center"
                      >
                        <FiCheck className="mr-2" /> Completed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {viewOrderDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto scrollbar-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Order #{viewOrderDetails.id} Details
              </h3>
              <button
                onClick={() => setViewOrderDetails(null)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h4 className="flex items-center text-lg font-semibold text-gray-800 mb-4">
                  <FaUser className="mr-2 text-indigo-600" /> Customer Information
                </h4>
                <div className="space-y-3 text-gray-700">
                  <p><span className="font-medium">Name:</span> {viewOrderDetails.userInfo.name}</p>
                  <p><span className="font-medium">City:</span> {viewOrderDetails.userInfo.city}</p>
                  <p><span className="font-medium">State:</span> {viewOrderDetails.userInfo.state}</p>
                  <p><span className="font-medium">Pincode:</span> {viewOrderDetails.userInfo.pincode}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h4 className="flex items-center text-lg font-semibold text-gray-800 mb-4">
                  <FaMapMarkerAlt className="mr-2 text-indigo-600" /> Shipping Details
                </h4>
                <div className="space-y-3 text-gray-700">
                  <p><span className="font-medium">Address:</span> {viewOrderDetails.userInfo.shippingAddress}</p>
                  <p><span className="font-medium">Payment Method:</span> <span className="capitalize">{viewOrderDetails.paymentMethod}</span></p>
                  <p><span className="font-medium">Date:</span> {viewOrderDetails.date}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="flex items-center text-lg font-semibold text-gray-800 mb-4">
                <FaBox className="mr-2 text-indigo-600" /> Order Items
              </h4>
              <div className="bg-gray-50 rounded-xl divide-y divide-gray-200">
                {viewOrderDetails.cartItems.map((item, index) => (
                  <div key={index} className="p-4 flex items-start hover:bg-gray-100 transition-colors">
                    <img
                      src={item.imgSrc}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-xl mr-4"
                    />
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-800 mb-2">{item.name}</h5>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <p>Price: {getCurrencySymbol(currentCurrency)}{parseFloat(item.price).toFixed(2)}</p>
                        <p>Discount: {item.discount}%</p>
                        <p>Quantity: {item.quantity}</p>
                        <p className="text-indigo-600 font-medium">
                          Total: {getCurrencySymbol(currentCurrency)}{calculateItemTotal(item).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-xl mb-6">
              <h4 className="flex items-center text-lg font-semibold mb-4">
                <FaCreditCard className="mr-2" /> Order Summary
              </h4>
              <div className="space-y-3 text-gray-100">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{getCurrencySymbol(currentCurrency)}{(viewOrderDetails.totalPrice - viewOrderDetails.shippingCost + (viewOrderDetails.discount || 0)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>{getCurrencySymbol(currentCurrency)}{viewOrderDetails.shippingCost.toFixed(2)}</span>
                </div>
                {viewOrderDetails.discount > 0 && (
                  <div className="flex justify-between text-green-300">
                    <span>Discount:</span>
                    <span>-{getCurrencySymbol(currentCurrency)}{viewOrderDetails.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-white/20 pt-3 mt-3 flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span className="text-white">{getCurrencySymbol(currentCurrency)}{viewOrderDetails.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => handleViewDetailPage(viewOrderDetails)}
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
              >
                View Full Page
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAllOrder;
