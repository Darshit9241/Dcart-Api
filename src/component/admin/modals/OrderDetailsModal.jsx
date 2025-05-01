import React from 'react';
import { FiX } from 'react-icons/fi';
import { FaUser, FaMapMarkerAlt, FaCreditCard } from 'react-icons/fa';
import { getCurrencySymbol } from '../../../utils/currencyUtils';

const OrderDetailsModal = ({ 
  order, 
  setViewOrderDetails, 
  handleViewDetailPage, 
  getStatusColor, 
  isDarkMode,
  currentCurrency 
}) => {
  // Helper function to calculate item total
  const calculateItemTotal = (item) => {
    const price = parseFloat(item.price || 0);
    const discount = Math.abs(parseFloat(item.discount || 0));
    const quantity = parseInt(item.quantity || 0);
    const discountedPrice = price * (1 - discount / 100);
    return discountedPrice * quantity;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto scrollbar-hidden`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
            Order #{order.id} Details
          </h3>
          <button
            onClick={() => setViewOrderDetails(null)}
            className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <h4 className={`flex items-center text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
              <FaUser className="mr-2 text-orange-500" /> Customer Information
            </h4>
            <div className={`space-y-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <p><span className="font-medium">Name:</span> {order.userInfo.name}</p>
              <p><span className="font-medium">City:</span> {order.userInfo.city}</p>
              <p><span className="font-medium">State:</span> {order.userInfo.state}</p>
              <p><span className="font-medium">Pincode:</span> {order.userInfo.pincode}</p>
            </div>
          </div>

          <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <h4 className={`flex items-center text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
              <FaMapMarkerAlt className="mr-2 text-orange-500" /> Shipping Details
            </h4>
            <div className={`space-y-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <p><span className="font-medium">Address:</span> {order.userInfo.shippingAddress}</p>
              <p><span className="font-medium">Date:</span> {new Date(order.date).toLocaleDateString()}</p>
              <p><span className="font-medium">Status:</span> 
                <span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                  {order.status === 'processing' ? 'Processing' : 
                   order.status === 'completed' ? 'Completed' : 'Cancelled'}
                </span>
              </p>
            </div>
          </div>
        </div>

        <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
          Order Items
        </h4>

        <div className={`rounded-xl divide-y ${isDarkMode ? 'bg-gray-700 divide-gray-600' : 'bg-gray-50 divide-gray-200'}`}>
          {order.cartItems.map((item, index) => (
            <div key={index} className={`p-4 flex items-start ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'} transition-colors`}>
              <img
                src={item.imgSrc}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-xl mr-4"
              />
              <div className="flex-1">
                <h5 className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-2`}>{item.name}</h5>
                <div className={`grid grid-cols-2 gap-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <p>Price: {getCurrencySymbol(currentCurrency)}{parseFloat(item.price).toFixed(2)}</p>
                  <p>Discount: {item.discount}%</p>
                  <p>Quantity: {item.quantity}</p>
                  <p className={`${isDarkMode ? 'text-orange-400' : 'text-orange-600'} font-medium`}>
                    Total: {getCurrencySymbol(currentCurrency)}{calculateItemTotal(item).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={`mt-6 p-6 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-orange-50'}`}>
          <h4 className={`flex items-center text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
            <FaCreditCard className="mr-2 text-orange-500" /> Order Summary
          </h4>
          <div className={`space-y-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{getCurrencySymbol(currentCurrency)}{(order.totalPrice - order.shippingCost + (order.discount || 0)).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>{getCurrencySymbol(currentCurrency)}{order.shippingCost.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-500">
                <span>Discount:</span>
                <span>-{getCurrencySymbol(currentCurrency)}{order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className={`border-t pt-3 mt-3 flex justify-between font-semibold text-lg ${isDarkMode ? 'border-gray-600' : 'border-orange-200'}`}>
              <span>Total:</span>
              <span className={isDarkMode ? 'text-orange-400' : 'text-orange-600'}>
                {getCurrencySymbol(currentCurrency)}{order.totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={() => handleViewDetailPage(order)}
            className="px-6 py-2 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors"
          >
            View Full Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal; 