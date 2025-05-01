import React, { useRef, useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTheme } from './ThemeContext';

// Mock product search data - in a real app, this would come from an API or props
const mockProductSearchData = [
  { id: 1, name: "iPhone 13 Pro Max", category: "Electronics" },
  { id: 2, name: "Samsung Galaxy S21", category: "Electronics" },
  { id: 3, name: "MacBook Air M1", category: "Computers" },
  { id: 4, name: "AirPods Pro", category: "Audio" },
  { id: 5, name: "Nike Air Max", category: "Footwear" },
  { id: 6, name: "Levi's 501 Jeans", category: "Clothing" },
  { id: 7, name: "Sony PlayStation 5", category: "Gaming" },
  { id: 8, name: "Kindle Paperwhite", category: "Books" }
];

const SearchBar = ({ isOpen, toggleSearch }) => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length > 1) {
      // Filter products that match the query
      const filteredSuggestions = mockProductSearchData
        .filter(product =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5); // Limit to 5 suggestions

      setSearchSuggestions(filteredSuggestions);
    } else {
      setSearchSuggestions([]);
    }
  };

  const handleSearchItemClick = (product) => {
    navigate(`/product/${product.id}`);
    toggleSearch();
    setSearchQuery("");
    setSearchSuggestions([]);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      toggleSearch();
      setSearchQuery("");
      setSearchSuggestions([]);
    }
  };

  return (
    <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 mt-3' : 'max-h-0'}`}>
      <form onSubmit={handleSearchSubmit} className="flex items-center">
        <div className="relative flex-grow">
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search for products..."
            className={`w-full py-2 pl-10 pr-4 border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
          />
          <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />

          {/* Search Suggestions */}
          {searchSuggestions.length > 0 && (
            <div className={`absolute left-0 right-0 mt-1 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto`}>
              {searchSuggestions.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleSearchItemClick(product)}
                  className={`px-4 py-2 cursor-pointer ${isDarkMode ? 'hover:bg-gray-700 border-gray-700' : 'hover:bg-gray-50 border-gray-100'} border-b last:border-b-0`}
                >
                  <div className="flex items-center">
                    <div>
                      <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{product.name}</p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>in {product.category}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          type="submit"
          className="ml-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar; 