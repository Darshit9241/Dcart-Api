import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaArrowRight, FaChevronLeft, FaChevronRight, FaShoppingCart, FaFire } from 'react-icons/fa';
import products from '../ProductData';

const OfferModal = ({ showModal, onClose }) => {
  const navigate = useNavigate();
  const [animation, setAnimation] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);
  
  // Find products with highest discounts
  const bestDeals = products
    .filter(product => product.discount)
    .sort((a, b) => {
      // Extract discount percentage values and convert to numbers
      const discountA = parseInt(a.discount.replace(/[^0-9]/g, ''));
      const discountB = parseInt(b.discount.replace(/[^0-9]/g, ''));
      return discountB - discountA; // Sort by highest discount first
    })
    .slice(0, 6); // Get top 6 deals (increased from 4)

  // Handle slider navigation
  const nextSlide = () => {
    if (currentSlide < bestDeals.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setCurrentSlide(0);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    } else {
      setCurrentSlide(bestDeals.length - 1);
    }
  };

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => setAnimation(true), 100);
    } else {
      document.body.style.overflow = 'auto';
      setAnimation(false);
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showModal]);

  // Scroll to current slide when it changes
  useEffect(() => {
    if (sliderRef.current && window.innerWidth < 640) {
      const slideWidth = sliderRef.current.scrollWidth / bestDeals.length;
      sliderRef.current.scrollTo({
        left: currentSlide * slideWidth,
        behavior: 'smooth'
      });
    }
  }, [currentSlide]);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center transition-all duration-300 px-3 sm:px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div 
        className={`bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-5xl relative overflow-hidden transform transition-all duration-500 max-h-[90vh] ${animation ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-auto max-h-[90vh] scrollbar-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {/* Background pattern - subtle geometric pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF7004] to-[#FF9F4A]" />
            <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxwYXRoIGQ9Ik0wIDMwIEwzMCAwIEw2MCAzMCBMMzAgNjAgWiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utb3BhY2l0eT0iMC4wNSIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+Cjwvc3ZnPg==')] opacity-20" />
          </div>

          {/* Header */}
          <div className="bg-gradient-to-r from-[#FF7004] to-[#FF9F4A] p-6 sm:p-8 text-center relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-white opacity-10 rounded-full"></div>
            <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-white opacity-10 rounded-full"></div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between">
              <div className="text-left mb-4 sm:mb-0">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">Flash Sale!</h2>
                <p className="text-white text-opacity-90 text-base sm:text-lg font-light max-w-md">Discover exclusive deals on our premium products with discounts up to 40% off</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 bg-opacity-20 dark:bg-opacity-30 backdrop-blur-sm px-5 py-3 rounded-xl">
                <div className="text-white text-center">
                  <p className="uppercase text-xs font-semibold tracking-wider mb-1">Limited time offer</p>
                  <div className="flex gap-2 sm:gap-3">
                    {[
                      { value: 2, label: 'Days' },
                      { value: 18, label: 'Hours' },
                      { value: 45, label: 'Mins' },
                      { value: 30, label: 'Secs' }
                    ].map((item, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div className="bg-white dark:bg-gray-700 text-[#FF7004] dark:text-white font-bold text-xl sm:text-2xl w-10 sm:w-12 h-10 sm:h-12 rounded-lg flex items-center justify-center">
                          {item.value}
                        </div>
                        <span className="text-white text-xs mt-1">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Close button */}
          <button
            className="absolute top-3 sm:top-4 right-3 sm:right-4 text-white bg-black bg-opacity-20 hover:bg-opacity-40 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:rotate-90 z-10"
            onClick={onClose}
            aria-label="Close Modal"
          >
            <FaTimes className="h-4 w-4" />
          </button>

          {/* Best Deals */}
          <div className="p-5 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <span className="inline-block w-1.5 h-6 sm:h-8 bg-gradient-to-b from-[#FF7004] to-purple-600 mr-3 rounded-full"></span>
              <FaFire className="text-orange-500 mr-2" />
              <span className="leading-tight">Hot Deals You Don't Want to Miss!</span>
            </h3>
            
            {/* Mobile Carousel (visible only on small screens) */}
            <div className="block sm:hidden relative">
              <div 
                ref={sliderRef}
                className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none -mx-5 px-5"
              >
                {bestDeals.map((product, index) => (
                  <div 
                    key={product.id} 
                    className="flex-shrink-0 w-full snap-center px-2"
                    onClick={() => {
                      navigate(`/product/${product.id}`);
                      onClose();
                    }}
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 cursor-pointer h-full">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-30"></div>
                        <img 
                          src={product.imgSrc} 
                          alt={product.name} 
                          className="w-full h-60 object-cover"
                        />
                        <div className="absolute top-0 left-0 w-full h-full p-4 flex flex-col justify-between">
                          <div className="flex justify-between">
                            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                              {product.discount}
                            </span>
                            <span className="bg-white bg-opacity-90 text-gray-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                              Best Deal
                            </span>
                          </div>
                          <div className="bg-white bg-opacity-90 dark:bg-gray-800 dark:bg-opacity-90 p-3 rounded-xl backdrop-blur-sm">
                            <h4 className="text-base font-semibold text-gray-800 dark:text-white truncate">{product.name}</h4>
                            <div className="flex items-center justify-between mt-2">
                              <div>
                                <span className="text-gray-400 line-through text-xs mr-2">${product.oldPrice.toFixed(2)}</span>
                                <span className="text-[#FF7004] dark:text-blue-400 font-bold">${product.price.toFixed(2)}</span>
                              </div>
                              <button className="bg-[#FF7004] text-white rounded-full p-2 transition-all">
                                <FaShoppingCart className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-4 gap-2">
                {bestDeals.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      currentSlide === index ? 'bg-[#FF7004] w-6' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
              <button
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md z-10"
                onClick={prevSlide}
              >
                <FaChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              </button>
              <button
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md z-10"
                onClick={nextSlide}
              >
                <FaChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            
            {/* Desktop Grid (visible only on larger screens) */}
            <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-6">
              {bestDeals.map((product) => (
                <div 
                  key={product.id} 
                  className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-700"
                  onClick={() => {
                    navigate(`/product/${product.id}`);
                    onClose();
                  }}
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={product.imgSrc} 
                      alt={product.name} 
                      className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
                    <div className="absolute top-3 left-3 right-3 flex justify-between">
                      <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                        {product.discount}
                      </span>
                      <div className="bg-[#FF7004] text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-md flex items-center">
                        <FaFire className="mr-1 h-3 w-3" /> Hot Deal
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <button className="bg-[#FF7004] text-white w-full py-2 rounded-lg font-medium flex items-center justify-center">
                        <FaShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="text-base font-medium text-gray-800 dark:text-white truncate group-hover:text-[#FF7004] dark:group-hover:text-[#FF7004] transition-colors">{product.name}</h4>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-gray-400 line-through text-xs">${product.oldPrice.toFixed(2)}</span>
                      <span className="text-[#FF7004] dark:text-[#FF7004] font-bold">${product.price.toFixed(2)}</span>
                      <span className="ml-auto text-xs text-gray-500 dark:text-gray-400 group-hover:text-[#FF7004] dark:group-hover:text-[#FF7004] flex items-center">
                        View details <FaArrowRight className="ml-1 h-2.5 w-2.5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-5 sm:p-6 bg-gray-50 dark:bg-gray-800 flex flex-col sm:flex-row justify-between gap-3">
            <button
              className="order-2 sm:order-1 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-600 font-medium py-3 px-6 rounded-lg transition-colors flex-1 sm:flex-initial text-sm"
              onClick={onClose}
            >
              Maybe Later
            </button>
            <button
              className="order-1 sm:order-2 bg-gradient-to-r from-[#FF7004] to-[#FF7004] text-white font-medium py-3 px-6 rounded-lg hover:shadow-lg hover:from-[#FF7004] hover:to-[#FF7004] transition-all flex-1 sm:flex-initial text-sm flex items-center justify-center"
              onClick={() => {
                navigate('/product');
                onClose();
              }}
            >
              <span>View All Products</span>
              <FaArrowRight className="ml-2 h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferModal; 