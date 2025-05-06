// src/components/Product.js
import React, { useState, useEffect, useRef } from "react";
import { FaRegHeart, FaHeart, FaStar, FaShoppingCart, FaSort, FaArrowUp } from "react-icons/fa";
import { FaCodeCompare, FaXmark, FaMagnifyingGlass } from "react-icons/fa6";
import { HiOutlineShoppingBag, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { HiMiniArrowPath } from "react-icons/hi2";
import { FiEdit, FiGrid, FiList, FiSliders, FiShare2, FiInfo } from "react-icons/fi";
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
import { categories, getCategoryColorClass } from '../../utils/categoryUtils';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [selectedCategories, setSelectedCategories] = useState(['All']);

  // Modern UI state variables
  const [sortOption, setSortOption] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef(null);
  const searchInputRef = useRef(null);

  // New modern UI enhancements
  const [activeProductTab, setActiveProductTab] = useState('description');
  const [showMobileSort, setShowMobileSort] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [productImageIndex, setProductImageIndex] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [page, setPage] = useState(1);
  const [gridColumns, setGridColumns] = useState(4);
  const [showColorOptions, setShowColorOptions] = useState(false);
  const [selectedColorOption, setSelectedColorOption] = useState(null);
  const [isSticky, setIsSticky] = useState(false);
  const productListRef = useRef(null);
  const headerRef = useRef(null);

  // Get product data and loading state from API context
  const {
    products,
    loading,
    searchAndFilterProducts,
    refreshData,
    removeProductFromApi
  } = useApi();

  // Initialize productStates based on products from API context
  const [productStates, setProductStates] = useState([]);

  // Initialize trending products
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [showSkeleton, setShowSkeleton] = useState(true);

  // Initialize recently viewed products
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Initialize scroll-to-top button
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Initialize quick add functionality
  const [quickAddProduct, setQuickAddProduct] = useState(null);
  const [showCartPreview, setShowCartPreview] = useState(false);
  const [lastAddedProduct, setLastAddedProduct] = useState(null);
  const cartPreviewTimeoutRef = useRef(null);

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

  // Track scrolling for sticky header effects and scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle clicks outside filter drawer
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get trending products
  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 800);

    // Get 4 random products as trending
    if (products.length > 0) {
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      setTrendingProducts(shuffled.slice(0, 4));
    }

    return () => clearTimeout(timer);
  }, [products]);

  // Load and manage recently viewed products
  useEffect(() => {
    // Get recently viewed products from localStorage
    const getRecentlyViewed = () => {
      const saved = localStorage.getItem('recentlyViewed');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return [];
        }
      }
      return [];
    };

    setRecentlyViewed(getRecentlyViewed());
  }, []);

  // Add product to recently viewed when opening product modal
  useEffect(() => {
    if (selectedProduct) {
      addToRecentlyViewed(selectedProduct);
    }
  }, [selectedProduct]);

  // Function to add a product to recently viewed
  const addToRecentlyViewed = (product) => {
    setRecentlyViewed(prev => {
      // Remove product if already in the list
      const filtered = prev.filter(item => item.id !== product.id);

      // Add to the beginning of the array and limit to 4 items
      const updated = [product, ...filtered].slice(0, 4);

      // Save to localStorage
      localStorage.setItem('recentlyViewed', JSON.stringify(updated));

      return updated;
    });
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
    addToRecentlyViewed(product);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
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
      toast.info("Removed from compare list");
    } else {
      if (compareList.length >= 4) {
        toast.warning("You can only compare up to 4 products");
        return;
      }
      dispatch(addToCompare(product));
      toast.success("Added to compare list");
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

  // Enhanced Add to Cart with preview
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
        toast.info("Removed from cart");
      }
    } else {
      dispatch(addItem({ ...product, quantity: 1 }));
      setCartItems([...cartItems, product.id]);
      setLastAddedProduct(product);

      // Show cart preview
      setShowCartPreview(true);

      // Auto hide after 3 seconds
      if (cartPreviewTimeoutRef.current) {
        clearTimeout(cartPreviewTimeoutRef.current);
      }

      cartPreviewTimeoutRef.current = setTimeout(() => {
        setShowCartPreview(false);
      }, 3000);

      toast.success("Added to cart");
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
      toast.info("Removed from wishlist");
    } else {
      dispatch(addToWishlist(product));
      toast.success("Added to wishlist");
    }
  };

  // Handle category selection
  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => {
      // If "All" is clicked
      if (category === 'All') {
        return ['All']; // Reset to just "All"
      }
      
      // If already selected, remove it
      if (prev.includes(category)) {
        const newCategories = prev.filter(c => c !== category);
        // If after removal no categories are left, set to "All"
        return newCategories.length === 0 ? ['All'] : newCategories;
      } else {
        // If adding a new category, remove "All" if it's in the list
        const newCategories = prev.filter(c => c !== 'All');
        return [...newCategories, category];
      }
    });
  };

  // Handle sort option change
  const handleSortChange = (option) => {
    setSortOption(option);
  };

  // Handle price range change
  const handlePriceRangeChange = (range) => {
    setPriceRange(range);
  };

  // Filter and search products
  const filteredProducts = searchAndFilterProducts(searchTerm, selectedCategories);

  // Apply price filter
  const priceFilteredProducts = filteredProducts.filter(product =>
    product.price >= priceRange[0] && product.price <= priceRange[1]
  );

  // Sort products based on selected sort option
  const getSortedProducts = () => {
    switch (sortOption) {
      case 'newest':
        return [...priceFilteredProducts].sort((a, b) => b.id - a.id);
      case 'price-low':
        return [...priceFilteredProducts].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...priceFilteredProducts].sort((a, b) => b.price - a.price);
      case 'name-asc':
        return [...priceFilteredProducts].sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return [...priceFilteredProducts].sort((a, b) => b.name.localeCompare(a.name));
      default:
        return [...priceFilteredProducts].sort((a, b) => b.id - a.id);
    }
  };

  const sortedProducts = getSortedProducts();

  const handleEditProduct = (product) => {
    navigate(`/edit-product/${product.id}`);
  };

  const focusSearch = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Enhanced loading skeleton component
  const ProductSkeleton = () => (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 animate-pulse">
      <div className="h-48 bg-gray-100 relative">
        <div className="absolute top-2 left-2 h-5 w-14 bg-gray-200 rounded-full"></div>
      </div>
      <div className="p-4">
        <div className="h-3 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div className="flex space-x-2 mb-3">
          <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
          <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
          <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  );

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Quick add functionality
  const handleQuickAdd = (product) => {
    setQuickAddProduct(product);
  };

  const closeQuickAdd = () => {
    setQuickAddProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Sticky Header with enhanced accessibility and mobile responsiveness */}
      <header
        ref={headerRef}
        className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-1">
              <h1 className="text-xl font-medium text-gray-900">Shop</h1>
              {selectedCategories.length > 1 && (
                <span className="hidden sm:inline-flex text-xs font-medium bg-black text-white px-2 py-0.5 rounded-full ml-2">
                  {selectedCategories.length > 3 
                    ? `${selectedCategories.length} categories` 
                    : selectedCategories.filter(c => c !== 'All').join(', ')}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {/* Search button for mobile */}
              <button
                onClick={focusSearch}
                className="md:hidden p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 active:scale-95 transition-all"
                aria-label="Search products"
              >
                <FaMagnifyingGlass className="h-4 w-4" />
              </button>

              {/* Filter Button with indicator dot */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 active:scale-95 transition-all relative"
                aria-label="Product filters"
                aria-expanded={showFilters}
                aria-controls="filter-panel"
              >
                <FiSliders className="h-4 w-4" />
                {(selectedCategories.length > 1 || priceRange[0] > 0 || priceRange[1] < 100000) && (
                  <span className="absolute top-0 right-0 h-2 w-2 bg-blue-500 rounded-full" />
                )}
              </button>

              {/* Sort Button for mobile - new */}
              <button
                onClick={() => setShowMobileSort(!showMobileSort)}
                className="sm:hidden p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 active:scale-95 transition-all"
                aria-label="Sort products"
                aria-expanded={showMobileSort}
                aria-controls="mobile-sort-menu"
              >
                <FaSort className="h-4 w-4" />
              </button>

              {/* View Mode Toggles - enhanced with accessibility */}
              <div className="hidden sm:flex border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => handleViewModeChange('grid')}
                  className={`p-1.5 ${viewMode === 'grid' ? 'bg-black text-white' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
                  aria-label="Grid view"
                  aria-pressed={viewMode === 'grid'}
                >
                  <FiGrid className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleViewModeChange('list')}
                  className={`p-1.5 ${viewMode === 'list' ? 'bg-black text-white' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
                  aria-label="List view"
                  aria-pressed={viewMode === 'list'}
                >
                  <FiList className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Grid size control - new */}
              {viewMode === 'grid' && (
                <div className="hidden md:flex border border-gray-200 rounded-lg overflow-hidden">
                  {[3, 4, 5].map(columns => (
                    <button
                      key={columns}
                      onClick={() => setGridColumns(columns)}
                      className={`text-[10px] font-medium px-2 py-1 ${gridColumns === columns
                        ? 'bg-black text-white'
                        : 'text-gray-500 hover:text-gray-700'
                        } transition-colors`}
                      aria-label={`${columns} columns grid view`}
                      aria-pressed={gridColumns === columns}
                    >
                      {columns}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile sort menu dropdown - new */}
      <AnimatePresence>
        {showMobileSort && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden fixed z-40 top-16 right-4 bg-white rounded-lg shadow-md p-2 border border-gray-100"
          >
            <div className="py-1">
              {[
                { value: 'newest', label: 'Newest First' },
                { value: 'price-low', label: 'Price: Low to High' },
                { value: 'price-high', label: 'Price: High to Low' },
                { value: 'name-asc', label: 'Name: A to Z' },
                { value: 'name-desc', label: 'Name: Z to A' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => {
                    handleSortChange(option.value);
                    setShowMobileSort(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-sm rounded ${sortOption === option.value
                    ? 'text-black font-medium bg-gray-100'
                    : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {/* Enhanced Search Bar with animations and modern UI */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-grow group">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-transparent transition-all duration-200
                group-hover:shadow-sm"
              aria-label="Search products"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaMagnifyingGlass className="h-4 w-4 text-gray-400" />
            </div>
            {searchTerm && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <FaXmark className="h-4 w-4" />
              </motion.button>
            )}
          </div>

          {/* Enhanced Sort dropdown with better mobile styling */}
          <div className="relative md:w-48">
            <select
              value={sortOption}
              onChange={(e) => handleSortChange(e.target.value)}
              className="appearance-none w-full px-4 py-2.5 pr-8 bg-white border border-gray-200 rounded-lg 
                text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-black/5 
                focus:border-transparent cursor-pointer transition-all duration-200 hover:shadow-sm"
              aria-label="Sort products"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <FaSort className="h-3 w-3" />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-5 lg:gap-8">
          {/* Enhanced Desktop Filters Panel with smooth animations */}
          <div className="hidden lg:block w-56 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-20">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-md font-medium text-gray-900">Filters</h2>
                {(selectedCategories.length > 1 || priceRange[0] > 0 || priceRange[1] < 100000) && (
                  <button
                    onClick={() => {
                      setSelectedCategories(['All']);
                      setPriceRange([0, 100000]);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    Reset all
                  </button>
                )}
              </div>

              <div className="mb-5">
                <h3 className="text-xs font-medium text-gray-600 mb-2 flex justify-between items-center">
                  <span>Categories</span>
                  <span className="text-xs text-gray-400">
                    {selectedCategories.includes('All') ? 'All' : `${selectedCategories.length} selected`}
                  </span>
                </h3>
                <div className="space-y-1">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all ${selectedCategories.includes(category)
                        ? 'bg-gray-900 text-white font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{category}</span>
                        {category === 'All' && selectedCategories.includes('All') && (
                          <span className="bg-gray-700 text-white rounded-full text-xs px-1.5 py-0.5">Default</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-medium text-gray-600 mb-2">Price Range</h3>
                <div className="px-1">
                  <div className="flex justify-between mb-1 text-xs text-gray-500">
                    <span>{getCurrencySymbol(currentCurrency)}{priceRange[0]}</span>
                    <span>{getCurrencySymbol(currentCurrency)}{priceRange[1]}</span>
                  </div>
                  <div className="mb-2">
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                    />
                  </div>

                  {/* Price inputs for direct entry */}
                  <div className="flex gap-2 mt-2">
                    <div className="relative flex-1">
                      <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                        {getCurrencySymbol(currentCurrency)}
                      </span>
                      <input
                        type="number"
                        min="0"
                        max={priceRange[1]}
                        value={priceRange[0]}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 0;
                          setPriceRange([value, Math.max(value, priceRange[1])]);
                        }}
                        className="w-full pl-5 pr-1 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-black/10"
                      />
                    </div>
                    <div className="relative flex-1">
                      <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                        {getCurrencySymbol(currentCurrency)}
                      </span>
                      <input
                        type="number"
                        min={priceRange[0]}
                        max="100000"
                        value={priceRange[1]}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 0;
                          setPriceRange([Math.min(priceRange[0], value), value]);
                        }}
                        className="w-full pl-5 pr-1 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-black/10"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Mobile/Tablet Filters Drawer */}
          <AnimatePresence>
            {showFilters && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 bg-black lg:hidden z-40"
                  onClick={() => setShowFilters(false)}
                />

                <motion.div
                  ref={filterRef}
                  initial={{ opacity: 0, x: -300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -300 }}
                  transition={{ type: "spring", damping: 30, stiffness: 300 }}
                  className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-md lg:hidden overflow-y-auto"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-center mb-5">
                      <h2 className="text-md font-medium text-gray-900">Filters</h2>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 active:scale-95 transition-all"
                        aria-label="Close filters"
                      >
                        <FaXmark className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mb-5">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-medium text-gray-600">Categories</h3>
                        {selectedCategories.length > 1 && (
                          <button
                            onClick={() => setSelectedCategories(['All'])}
                            className="text-xs text-blue-600 hover:underline"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        {categories.map((category) => (
                          <button
                            key={category}
                            onClick={() => {
                              handleCategoryChange(category);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all ${selectedCategories.includes(category)
                              ? 'bg-gray-900 text-white font-medium'
                              : 'text-gray-700 hover:bg-gray-100'
                              }`}
                          >
                            <div className="flex justify-between items-center">
                              <span>{category}</span>
                              {category === 'All' && selectedCategories.includes('All') && (
                                <span className="bg-gray-700 text-white rounded-full text-xs px-1.5 py-0.5">Default</span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-5">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-medium text-gray-600">Price Range</h3>
                        {(priceRange[0] > 0 || priceRange[1] < 100000) && (
                          <button
                            onClick={() => setPriceRange([0, 100000])}
                            className="text-xs text-blue-600 hover:underline"
                          >
                            Reset
                          </button>
                        )}
                      </div>

                      <div className="px-1">
                        <div className="flex justify-between mb-1 text-xs text-gray-500">
                          <span>{getCurrencySymbol(currentCurrency)}{priceRange[0]}</span>
                          <span>{getCurrencySymbol(currentCurrency)}{priceRange[1]}</span>
                        </div>
                        <div className="mb-2">
                          <input
                            type="range"
                            min="0"
                            max="100000"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                          />
                        </div>
                        <div className="mb-3">
                          <input
                            type="range"
                            min="0"
                            max="100000"
                            value={priceRange[0]}
                            onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                          />
                        </div>

                        {/* Mobile price inputs */}
                        <div className="flex gap-2 mt-2">
                          <div className="relative flex-1">
                            <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                              {getCurrencySymbol(currentCurrency)}
                            </span>
                            <input
                              type="number"
                              min="0"
                              max={priceRange[1]}
                              value={priceRange[0]}
                              onChange={(e) => {
                                const value = parseInt(e.target.value) || 0;
                                setPriceRange([value, Math.max(value, priceRange[1])]);
                              }}
                              className="w-full pl-5 pr-1 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-black/10"
                            />
                          </div>
                          <div className="relative flex-1">
                            <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                              {getCurrencySymbol(currentCurrency)}
                            </span>
                            <input
                              type="number"
                              min={priceRange[0]}
                              max="100000"
                              value={priceRange[1]}
                              onChange={(e) => {
                                const value = parseInt(e.target.value) || 0;
                                setPriceRange([Math.min(priceRange[0], value), value]);
                              }}
                              className="w-full pl-5 pr-1 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-black/10"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Apply filters button */}
                    <div className="sticky bottom-0 pt-3 pb-2 bg-white border-t border-gray-100 mt-auto">
                      <button
                        onClick={() => setShowFilters(false)}
                        className="w-full py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Products Display Area with modern responsive grid */}
          <div className="flex-1" ref={productListRef}>
            {/* Results Count and Active Filters */}
            <div className="flex flex-wrap items-center justify-between mb-5">
              <div className="text-sm text-gray-500 mb-2 sm:mb-0">
                Showing <span className="font-medium text-gray-900">{sortedProducts.length}</span> {sortedProducts.length === 1 ? 'product' : 'products'}
                {selectedCategories.length > 1 && (
                  <span> in <span className="font-medium text-gray-900">{selectedCategories.join(', ')}</span></span>
                )}
              </div>

              {/* Active Filters Pills */}
              {(selectedCategories.length > 1 || priceRange[0] > 0 || priceRange[1] < 100000) && (
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.length > 1 && (
                    <>
                      {selectedCategories.filter(cat => cat !== 'All').map(category => (
                        <button
                          key={category}
                          onClick={() => {
                            // Remove this category from the selected categories
                            setSelectedCategories(prev => prev.filter(c => c !== category));
                          }}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-black text-white"
                        >
                          {category}
                          <FaXmark className="ml-1 h-3 w-3" />
                        </button>
                      ))}
                    </>
                  )}
                  
                  {(priceRange[0] > 0 || priceRange[1] < 100000) && (
                    <button
                      onClick={() => setPriceRange([0, 100000])}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800"
                    >
                      {getCurrencySymbol(currentCurrency)}{priceRange[0]} - {getCurrencySymbol(currentCurrency)}{priceRange[1]}
                      <FaXmark className="ml-1 h-3 w-3" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      setSelectedCategories(['All']);
                      setPriceRange([0, 100000]);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Enhanced Product Grid with modern animation and layout */}
            {showSkeleton ? (
              <div className={`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-${gridColumns} gap-3 sm:gap-4 lg:gap-5`}>
                {[...Array(8)].map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : loading ? (
              <div className={`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-${gridColumns} gap-3 sm:gap-4 lg:gap-5`}>
                {[...Array(8)].map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : (
              sortedProducts.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                  <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FaMagnifyingGlass className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No products found</h3>
                    <p className="text-gray-600 mb-6">
                      {searchTerm
                        ? `We couldn't find any products matching "${searchTerm}" in ${selectedCategories.length > 1 && !selectedCategories.includes('All') 
                          ? `the selected categories (${selectedCategories.filter(c => c !== 'All').join(', ')})`
                          : 'any category'}.`
                        : `No products available in ${selectedCategories.length > 1 && !selectedCategories.includes('All')
                          ? `the selected categories (${selectedCategories.filter(c => c !== 'All').join(', ')})`
                          : 'any category'}.`}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedCategories(['All']);
                          setPriceRange([0, 100000]);
                        }}
                        className="px-5 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        Clear all filters
                      </button>
                      <button
                        onClick={() => focusSearch()}
                        className="px-5 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Try another search
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                viewMode === 'grid' ? (
                  <div>
                    {/* Grid view with dynamic column count */}
                    <div className={`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-${gridColumns} gap-3 sm:gap-4 lg:gap-5`}>
                      {sortedProducts.map((product, index) => {
                        const isWished = wishlist.some(item => item.id === product.id);
                        const isInCart = cartItems.includes(product.id);
                        const isCompared = compareList.some(item => item.id === product.id);

                        return (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.03 }}
                            className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full"
                          >
                            <div className="relative">
                              {/* Product Image with better hover effect */}
                              <div
                                className="aspect-square overflow-hidden p-2 bg-white flex items-center justify-center"
                                onClick={() => navigate(`/product/${product.id}`)}
                              >
                                <img
                                  src={product.imgSrc}
                                  alt={product.alt || product.name}
                                  className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://via.placeholder.com/300?text=Product+Image";
                                  }}
                                  loading="lazy" // Lazy load images for better performance
                                />
                              </div>

                              {/* Enhanced Quick action buttons */}
                              <div className="absolute top-2 right-2 flex flex-col gap-1.5">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => toggleFavorite(product)}
                                  className={`p-1.5 rounded-full shadow-sm hover:shadow transition-all duration-200 ${isWished
                                    ? 'bg-red-500 text-white'
                                    : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white'
                                    }`}
                                  aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
                                >
                                  {isWished ? <FaHeart className="w-3 h-3" /> : <FaRegHeart className="w-3 h-3" />}
                                </motion.button>

                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => toggleCompare(product)}
                                  className={`p-1.5 rounded-full shadow-sm hover:shadow transition-all duration-200 ${isCompared
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white'
                                    }`}
                                  aria-label={isCompared ? "Remove from compare" : "Add to compare"}
                                >
                                  <FaCodeCompare className="w-3 h-3" />
                                </motion.button>

                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleQuickAdd(product)}
                                  className="p-1.5 rounded-full bg-white/90 backdrop-blur-sm text-gray-600 shadow-sm hover:shadow hover:bg-white transition-all duration-200"
                                  aria-label="Quick view"
                                >
                                  <FaMagnifyingGlass className="w-3 h-3" />
                                </motion.button>
                              </div>

                              {/* Enhanced Category Badge */}
                              {product.availability && product.availability !== 'Out of Stock' && (
                                <div className="absolute top-2 left-2">
                                  <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${product.availability === 'In Stock' ? 'bg-green-100 text-green-800' :
                                    product.availability === 'Limited Stock' ? 'bg-orange-100 text-orange-800' :
                                      product.availability === 'Pre-order' ? 'bg-blue-100 text-blue-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                    {product.availability}
                                  </span>
                                </div>
                              )}

                              {/* Enhanced Discount Badge */}
                              {product?.discount && (
                                <div className="absolute top-2 left-2 mt-6">
                                  <span className="bg-red-500 text-white text-xs font-medium px-1.5 py-0.5 rounded-full">
                                    {product.discount}
                                  </span>
                                </div>
                              )}

                              {/* New "Out of Stock" Overlay */}
                              {product.availability === 'Out of Stock' && (
                                <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center">
                                  <span className="bg-black/80 text-white text-xs font-medium px-2 py-1 rounded">
                                    Out of Stock
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="p-3 flex flex-col flex-grow">
                              <div className="mb-auto">
                                <h3
                                  className="text-sm font-medium text-gray-900 mb-1 line-clamp-1 group-hover:text-black cursor-pointer"
                                  onClick={() => navigate(`/product/${product.id}`)}
                                >
                                  {product.name}
                                </h3>

                                <div className="flex items-center justify-between mb-2">
                                  <div>
                                    {typeof product.oldPrice === "number" && product.oldPrice > 0 && (
                                      <span className="text-xs text-gray-400 line-through mr-1">
                                        {getCurrencySymbol(currentCurrency)}{product.oldPrice.toFixed(2)}
                                      </span>
                                    )}
                                    {typeof product.price === "number" && (
                                      <span className="text-sm font-bold text-gray-900">
                                        {getCurrencySymbol(currentCurrency)}{product.price.toFixed(2)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleAddToCart(product)}
                                disabled={product.availability === 'Out of Stock'}
                                className={`w-full py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all duration-200 ${isInCart
                                  ? 'bg-gray-900 text-white hover:bg-gray-800'
                                  : product.availability === 'Out of Stock'
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : 'bg-black text-white hover:bg-gray-800 active:bg-gray-900'
                                  }`}
                              >
                                <FaShoppingCart className={`w-3 h-3 ${isInCart ? 'text-white' : 'text-white'}`} />
                                {isInCart ? 'Remove' : 'Add to Cart'}
                              </motion.button>

                              {/* Admin Actions */}
                              {localStorage.getItem("userEmail") === "test1278@gmail.com" && (
                                <div className="flex justify-end gap-1 mt-2">
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleEditProduct(product)}
                                    className="p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200"
                                  >
                                    <FiEdit className="w-3 h-3" />
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleRemoveProduct(product.id)}
                                    className={`p-1 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-200 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                                      }`}
                                    disabled={isDeleting}
                                  >
                                    {isDeleting ? (
                                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                      <IoIosCloseCircle className="w-3 h-3" />
                                    )}
                                  </motion.button>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Load more button */}
                    {hasMoreProducts && (
                      <div className="mt-8 text-center">
                        <button
                          onClick={() => {
                            setLoadingMore(true);
                            // Simulate loading more products
                            setTimeout(() => {
                              setLoadingMore(false);
                              setHasMoreProducts(false);
                            }, 1500);
                          }}
                          disabled={loadingMore}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
                        >
                          {loadingMore ? (
                            <>
                              <HiMiniArrowPath className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" />
                              Loading...
                            </>
                          ) : (
                            'Load More Products'
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  // Enhanced List View with modern card design
                  <div className="space-y-4">
                    {sortedProducts.map((product, index) => {
                      const isWished = wishlist.some(item => item.id === product.id);
                      const isInCart = cartItems.includes(product.id);
                      const isCompared = compareList.some(item => item.id === product.id);

                      return (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                        >
                          <div className="flex flex-col sm:flex-row">
                            {/* Product Image with aspect ratio */}
                            <div className="relative w-full sm:w-1/3 lg:w-1/4">
                              <div className={`aspect-square sm:h-full relative ${product.availability === 'Out of Stock' ? 'opacity-70' : ''}`}>
                                <img
                                  onClick={() => navigate(`/product/${product.id}`)}
                                  src={product.imgSrc}
                                  alt={product.alt || product.name}
                                  className="w-full h-full object-contain p-4 cursor-pointer transition-transform duration-300 group-hover:scale-105"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://via.placeholder.com/300?text=Product+Image";
                                  }}
                                  loading="lazy"
                                />

                                {/* Category Tag */}
                                {product.category && (
                                  <div className="absolute top-2 left-2">
                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getCategoryColorClass(product.category)}`}>
                                      {product.category}
                                    </span>
                                  </div>
                                )}

                                {/* Enhanced Discount Badge */}
                                {product?.discount && (
                                  <div className="absolute top-2 right-2">
                                    <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                                      {product.discount}
                                    </span>
                                  </div>
                                )}

                                {/* Out of Stock Overlay */}
                                {product.availability === 'Out of Stock' && (
                                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                                    <span className="bg-black/80 text-white text-xs font-medium px-2 py-1 rounded">
                                      Out of Stock
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="w-full sm:w-2/3 lg:w-3/4 p-4 sm:p-5 flex flex-col">
                              <div className="flex justify-between mb-1">
                                <h3
                                  className="text-base md:text-lg font-medium text-gray-900 hover:underline cursor-pointer line-clamp-1"
                                  onClick={() => navigate(`/product/${product.id}`)}
                                >
                                  {product.name}
                                </h3>

                                <div className="flex gap-1.5">
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => toggleFavorite(product)}
                                    className={`p-1.5 rounded-full ${isWished
                                      ? 'bg-red-500 text-white'
                                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                      } transition-all duration-200`}
                                    aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
                                  >
                                    {isWished ? <FaHeart className="w-3.5 h-3.5" /> : <FaRegHeart className="w-3.5 h-3.5" />}
                                  </motion.button>

                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => toggleCompare(product)}
                                    className={`p-1.5 rounded-full ${isCompared
                                      ? 'bg-blue-500 text-white'
                                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                      } transition-all duration-200`}
                                    aria-label={isCompared ? "Remove from compare" : "Add to compare"}
                                  >
                                    <FaCodeCompare className="w-3.5 h-3.5" />
                                  </motion.button>

                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowShareOptions(true)}
                                    className="p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200"
                                    aria-label="Share product"
                                  >
                                    <FiShare2 className="w-3.5 h-3.5" />
                                  </motion.button>
                                </div>
                              </div>

                              <div className="flex items-center mb-1.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <FaStar
                                    key={star}
                                    className={`w-3.5 h-3.5 ${star <= (product.rating || Math.floor(Math.random() * 5) + 3)
                                      ? 'text-yellow-400'
                                      : 'text-gray-300'
                                      }`}
                                  />
                                ))}
                                <span className="ml-1 text-xs text-gray-500">
                                  {product.reviews || Math.floor(Math.random() * 100) + 5} reviews
                                </span>
                              </div>

                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {product.description || "No description available."}
                              </p>

                              <div className="flex flex-wrap items-center gap-3 mb-3">
                                <div className="flex items-baseline">
                                  {typeof product.oldPrice === "number" && product.oldPrice > 0 && (
                                    <span className="text-sm text-gray-400 line-through mr-2">
                                      {getCurrencySymbol(currentCurrency)}{product.oldPrice.toFixed(2)}
                                    </span>
                                  )}
                                  {typeof product.price === "number" && (
                                    <span className="text-lg md:text-xl font-bold text-gray-900">
                                      {getCurrencySymbol(currentCurrency)}{product.price.toFixed(2)}
                                    </span>
                                  )}
                                </div>

                                {product.availability && product.availability !== 'Out of Stock' && (
                                  <span className={`text-xs px-2 py-1 rounded-full ${product.availability === 'In Stock' ? 'bg-green-100 text-green-800' :
                                    product.availability === 'Limited Stock' ? 'bg-orange-100 text-orange-800' :
                                      product.availability === 'Pre-order' ? 'bg-blue-100 text-blue-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                    {product.availability}
                                  </span>
                                )}

                                {/* Product color options */}
                                {product.colors && (
                                  <div className="flex items-center gap-1">
                                    {product.colors.map((color, i) => (
                                      <div
                                        key={i}
                                        className={`w-4 h-4 rounded-full cursor-pointer border ${selectedColorOption === i ? 'ring-2 ring-black ring-offset-1' : 'border-gray-300'
                                          }`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => setSelectedColorOption(i)}
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>

                              <div className="mt-auto flex flex-wrap gap-2">
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => handleViewDetails(product)}
                                  className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 
                                    transition-colors flex-grow sm:flex-grow-0"
                                >
                                  View Details
                                </motion.button>

                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => handleAddToCart(product)}
                                  disabled={product.availability === 'Out of Stock'}
                                  className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 
                                    transition-all duration-200 flex-grow sm:flex-grow-0 ${isInCart
                                      ? 'bg-gray-900 text-white hover:bg-gray-800'
                                      : product.availability === 'Out of Stock'
                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                        : 'bg-black text-white hover:bg-gray-800'
                                    }`}
                                >
                                  <FaShoppingCart className="w-3.5 h-3.5" />
                                  <span>{isInCart ? 'Remove' : 'Add to Cart'}</span>
                                </motion.button>

                                {/* Quick buy button */}
                                {product.availability !== 'Out of Stock' && (
                                  <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (!isInCart) handleAddToCart(product);
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 
                                      transition-colors flex-grow sm:flex-grow-0"
                                  >
                                    Buy Now
                                  </motion.button>
                                )}
                              </div>

                              {/* Admin Actions */}
                              {localStorage.getItem("userEmail") === "test1278@gmail.com" && (
                                <div className="flex justify-end gap-1.5 mt-3">
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleEditProduct(product)}
                                    className="p-1.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                                  >
                                    <FiEdit className="w-3.5 h-3.5" />
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleRemoveProduct(product.id)}
                                    className={`p-1.5 bg-black text-white rounded-full hover:bg-gray-800 transition-colors ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                                      }`}
                                    disabled={isDeleting}
                                  >
                                    {isDeleting ? (
                                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                      <IoIosCloseCircle className="w-3.5 h-3.5" />
                                    )}
                                  </motion.button>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}

                    {/* Load more button for list view */}
                    {hasMoreProducts && (
                      <div className="mt-8 text-center">
                        <button
                          onClick={() => {
                            setLoadingMore(true);
                            // Simulate loading more products
                            setTimeout(() => {
                              setLoadingMore(false);
                              setHasMoreProducts(false);
                            }, 1500);
                          }}
                          disabled={loadingMore}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
                        >
                          {loadingMore ? (
                            <>
                              <HiMiniArrowPath className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" />
                              Loading...
                            </>
                          ) : (
                            'Load More Products'
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )
              )
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Scroll to Top Button with animation */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-4 right-4 p-3 rounded-full bg-black text-white shadow-md z-40"
            aria-label="Scroll to top"
          >
            <FaArrowUp className="h-3 w-3" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Enhanced Product Detail Modal with multiple tabs and improved image gallery */}
      <AnimatePresence>
        {showModal && selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-xl shadow-lg max-w-4xl w-[95%] max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 z-50 p-1.5 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm text-gray-600 hover:text-gray-900 transition-all duration-200"
                aria-label="Close modal"
              >
                <FaXmark className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                {/* Left side - Image Gallery */}
                <div className="relative bg-white flex flex-col h-full">
                  {/* Main product image */}
                  <div className="relative flex-grow overflow-hidden p-4 md:p-8 flex items-center justify-center">
                    <img
                      src={selectedProduct.imgSrc}
                      alt={selectedProduct.alt || selectedProduct.name}
                      className="max-w-full max-h-full object-contain transition-transform duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/400?text=Product+Image";
                      }}
                    />

                    {/* Image navigation arrows */}
                    {selectedProduct.images && selectedProduct.images.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setProductImageIndex(prev =>
                              prev === 0 ? selectedProduct.images.length - 1 : prev - 1
                            );
                          }}
                          className="absolute left-2 p-1.5 rounded-full bg-white/80 text-gray-700 shadow-sm hover:bg-white"
                          aria-label="Previous image"
                        >
                          <HiChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setProductImageIndex(prev =>
                              prev === selectedProduct.images.length - 1 ? 0 : prev + 1
                            );
                          }}
                          className="absolute right-2 p-1.5 rounded-full bg-white/80 text-gray-700 shadow-sm hover:bg-white"
                          aria-label="Next image"
                        >
                          <HiChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}

                    {/* Stock badge overlay */}
                    {selectedProduct.availability && (
                      <div className="absolute top-4 left-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${selectedProduct.availability === 'In Stock' ? 'bg-green-100 text-green-800' :
                          selectedProduct.availability === 'Out of Stock' ? 'bg-red-100 text-red-800' :
                            selectedProduct.availability === 'Limited Stock' ? 'bg-orange-100 text-orange-800' :
                              'bg-gray-100 text-gray-800'
                          }`}>
                          {selectedProduct.availability}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Thumbnail row */}
                  {selectedProduct.images && selectedProduct.images.length > 1 && (
                    <div className="flex justify-center gap-2 p-3 border-t border-gray-100">
                      {selectedProduct.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setProductImageIndex(idx)}
                          className={`w-12 h-12 rounded-md overflow-hidden border-2 ${productImageIndex === idx ? 'border-black' : 'border-transparent'
                            }`}
                        >
                          <img
                            src={img}
                            alt={`Product view ${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/100?text=Thumbnail";
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right side - Product details with tabs */}
                <div className="p-5 flex flex-col overflow-y-auto max-h-[70vh] md:max-h-[90vh]">
                  <div className="mb-3">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{selectedProduct.name}</h2>

                    <div className="flex items-center mb-2">
                      {/* Star rating */}
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            className={`w-4 h-4 ${star <= (selectedProduct.rating || 4)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                              }`}
                          />
                        ))}
                        <span className="ml-1 text-sm text-gray-500">
                          {selectedProduct.reviews || '36'} reviews
                        </span>
                      </div>

                      {/* Share button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowShareOptions(true);
                        }}
                        className="ml-auto p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                        aria-label="Share product"
                      >
                        <FiShare2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Price display */}
                    <div className="flex items-baseline mb-3">
                      {typeof selectedProduct.oldPrice === "number" && selectedProduct.oldPrice > 0 && (
                        <span className="text-sm text-gray-400 line-through mr-2">
                          {getCurrencySymbol(currentCurrency)}{selectedProduct.oldPrice.toFixed(2)}
                        </span>
                      )}
                      {typeof selectedProduct.price === "number" && (
                        <span className="text-2xl font-bold text-gray-900">
                          {getCurrencySymbol(currentCurrency)}{selectedProduct.price.toFixed(2)}
                        </span>
                      )}

                      {/* Discount badge */}
                      {selectedProduct?.discount && (
                        <span className="ml-2 bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                          {selectedProduct.discount}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Tab navigation */}
                  <div className="flex border-b border-gray-200 mb-4">
                    {['description', 'specs', 'reviews'].map((tab) => (
                      <button
                        key={tab}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveProductTab(tab);
                        }}
                        className={`px-4 py-2 text-sm font-medium capitalize ${activeProductTab === tab
                          ? 'text-black border-b-2 border-black'
                          : 'text-gray-500 hover:text-gray-700'
                          }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* Tab content */}
                  <div className="mb-6 flex-grow">
                    {activeProductTab === 'description' && (
                      <div>
                        <p className="text-sm text-gray-600">
                          {selectedProduct.description || "No description available for this product."}
                        </p>

                        {/* Feature points */}
                        {selectedProduct.features && (
                          <ul className="mt-3 space-y-1">
                            {selectedProduct.features.map((feature, i) => (
                              <li key={i} className="flex items-start">
                                <span className="text-green-500 mr-2">✓</span>
                                <span className="text-sm text-gray-600">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}

                    {activeProductTab === 'specs' && (
                      <div className="text-sm">
                        <div className="divide-y divide-gray-200">
                          {selectedProduct.specs ? (
                            Object.entries(selectedProduct.specs).map(([key, value]) => (
                              <div key={key} className="flex py-2">
                                <span className="w-1/3 font-medium text-gray-500">{key}</span>
                                <span className="w-2/3 text-gray-900">{value}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500">No specifications available for this product.</p>
                          )}
                        </div>
                      </div>
                    )}

                    {activeProductTab === 'reviews' && (
                      <div className="text-sm">
                        <p className="text-gray-500">Customer reviews will appear here.</p>
                      </div>
                    )}
                  </div>

                  {/* Color selection if available */}
                  {selectedProduct.colors && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Select Color</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.colors.map((color, i) => (
                          <button
                            key={i}
                            onClick={() => setSelectedColorOption(i)}
                            className={`w-8 h-8 rounded-full border-2 overflow-hidden ${selectedColorOption === i ? 'ring-2 ring-black ring-offset-1' : ''
                              }`}
                            style={{ borderColor: selectedColorOption === i ? color : 'transparent' }}
                            aria-label={`Select ${color} color`}
                          >
                            <span
                              className="block w-full h-full rounded-full"
                              style={{ backgroundColor: color }}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(selectedProduct);
                      }}
                      disabled={selectedProduct.availability === 'Out of Stock'}
                      className={`py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 ${cartItems.includes(selectedProduct.id)
                        ? 'bg-gray-900 text-white hover:bg-gray-800'
                        : selectedProduct.availability === 'Out of Stock'
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-black text-white hover:bg-gray-800'
                        }`}
                    >
                      <FaShoppingCart className="w-4 h-4" />
                      {cartItems.includes(selectedProduct.id) ? 'Remove from Cart' : 'Add to Cart'}
                    </motion.button>

                    {selectedProduct.availability !== 'Out of Stock' && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!cartItems.includes(selectedProduct.id)) {
                            handleAddToCart(selectedProduct);
                          }
                          closeModal();
                          onCartOpen?.();
                        }}
                        className="py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200"
                      >
                        <HiOutlineShoppingBag className="w-4 h-4" />
                        Buy Now
                      </motion.button>
                    )}
                  </div>

                  {/* Wishlist toggle button */}
                  <div className="mt-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(selectedProduct);
                      }}
                      className={`w-full py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 border transition-all duration-200 ${wishlist.some(item => item.id === selectedProduct.id)
                        ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                      {wishlist.some(item => item.id === selectedProduct.id) ? (
                        <>
                          <FaHeart className="w-4 h-4" />
                          Remove from Wishlist
                        </>
                      ) : (
                        <>
                          <FaRegHeart className="w-4 h-4" />
                          Add to Wishlist
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Floating Cart Preview with animations */}
      <AnimatePresence>
        {showCartPreview && lastAddedProduct && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 z-40 max-w-md w-[90%] border border-gray-100"
          >
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-50 p-2">
                <img
                  src={lastAddedProduct.imgSrc}
                  alt={lastAddedProduct.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/150?text=Product+Image";
                  }}
                />
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center">
                  <span className="flex items-center bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-1"></span>
                    Added to cart
                  </span>
                  <button
                    onClick={() => setShowCartPreview(false)}
                    className="ml-auto text-gray-400 hover:text-gray-600"
                    aria-label="Close preview"
                  >
                    <FaXmark className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h4 className="text-gray-900 font-medium text-sm mt-1 line-clamp-1">{lastAddedProduct.name}</h4>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-gray-700 text-sm font-bold">{getCurrencySymbol(currentCurrency)}{lastAddedProduct.price.toFixed(2)}</p>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => navigate(`/product/${lastAddedProduct.id}`)}
                      className="text-xs text-black hover:underline"
                    >
                      View
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={onCartClick || (() => { })}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Add Modal with enhanced UI */}
      <AnimatePresence>
        {quickAddProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={closeQuickAdd}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-lg shadow-lg max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col sm:flex-row">
                <div className="w-full sm:w-2/5 bg-gray-50 p-4 flex items-center justify-center">
                  <div className="aspect-square relative w-full">
                    <img
                      src={quickAddProduct.imgSrc}
                      alt={quickAddProduct.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/300?text=Product+Image";
                      }}
                    />

                    {quickAddProduct.availability === 'Out of Stock' && (
                      <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                        <span className="bg-black/80 text-white text-xs font-medium px-2 py-1 rounded">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-full sm:w-3/5 p-4 sm:p-5 flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-base font-medium text-gray-900 pr-6 line-clamp-2">{quickAddProduct.name}</h3>
                    <button
                      onClick={closeQuickAdd}
                      className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                      aria-label="Close quick add"
                    >
                      <FaXmark className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={`w-3.5 h-3.5 ${star <= (quickAddProduct.rating || Math.floor(Math.random() * 5) + 3)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                          }`}
                      />
                    ))}
                    <span className="ml-1 text-xs text-gray-500">
                      {quickAddProduct.reviews || Math.floor(Math.random() * 100) + 5} reviews
                    </span>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-baseline">
                      {typeof quickAddProduct.oldPrice === "number" && quickAddProduct.oldPrice > 0 && (
                        <span className="text-sm text-gray-400 line-through mr-2">
                          {getCurrencySymbol(currentCurrency)}{quickAddProduct.oldPrice?.toFixed(2)}
                        </span>
                      )}
                      {typeof quickAddProduct.price === "number" && (
                        <span className="text-lg font-bold text-gray-900">
                          {getCurrencySymbol(currentCurrency)}{quickAddProduct.price?.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-4 flex-grow">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {quickAddProduct.description || "No description available."}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        handleAddToCart(quickAddProduct);
                        closeQuickAdd();
                      }}
                      disabled={quickAddProduct.availability === 'Out of Stock'}
                      className={`py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-1 ${cartItems.includes(quickAddProduct.id)
                        ? 'bg-gray-900 text-white hover:bg-gray-800'
                        : quickAddProduct.availability === 'Out of Stock'
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-black text-white hover:bg-gray-800'
                        }`}
                    >
                      <FaShoppingCart className="w-3.5 h-3.5" />
                      {cartItems.includes(quickAddProduct.id) ? 'Remove' : 'Add to Cart'}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        navigate(`/product/${quickAddProduct.id}`);
                        closeQuickAdd();
                      }}
                      className="py-2.5 px-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
                    >
                      View Details
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}