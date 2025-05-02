import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaChevronLeft, FaChevronRight, FaEye, FaHeart } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addItem } from "../redux/cartSlice";
import { toast } from "react-toastify";
import { useApi } from "../context/ApiContext";
import { motion, AnimatePresence } from "framer-motion";

export default function TrendingProducts({ title = "Trending Products", maxProducts = 10 }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, loading } = useApi();
  const [trendingProducts, setTrendingProducts] = useState([]);
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  useEffect(() => {
    if (products.length > 0) {
      const sorted = [...products].sort((a, b) => b.price - a.price);
      setTrendingProducts(sorted.slice(0, maxProducts));
    }
  }, [products, maxProducts]);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return;
      
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 20);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
      
      const itemWidth = 320 + 24; // Updated card width + gap
      const newIndex = Math.round(scrollLeft / itemWidth);
      setActiveIndex(newIndex);
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial check
      
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, [trendingProducts]);

  const handleAddToCart = (product, event) => {
    event.stopPropagation();
    dispatch(addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.imgSrc
    }));
    toast.success("Added to cart", {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const navigateToProduct = () => {
    navigate("/product");
  };

  const handleViewProduct = (product) => {
    navigate(`/product/${product.id}`);
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const itemWidth = 320 + 24; // Updated card width + gap
      
      if (direction === 'left') {
        const newIndex = Math.max(0, activeIndex - 1);
        current.scrollTo({
          left: newIndex * itemWidth,
          behavior: 'smooth'
        });
      } else {
        const newIndex = Math.min(trendingProducts.length - 1, activeIndex + 1);
        current.scrollTo({
          left: newIndex * itemWidth,
          behavior: 'smooth'
        });
      }
    }
  };

  if (loading) {
    return <ProductSkeleton />;
  }

  return (
    <section className="py-16 px-4 sm:px-8 md:px-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center mb-12"
        >
          <div>
            <motion.h2 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 inline-block relative"
            >
              {title}
              <div className="absolute -bottom-2 left-0 w-12 h-1.5 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"></div>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-gray-500 mt-2 max-w-xl"
            >
              Discover our most popular items handpicked for you
            </motion.p>
          </div>
          
          <motion.button 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            onClick={navigateToProduct}
            className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 flex items-center rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            View All
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </motion.div>
        
        <div className="relative">
          <AnimatePresence>
            {showLeftArrow && (
              <motion.button 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg text-gray-800 hover:bg-orange-500 hover:text-white transition-colors duration-300 hidden sm:flex items-center justify-center"
                aria-label="Scroll left"
              >
                <FaChevronLeft className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>
          
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto gap-6 pb-8 hide-scrollbar snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {trendingProducts.map((product, index) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex-shrink-0 snap-start w-[320px] bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => handleViewProduct(product)}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                whileHover={{ y: -5 }}
              >
                <div className="relative overflow-hidden pt-[75%]">
                  <motion.img 
                    src={product.imgSrc} 
                    alt={product.name} 
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    animate={{ 
                      scale: hoveredProduct === product.id ? 1.08 : 1
                    }}
                    transition={{ duration: 0.5 }}
                  />
                  {product.discount && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                      {product.discount}
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-all duration-300 flex items-end justify-center opacity-100">
                    <motion.div 
                      initial={{ y: 80 }}
                      animate={{ y: hoveredProduct === product.id ? 0 : 80 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="flex gap-2 mb-4"
                    >
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => handleViewProduct(product, e)}
                        className="p-3 bg-white rounded-full text-gray-700 hover:bg-orange-500 hover:text-white shadow-md transition-colors duration-300"
                      >
                        <FaEye className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => handleAddToCart(product, e)}
                        className="p-3 bg-white rounded-full text-gray-700 hover:bg-orange-500 hover:text-white shadow-md transition-colors duration-300"
                      >
                        <FaShoppingCart className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.success("Added to wishlist", {
                            position: "bottom-right",
                            autoClose: 2000,
                          });
                        }}
                        className="p-3 bg-white rounded-full text-gray-700 hover:bg-pink-500 hover:text-white shadow-md transition-colors duration-300"
                      >
                        <FaHeart className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-xs ${i < Math.floor(4 + Math.random()) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                    ))}
                    <span className="text-xs text-gray-500 ml-1">(120+)</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1.5 text-lg group-hover:text-orange-600 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg text-orange-600">${product.price.toFixed(2)}</span>
                      {product.oldPrice && product.oldPrice > product.price && (
                        <span className="text-gray-500 text-sm line-through">${product.oldPrice.toFixed(2)}</span>
                      )}
                    </div>
                    <span className="text-xs text-green-600 font-medium px-2 py-1 bg-green-100 rounded-full">In Stock</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <AnimatePresence>
            {showRightArrow && (
              <motion.button 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg text-gray-800 hover:bg-orange-500 hover:text-white transition-colors duration-300 hidden sm:flex items-center justify-center"
                aria-label="Scroll right"
              >
                <FaChevronRight className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        
        <div className="flex items-center justify-center gap-2 mt-8">
          {trendingProducts.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                if (scrollRef.current) {
                  const itemWidth = 320 + 24; // Updated card width + gap
                  scrollRef.current.scrollTo({
                    left: index * itemWidth,
                    behavior: 'smooth'
                  });
                }
              }}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === activeIndex 
                  ? 'bg-gradient-to-r from-orange-400 to-orange-600 w-8' 
                  : 'bg-gray-300 hover:bg-gray-400 w-2.5'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              aria-label={`Go to product ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const ProductSkeleton = () => (
  <section className="py-16 px-4 sm:px-8 md:px-16 bg-gradient-to-b from-gray-50 to-white">
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-12">
        <div>
          <div className="w-1/3 h-10 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="w-2/3 h-5 bg-gray-200 rounded-md animate-pulse mt-2"></div>
        </div>
        <div className="w-28 h-10 bg-gray-200 rounded-md animate-pulse"></div>
      </div>
      <div className="flex overflow-x-auto gap-6 pb-8">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex-shrink-0 w-[320px] bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className="pt-[75%] relative bg-gray-200 animate-pulse"></div>
            <div className="p-5">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-3 h-3 rounded-full bg-gray-200 animate-pulse"></div>
                ))}
              </div>
              <div className="w-3/4 h-6 bg-gray-200 rounded mb-3 animate-pulse"></div>
              <div className="flex justify-between items-center">
                <div className="w-1/3 h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-1/4 h-5 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-2 mt-8">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="w-2.5 h-2.5 rounded-full bg-gray-200 animate-pulse"></div>
        ))}
      </div>
    </div>
  </section>
); 