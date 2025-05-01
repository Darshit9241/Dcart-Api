import React, { useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoMdClose, IoMdGitCompare } from "react-icons/io";
import { FaShoppingBag, FaHeart, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaTicketAlt, FaHome } from "react-icons/fa";
import { FiPackage, FiUpload } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { MdDarkMode, MdLightMode, MdAdminPanelSettings } from "react-icons/md";
import { useTheme } from './ThemeContext';

const MobileSidebar = ({ 
  isOpen, 
  onClose, 
  profileImage, 
  triggerFileInput 
}) => {
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const { isDarkMode, toggleDarkMode, currentLanguage, changeLanguage, languages } = useTheme();
  const userEmail = localStorage.getItem("userEmail");
  const username = userEmail ? userEmail.split("@")[0] : null;

  // Get cart, wishlist and compare counts from Redux
  const cartItems = useSelector((state) => state.cart.items);
  const cartItemCount = cartItems.length;

  const wishlistItems = useSelector((state) => state.wishlist);
  const wishlistCount = wishlistItems.length;

  const compareItems = useSelector((state) => state.compare);
  const compareCount = compareItems.length;

  const handleLogInClick = () => {
    navigate("/login");
    onClose();
  };

  const handleSignInClick = () => {
    navigate("/sign-up");
    onClose();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("profileImage");
    navigate("/login");
    onClose();
    window.location.reload();
  };

  const navigateTo = (path) => {
    navigate(path);
    onClose();
  };

  const handleCartClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/cart");
    } else {
      navigate("/login");
    }
    onClose();
  };

  const handleWishList = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/WishList");
    } else {
      navigate("/login");
    }
    onClose();
  };

  const handleCompareList = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/compare");
    } else {
      navigate("/login");
    }
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-64 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'} shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className={`flex items-center justify-between p-4 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
            <Link to="/" className="flex items-center" onClick={onClose}>
              <span className="text-2xl font-bold text-[#FF7004] font-dcart tracking-wider">
                DCART
              </span>
            </Link>
            <button
              onClick={onClose}
              className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-orange-500'} focus:outline-none`}
            >
              <IoMdClose className="h-6 w-6" />
            </button>
          </div>

          {/* Dark Mode Toggle in Sidebar */}
          <div className={`p-4 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
            <button
              onClick={toggleDarkMode}
              className={`w-full flex items-center justify-between px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'} transition-colors duration-200`}
            >
              <span className="flex items-center">
                {isDarkMode ? <MdLightMode className="mr-2" /> : <MdDarkMode className="mr-2" />}
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </span>
              <span className={`flex h-6 w-11 items-center rounded-full ${isDarkMode ? 'bg-orange-600' : 'bg-gray-300'} px-1 transition-colors duration-300`}>
                <span className={`h-4 w-4 rounded-full bg-white transition-transform duration-300 ${isDarkMode ? 'translate-x-5' : ''}`}></span>
              </span>
            </button>
          </div>

          {/* Language Selector in Sidebar */}
          <div className={`p-4 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    currentLanguage === lang.code
                      ? (isDarkMode ? 'bg-orange-600 text-white' : 'bg-orange-500 text-white')
                      : (isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700')
                  } transition-colors duration-200`}
                >
                  <span className="mr-1">{lang.flag}</span>
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          {/* User Info */}
          {userEmail && (
            <div className={`p-4 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <div className="flex items-center">
                {/* Profile image */}
                <div
                  className={`relative w-12 h-12 rounded-full overflow-hidden border-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} cursor-pointer mr-3 group`}
                  onClick={triggerFileInput}
                >
                  {profileImage ? (
                    <>
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all duration-300">
                        <FiUpload className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </>
                  ) : (
                    <div className={`w-full h-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} flex items-center justify-center`}>
                      <CgProfile className={`${isDarkMode ? 'text-gray-400' : 'text-gray-400'} text-2xl`} />
                    </div>
                  )}
                </div>
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>Welcome!</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} truncate`}>{username}</p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>Tap image to change</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-4 space-y-1">
              <button
                onClick={() => navigateTo('/')}
                className={`w-full flex items-center gap-3 px-4 py-3 ${isDarkMode ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'} rounded-lg transition-colors duration-200`}
              >
                <FaHome className="text-lg" />
                <span>Home</span>
              </button>
              <button
                onClick={handleCartClick}
                className={`w-full flex items-center gap-3 px-4 py-3 ${isDarkMode ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'} rounded-lg transition-colors duration-200`}
              >
                <div className="relative">
                  <FaShoppingBag className="text-lg" />
                  {cartItemCount > 0 && localStorage.getItem("token") && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </div>
                <span>Cart</span>
              </button>

              <button
                onClick={handleWishList}
                className={`w-full flex items-center gap-3 px-4 py-3 ${isDarkMode ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'} rounded-lg transition-colors duration-200`}
              >
                <div className="relative">
                  <FaHeart className="text-lg" />
                  {wishlistCount > 0 && localStorage.getItem("token") && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </div>
                <span>Wishlist</span>
              </button>

              <button
                onClick={handleCompareList}
                className={`w-full flex items-center gap-3 px-4 py-3 ${isDarkMode ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'} rounded-lg transition-colors duration-200`}
              >
                <div className="relative">
                  <IoMdGitCompare className="text-lg" />
                  {compareCount > 0 && localStorage.getItem("token") && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {compareCount}
                    </span>
                  )}
                </div>
                <span>Compare</span>
              </button>

              <button
                onClick={() => navigateTo("/view-all-order")}
                className={`w-full flex items-center gap-3 px-4 py-3 ${isDarkMode ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'} rounded-lg transition-colors duration-200`}
              >
                <FiPackage className="text-lg" />
                <span>Orders</span>
              </button>

              {/* Admin Panel Link - Only visible for admin user */}
              {localStorage.getItem("userEmail") === "test1278@gmail.com" && (
                <button
                  onClick={() => navigateTo("/admin-dashboard")}
                  className={`w-full flex items-center gap-3 px-4 py-3 ${isDarkMode ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'} rounded-lg transition-colors duration-200`}
                >
                  <MdAdminPanelSettings className="text-lg" />
                  <span>Admin Panel</span>
                </button>
              )}

              <button
                onClick={() => navigateTo("/Coupon")}
                className={`w-full flex items-center gap-3 px-4 py-3 ${isDarkMode ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'} rounded-lg transition-colors duration-200`}
              >
                <FaTicketAlt className="text-lg" />
                <span>Coupons</span>
              </button>
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className={`p-4 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
            {userEmail ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors duration-200"
              >
                <FaSignOutAlt />
                <span>Log Out</span>
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={handleLogInClick}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors duration-200"
                >
                  <FaSignInAlt />
                  <span>Log In</span>
                </button>
                <button
                  onClick={handleSignInClick}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2 ${isDarkMode ? 'text-orange-400 bg-gray-800 hover:bg-gray-700' : 'text-orange-500 bg-orange-50 hover:bg-orange-100'} rounded-lg transition-colors duration-200`}
                >
                  <FaUserPlus />
                  <span>Sign Up</span>
                </button>
              </div>
            )}
          </div>

          {/* Admin Section */}
          {localStorage.getItem("userEmail") === "test1278@gmail.com" && (
            <div className={`p-4 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <button
                onClick={() => navigateTo('/addproduct')}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-white bg-[#2F333A] rounded-lg hover:bg-[#444848] transition-colors duration-200"
              >
                <span>Add Product</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileSidebar; 