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
  const currentCurrency = useSelector((state) => state.currency.currentCurrency);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const savedOrders = JSON.parse(localStorage.getItem('orders')) || [];

      // Ensure all orders have a valid totalPrice, default to 0 if missing
      const validatedOrders = savedOrders.map(order => ({
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

      setOrders(sortedOrders);
    } catch (err) {
      setError('Failed to load orders. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCancelOrder = (id) => {
    try {
      const updatedOrders = orders.map(order =>
        order.id === id ? { ...order, status: 'cancelled' } : order
      );
      setOrders(updatedOrders);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      setSelectedOrder(null);
    } catch (err) {
      setError('Failed to cancel order. Please try again.');
    }
  };

  const handleCancelOrderForSection = (orderId) => {
    const updatedOrders = orders.filter(order => order.id !== orderId);
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
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
    const matchesSearch = order.id.toString().includes(searchTerm) ||
      order.userInfo.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                All Orders
              </h1>
              <p className="text-gray-500 mt-1">Manage and track all your orders in one place</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-50 px-4 py-2 rounded-xl flex items-center">
                <FiPackage className="h-6 w-6 text-indigo-600" />
                <span className="ml-2 font-semibold text-indigo-600">{orders.length} Orders</span>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order ID or customer name..."
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

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <FiPackage className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Orders Found</h3>
            <p className="text-gray-500">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Start shopping to create your first order!'}
            </p>
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
                  <MdCancel
                    onClick={() => handleCancelOrderForSection(order.id)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 cursor-pointer z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                    size={24}
                    title="Cancel Order"
                  />
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
                      <FaMapMarkerAlt className="h-5 w-5 mr-2 mt-1 text-indigo-600" />
                      <span className="flex-1">{order.userInfo.shippingAddress}</span>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium flex items-center text-gray-700">
                          <FiShoppingBag className="mr-2 text-indigo-600" />
                          {order.cartItems.length} Items
                        </p>
                        <button
                          onClick={() => setViewOrderDetails(order)}
                          className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                        >
                          <FiInfo className="mr-1" /> Details
                        </button>
                      </div>

                      <div className="space-y-1 text-sm text-gray-500">
                        {order.cartItems.slice(0, 2).map((item, idx) => (
                          <p key={idx} className="truncate">
                            {item.quantity}x {item.name}
                          </p>
                        ))}
                        {order.cartItems.length > 2 && (
                          <p className="text-xs text-indigo-500">
                            +{order.cartItems.length - 2} more items
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100">
                      <p className="text-lg font-semibold flex items-center justify-between">
                        Total:
                        <span className="text-indigo-600">{getCurrencySymbol(currentCurrency)}{order.totalPrice.toFixed(2)}</span>
                      </p>
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

      {/* Cancel Order Confirmation Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Cancel Order #{selectedOrder.id}?</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to cancel this order? This action cannot be undone.</p>
            <div className="flex space-x-4">
              <button
                onClick={() => handleCancelOrder(selectedOrder.id)}
                className="flex-1 bg-red-500 text-white font-semibold px-4 py-2 rounded-xl hover:bg-red-600 transition duration-300"
              >
                Yes, Cancel Order
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex-1 bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-xl hover:bg-gray-300 transition duration-300"
              >
                No, Keep Order
              </button>
            </div>
          </div>
        </div>
      )}

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
