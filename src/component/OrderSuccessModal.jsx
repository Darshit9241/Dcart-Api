import React, { useState } from 'react';
import { FaCheckCircle, FaAngleDown, FaAngleUp, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getCurrencySymbol } from '../utils/currencyUtils';
import { useSelector } from 'react-redux';

const OrderSuccessModal = ({ orderDetails, onClose }) => {
  const navigate = useNavigate();
  const [showOrderItems, setShowOrderItems] = useState(false);
  const currentCurrency = useSelector((state) => state.currency.currentCurrency);

  if (!orderDetails) return null;

  const toggleOrderItems = () => {
    setShowOrderItems(!showOrderItems);
  };

  const calculateItemTotal = (item) => {
    const price = parseFloat(item.price || 0);
    const discount = Math.abs(parseFloat(item.discount || 0));
    const quantity = parseInt(item.quantity || 0);
    const discountedPrice = price * (1 - discount / 100);
    return discountedPrice * quantity;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-lg max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
          aria-label="Close"
        >
          <FaTimes />
        </button>

        <div className="text-center mb-6">
          <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-3" />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Order Placed Successfully!
          </h2>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            Thank you for your purchase.
          </p>
        </div>

        <div className="space-y-4 text-sm md:text-base">
          <InfoRow label="Order ID:" value={orderDetails.id} />
          <InfoRow label="Date:" value={orderDetails.date} />
          <InfoRow label="Payment Method:" value={orderDetails.paymentMethod} capitalize />
          <InfoRow label="Shipping Address:" value={orderDetails.userInfo.shippingAddress} />

          {/* Order Items Section */}
          <div className="mt-4">
            <button
              onClick={toggleOrderItems}
              className="flex items-center justify-between w-full py-2 px-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <span className="font-medium">Order Items ({orderDetails.cartItems.length})</span>
              {showOrderItems ? <FaAngleUp /> : <FaAngleDown />}
            </button>

            {showOrderItems && (
              <div className="mt-3 space-y-3 bg-gray-50 p-3 rounded-lg">
                {orderDetails.cartItems.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-200 last:border-0">
                    <img
                      src={item.imgSrc}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      <div className="grid grid-cols-2 gap-1 text-sm text-gray-500 mt-1">
                        <span>Price: {getCurrencySymbol(currentCurrency)}{parseFloat(item.price).toFixed(2)}</span>
                        <span>Discount: {item.discount}%</span>
                        <span>Quantity: {item.quantity}</span>
                        <span className="font-semibold text-blue-600">
                          Total: {getCurrencySymbol(currentCurrency)}{calculateItemTotal(item).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <InfoRow label="Shipping Cost:" value={`${getCurrencySymbol(currentCurrency)}${orderDetails.shippingCost.toFixed(2)}`} />

          {orderDetails.discount > 0 && (
            <InfoRow label="After apply Coupon Discount:" value={`-${getCurrencySymbol(currentCurrency)}${orderDetails.discount.toFixed(2)}`} highlight />
          )}

          <div className="flex justify-between items-center border-t pt-3 mt-3 font-semibold text-base md:text-lg">
            <span>Total Amount:</span>
            <span>{getCurrencySymbol(currentCurrency)}{orderDetails.totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-300"
          >
            Close
          </button>
          <button
            onClick={() => navigate('/order-detail', { state: orderDetails })}
            className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-[#FF7004] to-[#FF9F4A] text-white rounded-md hover:opacity-90 transition duration-300"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value, capitalize, highlight }) => (
  <div className={`flex justify-between flex-wrap ${highlight ? 'text-green-600 font-medium' : 'text-gray-700'}`}>
    <span>{label}</span>
    <span className={`font-semibold ${capitalize ? 'capitalize' : ''}`}>{value}</span>
  </div>
);

export default OrderSuccessModal;
