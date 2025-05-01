import React from "react";
import { useNavigate } from "react-router-dom";

export default function Banner() {
  const navigate = useNavigate();
  const items = ["Bedroom", "Living", "Dining", "Lounge", "Office Chair"];
  return (
    <>
      <div className="bg-gradient-to-r from-[#f5f5f5] to-[#e0e0e0] flex flex-col md:flex-row items-center justify-between px-6 md:px-20 lg:px-44 py-16 md:py-12 h-auto md:h-[670px] relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full opacity-40 blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-tr from-blue-100 to-blue-200 rounded-full opacity-30 blur-3xl"></div>

        {/* Left Section */}
        <div className="flex-1 flex flex-col justify-center md:pr-10 text-center md:text-left z-10">
          <span className="inline-block bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 w-max mx-auto md:mx-0 shadow-sm animate-pulse">
            Trending 2025
          </span>

          <h2 className="font-medium text-gray-600 text-xl md:text-2xl tracking-wide">
            Premium Ergonomic Collection
          </h2>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mt-3 leading-tight relative">
            <span className="relative inline-block">
              The 
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-[#FF7004] to-[#FF9F4A] rounded-full"></span>
            </span>
            <span className="block mt-1 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
              Flexible Chair
            </span>
          </h1>
          
          <p className="text-base md:text-lg mt-6 text-gray-700 max-w-lg mx-auto md:mx-0 leading-relaxed">
            Designed for comfort and style, our latest ergonomic chair is perfect
            for long hours of work and relaxation. Enhance your workspace today.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
            <button
              onClick={() => navigate(`/product`)}
              className="px-6 py-3.5 bg-gradient-to-r from-[#FF7004] to-[#FF9F4A] text-white font-semibold rounded-lg shadow-lg hover:shadow-orange-200/50 hover:-translate-y-1 transition-all duration-300 w-[160px] md:w-[180px] flex items-center justify-center gap-2"
            >
              Shop Now
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={() => navigate(`/product`)}
              className="px-6 py-3.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-[#FF7004] hover:text-[#FF7004] transition duration-300 w-[160px] md:w-[180px]"
            >
              View Collection
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-1 mt-12 md:mt-0 relative flex justify-center z-10">
          <div className="absolute -z-10 w-60 h-60 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full blur-xl opacity-70 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
          <img
            src="../../images/section1/banner.png"
            alt="Flexible Chair"
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-full h-auto max-h-[700px] object-contain transform hover:scale-105 transition duration-500 drop-shadow-xl"
          />
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-gradient-to-b from-[#f8f8f8] to-white py-10 md:py-16">
        <h3 className="text-center text-gray-500 uppercase tracking-widest text-sm font-medium mb-6">Browse By Category</h3>
        <div className="flex flex-wrap justify-center gap-6 md:gap-12 px-4 md:px-10">
          {items.map((label, index) => (
            <div
              key={index}
              onClick={() => navigate(`/category/${label.toLowerCase()}`)}
              className="h-[150px] w-[150px] md:h-[180px] md:w-[180px] rounded-2xl flex items-center justify-center
              bg-white/80 backdrop-blur-lg border border-gray-100 shadow-md transition-all duration-300
              hover:scale-105 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-100 group cursor-pointer"
            >
              <div className="flex flex-col items-center">
                <img
                  src={`../../images/section2/img${index + 1}.jpg`}
                  alt={label}
                  className="w-[60px] h-[60px] md:w-[70px] md:h-[70px] mb-3 md:mb-4 rounded-full border border-white shadow-sm object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <h1 className="text-lg md:text-xl font-semibold text-gray-800 group-hover:text-[#FF7004] transition-colors duration-300">
                  {label}
                </h1>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
