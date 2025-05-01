import React from 'react';
import { FaShoppingBag, FaHeart } from "react-icons/fa";
import { IoMdGitCompare } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTheme } from './ThemeContext';

const QuickActions = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  
  // Get cart items count from Redux
  const cartItems = useSelector((state) => state.cart.items);
  const cartItemCount = cartItems.length;

  // Get wishlist items count from Redux
  const wishlistItems = useSelector((state) => state.wishlist);
  const wishlistCount = wishlistItems.length;

  // Get compare items count from Redux
  const compareItems = useSelector((state) => state.compare);
  const compareCount = compareItems.length;

  const handleCartClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/cart");
    } else {
      navigate("/login");
    }
  };

  const handleWishList = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/WishList");
    } else {
      navigate("/login");
    }
  };

  const handleCompareList = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/compare");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={handleCartClick}
        className="relative group"
      >
        <FaShoppingBag className={`text-2xl ${isDarkMode ? 'text-white group-hover:text-orange-400' : 'text-gray-700 group-hover:text-orange-500'} transition-colors duration-300`} />
        {cartItemCount > 0 && localStorage.getItem("token") && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {cartItemCount}
          </span>
        )}
      </button>
      <button
        onClick={handleWishList}
        className="relative group hidden sm:block"
      >
        <FaHeart className={`text-2xl ${isDarkMode ? 'text-white group-hover:text-orange-400' : 'text-gray-700 group-hover:text-orange-500'} transition-colors duration-300`} />
        {wishlistCount > 0 && localStorage.getItem("token") && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {wishlistCount}
          </span>
        )}
      </button>
      <button
        onClick={handleCompareList}
        className="relative group hidden sm:block"
      >
        <IoMdGitCompare className={`text-2xl ${isDarkMode ? 'text-white group-hover:text-orange-400' : 'text-gray-700 group-hover:text-orange-500'} transition-colors duration-300`} />
        {compareCount > 0 && localStorage.getItem("token") && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {compareCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default QuickActions; 