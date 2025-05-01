// src/components/Product.js
import React, { useState, useEffect } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { FaCodeCompare } from "react-icons/fa6";
import { HiOutlineViewGrid } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { addItem, removeItem } from '../../redux/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../redux/wishlistSlice';
import { toast } from 'react-toastify';
import { addToCompare, removeFromCompare } from '../../redux/compareSlice';
import { removeProduct } from '../../redux/productSlice';
import { IoIosCloseCircle } from "react-icons/io";
import { getCurrencySymbol } from '../../utils/currencyUtils';
import { useApi } from '../../context/ApiContext';
import { categories, filterByCategory, getCategoryColorClass } from '../../utils/categoryUtils';


export default function Product({ onCartClick, onCartOpen }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist);
  const compareList = useSelector((state) => state.compare);
  const currentCurrency = useSelector((state) => state.currency.currentCurrency);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const cart = useSelector((state) => state.cart.items);
  const [cartItems, setCartItems] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Get product data and loading state from API context
  const { 
    products, 
    loading, 
    searchProducts, 
    searchAndFilterProducts,
    refreshData, 
    removeProductFromApi 
  } = useApi();

  // Initialize productStates based on products from API context
  const [productStates, setProductStates] = useState([]);

  // Initialize cartItems based on the redux state
  useEffect(() => {
    if (cart) {
      setCartItems(cart.map(item => item.id));
    }
  }, [cart]);

  // Update product states when products change
  useEffect(() => {
    if (products.length > 0) {
      setProductStates(products.map(product => ({
        ...product,
        isFavorite: false,
      })));
    }
  }, [products]);

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const toggleCompare = (product) => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      navigate("/login")
      return;
    }
    const isCompared = compareList.some(item => item.id === product.id);
    if (isCompared) {
      dispatch(removeFromCompare(product));
    } else {
      if (compareList.length >= 4) {
        toast.warning("You can only compare up to 4 products");
        return;
      }
      dispatch(addToCompare(product));
    }
  };

  const handleRemoveProduct = async (productId) => {
    try {
      setIsDeleting(true); // Set deleting state to true during deletion
      
      // First delete from API
      await removeProductFromApi(productId);
      
      // Then update Redux state
      dispatch(removeProduct(productId));
      
      // Update cartItems if the product was in cart
      if (cartItems.includes(productId)) {
        const itemIndex = cart.findIndex(item => item.id === productId);
        if (itemIndex !== -1) {
          dispatch(removeItem({ index: itemIndex }));
          setCartItems(cartItems.filter(id => id !== productId));
        }
      }
      
      // Update local product states
      setProductStates(prev => prev.filter(product => product.id !== productId));
      
      toast.success("Product removed successfully!");
    } catch (error) {
      console.error("Error removing product:", error);
      toast.error("Failed to remove product. Please try again.");
      
      // Refresh product data to ensure UI is in sync with backend
      try {
        await refreshData();
        toast.info("Product list has been refreshed");
      } catch (refreshError) {
        console.error("Error refreshing product data:", refreshError);
      }
    } finally {
      setIsDeleting(false); // Reset deleting state regardless of outcome
    }
  };

  const handleAddToCart = (product) => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      navigate("/login")
      return;
    }

    const isInCart = cartItems.includes(product.id);

    if (isInCart) {
      const itemIndex = cart.findIndex(item => item.id === product.id);
      if (itemIndex !== -1) {
        dispatch(removeItem({ index: itemIndex }));
        setCartItems(cartItems.filter(id => id !== product.id));
      }
    } else {
      dispatch(addItem({ ...product, quantity: 1 }));
      setCartItems([...cartItems, product.id]);
    }
  };

  const toggleFavorite = (product) => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      navigate("/login")
      return;
    }

    const isWished = wishlist.some(item => item.id === product.id);
    if (isWished) {
      dispatch(removeFromWishlist(product));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  // Handle category selection
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Filter and search products
  const filteredProducts = searchAndFilterProducts(searchTerm, selectedCategory);

  // Sort products by id in descending order (newest first)
  const sortedProducts = [...filteredProducts].sort((a, b) => b.id - a.id);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Our Products
          </h1>
          <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
            We are passionate about transforming houses into beautiful homes with our exquisite collection of handcrafted furniture.
          </p>
        </div>

        <div className="max-w-xl mx-auto mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
              <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Category filter buttons */}
        <div className="mb-10 mt-8">
          <div className="max-w-4xl mx-auto">
            {/* Minimal category filter with horizontal scrolling */}
            <div className="relative">
              {/* Left shadow fade for scroll indication */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>
              
              <div className="flex overflow-x-auto py-2 px-4 scrollbar-hide hide-scrollbar">
                {categories.map((category) => {
                  const isSelected = selectedCategory === category;
                  
                  return (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`whitespace-nowrap px-5 py-2 mx-1 text-sm transition-all duration-300 border-b-2 ${
                        isSelected 
                        ? 'border-black text-black font-medium' 
                        : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
              
              {/* Right shadow fade for scroll indication */}
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div>
            </div>
            
            {/* Optional: Simple Filter Indicator */}
            {selectedCategory !== "All" && (
              <div className="mt-2 px-4">
                <div className="inline-flex items-center gap-2 text-sm text-gray-600">
                  <span>Filtered by {selectedCategory}</span>
                  <button 
                    onClick={() => handleCategoryChange("All")}
                    className="text-black hover:text-gray-700 underline text-xs"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        ) : (
          <>
            {sortedProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm">
                <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-medium text-gray-700 mb-2">No products found</h3>
                <p className="text-gray-500 text-center max-w-md">
                  {searchTerm 
                    ? `No products matching "${searchTerm}" in ${selectedCategory !== 'All' ? selectedCategory : 'any'} category.` 
                    : `No products available in ${selectedCategory} category.`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {sortedProducts.map((product) => {
                  const isWished = wishlist.some(item => item.id === product.id);

                  return (
                    <div key={product.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">

                      <div className="relative">
                        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-2xl">
                          <img
                            onClick={() => navigate(`/product/${product.id}`)}
                            src={product.imgSrc}
                            alt={product.alt || product.name}
                            className="w-full h-[300px] object-cover transform group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/300?text=Product+Image";
                            }}
                          />
                        </div>


                        <div className="absolute top-4 right-4 flex flex-col gap-2">
                          <button
                            onClick={() => toggleFavorite(product)}
                            className={`p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200 ${isWished ? 'text-red-500' : 'text-gray-600'
                              }`}
                          >
                            {isWished ? <FaHeart className="text-xl" /> : <FaRegHeart className="text-xl" />}
                          </button>

                          <button
                            onClick={() => handleViewDetails(product)}
                            className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white text-gray-600 transition-all duration-200"
                          >
                            <HiOutlineViewGrid className="text-xl" />
                          </button>

                          <button
                            onClick={() => toggleCompare(product)}
                            className={`p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200 ${compareList.some(item => item.id === product.id) ? 'text-blue-500' : 'text-gray-600'
                              }`}
                          >
                            <FaCodeCompare className="text-xl" />
                          </button>

                          {localStorage.getItem("userEmail") === "test1278@gmail.com" && (
                            <button
                              onClick={() => handleRemoveProduct(product.id)}
                              className={`p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200
                                  ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}
                                  }`}
                              disabled={isDeleting}
                            >
                              {isDeleting ? (
                                <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <IoIosCloseCircle className="text-xl" />
                              )}
                            </button>
                          )}

                        </div>

                        {product?.discount && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-lg">
                            {product.discount} OFF
                          </div>
                        )}

                        <button
                          onClick={() => handleAddToCart(product)}
                          className={`m-3 rounded-2xl absolute bottom-0 left-0 right-0 ${cartItems.includes(product.id) ? 'bg-black' : 'bg-black'} text-white py-3 text-center font-medium transform translate-y-0 group-hover:translate-y-0 transition-transform duration-300`}
                        >
                          {cartItems.includes(product.id) ? 'Remove from Cart' : 'Add to Cart'}
                        </button>
                      </div>

                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                        <div className="flex items-center gap-3">
                          {typeof product.oldPrice === "number" && product.oldPrice > 0 && (
                            <span className="text-gray-400 line-through">{getCurrencySymbol(currentCurrency)}{product.oldPrice.toFixed(2)}</span>
                          )}
                          {typeof product.price === "number" && (
                            <span className="text-xl font-bold text-gray-900">{getCurrencySymbol(currentCurrency)}{product.price.toFixed(2)}</span>
                          )}
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          {product.availability && (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${product.availability === 'In Stock' ? 'bg-green-100 text-green-800' :
                              product.availability === 'Out of Stock' ? 'bg-red-100 text-red-800' :
                                product.availability === 'Limited Stock' ? 'bg-orange-100 text-orange-800' :
                                  product.availability === 'Pre-order' ? 'bg-blue-100 text-blue-800' :
                                    product.availability === 'Back-order' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-gray-100 text-gray-800'
                              }`}>
                              {product.availability}
                            </span>
                          )}
                        </div>
                      </div>

                      {localStorage.getItem("userEmail") === "test1278@gmail.com" && (
                        <button
                          onClick={() => handleRemoveProduct(product.id)}
                          className={`absolute top-2 left-2 p-1.5 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-200 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                <div className="bg-gray-50 rounded-xl p-6 flex items-center justify-center">
                  <img
                    src={selectedProduct.imgSrc}
                    alt={selectedProduct.alt}
                    className="max-h-[400px] object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/400?text=Product+Image";
                    }}
                  />
                </div>

                <div className="flex flex-col">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedProduct.name}</h2>
                  <p className="text-gray-600 mb-6">
                    {selectedProduct.description || "No description available."}
                  </p>

                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-gray-400 line-through text-xl">
                      {getCurrencySymbol(currentCurrency)}{selectedProduct.oldPrice.toFixed(2)}
                    </span>
                    <span className="text-2xl font-bold text-gray-900">
                      {getCurrencySymbol(currentCurrency)}{selectedProduct.price.toFixed(2)}
                    </span>
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {selectedProduct.discount ? `${selectedProduct.discount}` : '0%'}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-8">
                    A long established fact that a reader will be distracted by the
                    readable content of a page when looking at its layout. The point
                    of using Lorem Ipsum is that it has a more-or-less normal
                    distribution of letters, as opposed
                  </p>

                  <div className="mb-4">
                    <p className="text-gray-700 font-medium mb-2">Category:</p>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColorClass(selectedProduct.category)}`}>
                      {selectedProduct.category || "Uncategorized"}
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-gray-700 font-medium mb-2">Availability:</p>
                    <div className={`inline-flex items-center rounded-full text-sm`}>
                      {selectedProduct.availability && (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${selectedProduct.availability === 'In Stock' ? 'bg-green-100 text-green-800' :
                            selectedProduct.availability === 'Out of Stock' ? 'bg-red-100 text-red-800' :
                              selectedProduct.availability === 'Limited Stock' ? 'bg-orange-100 text-orange-800' :
                                selectedProduct.availability === 'Pre-order' ? 'bg-blue-100 text-blue-800' :
                                  selectedProduct.availability === 'Back-order' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                            }`}>
                            {selectedProduct.availability}
                          </span>
                        )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      handleAddToCart(selectedProduct);
                      closeModal();
                    }}
                    className="w-full bg-black text-white py-4 rounded-xl font-medium hover:bg-gray-800 transition-colors duration-200"
                  >
                    {cartItems.includes(selectedProduct.id) ? 'Remove from Cart' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
