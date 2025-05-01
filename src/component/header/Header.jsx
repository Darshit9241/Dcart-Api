import React, { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { HiMenu } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";
import MobileSidebar from "./MobileSidebar";
import SearchBar from "./SearchBar";
import QuickActions from "./QuickActions";
import { useTheme, ThemeProvider } from "./ThemeContext";
import { currencies } from '../../utils/currencyUtils';
import { setCurrency } from '../../redux/currencySlice';
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { MdAdminPanelSettings } from "react-icons/md";

const HeaderContent = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isRecentlyViewedOpen, setIsRecentlyViewedOpen] = useState(false);
  const dispatch = useDispatch();
  const currentCurrency = useSelector((state) => state.currency.currentCurrency);
  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);

  const profileMenuRef = useRef(null);
  const sidebarRef = useRef(null);
  const fileInputRef = useRef(null);
  const categoryMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  const languageMenuRef = useRef(null);
  const recentlyViewedRef = useRef(null);
  const currencyMenuRef = useRef(null);
  const navigate = useNavigate();

  // Check for saved profile image on component mount
  useEffect(() => {
    const savedProfileImage = localStorage.getItem("profileImage");
    if (savedProfileImage) {
      setProfileImage(savedProfileImage);
    }
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Toggle sidebar when mobile menu button is clicked
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Toggle profile menu when profile button is clicked
  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  // Toggle search bar
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  // Handle file input change for profile image upload
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageDataUrl = event.target.result;
        setProfileImage(imageDataUrl);
        localStorage.setItem("profileImage", imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Prevent scrolling when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }

    return () => {
      document.body.style.overflow = 'visible';
    };
  }, [isSidebarOpen]);

  const navigateTo = (path) => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  const handleClickOutside = (event) => {
    if (
      profileMenuRef.current &&
      !profileMenuRef.current.contains(event.target) &&
      !event.target.closest('[data-profile-button]')
    ) {
      setIsProfileMenuOpen(false);
    }

    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target) &&
      !event.target.closest('[data-menu-button]')
    ) {
      setIsSidebarOpen(false);
    }

    if (
      categoryMenuRef.current &&
      !categoryMenuRef.current.contains(event.target) &&
      !event.target.closest('[data-category-button]')
    ) {
      setIsCategoryMenuOpen(false);
    }

    if (
      notificationsRef.current &&
      !notificationsRef.current.contains(event.target) &&
      !event.target.closest('[data-notifications-button]')
    ) {
      setIsNotificationsOpen(false);
    }

    if (
      languageMenuRef.current &&
      !languageMenuRef.current.contains(event.target) &&
      !event.target.closest('[data-language-button]')
    ) {
      setIsLanguageMenuOpen(false);
    }

    if (
      recentlyViewedRef.current &&
      !recentlyViewedRef.current.contains(event.target) &&
      !event.target.closest('[data-recently-viewed-button]')
    ) {
      setIsRecentlyViewedOpen(false);
    }

    // Close currency menu if clicked outside
    if (
      currencyMenuRef.current &&
      !currencyMenuRef.current.contains(event.target) &&
      !event.target.closest('[data-currency-button]')
    ) {
      setIsCurrencyMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Currency toggle
  const toggleCurrencyMenu = () => {
    setIsCurrencyMenuOpen(!isCurrencyMenuOpen);
  };

  const changeCurrency = (currencyCode) => {
    dispatch(setCurrency(currencyCode));
    setIsCurrencyMenuOpen(false);
  };

  return (
    <>
      {/* Hidden file input for profile image upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        style={{ display: "none" }}
        accept="image/*"
      />

      {/* Mobile Sidebar Component */}
      <MobileSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        profileImage={profileImage}
        triggerFileInput={triggerFileInput}
      />

      {/* Top Bar */}
      <div className={`fixed top-0 left-0 right-0 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} py-[10px] z-30 shadow-md transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            {/* <div className="md:hidden">
              <button
                data-menu-button
                onClick={toggleSidebar}
                className={`${isDarkMode ? 'text-white hover:text-orange-400' : 'text-gray-700 hover:text-orange-500'} focus:outline-none transition-colors duration-300`}
              >
                <HiMenu className="text-2xl" />
              </button>
            </div> */}

            {/* Logo */}
            <div className="flex-none">
              <Link to="/" className="flex items-center">
                <span className={`text-2xl md:text-3xl font-bold text-[#FF7004] font-dcart tracking-wider hover:text-orange-600 transition-colors duration-300`}>
                  DCART
                </span>
              </Link>
            </div>

            {/* Right: Quick Actions */}
            <div className="flex justify-end space-x-3 md:space-x-4 items-center">
              {/* Search Button */}
              <button
                onClick={toggleSearch}
                className={`${isDarkMode ? 'text-white hover:text-orange-400' : 'text-gray-700 hover:text-orange-500'} focus:outline-none transition-colors duration-300`}
              >
                <FaSearch className="text-xl" />
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`${isDarkMode ? 'text-white hover:text-orange-400' : 'text-gray-700 hover:text-orange-500'} hidden sm:block focus:outline-none transition-colors duration-300`}
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? <MdLightMode className="text-xl" /> : <MdDarkMode className="text-xl" />}
              </button>

              {/* Currency Menu */}
              {localStorage.getItem("userEmail") === "test1278@gmail.com" && (
                <div className="relative" ref={currencyMenuRef}>
                  <button
                    onClick={toggleCurrencyMenu}
                    className={`${isDarkMode ? 'text-white hover:text-orange-400' : 'text-gray-700 hover:text-orange-500'} flex items-center space-x-1 focus:outline-none transition-colors duration-300`}
                    aria-label="Toggle currency menu"
                  >
                    <span className="text-sm font-medium">
                      {currencies.find(c => c.code === currentCurrency)?.symbol || '$'}
                    </span>
                    <span className="text-xs">{currentCurrency}</span>
                  </button>

                  {isCurrencyMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 scrollbar-hidden">
                      <div className="py-1 max-h-60 overflow-y-auto scrollbar-hidden">
                        {currencies.map(currency => (
                          <button
                            key={currency.code}
                            onClick={() => changeCurrency(currency.code)}
                            className={`w-full text-left px-4 py-2 text-sm ${currentCurrency === currency.code
                              ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                              }`}
                            aria-label={`Change currency to ${currency.name}`}
                          >
                            <span className="inline-block w-8">{currency.symbol}</span>
                            {currency.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Language Menu Component */}
              {/* <LanguageMenu /> */}

              {/* Quick Actions Component (Cart, Wishlist, Compare) */}
              <QuickActions /> 

              {/* Profile Menu Component */}
              <ProfileMenu
                ref={profileMenuRef}
                isOpen={isProfileMenuOpen}
                toggleMenu={toggleProfileMenu}
                profileImage={profileImage}
                triggerFileInput={triggerFileInput}
              />
              <div className="md:hidden">
                <button
                  data-menu-button
                  onClick={toggleSidebar}
                  className={`${isDarkMode ? 'text-white hover:text-orange-400' : 'text-gray-700 hover:text-orange-500'} focus:outline-none transition-colors duration-300`}
                >
                  <HiMenu className="text-2xl" />
                </button>
              </div>
              <div className="justify-center items-center hidden sm:block">
                {localStorage.getItem("userEmail") === "test1278@gmail.com" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigateTo('/admin-login')}
                      className="w-[150px] flex items-center justify-center gap-2 px-4 py-2 text-white bg-[#FF7004] rounded-lg hover:bg-orange-600 transition-colors duration-200"
                    >
                      <MdAdminPanelSettings className="text-xl" />
                      <span>Admin Panel</span>
                    </button>
                    <button
                      onClick={() => navigateTo('/addproduct')}
                      className="w-[150px] flex items-center justify-center gap-2 px-4 py-2 text-white bg-[#2F333A] rounded-lg hover:bg-[#444848] transition-colors duration-200"
                    >
                      <span>Add Product</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search Bar Component */}
          <SearchBar
            isOpen={isSearchOpen}
            toggleSearch={toggleSearch}
          />
        </div>
      </div>
    </>
  );
};

// Wrap with ThemeProvider to provide context
const Header = () => {
  return (
    <ThemeProvider>
      <HeaderContent />
    </ThemeProvider>
  );
};

export default Header;
