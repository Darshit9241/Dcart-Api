import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegHeart, FaHeart, FaShoppingCart, FaEye, FaArrowRight } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../redux/cartSlice";
import { addToWishlist, removeFromWishlist } from "../redux/wishlistSlice";
import { toast } from "react-toastify";
import { useApi } from "../context/ApiContext";

export default function FeaturedProducts({ title = "Featured Products", maxProducts = 4 }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist);
  const { products, loading } = useApi();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  useEffect(() => {
    if (products.length > 0) {
      // Get featured products (in a real app, this might be filtered by a "featured" flag)
      // For demo, we'll just take the first maxProducts
      setFeaturedProducts(products.slice(0, maxProducts));
    }
  }, [products, maxProducts]);

  const handleAddToCart = (product, event) => {
    event.stopPropagation();
    dispatch(addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.imgSrc
    }));
    toast.success("Added to cart");
  };

  const toggleFavorite = (product, event) => {
    event.stopPropagation();
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      navigate("/login");
      return;
    }
    
    const isFavorite = wishlist.some(item => item.id === product.id);
    if (isFavorite) {
      dispatch(removeFromWishlist(product));
      toast.info("Removed from wishlist");
    } else {
      dispatch(addToWishlist(product));
      toast.success("Added to wishlist");
    }
  };

  const handleViewProduct = (product) => {
    // Navigate to product detail page
    navigate(`/product/${product.id}`);
  };

  if (loading) {
    return <ProductSkeleton />;
  }

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-14">
          <div className="relative">
            <h2 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
              {title}
            </h2>
            <div className="h-1.5 w-20 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"></div>
            <p className="mt-4 text-gray-500 max-w-xl">
              Discover our carefully selected products that combine quality, style, and value.
            </p>
          </div>
          <button 
            onClick={() => navigate("/product")}
            className="mt-6 sm:mt-0 px-8 py-3.5 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-full hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-orange-200 flex items-center group"
          >
            View All Products
            <FaArrowRight className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
          {featuredProducts.map((product) => (
            <div 
              key={product.id}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
              onClick={() => handleViewProduct(product)}
            >
              <div className="relative overflow-hidden pb-[120%]">
                <img 
                  src={product.imgSrc} 
                  alt={product.name} 
                  className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                />
                {product.discount && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-md">
                    {product.discount}
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < 4 ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-xs text-gray-500 ml-1">4.0</span>
                </div>
                <h3 className="font-medium text-gray-800 text-lg mb-2 truncate hover:text-orange-600 transition-colors">{product.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-bold text-xl text-gray-900">${product.price.toFixed(2)}</span>
                  {product.oldPrice && product.oldPrice > product.price && (
                    <span className="text-gray-400 text-sm line-through">${product.oldPrice.toFixed(2)}</span>
                  )}
                </div>
                
                <div className={`flex items-center justify-between mt-4 transition-opacity duration-300 ${hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'}`}>
                  <button 
                    onClick={(e) => handleAddToCart(product, e)}
                    className="px-4 py-2 bg-orange-50 text-orange-600 rounded-full text-sm font-medium hover:bg-orange-600 hover:text-white transition-colors flex items-center gap-1"
                  >
                    <FaShoppingCart className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                  
                  <button 
                    onClick={(e) => toggleFavorite(product, e)}
                    className="p-2.5 bg-gray-50 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    {wishlist.some(item => item.id === product.id) ? (
                      <FaHeart className="w-4 h-4 text-red-500" />
                    ) : (
                      <FaRegHeart className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div 
                className={`absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[1px]`}
              >
                <button 
                  className="bg-white text-gray-800 px-6 py-3 rounded-full flex items-center space-x-2 font-medium shadow-lg hover:bg-orange-500 hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewProduct(product);
                  }}
                >
                  <FaEye className="w-4 h-4 mr-2" />
                  <span>Quick View</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const ProductSkeleton = () => (
  <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-14">
        <div>
          <div className="w-64 h-9 bg-gray-200 rounded-md animate-pulse mb-2"></div>
          <div className="h-1.5 w-20 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="mt-4 w-96 h-5 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="w-40 h-12 bg-gray-200 rounded-full animate-pulse mt-6 sm:mt-0"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className="pb-[120%] relative bg-gray-200 animate-pulse"></div>
            <div className="p-6">
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-gray-200 rounded-full animate-pulse"></div>
                ))}
              </div>
              <div className="w-full h-5 bg-gray-200 rounded mb-3 animate-pulse"></div>
              <div className="w-1/3 h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="flex justify-between mt-4">
                <div className="w-24 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
); 