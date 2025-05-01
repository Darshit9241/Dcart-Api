import React, { useRef } from 'react';
import { MdLanguage } from "react-icons/md";
import { useTheme } from './ThemeContext';

const LanguageMenu = () => {
  const { isDarkMode, currentLanguage, changeLanguage, languages } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative hidden sm:block" ref={menuRef}>
      <button
        data-language-button
        onClick={toggleMenu}
        className={`${isDarkMode ? 'text-white hover:text-orange-400' : 'text-gray-700 hover:text-orange-500'} focus:outline-none transition-colors duration-300 flex items-center`}
      >
        <MdLanguage className="text-xl" />
      </button>

      {isOpen && (
        <div className={`absolute right-0 mt-3 w-48 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border rounded-lg shadow-xl z-50 animate-fadeIn`}>
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  changeLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center px-4 py-2 ${currentLanguage === lang.code ? (isDarkMode ? 'bg-gray-700' : 'bg-orange-50 text-orange-600') : ''} ${isDarkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'} transition-colors duration-200`}
              >
                <span className="mr-2">{lang.flag}</span>
                <span>{lang.name}</span>
                {currentLanguage === lang.code && (
                  <span className="ml-auto">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageMenu; 