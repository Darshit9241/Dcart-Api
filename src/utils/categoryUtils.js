/**
 * Utility functions and constants for product categories
 */

// Product categories array
export const categories = [
  "All",
  "Electronics",
  "Clothing",
  "Home & Kitchen",
  "Beauty & Personal Care",
  "Toys & Games",
  "Books",
  "Sports & Outdoors",
  "Automotive",
  "Health & Wellness",
  "Grocery",
  "Other"
];

// Get all categories excluding "All" (for adding products)
export const getProductCategories = () => {
  return categories.filter(category => category !== "All");
};

// Filter products by category
export const filterByCategory = (products, category) => {
  if (!category || category === "All") {
    return products;
  }
  return products.filter(product => product.category === category);
};

// Get category color classes based on category name
export const getCategoryColorClass = (category) => {
  const colorMap = {
    "Electronics": "bg-blue-100 text-blue-800",
    "Clothing": "bg-purple-100 text-purple-800",
    "Home & Kitchen": "bg-amber-100 text-amber-800",
    "Beauty & Personal Care": "bg-pink-100 text-pink-800",
    "Toys & Games": "bg-orange-100 text-orange-800",
    "Books": "bg-emerald-100 text-emerald-800",
    "Sports & Outdoors": "bg-green-100 text-green-800",
    "Automotive": "bg-gray-100 text-gray-800",
    "Health & Wellness": "bg-teal-100 text-teal-800",
    "Grocery": "bg-lime-100 text-lime-800",
    "Other": "bg-indigo-100 text-indigo-800"
  };

  return colorMap[category] || "bg-indigo-100 text-indigo-800";
}; 