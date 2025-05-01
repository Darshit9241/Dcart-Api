import React from "react";
import { useNavigate } from "react-router-dom";

export default function Banner() {
  const navigate = useNavigate();
  const categories = [
    { name: "Electronics", icon: "📱" },
    { name: "Fashion", icon: "👕" },
    { name: "Home & Kitchen", icon: "🏠" },
    { name: "Beauty", icon: "✨" },
    { name: "Sports", icon: "🏅" }
  ];

  return (

    <>
      <div className="bg-gradient-to-r from-[#f0f0f0] to-[#e7e7e7] flex flex-col md:flex-row items-center justify-between px-6 md:px-20 lg:px-44 py-16 md:py-0 h-auto md:h-[670px] relative overflow-hidden">

        {/* Left Section */}
        <div className="flex-1 flex flex-col justify-center md:pr-10 text-center md:text-left">
          <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full mb-4 w-max mx-auto md:mx-0">
            Sale Now On
          </span>

          <h2 className="font-medium text-gray-600 text-lg md:text-xl">
            Exclusive Summer Collection
          </h2>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mt-2 leading-tight">
            Up to 50% Off
          </h1>
          <p className="text-base md:text-lg mt-4 text-gray-700 max-w-lg mx-auto md:mx-0">
            Discover thousands of products at unbeatable prices. Limited time offers
            on our most popular items. Free shipping on orders over $50.
          </p>

          <button
            onClick={() => navigate(`/product`)}
            className="mt-6 px-5 py-3 bg-gradient-to-r from-[#FF7004] to-[#FF9F4A] text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300 w-[140px] md:w-[160px] mx-auto md:mx-0"
          >
            Shop Now
          </button>

        </div>

        {/* Right Section */}
        <div className="flex-1 mt-10 md:mt-0 relative flex justify-center">
          <img
            src="../../images/section1/chair.png"
            alt="Flexible Chair"
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-full h-auto max-h-[300px] md:max-h-[400px] object-contain transform hover:scale-105 transition duration-500"
          />
        </div>
      </div>
      <div className="flex justify-center cursor-pointer bg-gradient-to-br from-white-50 to-white">
        <div className="flex flex-wrap justify-center gap-10 md:gap-16 py-16 md:py-28">
          {categories.map((category, index) => (
            <div
              key={index}
              // onClick={() => navigate(`/category/${category.name.toLowerCase()}`)}
              className="h-[150px] w-[150px] md:h-[200px] md:w-[200px] rounded-xl flex items-center justify-center
              bg-white border border-gray-200 shadow-md transition-all duration-300
              hover:scale-105 hover:border-orange-400 hover:shadow-2xl hover:bg-orange-50 group"
            >
              <div className="flex flex-col items-center">
                <div className="text-4xl md:text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <h1 className="text-lg md:text-xl font-semibold text-gray-800 group-hover:text-orange-600 transition-colors duration-300">
                  {category.name}
                </h1>
                <p className="text-xs text-gray-500 mt-1 group-hover:text-orange-400">
                  View Products
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
