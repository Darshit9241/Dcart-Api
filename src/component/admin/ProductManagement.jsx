import React, { useState } from 'react';
import { FiPackage, FiAlertCircle, FiEdit, FiTrash2, FiPlus, FiX, FiMaximize, FiMenu, FiGrid } from 'react-icons/fi';
import { FaSearch, FaImage, FaEllipsisV } from 'react-icons/fa';
import { getCurrencySymbol } from '../../utils/currencyUtils';

const ProductManagement = ({ 
  products, 
  loading, 
  error, 
  isDarkMode, 
  productSearchTerm, 
  setProductSearchTerm, 
  handleAddProduct, 
  handleEditProduct, 
  handleDeleteProduct, 
  calculateDiscountPercentage, 
  currentCurrency 
}) => {
  const [fullScreenProduct, setFullScreenProduct] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [activeDropdown, setActiveDropdown] = useState(null);

  const openFullScreenView = (product) => {
    setFullScreenProduct(product);
  };

  const closeFullScreenView = () => {
    setFullScreenProduct(null);
  };

  const toggleDropdown = (id) => {
    if (activeDropdown === id) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(id);
    }
  };

  // Calculate discount percentage for a product
  const getDiscountPercent = (product) => {
    return product.discount 
      ? parseInt(product.discount.replace('-', '').replace('%', '')) 
      : calculateDiscountPercentage(product.oldPrice, product.price);
  };

  return (
    <div className={`${isDarkMode ? 'bg-black' : 'bg-white'} rounded-none`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-black' : 'bg-white'} sticky top-0 z-10 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
        <div className="flex flex-col px-4 py-5">
          <div className="flex justify-between items-center mb-5">
            <h1 className={`text-2xl md:text-3xl font-extrabold ${isDarkMode ? 'text-white' : 'text-black'}`}>
              Products
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? (isDarkMode ? 'bg-gray-800 text-teal-400' : 'bg-teal-50 text-teal-600') : (isDarkMode ? 'text-gray-500' : 'text-gray-400')}`}
                aria-label="List View"
              >
                <FiMenu size={18} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? (isDarkMode ? 'bg-gray-800 text-teal-400' : 'bg-teal-50 text-teal-600') : (isDarkMode ? 'text-gray-500' : 'text-gray-400')}`}
                aria-label="Grid View"
              >
                <FiGrid size={18} />
              </button>
              <button
                onClick={handleAddProduct}
                className="ml-2 bg-teal-500 hover:bg-teal-600 text-white p-2 rounded-lg transition-colors"
                aria-label="Add Product"
              >
                <FiPlus size={18} />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Find products..."
              value={productSearchTerm}
              onChange={(e) => setProductSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 ${
                isDarkMode 
                  ? 'bg-gray-900 text-white border-gray-800 focus:bg-gray-800 focus:border-gray-700' 
                  : 'bg-gray-100 text-gray-900 border-transparent focus:bg-white focus:border-gray-300'
              } border rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 transition-colors`}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center">
              <div className="relative w-20 h-20">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-t-teal-500 rounded-full animate-spin"></div>
              </div>
              <p className={`mt-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} font-medium`}>Loading products...</p>
            </div>
          </div>
        ) : error ? (
          <div className={`p-8 rounded-xl ${isDarkMode ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-500'} text-center`}>
            <FiAlertCircle className="mx-auto h-16 w-16 mb-4" />
            <h2 className="text-2xl font-bold mb-3">Error</h2>
            <p>{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className={`p-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-center`}>
            <FiPackage className="mx-auto h-16 w-16 mb-4" />
            <h2 className="text-2xl font-bold mb-3">No Products Found</h2>
            <p className="mb-8">
              {productSearchTerm 
                ? 'Try adjusting your search criteria.' 
                : 'There are currently no products in the system.'}
            </p>
            <button
              onClick={handleAddProduct}
              className="inline-flex items-center px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl transition-colors"
            >
              <FiPlus className="mr-2" /> Add Your First Product
            </button>
          </div>
        ) : (
          <div>
            {viewMode === 'grid' ? (
              // Masonry Grid Layout
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => {
                  const discountPercent = getDiscountPercent(product);
                  
                  return (
                    <div 
                      key={product.id} 
                      className={`group relative overflow-hidden rounded-xl ${isDarkMode ? 'bg-gray-900 hover:bg-gray-800' : 'bg-white hover:bg-gray-50'} shadow-sm ${isDarkMode ? 'border-gray-800' : 'border'} transition-all duration-300`}
                    >
                      {/* Product Image */}
                      <div 
                        className="relative aspect-[4/3] w-full cursor-pointer overflow-hidden bg-gray-100 dark:bg-gray-800"
                        onClick={() => openFullScreenView(product)}
                      >
                        {discountPercent > 0 && (
                          <div className="absolute top-2 left-2 z-10">
                            <span className="inline-block bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                              -{discountPercent}%
                            </span>
                          </div>
                        )}
                        
                        <div className="absolute top-2 right-2 z-10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDropdown(product.id);
                            }}
                            className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                          >
                            <FaEllipsisV size={14} />
                          </button>
                          
                          {activeDropdown === product.id && (
                            <div 
                              className={`absolute right-0 mt-1 w-32 rounded-lg shadow-lg overflow-hidden ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openFullScreenView(product);
                                  setActiveDropdown(null);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
                              >
                                View
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditProduct(product);
                                  setActiveDropdown(null);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
                              >
                                Edit
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteProduct(product.id);
                                  setActiveDropdown(null);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm ${isDarkMode ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-red-50 text-red-600'}`}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                        
                        {product.imgSrc ? (
                          <img 
                            src={product.imgSrc} 
                            alt={product.name} 
                            className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/300?text=No+Image';
                            }}
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <FaImage className="text-gray-300 h-12 w-12" />
                          </div>
                        )}
                      </div>
                      
                      {/* Product Info */}
                      <div className="p-4">
                        <h3 
                          className={`font-medium text-sm mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'} hover:text-teal-500 cursor-pointer truncate`}
                          onClick={() => openFullScreenView(product)}
                        >
                          {product.name}
                        </h3>
                        <div className="flex items-baseline gap-2">
                          <span className={`text-lg font-bold ${isDarkMode ? 'text-teal-400' : 'text-teal-600'}`}>
                            {getCurrencySymbol(currentCurrency)}{parseFloat(product.price).toFixed(2)}
                          </span>
                          {product.oldPrice && parseFloat(product.oldPrice) > parseFloat(product.price) && (
                            <span className="text-xs text-gray-500 line-through">
                              {getCurrencySymbol(currentCurrency)}{parseFloat(product.oldPrice).toFixed(2)}
                            </span>
                          )}
                        </div>
                        <div className="mt-2">
                          <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            ID: {product.id}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // List View
              <div className={`divide-y ${isDarkMode ? 'divide-gray-800' : 'divide-gray-100'}`}>
                {products.map((product) => {
                  const discountPercent = getDiscountPercent(product);
                  
                  return (
                    <div 
                      key={product.id} 
                      className={`flex py-4 ${isDarkMode ? 'hover:bg-gray-900/50' : 'hover:bg-gray-50'}`}
                    >
                      {/* Product Image */}
                      <div 
                        className="h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 overflow-hidden rounded-lg cursor-pointer"
                        onClick={() => openFullScreenView(product)}
                      >
                        {product.imgSrc ? (
                          <img 
                            src={product.imgSrc} 
                            alt={product.name} 
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/80?text=No+Image';
                            }}
                          />
                        ) : (
                          <div className={`h-full w-full flex items-center justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                            <FaImage className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      {/* Product Info */}
                      <div className="ml-4 flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                          <div>
                            <h3 
                              className={`font-medium text-sm sm:text-base mb-1 truncate ${isDarkMode ? 'text-white' : 'text-gray-900'} hover:text-teal-500 cursor-pointer`}
                              onClick={() => openFullScreenView(product)}
                            >
                              {product.name}
                            </h3>
                            <div className="flex items-center gap-3">
                              <span className={`text-base font-bold ${isDarkMode ? 'text-teal-400' : 'text-teal-600'}`}>
                                {getCurrencySymbol(currentCurrency)}{parseFloat(product.price).toFixed(2)}
                              </span>
                              {product.oldPrice && parseFloat(product.oldPrice) > parseFloat(product.price) && (
                                <span className="text-xs text-gray-500 line-through">
                                  {getCurrencySymbol(currentCurrency)}{parseFloat(product.oldPrice).toFixed(2)}
                                </span>
                              )}
                              {discountPercent > 0 && (
                                <span className="inline-block bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                                  -{discountPercent}%
                                </span>
                              )}
                            </div>
                            <div className="mt-1">
                              <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                ID: {product.id}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 mt-2 sm:mt-0">
                            <button
                              onClick={() => openFullScreenView(product)}
                              className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                              title="View Details"
                            >
                              <FiMaximize size={16} />
                            </button>
                            <button
                              onClick={() => handleEditProduct(product)}
                              className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                              title="Edit Product"
                            >
                              <FiEdit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-800 text-red-400 hover:bg-red-900/30' : 'bg-gray-100 text-red-500 hover:bg-red-50'}`}
                              title="Delete Product"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Full Screen Product View Modal */}
      {fullScreenProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div 
            className={`w-full max-w-4xl max-h-[90vh] overflow-hidden ${
              isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
            } rounded-2xl shadow-2xl`}
          >
            {/* Modal Header */}
            <div className={`px-6 py-4 flex justify-between items-center border-b ${
              isDarkMode ? 'border-gray-800 bg-black/50' : 'border-gray-100'
            } sticky top-0 z-10 backdrop-blur-sm`}>
              <h2 className="text-xl font-bold truncate flex-1">
                {fullScreenProduct.name}
              </h2>
              <button 
                onClick={closeFullScreenView}
                className={`p-2 rounded-full ${
                  isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
                aria-label="Close"
              >
                <FiX size={20} />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-64px)]">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Product Image */}
                <div className={`${isDarkMode ? 'bg-black' : 'bg-gray-50'} aspect-square`}>
                  {fullScreenProduct.imgSrc ? (
                    <img 
                      src={fullScreenProduct.imgSrc} 
                      alt={fullScreenProduct.name} 
                      className="h-full w-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/400?text=No+Image';
                      }}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <FaImage className="h-24 w-24 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-2">
                      {fullScreenProduct.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                        ID: {fullScreenProduct.id}
                      </span>
                      {fullScreenProduct.category && (
                        <span className={`px-2 py-1 text-xs rounded-full ${isDarkMode ? 'bg-teal-900/30 text-teal-300' : 'bg-teal-50 text-teal-700'}`}>
                          {fullScreenProduct.category}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Pricing Info */}
                  <div className="mb-6">
                    <div className="flex items-end space-x-3 mb-2">
                      <div className="text-3xl font-bold text-teal-500">
                        {getCurrencySymbol(currentCurrency)}{parseFloat(fullScreenProduct.price).toFixed(2)}
                      </div>
                      {fullScreenProduct.oldPrice && parseFloat(fullScreenProduct.oldPrice) > parseFloat(fullScreenProduct.price) && (
                        <div className="text-lg text-gray-500 dark:text-gray-400 line-through">
                          {getCurrencySymbol(currentCurrency)}{parseFloat(fullScreenProduct.oldPrice).toFixed(2)}
                        </div>
                      )}
                    </div>
                    
                    {getDiscountPercent(fullScreenProduct) > 0 && (
                      <div>
                        <span className="px-3 py-1 text-sm font-semibold bg-red-500 text-white rounded">
                          {getDiscountPercent(fullScreenProduct)}% OFF
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Description */}
                  {fullScreenProduct.description && (
                    <div className="mb-6">
                      <h4 className="text-lg font-medium mb-2">Description</h4>
                      <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {fullScreenProduct.description}
                      </p>
                    </div>
                  )}

                  {/* Product Details/Specs */}
                  <div className="mb-6">
                    <h4 className="text-lg font-medium mb-2">Details</h4>
                    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {fullScreenProduct.sku && (
                        <div>
                          <span className="font-medium">SKU:</span> {fullScreenProduct.sku}
                        </div>
                      )}
                      {fullScreenProduct.stock !== undefined && (
                        <div>
                          <span className="font-medium">Stock:</span> {fullScreenProduct.stock} units
                        </div>
                      )}
                      {fullScreenProduct.weight && (
                        <div>
                          <span className="font-medium">Weight:</span> {fullScreenProduct.weight}
                        </div>
                      )}
                      {fullScreenProduct.dimensions && (
                        <div>
                          <span className="font-medium">Dimensions:</span> {fullScreenProduct.dimensions}
                        </div>
                      )}
                      {fullScreenProduct.createdAt && (
                        <div>
                          <span className="font-medium">Created:</span> {new Date(fullScreenProduct.createdAt).toLocaleDateString()}
                        </div>
                      )}
                      {fullScreenProduct.updatedAt && (
                        <div>
                          <span className="font-medium">Updated:</span> {new Date(fullScreenProduct.updatedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        closeFullScreenView();
                        handleEditProduct(fullScreenProduct);
                      }}
                      className="flex-1 flex items-center justify-center bg-teal-500 hover:bg-teal-600 text-white px-4 py-3 rounded-xl transition-colors"
                    >
                      <FiEdit className="mr-2" /> Edit Product
                    </button>
                    <button
                      onClick={() => {
                        closeFullScreenView();
                        handleDeleteProduct(fullScreenProduct.id);
                      }}
                      className={`flex items-center justify-center ${
                        isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-red-400' : 'bg-gray-100 hover:bg-gray-200 text-red-500'
                      } px-4 py-3 rounded-xl transition-colors`}
                    >
                      <FiTrash2 className="mr-2" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement; 