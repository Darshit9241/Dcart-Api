import React, { useState } from "react";
import { IoIosArrowDropdown } from "react-icons/io";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-[#292b2c] text-white p-4 mt-[55px]">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo / Title */}
        {/* <div className="text-xl font-semibold">MySite</div> */}

        {/* Hamburger Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white text-2xl">
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 items-center">
          <li className="hover:text-gray-400 cursor-pointer"><a href="/">Home</a></li>
          <li className="hover:text-gray-400 cursor-pointer"><a href="/about">About</a></li>
          <li className="hover:text-gray-400 cursor-pointer"><a href="/product">Product</a></li>

          {/* Office Furniture Dropdown */}
          <li className="relative group">
            <div className="flex items-center cursor-pointer">
              <span className="hover:text-gray-400">Office Furniture</span>
            </div>
          </li>

          {/* Hospital Furniture Dropdown */}
          <li className="relative group">
            <div className="flex items-center cursor-pointer">
              <span className="hover:text-gray-400">Hospital Furniture</span>
            </div>
          </li>

          <li className="hover:text-gray-400 cursor-pointer"><a href="/contact">Contact Us</a></li>
        </ul>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul className="md:hidden mt-4 space-y-4 px-4">
          <li className="hover:text-gray-400"><a href="/">Home</a></li>
          <li className="hover:text-gray-400"><a href="/about">About</a></li>
          <li className="hover:text-gray-400"><a href="/product">Product</a></li>

          {/* Office Furniture Mobile Dropdown */}
          <details className="text-white">
            <summary className="cursor-pointer hover:text-gray-400 flex items-center">
              Office Furniture <IoIosArrowDropdown className="ml-1" />
            </summary>
            <ul className="ml-4 mt-2 space-y-2 text-sm text-gray-300">
              <li className="hover:text-white cursor-pointer">Lounge</li>
              <li className="hover:text-white cursor-pointer">Office Chair</li>
              <li className="hover:text-white cursor-pointer">Office Table</li>
            </ul>
          </details>

          {/* Hospital Furniture Mobile Dropdown */}
          <details className="text-white">
            <summary className="cursor-pointer hover:text-gray-400 flex items-center">
              Hospital Furniture <IoIosArrowDropdown className="ml-1" />
            </summary>
            <ul className="ml-4 mt-2 space-y-2 text-sm text-gray-300">
              <li className="hover:text-white cursor-pointer">Hospital Bed</li>
              <li className="hover:text-white cursor-pointer">Hospital Utility</li>
              <li className="hover:text-white cursor-pointer">Living</li>
            </ul>
          </details>

          <li className="hover:text-gray-400"><a href="/contact">Contact Us</a></li>
        </ul>
      )}
    </nav>
  );
}
