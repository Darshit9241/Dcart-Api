import React, { createContext, useState, useContext, useEffect } from "react";

// Create context
const AdminThemeContext = createContext();

export const useAdminTheme = () => useContext(AdminThemeContext);

export const AdminThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize from localStorage on component mount
  useEffect(() => {
    // Dark mode
    const savedDarkMode = localStorage.getItem("adminDarkMode") === "true";
    setIsDarkMode(savedDarkMode);
    
    // Apply dark mode class to body for admin pages
    if (savedDarkMode) {
      document.body.classList.add('admin-dark-mode');
    } else {
      document.body.classList.remove('admin-dark-mode');
    }
  }, []);

  // Toggle dark mode
  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem("adminDarkMode", newDarkMode.toString());

    if (newDarkMode) {
      document.body.classList.add('admin-dark-mode');
    } else {
      document.body.classList.remove('admin-dark-mode');
    }
  };

  // Context value
  const value = {
    isDarkMode,
    toggleTheme
  };

  return (
    <AdminThemeContext.Provider value={value}>
      {children}
    </AdminThemeContext.Provider>
  );
};

export default AdminThemeContext; 