import React from 'react';

const CancelOrderModal = ({ selectedOrder, setSelectedOrder, handleCancelOrder, isDarkMode }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 max-w-md w-full`}>
        <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Cancel Order #{selectedOrder.id}?</h3>
        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>Are you sure you want to cancel this order? This action cannot be undone.</p>
        <div className="flex space-x-4">
          <button
            onClick={() => handleCancelOrder(selectedOrder.id)}
            className="flex-1 bg-red-500 text-white font-semibold px-4 py-2 rounded-xl hover:bg-red-600 transition duration-300"
          >
            Yes, Cancel Order
          </button>
          <button
            onClick={() => setSelectedOrder(null)}
            className={`flex-1 ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'} font-semibold px-4 py-2 rounded-xl transition duration-300`}
          >
            No, Keep Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderModal; 