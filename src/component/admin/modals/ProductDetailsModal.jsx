import React from 'react';
import { FiX, FiEdit, FiTrash2, FiInfo } from 'react-icons/fi';
import { FaImage, FaTags, FaPercent, FaDollarSign } from 'react-icons/fa';
import { getCurrencySymbol } from '../../../utils/currencyUtils';

const ProductDetailsModal = ({
  product,
  setShowProductModal,
  handleEditProduct,
  handleDeleteProduct,
  isDarkMode,
  currentCurrency,
  calculateDiscountPercentage
}) => {
  // Calculate discount
  const discountPercentage = 
    product.oldPrice && parseFloat(product.oldPrice) > parseFloat(product.price)
      ? calculateDiscountPercentage(product.oldPrice, product.price)
      : 0;

  const getImageSrc = () => {
    if (product.imgSrc) {
      return product.imgSrc;
    }
    return 'https://via.placeholder.com/400x400?text=No+Image';
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 md:p-4 z-50 overflow-y-auto">
      <div 
        onClick={(e) => e.stopPropagation()}
        className={`relative rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto scrollbar-thin ${
          isDarkMode 
            ? 'bg-gray-800 border border-gray-700 scrollbar-thumb-gray-600 scrollbar-track-gray-800' 
            : 'bg-white border border-gray-200 scrollbar-thumb-gray-300 scrollbar-track-gray-100'
        }`}
      >
        {/* Header with blurred background image */}
        <div 
          className="relative h-28 sm:h-36 rounded-t-2xl overflow-hidden bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${getImageSrc()})` 
          }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <div className="py-1 px-3 rounded-full bg-white/20 text-white backdrop-blur-sm text-xs sm:text-sm">
                #{product.id}
              </div>
              <button
                onClick={() => setShowProductModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Close modal"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white line-clamp-2">{product.name}</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            {/* Left Column - Image */}
            <div className="md:w-1/3">
              <div className={`rounded-xl overflow-hidden border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} aspect-square`}>
                <img 
                  src={getImageSrc()} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/400?text=No+Image';
                  }}
                />
              </div>
              
              {/* Price Badge */}
              <div className="mt-3 sm:mt-4 flex justify-between items-center flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className={`text-xl sm:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {getCurrencySymbol(currentCurrency)}{parseFloat(product.price).toFixed(2)}
                  </span>
                  
                  {product.oldPrice && parseFloat(product.oldPrice) > parseFloat(product.price) && (
                    <span className="text-sm line-through text-gray-500">
                      {getCurrencySymbol(currentCurrency)}{parseFloat(product.oldPrice).toFixed(2)}
                    </span>
                  )}
                </div>
                
                {discountPercentage > 0 && (
                  <span className={`py-1 px-3 rounded-full text-xs font-medium ${isDarkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-700'}`}>
                    -{discountPercentage}%
                  </span>
                )}
              </div>
            </div>
            
            {/* Right Column - Details */}
            <div className="md:w-2/3 mt-4 md:mt-0">
              {/* Product Info Cards */}
              <div className={`p-4 sm:p-5 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <h3 className={`text-md sm:text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Product Details
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category */}
                  {product.category && (
                    <div className="flex items-start">
                      <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-600/50' : 'bg-gray-100'}`}>
                        <FaTags className={`w-4 h-4 ${isDarkMode ? 'text-orange-400' : 'text-orange-500'}`} />
                      </div>
                      <div className="ml-3">
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Category</p>
                        <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{product.category}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Price */}
                  <div className="flex items-start">
                    <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-600/50' : 'bg-gray-100'}`}>
                      <FaDollarSign className={`w-4 h-4 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} />
                    </div>
                    <div className="ml-3">
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Price</p>
                      <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {getCurrencySymbol(currentCurrency)}{parseFloat(product.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Discount */}
                  {discountPercentage > 0 && (
                    <div className="flex items-start">
                      <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-600/50' : 'bg-gray-100'}`}>
                        <FaPercent className={`w-4 h-4 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />
                      </div>
                      <div className="ml-3">
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Discount</p>
                        <p className={`font-medium ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                          {discountPercentage}% OFF
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Description */}
              {product.description && (
                <div className={`mt-3 sm:mt-4 p-4 sm:p-5 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <div className="flex items-center mb-3">
                    <FiInfo className={`w-4 h-4 mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                    <h3 className={`text-md sm:text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Description
                    </h3>
                  </div>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm sm:text-base`}>{product.description}</p>
                </div>
              )}
              
              {/* Image URL Card */}
              <div className={`mt-3 sm:mt-4 p-4 sm:p-5 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <div className="flex items-center mb-3">
                  <FaImage className={`w-4 h-4 mr-2 ${isDarkMode ? 'text-orange-400' : 'text-orange-500'}`} />
                  <h3 className={`text-md sm:text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Image URL
                  </h3>
                </div>
                <div className={`font-mono text-xs overflow-x-auto p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <div className="whitespace-nowrap">
                    {product.imgSrc || 'No image URL available'}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="mt-5 sm:mt-6 flex flex-wrap gap-2 sm:gap-3 justify-end">
            <button
              onClick={() => handleEditProduct(product)}
              className="px-3 sm:px-4 py-2 sm:py-2.5 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors flex items-center"
            >
              <FiEdit className="w-4 h-4 mr-2" /> <span className="whitespace-nowrap">Edit Product</span>
            </button>
            <button
              onClick={() => handleDeleteProduct(product.id)}
              className="px-3 sm:px-4 py-2 sm:py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors flex items-center"
            >
              <FiTrash2 className="w-4 h-4 mr-2" /> <span className="whitespace-nowrap">Delete</span>
            </button>
            <button
              onClick={() => setShowProductModal(false)}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-medium transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal; 