import React, { useState, useEffect, useRef } from "react";
import { CgProfile } from "react-icons/cg";
import { FaShoppingBag, FaHeart } from "react-icons/fa";
import { IoMdGitCompare } from "react-icons/io";
import { HiMenu } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FiPackage } from "react-icons/fi";
import { FaSignInAlt, FaUserPlus, FaSignOutAlt, FaTicketAlt, FaKey, FaCamera, FaMoon, FaSun, FaMicrophone, FaQrcode } from "react-icons/fa";
import { BiSearch } from "react-icons/bi";
import { IoNotificationsOutline } from "react-icons/io5";
import { IoEarth, IoChevronDown } from "react-icons/io5";
import { useQRCode } from 'next-qrcode';

// Add animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInLeft {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }
  .animate-slide-in-left {
    animation: slideInLeft 0.3s ease-out forwards;
  }
  
  /* Prevent body scrolling when mobile menu is open */
  body.mobile-menu-open {
    overflow: hidden;
    position: fixed;
    width: 100%;
    height: 100%;
  }
  
  /* Better scrollbar for mobile menu */
  .mobile-menu-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(200, 200, 200, 0.7) transparent;
    -webkit-overflow-scrolling: touch;
  }
  .mobile-menu-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  .mobile-menu-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .mobile-menu-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(200, 200, 200, 0.7);
    border-radius: 20px;
  }
  
  /* Better touch interactions for mobile menu buttons */
  .mobile-menu-btn {
    -webkit-tap-highlight-color: transparent;
  }
  .mobile-menu-btn:active {
    transform: scale(0.97);
  }
  
  /* Add a safe area at the bottom for iOS */
  @supports (padding-bottom: env(safe-area-inset-bottom)) {
    .mobile-menu-footer {
      padding-bottom: calc(1rem + env(safe-area-inset-bottom));
    }
  }
  
  /* Improved animation for mobile menu */
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
  }
  
  /* Search modal animation */
  @keyframes slideInUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  .animate-slide-in-up {
    animation: slideInUp 0.3s ease-out forwards;
  }
  
  /* Voice recording animation */
  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.8;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
  .animate-pulse {
    animation: pulse 1.5s infinite;
  }
  
  /* Dark mode styles */
  .dark {
    color-scheme: dark;
  }
  
  .dark body {
    background-color: #1a1a1a;
    color: #f3f4f6;
  }
  
  .dark .bg-white {
    background-color: #1a1a1a;
  }
  
  .dark .text-gray-700 {
    color: #d1d5db;
  }
  
  .dark .text-gray-500 {
    color: #9ca3af;
  }
  
  .dark .border-gray-100 {
    border-color: #374151;
  }
  
  .dark .border-gray-200 {
    border-color: #374151;
  }
  
  .dark .shadow-md {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
  }
`;
document.head.appendChild(style);

export default function Header() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [userPhoto, setUserPhoto] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Welcome to DCART! Explore our latest products.", read: false, time: new Date(Date.now() - 3600000).toISOString() },
    { id: 2, text: "New arrivals in electronics category. Check them out!", read: false, time: new Date(Date.now() - 86400000).toISOString() },
    { id: 3, text: "Limited time offer: 20% off on all fashion items.", read: true, time: new Date(Date.now() - 172800000).toISOString() }
  ]);
  
  // New states for modern features
  const [darkMode, setDarkMode] = useState(false);
  const [isVoiceSearchActive, setIsVoiceSearchActive] = useState(false);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularSearches] = useState(['laptops', 'smartphones', 'headphones', 'watches', 'cameras']);
  
  const profileMenuRef = useRef(null);
  const searchModalRef = useRef(null);
  const fileInputRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  const languageMenuRef = useRef(null);
  const qrScannerRef = useRef(null);
  const navigate = useNavigate();
  const { Canvas } = useQRCode();
  
  // For swipe gesture detection
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const cartItems = useSelector((state) => state.cart.items);
  const cartItemCount = cartItems.length;

  const wishlistItems = useSelector((state) => state.wishlist);
  const wishlistCount = wishlistItems.length;

  const compareItems = useSelector((state) => state.compare);
  const compareCount = compareItems.length;

  const userEmail = localStorage.getItem("userEmail");
  const username = userEmail ? userEmail.split("@")[0] : null;
  
  // Handle swipe gesture
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  
  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 100) {
      // Swiped left, close the menu
      setIsMobileMenuOpen(false);
    }
  };

  // Load user photo from localStorage
  useEffect(() => {
    const storedPhoto = localStorage.getItem("userPhoto");
    if (storedPhoto) {
      setUserPhoto(storedPhoto);
      console.log("Photo loaded from localStorage in Header");
    }
  }, [userEmail]);

  // Force header to update when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const storedPhoto = localStorage.getItem("userPhoto");
      if (storedPhoto) {
        setUserPhoto(storedPhoto);
      } else {
        setUserPhoto(null);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Available languages and currencies
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'zh', name: '中文' }
  ];

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' }
  ];

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const getUnreadCount = () => {
    return notifications.filter(notification => !notification.read).length;
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffHrs = diffMs / (1000 * 60 * 60);
    
    if (diffHrs < 1) {
      return 'Just now';
    } else if (diffHrs < 24) {
      return `${Math.floor(diffHrs)}h ago`;
    } else {
      return `${Math.floor(diffHrs / 24)}d ago`;
    }
  };

  const toggleLanguageMenu = () => {
    setIsLanguageMenuOpen(!isLanguageMenuOpen);
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    setIsLanguageMenuOpen(false);
    // Here you would implement actual language change logic
    // For example, dispatch an action to update app language
  };

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
    setIsLanguageMenuOpen(false);
    // Here you would implement actual currency change logic
    // For example, dispatch an action to update app currency
  };

  const handleClickOutside = (event) => {
    if (
      profileMenuRef.current &&
      !profileMenuRef.current.contains(event.target)
    ) {
      setIsProfileMenuOpen(false);
    }
    if (
      searchModalRef.current &&
      !searchModalRef.current.contains(event.target)
    ) {
      setIsSearchModalOpen(false);
    }
    if (
      notificationsRef.current &&
      !notificationsRef.current.contains(event.target)
    ) {
      setIsNotificationsOpen(false);
    }
    if (
      languageMenuRef.current &&
      !languageMenuRef.current.contains(event.target)
    ) {
      setIsLanguageMenuOpen(false);
    }
    // Close mobile menu when clicking outside
    if (
      isMobileMenuOpen &&
      mobileMenuRef.current && 
      !mobileMenuRef.current.contains(event.target)
    ) {
      // Don't close if clicking the menu button
      if (!event.target.closest('button[aria-label="toggle-mobile-menu"]')) {
        setIsMobileMenuOpen(false);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignInClick = () => {
    navigate("/sign-up");
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false)
  };

  const handleLogInClick = () => {
    navigate("/login");
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false)
  };

  const handleLogout = () => {
    // Clear all user data
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPhoto");
    
    // Clear local state
    setUserPhoto(null);
    
    // Trigger storage event for any other components
    window.dispatchEvent(new Event('storage'));
    
    // Close menus and navigate to login
    setIsProfileMenuOpen(false);
    navigate("/login");
    window.location.reload();
  };

  const handleWishList = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/WishList");
    } else {
      navigate("/login");
    }
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false)
  };

  const handleCompareList = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/compare");
    } else {
      navigate("/login");
    }
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false)
  };

  const handleCartClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/cart");
    } else {
      navigate("/login");
    }
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false)

  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleProfilePhotoClick = (e) => {
    if (userEmail) {
      e.stopPropagation(); // Prevent opening/closing the profile menu
      fileInputRef.current.click();
    } else {
      toggleProfileMenu();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const photoData = reader.result;
        // Save to localStorage
        localStorage.setItem("userPhoto", photoData);
        // Update state
        setUserPhoto(photoData);
        // Trigger storage event for other components
        window.dispatchEvent(new Event('storage'));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSearchModalOpen = () => {
    setIsSearchModalOpen(true);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      // Save search query to recent searches
      saveToRecentSearches(searchQuery.trim());
      
      // Mock search functionality - in a real app, this would call an API
      setTimeout(() => {
        setIsSearching(false);
        // Close the modal
        setIsSearchModalOpen(false);
        // Navigate to search results page with query parameter
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        // Reset search query
        setSearchQuery("");
      }, 500);
    }
  };

  // Prevent body scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }
    
    // Cleanup function
    return () => {
      document.body.classList.remove('mobile-menu-open');
    };
  }, [isMobileMenuOpen]);
  
  // Same for search modal
  useEffect(() => {
    if (isSearchModalOpen) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }
    
    return () => {
      document.body.classList.remove('mobile-menu-open');
    };
  }, [isSearchModalOpen]);

  // Load dark mode preference from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Update document class when dark mode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);
  
  // Voice search functionality
  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice search is not supported in your browser');
      return;
    }
    
    setIsVoiceSearchActive(true);
    
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
      // Show feedback that voice recognition is active
    };
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      // Auto-search after voice input
      setTimeout(() => {
        setIsVoiceSearchActive(false);
        handleSearch({ preventDefault: () => {} });
      }, 500);
    };
    
    recognition.onerror = (event) => {
      setIsVoiceSearchActive(false);
      console.error('Speech recognition error', event.error);
    };
    
    recognition.onend = () => {
      setIsVoiceSearchActive(false);
    };
    
    recognition.start();
  };
  
  // QR code scanner handler
  const handleQrScanner = () => {
    setIsQrScannerOpen(true);
    // In a real implementation, we would use the device camera to scan QR codes
    // For demo purposes, we'll just show a modal that simulates scanning
  };
  
  const handleQrResult = (result) => {
    setIsQrScannerOpen(false);
    // If result is a URL, navigate to it
    if (result && result.startsWith('http')) {
      window.open(result, '_blank');
    } else if (result) {
      // If it's a product ID or other data, handle appropriately
      setSearchQuery(result);
      handleSearch({ preventDefault: () => {} });
    }
  };
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  // Save search to recent searches
  const saveToRecentSearches = (query) => {
    if (!query) return;
    
    const searches = [...recentSearches];
    // Remove if already exists
    const existingIndex = searches.findIndex(s => s === query);
    if (existingIndex !== -1) {
      searches.splice(existingIndex, 1);
    }
    // Add to beginning of array
    searches.unshift(query);
    // Keep only the most recent 5 searches
    setRecentSearches(searches.slice(0, 5));
    // Save to localStorage
    localStorage.setItem('recentSearches', JSON.stringify(searches.slice(0, 5)));
  };
  
  // Load recent searches from localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      try {
        const parsedSearches = JSON.parse(savedSearches);
        setRecentSearches(parsedSearches);
      } catch (e) {
        console.error('Failed to parse recent searches', e);
      }
    }
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bg-white py-3 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Mobile menu button - Now on the left */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-orange-500 focus:outline-none p-2 -m-2 mobile-menu-btn"
                aria-label="toggle-mobile-menu"
              >
                {isMobileMenuOpen ? (
                  <IoMdClose className="h-6 w-6" />
                ) : (
                  <HiMenu className="h-6 w-6" />
                )}
              </button>
            </div>

            {/* Logo - Moved to the right on mobile */}
            <Link to="/" className="flex items-center order-last md:order-first">
              <span className="text-2xl md:text-3xl font-bold text-[#FF7004] font-dcart tracking-wider hover:text-orange-600 transition-colors duration-300">
                DCART
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {/* Language/Currency Selector */}
              <div className="relative" ref={languageMenuRef}>
                <button
                  onClick={toggleLanguageMenu}
                  className="flex items-center space-x-1 text-gray-700 hover:text-orange-500 transition-colors duration-300"
                >
                  <IoEarth className="text-lg" />
                  <span className="text-sm font-medium">{selectedLanguage} / {selectedCurrency}</span>
                  <IoChevronDown className={`text-xs transition-transform duration-200 ${isLanguageMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isLanguageMenuOpen && (
                  <div className="absolute left-0 mt-3 w-64 bg-white border border-gray-100 rounded-xl shadow-xl z-50 animate-fadeIn">
                    <div className="py-2 px-4 border-b border-gray-100">
                      <h3 className="text-sm font-medium text-gray-500">Select Language</h3>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {languages.map(language => (
                          <button
                            key={language.code}
                            className={`text-left px-3 py-1.5 text-sm rounded hover:bg-orange-50 ${selectedLanguage === language.name ? 'bg-orange-100 text-orange-700 font-medium' : 'text-gray-700'}`}
                            onClick={() => handleLanguageChange(language.name)}
                          >
                            {language.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="py-2 px-4">
                      <h3 className="text-sm font-medium text-gray-500">Select Currency</h3>
                      <div className="mt-2 space-y-1">
                        {currencies.map(currency => (
                          <button
                            key={currency.code}
                            className={`w-full text-left px-3 py-1.5 text-sm rounded hover:bg-orange-50 ${selectedCurrency === currency.code ? 'bg-orange-100 text-orange-700 font-medium' : 'text-gray-700'}`}
                            onClick={() => handleCurrencyChange(currency.code)}
                          >
                            <span className="inline-block w-8">{currency.symbol}</span>
                            {currency.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-6 items-center">
                {/* Search Button */}
                <button
                  onClick={handleSearchModalOpen}
                  className="group"
                >
                  <BiSearch className="text-2xl text-gray-700 group-hover:text-orange-500 transition-colors duration-300 dark:text-gray-300" />
                </button>

                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className="group"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? (
                    <FaSun className="text-2xl text-gray-700 group-hover:text-orange-500 transition-colors duration-300 dark:text-gray-300" />
                  ) : (
                    <FaMoon className="text-2xl text-gray-700 group-hover:text-orange-500 transition-colors duration-300" />
                  )}
                </button>

                {/* QR Scanner Button */}
                <button
                  onClick={handleQrScanner}
                  className="group"
                >
                  <FaQrcode className="text-2xl text-gray-700 group-hover:text-orange-500 transition-colors duration-300 dark:text-gray-300" />
                </button>

                {/* Notifications */}
                <div className="relative" ref={notificationsRef}>
                  <button
                    onClick={toggleNotifications}
                    className="relative group"
                  >
                    <IoNotificationsOutline className="text-2xl text-gray-700 group-hover:text-orange-500 transition-colors duration-300" />
                    {getUnreadCount() > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                        {getUnreadCount()}
                      </span>
                    )}
                  </button>
                  
                  {isNotificationsOpen && (
                    <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-100 rounded-xl shadow-xl z-50 animate-fadeIn max-h-96 overflow-hidden flex flex-col">
                      <div className="py-2 px-4 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-medium text-gray-900">Notifications</h3>
                        {getUnreadCount() > 0 && (
                          <button 
                            onClick={markAllAsRead}
                            className="text-xs text-orange-500 hover:text-orange-600 font-medium"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                      
                      <div className="overflow-y-auto flex-grow">
                        {notifications.length > 0 ? (
                          notifications.map(notification => (
                            <div 
                              key={notification.id}
                              className={`p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.read ? 'bg-orange-50' : ''}`}
                              onClick={() => markAsRead(notification.id)}
                            >
                              <div className="flex items-start">
                                {!notification.read && (
                                  <div className="h-2 w-2 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                                )}
                                <div className={`flex-grow ${!notification.read ? 'pl-1' : 'pl-4'}`}>
                                  <p className="text-sm text-gray-700">{notification.text}</p>
                                  <p className="text-xs text-gray-500 mt-1">{formatTime(notification.time)}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-gray-500">No notifications</div>
                        )}
                      </div>
                      
                      <div className="p-2 border-t border-gray-100 text-center">
                        <button 
                          onClick={() => {
                            navigate("/notifications");
                            setIsNotificationsOpen(false);
                          }}
                          className="text-sm text-orange-500 hover:text-orange-600 font-medium py-1"
                        >
                          View all notifications
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile */}
                <div className="relative" ref={profileMenuRef}>
                  <button
                    className="flex items-center space-x-1 group"
                    onClick={toggleProfileMenu}
                  >
                    {(userPhoto || localStorage.getItem("userPhoto")) && userEmail ? (
                      <div 
                        className="w-8 h-8 rounded-full overflow-hidden relative group cursor-pointer"
                        onClick={handleProfilePhotoClick}
                      >
                        <img 
                          src={userPhoto || localStorage.getItem("userPhoto")} 
                          alt="User" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error("Error loading user photo");
                            e.target.src = "https://via.placeholder.com/40"; // Fallback image
                          }}
                        />
                        {userEmail && (
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100">
                            <FaCamera className="text-white text-lg" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <CgProfile className="text-2xl text-gray-700 group-hover:text-orange-500 transition-colors duration-300" />
                    )}
                  </button>

                  {/* Hidden file input */}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="hidden" 
                  />

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-xl shadow-xl z-50 animate-fadeIn">
                      <div className="py-2">
                        {userEmail && (
                          <div className="px-4 py-3 border-b border-gray-100 flex items-center space-x-3">
                            <div 
                              className="w-10 h-10 rounded-full overflow-hidden relative group cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                fileInputRef.current.click();
                              }}
                            >
                              {(userPhoto || localStorage.getItem("userPhoto")) ? (
                                <>
                                  <img 
                                    src={userPhoto || localStorage.getItem("userPhoto")} 
                                    alt="User" 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.src = "https://via.placeholder.com/40";
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100">
                                    <FaCamera className="text-white text-lg" />
                                  </div>
                                </>
                              ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                  <FaCamera className="text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">Welcome To Dcart!</p>
                              <p className="text-sm text-gray-600 truncate">{username}</p>
                            </div>
                          </div>
                        )}
                        <div className="px-2 py-2 space-y-1">
                          <button
                            onClick={handleSignInClick}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-md transition-colors duration-200"
                          >
                            <FaUserPlus /> Sign Up
                          </button>

                          <button
                            onClick={handleLogInClick}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-md transition-colors duration-200"
                          >
                            <FaSignInAlt /> Log In
                          </button>

                          <button
                            onClick={handleForgotPassword}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-md transition-colors duration-200"
                          >
                            <FaKey /> Forgot Password
                          </button>

                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-md transition-colors duration-200"
                          >
                            <FaSignOutAlt /> Log Out
                          </button>

                          <button
                            onClick={() => navigate("/Coupon")}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-md transition-colors duration-200"
                          >
                            <FaTicketAlt /> Coupon
                          </button>

                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cart */}
                <button
                  onClick={handleCartClick}
                  className="relative group"
                >
                  <FaShoppingBag className="text-2xl text-gray-700 group-hover:text-orange-500 transition-colors duration-300" />
                  {cartItemCount > 0 && localStorage.getItem("token") && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {cartItemCount}
                    </span>
                  )}
                </button>

                {/* Wishlist */}
                <button
                  onClick={handleWishList}
                  className="relative group"
                >
                  <FaHeart className="text-2xl text-gray-700 group-hover:text-orange-500 transition-colors duration-300" />
                  {wishlistCount > 0 && localStorage.getItem("token") && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {wishlistCount}
                    </span>
                  )}
                </button>

                {/* Compare */}
                <button
                  onClick={handleCompareList}
                  className="relative group"
                >
                  <IoMdGitCompare className="text-2xl text-gray-700 group-hover:text-orange-500 transition-colors duration-300" />
                  {compareCount > 0 && localStorage.getItem("token") && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {compareCount}
                    </span>
                  )}
                </button>

                {/* Orders */}
                <button
                  onClick={() => navigate("/view-all-order")}
                  className="group"
                >
                  <FiPackage className="text-2xl text-gray-700 group-hover:text-orange-500 transition-colors duration-300" />
                </button>

                {/* Admin Product Add Button */}
                {localStorage.getItem("userEmail") === "test1278@gmail.com" && (
                  <button
                    onClick={() => navigate(`/addproduct`)}
                    className="px-4 py-2 bg-[#2F333A] text-white text-sm font-semibold rounded-lg shadow-md hover:bg-[#444848] transition-all duration-300 transform hover:scale-105"
                  >
                    Add Product
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden animate-fadeIn" onClick={handleClickOutside}>
            <div 
              ref={mobileMenuRef}
              className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out animate-slide-in-left flex flex-col"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '85%' }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Mobile Menu Header - Fixed */}
              <div className="sticky top-0 z-10 bg-white">
                {/* Mobile Menu Header with logo and close button */}
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center">
                    <span className="text-2xl font-bold text-[#FF7004] font-dcart tracking-wider">DCART</span>
                  </Link>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 mobile-menu-btn"
                  >
                    <IoMdClose className="h-6 w-6" />
                  </button>
                </div>

                {/* User Profile Section - if logged in */}
                {userEmail && (
                  <div className="px-4 py-4 bg-gradient-to-r from-orange-50 to-white border-b border-gray-100">
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-14 h-14 rounded-full overflow-hidden relative group cursor-pointer shadow-sm border-2 border-white mobile-menu-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current.click();
                        }}
                      >
                        {(userPhoto || localStorage.getItem("userPhoto")) ? (
                          <>
                            <img 
                              src={userPhoto || localStorage.getItem("userPhoto")} 
                              alt="User" 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/40";
                              }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100">
                              <FaCamera className="text-white text-lg" />
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <FaCamera className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Welcome To Dcart!</p>
                        <p className="text-base font-semibold text-[#FF7004] truncate">{username}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Main menu items - Scrollable */}
              <div className="flex-grow overflow-y-auto py-2 px-2 mobile-menu-scrollbar overscroll-contain">
                <div className="space-y-1">
                  {/* Language/Currency Selector for Mobile */}
                  <div className="p-3 border-b border-gray-100">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Language & Currency</h3>
                    </div>
                    
                    <div className="flex space-x-2">
                      <select 
                        value={selectedLanguage}
                        onChange={(e) => handleLanguageChange(e.target.value)}
                        className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        {languages.map(language => (
                          <option key={language.code} value={language.name}>
                            {language.name}
                          </option>
                        ))}
                      </select>
                      
                      <select 
                        value={selectedCurrency}
                        onChange={(e) => handleCurrencyChange(e.target.value)}
                        className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        {currencies.map(currency => (
                          <option key={currency.code} value={currency.code}>
                            {currency.symbol} {currency.code}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="grid grid-cols-3 gap-2 p-2 mb-3">
                    <button
                      onClick={handleCartClick}
                      className="flex flex-col items-center justify-center p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors mobile-menu-btn"
                    >
                      <div className="relative">
                        <FaShoppingBag className="text-xl text-gray-700 dark:text-gray-300 mb-1" />
                        {cartItemCount > 0 && localStorage.getItem("token") && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {cartItemCount}
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-medium dark:text-gray-300">Cart</span>
                    </button>
                    
                    <button
                      onClick={handleWishList}
                      className="flex flex-col items-center justify-center p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors mobile-menu-btn"
                    >
                      <div className="relative">
                        <FaHeart className="text-xl text-gray-700 dark:text-gray-300 mb-1" />
                        {wishlistCount > 0 && localStorage.getItem("token") && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {wishlistCount}
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-medium dark:text-gray-300">Wishlist</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsNotificationsOpen(!isNotificationsOpen);
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex flex-col items-center justify-center p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors mobile-menu-btn"
                    >
                      <div className="relative">
                        <IoNotificationsOutline className="text-xl text-gray-700 dark:text-gray-300 mb-1" />
                        {getUnreadCount() > 0 && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                            {getUnreadCount()}
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-medium dark:text-gray-300">Alerts</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 p-2 mb-4">
                    <button
                      onClick={handleCompareList}
                      className="flex flex-col items-center justify-center p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors mobile-menu-btn"
                    >
                      <div className="relative">
                        <IoMdGitCompare className="text-xl text-gray-700 dark:text-gray-300 mb-1" />
                        {compareCount > 0 && localStorage.getItem("token") && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {compareCount}
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-medium dark:text-gray-300">Compare</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        navigate("/view-all-order");
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex flex-col items-center justify-center p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors mobile-menu-btn"
                    >
                      <FiPackage className="text-xl text-gray-700 dark:text-gray-300 mb-1" />
                      <span className="text-sm font-medium dark:text-gray-300">Orders</span>
                    </button>
                    
                    <button
                      onClick={toggleDarkMode}
                      className="flex flex-col items-center justify-center p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors mobile-menu-btn"
                    >
                      {darkMode ? (
                        <>
                          <FaSun className="text-xl text-gray-700 dark:text-gray-300 mb-1" />
                          <span className="text-sm font-medium dark:text-gray-300">Light</span>
                        </>
                      ) : (
                        <>
                          <FaMoon className="text-xl text-gray-700 dark:text-gray-300 mb-1" />
                          <span className="text-sm font-medium dark:text-gray-300">Dark</span>
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 p-2 mb-4">
                    <button
                      onClick={() => {
                        handleQrScanner();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex flex-col items-center justify-center p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors mobile-menu-btn"
                    >
                      <FaQrcode className="text-xl text-gray-700 dark:text-gray-300 mb-1" />
                      <span className="text-sm font-medium dark:text-gray-300">QR Scan</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setIsSearchModalOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex flex-col items-center justify-center p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors mobile-menu-btn"
                    >
                      <BiSearch className="text-xl text-gray-700 dark:text-gray-300 mb-1" />
                      <span className="text-sm font-medium dark:text-gray-300">Search</span>
                    </button>
                  </div>
                  
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Account
                  </div>

                  {!userEmail ? (
                    <>
                      <button
                        onClick={handleSignInClick}
                        className="w-full flex items-center gap-3 p-4 text-gray-700 hover:bg-orange-50 rounded-xl mobile-menu-btn"
                      >
                        <FaUserPlus className="text-lg text-gray-500" />
                        <span className="font-medium">Sign Up</span>
                      </button>

                      <button
                        onClick={handleLogInClick}
                        className="w-full flex items-center gap-3 p-4 text-gray-700 hover:bg-orange-50 rounded-xl mobile-menu-btn"
                      >
                        <FaSignInAlt className="text-lg text-gray-500" />
                        <span className="font-medium">Log In</span>
                      </button>

                      <button
                        onClick={handleForgotPassword}
                        className="w-full flex items-center gap-3 p-4 text-gray-700 hover:bg-orange-50 rounded-xl mobile-menu-btn"
                      >
                        <FaKey className="text-lg text-gray-500" />
                        <span className="font-medium">Forgot Password</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 p-4 text-gray-700 hover:bg-orange-50 rounded-xl mobile-menu-btn"
                    >
                      <FaSignOutAlt className="text-lg text-gray-500" />
                      <span className="font-medium">Log Out</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      navigate("/Coupon");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-4 text-gray-700 hover:bg-orange-50 rounded-xl mobile-menu-btn"
                  >
                    <FaTicketAlt className="text-lg text-gray-500" />
                    <span className="font-medium">Coupon</span>
                  </button>
                  
                  {/* Add padding to ensure content scrolls properly on all screen sizes */}
                  <div className="h-16"></div>
                </div>
              </div>
              
              {/* Admin section if admin user - Fixed at the bottom */}
              {localStorage.getItem("userEmail") === "test1278@gmail.com" && (
                <div className="sticky bottom-0 p-4 border-t border-gray-200 bg-white z-10 mobile-menu-footer shadow-inner">
                  <button
                    onClick={() => {
                      navigate("/addproduct");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 p-3 bg-[#2F333A] text-white rounded-xl hover:bg-[#444848] transition-all mobile-menu-btn"
                  >
                    <span className="font-medium">Add Product</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Search Modal */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 animate-fadeIn">
          <div 
            ref={searchModalRef} 
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-11/12 max-w-lg mx-4 animate-slide-in-up"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Search Products</h2>
              <button
                onClick={() => setIsSearchModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200 p-2 -m-2 mobile-menu-btn"
              >
                <IoMdClose className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <div className="absolute right-3 top-3 flex items-center space-x-2">
                {/* Voice Search Button */}
                <button 
                  type="button"
                  onClick={handleVoiceSearch}
                  className={`text-gray-500 hover:text-orange-500 dark:text-gray-300 dark:hover:text-orange-400 ${isVoiceSearchActive ? 'text-red-500 animate-pulse' : ''}`}
                >
                  <FaMicrophone className="h-5 w-5" />
                </button>
                
                {/* Search Button */}
                <button 
                  type="submit"
                  className="text-gray-500 hover:text-orange-500 dark:text-gray-300 dark:hover:text-orange-400"
                >
                  {isSearching ? (
                    <div className="h-6 w-6 border-2 border-t-orange-500 border-gray-200 rounded-full animate-spin" />
                  ) : (
                    <BiSearch className="h-6 w-6" />
                  )}
                </button>
              </div>
            </form>
            
            {/* Recent & Popular Searches */}
            <div className="mt-5 space-y-4">
              {recentSearches.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Recent Searches</h3>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term, index) => (
                      <button
                        key={`recent-${index}`}
                        className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm hover:bg-orange-100 dark:hover:bg-orange-900 transition-colors"
                        onClick={() => {
                          setSearchQuery(term);
                          handleSearch({ preventDefault: () => {} });
                        }}
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Popular Searches</h3>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term, index) => (
                    <button
                      key={`popular-${index}`}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm hover:bg-orange-100 dark:hover:bg-orange-900 transition-colors"
                      onClick={() => {
                        setSearchQuery(term);
                        handleSearch({ preventDefault: () => {} });
                      }}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {searchResults.length > 0 && (
              <div className="mt-4 max-h-60 overflow-y-auto border-t border-gray-100 dark:border-gray-700 pt-2 mobile-menu-scrollbar">
                {searchResults.map((item, index) => (
                  <div 
                    key={index} 
                    className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md cursor-pointer mobile-menu-btn"
                    onClick={() => {
                      setIsSearchModalOpen(false);
                      navigate(`/product/${item.id}`);
                    }}
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-600 rounded-md mr-3 flex-shrink-0">
                        {item.image && <img src={item.image} alt={item.name} className="object-cover w-full h-full rounded-md" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">${item.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* QR Scanner Modal */}
      {isQrScannerOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 animate-fadeIn">
          <div 
            ref={qrScannerRef} 
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-11/12 max-w-md mx-4 animate-slide-in-up"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Scan QR Code</h2>
              <button
                onClick={() => setIsQrScannerOpen(false)}
                className="text-gray-400 hover:text-gray-500 dark:text-gray-300 p-2 -m-2 mobile-menu-btn"
              >
                <IoMdClose className="h-6 w-6" />
              </button>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="mb-5 border-2 border-dashed border-gray-300 dark:border-gray-600 p-3 rounded-lg">
                {/* Placeholder for camera view - in a real app this would use the device camera */}
                <div className="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                  <div className="text-center p-4">
                    <FaQrcode className="text-4xl mx-auto mb-3 text-gray-500 dark:text-gray-400" />
                    <p className="text-gray-500 dark:text-gray-400 mb-2">Point your camera at a QR code</p>
                    <button 
                      className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                      onClick={() => {
                        // For demo, simulate a scan result after a delay
                        setTimeout(() => {
                          handleQrResult("https://example.com/product/12345");
                        }, 1500);
                      }}
                    >
                      Simulate Scan
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="text-center w-full">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Share your cart with friends</p>
                <div className="bg-white p-3 rounded-lg inline-block">
                  <Canvas
                    text={"https://dcart.store/shared-cart/" + (localStorage.getItem("userEmail") || "guest")}
                    options={{
                      level: 'M',
                      margin: 3,
                      scale: 4,
                      width: 200,
                      color: {
                        dark: '#000',
                        light: '#FFF',
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
