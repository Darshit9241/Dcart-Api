import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaBox, FaMapMarkerAlt, FaUser,   FaShoppingBag, FaCreditCard } from 'react-icons/fa';
import { MdArrowBack } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { getCurrencySymbol } from '../utils/currencyUtils';

const OrderDetails = () => {
  const location = useLocation();
  const orderDetails = location.state;
  const navigate = useNavigate();
  const currentCurrency = useSelector((state) => state.currency.currentCurrency);

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <FaShoppingBag className="mx-auto text-5xl text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Order Details Found</h2>
          <p className="text-gray-600 mb-6">The order information could not be found.</p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 bg-gradient-to-r from-[#FF7004] to-[#FF9F4A] text-white rounded-lg font-medium hover:opacity-90"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const calculateItemTotal = (item) => {
    const price = parseFloat(item.price || 0);
    const discount = Math.abs(parseFloat(item.discount || 0));
    const quantity = parseInt(item.quantity || 0);
    const discountedPrice = price * (1 - discount / 100);
    return discountedPrice * quantity;
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-white to-purple-50 py-4 sm:py-8 lg:py-12 px-3 sm:px-4 lg:px-6">
      <div className="max-w-4xl mx-auto px-2 sm:px-4">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate('/cart/payment')}
            className="mr-4 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
          >
            <MdArrowBack className="text-gray-700 text-xl" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
        </div>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Order Status Banner */}
          <div className="bg-gradient-to-r from-[#FF7004] to-[#FF9F4A] text-white py-4 px-6">
            <h2 className="text-xl font-semibold">Order #{orderDetails.id}</h2>
            <p className="opacity-90">Placed on {orderDetails.date}</p>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            {/* Customer & Shipping Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-gray-50 p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl">
                <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-3">
                  <FaUser className="mr-2 text-[#FF7004]" /> Customer Information
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p><span className="font-medium">Name:</span> {orderDetails.userInfo.name}</p>
                  <p><span className="font-medium">City:</span> {orderDetails.userInfo.city}</p>
                  <p><span className="font-medium">State:</span> {orderDetails.userInfo.state}</p>
                  <p><span className="font-medium">Pincode:</span> {orderDetails.userInfo.pincode}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl">
                <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-3">
                  <FaMapMarkerAlt className="mr-2 text-[#FF7004]" /> Shipping Details
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p><span className="font-medium">Address:</span> {orderDetails.userInfo.shippingAddress}</p>
                  <p><span className="font-medium">Payment Method:</span> <span className="capitalize">{orderDetails.paymentMethod}</span></p>
                  <p><span className="font-medium">Shipping Cost:</span> {getCurrencySymbol(currentCurrency)}{orderDetails.shippingCost.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-gray-50 p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl">
              <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-4">
                <FaBox className="mr-2 text-[#FF7004]" /> Order Items
              </h3>
              
              <div className="divide-y divide-gray-200">
                {orderDetails.cartItems.map((item, index) => (
                  <div key={index} className="py-3 sm:py-4 flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                    <img 
                      src={item.imgSrc} 
                      alt={item.name} 
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg" 
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{item.name}</h4>
                      <div className="mt-1 text-sm text-gray-500 grid grid-cols-2 gap-x-4 gap-y-1">
                        <p>Price: {getCurrencySymbol(currentCurrency)}{parseFloat(item.price).toFixed(2)}</p>
                        {item.discount ? `${item.discount}` : '-0%'}
                        <p>Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-[#FF7004]">
                        {getCurrencySymbol(currentCurrency)}{calculateItemTotal(item).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-800 text-white p-5 rounded-xl">
              <h3 className="flex items-center text-lg font-semibold mb-4">
                <FaCreditCard className="mr-2 text-[#FF9F4A]" /> Order Summary
              </h3>
              
              <div className="space-y-2 text-gray-300">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{getCurrencySymbol(currentCurrency)}{orderDetails.totalPrice - orderDetails.shippingCost + orderDetails.discount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>{getCurrencySymbol(currentCurrency)}{orderDetails.shippingCost.toFixed(2)}</span>
                </div>
                {orderDetails.discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount:</span>
                    <span>-{getCurrencySymbol(currentCurrency)}{orderDetails.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-gray-600 pt-2 mt-2 flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span className="text-[#FF9F4A]">{getCurrencySymbol(currentCurrency)}{orderDetails.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-gradient-to-r from-[#FF7004] to-[#FF9F4A] text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-md"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => navigate('/view-all-order')}
                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors shadow-md"
              >
                View All Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
