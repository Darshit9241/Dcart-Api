// CouponModal.js
import React, { useEffect } from 'react';
import { coupons } from '../data/coupons';

const CouponModal = ({ showModal, onClose, handleAddCoupon }) => {
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showModal]);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center backdrop-blur-sm transition-opacity duration-300">
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 relative overflow-hidden "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FF7004] to-[#FF9F4A] p-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">Available Coupons</h2>
          <p className="text-blue-100 text-sm">Select a coupon to apply to your order</p>
        </div>

        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-white hover:text-gray-200 transition-transform transform hover:scale-110"
          onClick={onClose}
          aria-label="Close Modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Coupon List */}
        <div className="max-h-[60vh] overflow-y-auto scrollbar-hidden p-6">
          <ul className="space-y-3">
            {Object.keys(coupons).map((couponCode) => (
              <li
                key={couponCode}
                className="flex items-center justify-between gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-lg transition-all duration-200 group"
              >
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 group-hover:text-purple-600 transition-colors">{couponCode}</h3>
                    <p className="text-sm text-gray-600">{coupons[couponCode].description}</p>
                    {coupons[couponCode].discount && (
                      <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                        {coupons[couponCode].discount} off
                      </span>
                    )}
                  </div>
                </div>
                <button
                  className="bg-gradient-to-r from-[#FF7004] to-[#FF9F4A] text-white font-medium px-4 py-2 rounded-lg transition-all transform"
                  onClick={() => {
                    handleAddCoupon(couponCode);
                    onClose();
                  }}
                >
                  Apply
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <button
            className="w-full bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 px-4 border border-gray-300 rounded-lg shadow-sm transition-colors"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CouponModal;