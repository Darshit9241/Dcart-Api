import React, { useRef } from 'react';
import { CgProfile } from "react-icons/cg";
import { FaSignInAlt, FaUserPlus, FaSignOutAlt, FaTicketAlt, FaCamera } from "react-icons/fa";
import { FiPackage } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
// import { useTheme } from './ThemeContext';

const ProfileMenu = ({ 
  isOpen, 
  toggleMenu, 
  profileImage, 
  triggerFileInput 
}) => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail");
  const username = userEmail ? userEmail.split("@")[0] : null;
  // const { isDarkMode } = useTheme();
  const menuRef = useRef(null);

  const handleSignInClick = () => {
    navigate("/sign-up");
    toggleMenu();
  };

  const handleLogInClick = () => {
    navigate("/login");
    toggleMenu();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("profileImage");
    navigate("/login");
    toggleMenu();
    window.location.reload();
  };

  const navigateTo = (path) => {
    navigate(path);
    toggleMenu();
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="flex items-center space-x-1 group"
        onClick={toggleMenu}
      >
        {profileImage ? (
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200 hover:border-orange-500 transition-colors duration-300">
            <img
              src={profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <CgProfile className="text-2xl text-gray-700 group-hover:text-orange-500 transition-colors duration-300" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-xl shadow-xl z-50 animate-fadeIn">
          <div className="py-2">
            {userEmail && (
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">Welcome back!</p>
                <p className="text-sm text-gray-600 truncate">{username}</p>

                {/* Profile Image */}
                <div className="mt-3 flex items-center justify-center">
                  <div
                    className="group relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 cursor-pointer"
                    onClick={triggerFileInput}
                  >
                    {profileImage ? (
                      <>
                        <img
                          src={profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all duration-300">
                          <FaCamera className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <FaCamera className="text-gray-400 text-xl" />
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-xs text-center mt-1 text-gray-500">Click to change</p>
              </div>
            )}
            <div className="px-2 py-2 space-y-1">
              {!userEmail ? (
                <>
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
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-md transition-colors duration-200"
                >
                  <FaSignOutAlt /> Log Out
                </button>
              )}
              <button
                onClick={() => navigateTo("/View-all-order")}
                className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-md transition-colors duration-200"
              >
                <FiPackage /> Orders
              </button>
              <button
                onClick={() => navigateTo("/Coupon")}
                className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-md transition-colors duration-200"
              >
                <FaTicketAlt /> Coupon
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu; 