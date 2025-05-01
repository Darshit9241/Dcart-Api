import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart, FaStar, FaStarHalfAlt, FaRegStar, FaShoppingCart } from "react-icons/fa";
import { FaCodeCompare, FaShare } from "react-icons/fa6";
import { AiOutlineTwitter, AiFillFacebook, AiFillInstagram } from "react-icons/ai";
import { useParams } from "react-router-dom";
import { addItem } from "../../redux/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from '../../redux/wishlistSlice';
import { addToCompare, removeFromCompare } from "../../redux/compareSlice";
import { toast } from "react-toastify";
import SimilarProductStaticPage from "../../component/SimilarProductStaticPage";
import { getCurrencySymbol } from "../../utils/currencyUtils";
import { fetchProductById, fetchRelatedProducts } from "../../utils/api";

// Tab component for product details
const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="border-b border-gray-200">
      <div className="flex flex-wrap -mb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`inline-block py-4 px-6 text-sm font-medium ${activeTab === tab.id
                ? "text-[#FF7004] border-b-2 border-[#FF7004]"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// Star Rating component
const StarRating = ({ rating }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-yellow-400" />);
    }
  }

  return <div className="flex">{stars}</div>;
};

const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setIsZoomed(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsZoomed(false);
  };

  const handleMouseMove = (e) => {
    if (!isZoomed) return;

    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomPosition({ x, y });
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div
        className="overflow-hidden relative"
        onClick={toggleZoom}
        onMouseMove={handleMouseMove}
      >
        <div
          className={`transition-all duration-300 ${isZoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"}`}
          style={isZoomed ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` } : {}}
        >
          <img
            src={images[currentIndex]}
            alt="Product"
            className="w-full h-[500px] object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/500?text=Product+Image";
            }}
          />
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); prevSlide(); }}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 text-white px-3 py-2 text-xl hover:bg-opacity-50 z-10"
        >
          ‹
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); nextSlide(); }}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 text-white px-3 py-2 text-xl hover:bg-opacity-50 z-10"
        >
          ›
        </button>
      </div>
      <div className="flex justify-center mt-2 gap-2 overflow-x-auto">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="Thumbnail"
            onClick={() => setCurrentIndex(index)}
            className={`w-14 h-14 object-cover border-2 rounded cursor-pointer hover:opacity-80 ${currentIndex === index ? "border-[#FF7004]" : "border-gray-300"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default function ProductDetail({ onCartOpen, onCartClick }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("Select Color");
  const [selectedSize, setSelectedSize] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentCurrency = useSelector((state) => state.currency.currentCurrency);

  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist);
  const compareList = useSelector((state) => state.compare);

  useEffect(() => {
    const loadProductDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch product details
        const productData = await fetchProductById(productId);
        setProduct(productData);
        
        // Fetch related products
        const relatedProductsData = await fetchRelatedProducts(productId, 4);
        setRelatedProducts(relatedProductsData);
      } catch (error) {
        console.error('Error loading product details:', error);
        toast.error('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadProductDetails();
  }, [productId]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#FF7004]"></div>
    </div>
  );

  if (!product) return (
    <div className="flex justify-center items-center min-h-[50vh] flex-col">
      <div className="text-2xl font-bold text-gray-700 mb-4">Product Not Found</div>
      <p className="text-gray-500">The product you're looking for might be unavailable or doesn't exist.</p>
    </div>
  );

  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () => quantity > 1 && setQuantity(quantity - 1);
  const handleColorChange = (color) => setSelectedColor(color);
  const handleSizeChange = (size) => setSelectedSize(size);

  const carouselImages = [
    product.imgSrc, // Use the product image from API as the first image
    "../../images/product/img1.jpg",
    "../../images/product/img2.jpg",
    "../../images/product/img3.jpg",
    "../../images/product/img4.jpg",
  ];

  const handleAddToCart = (product) => {
    if (!selectedSize && product.hasSizes) {
      toast.warning("Please select a size");
      return;
    }

    if (selectedColor === "Select Color") {
      toast.warning("Please select a color");
      return;
    }

    dispatch(addItem({
      ...product,
      quantity,
      selectedColor,
      selectedSize: selectedSize || "One Size"
    }));

    toast.success(`${product.name} added to cart`);
    onCartClick();
    onCartOpen();
  };

  const handleBuyNow = (product) => {
    handleAddToCart(product);
    // Navigate to checkout (this would need to be implemented)
    // history.push('/checkout');
  };

  const isWished = wishlist.some((item) => item.id === product.id);

  const toggleFavorite = (product) => {
    if (isWished) {
      dispatch(removeFromWishlist(product));
      toast.info(`Removed from wishlist`);
    } else {
      dispatch(addToWishlist(product));
      toast.success(`Added to wishlist`);
    }
  };

  const toggleCompare = (product) => {
    const isCompared = compareList.some((item) => item.id === product.id);
    if (isCompared) {
      dispatch(removeFromCompare(product));
      toast.info(`${product.name} removed from comparison`);
    } else {
      if (compareList.length >= 4) {
        toast.warning("You can only compare up to 4 products");
        return;
      }
      dispatch(addToCompare(product));
      toast.success(`${product.name} added to comparison`);
    }
  };

  const toggleShareOptions = () => {
    setShowShareOptions(!showShareOptions);
  };

  const shareProduct = (platform) => {
    // Implement actual sharing logic here
    toast.success(`Shared on ${platform}`);
    setShowShareOptions(false);
  };

  const colors = ["Red", "Blue", "Green", "Black"];
  const sizes = ["S", "M", "L", "XL", "XXL"];

  // Product detail tabs content
  const tabs = [
    { id: "description", label: "Description" },
    { id: "specifications", label: "Specifications" },
    { id: "reviews", label: "Reviews" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="py-4">
            <p className="text-gray-700 leading-relaxed">
              {product.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."}
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-2 text-gray-700">
              <li>Premium quality materials</li>
              <li>Durable and long-lasting</li>
              <li>Comfortable fit</li>
              <li>Modern design</li>
            </ul>
          </div>
        );
      case "specifications":
        return (
          <div className="py-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-900">Brand</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{product.brand || "Brand Name"}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-900">Material</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{product.material || "Cotton, Polyester"}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-900">Weight</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{product.weight || "0.5 kg"}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-900">Dimensions</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{product.dimensions || "30 x 20 x 10 cm"}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-900">Country of Origin</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{product.origin || "USA"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      case "reviews":
        return (
          <div className="py-4">
            <div className="flex items-center mb-4">
              <StarRating rating={4.7} />
              <span className="ml-2 text-gray-700">4.7 out of 5</span>
            </div>

            <div className="space-y-4 mt-6">
              {/* Sample reviews */}
              {[1, 2, 3].map((index) => (
                <div key={index} className="border-b pb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Customer {index}</h3>
                      <StarRating rating={5 - (index * 0.5)} />
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(Date.now() - index * 86400000).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-700">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
                  </p>
                </div>
              ))}
            </div>

            <button className="mt-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded">
              Write a Review
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center py-12 bg-[#F4F5F8]">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <h1 className="text-xl pt-2 text-gray-500">
          Home / product / {product.name}
        </h1>
      </div>

      <div className="py-10 px-4 sm:px-8 md:px-16 lg:px-40">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Image Section */}
          <div className="w-full md:w-1/2">
            <Carousel images={carouselImages} />
          </div>

          {/* Details Section */}
          <div className="w-full md:w-1/2 relative">
            <div className="flex items-center gap-2 pb-3">
              {product.isNew && (
                <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
                  New Arrival
                </span>
              )}
              {product.isBestSeller && (
                <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full">
                  Best Seller
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <p className="font-bold text-xl sm:text-2xl">{product.name}</p>
              <div className="flex items-center gap-2">
                <StarRating rating={product.rating || 4.5} />
                <span className="text-sm text-gray-500">({product.reviewCount || 24} reviews)</span>
              </div>
            </div>

            <div className="flex gap-5 font-semibold pt-4 text-[20px]">
              {product.oldPrice && (
                <h2>Old Price: <span className="line-through text-gray-500">{getCurrencySymbol(currentCurrency)}{product.oldPrice}</span></h2>
              )}
              <h2>Price: <span className="text-green-600 font-bold">{getCurrencySymbol(currentCurrency)}{product.price}</span></h2>
            </div>

            <div className="flex flex-wrap gap-2 items-center mt-2">
              <h1 className="font-bold text-sm md:text-base">
                SKU: <span className="font-normal">{product.id}</span>
              </h1>
              <span className="text-gray-400">|</span>
              <h1 className="font-bold text-sm md:text-base">
                Availability: <span className="font-normal text-green-600">In Stock</span>
              </h1>
            </div>

            <p className="pt-4 text-sm text-gray-700 leading-relaxed">
              {product.shortDescription || "A long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution..."}
            </p>

            {/* Size Selection */}
            <div className="pt-4">
              <p className="font-semibold text-base pb-2">Size:</p>
              <div className="flex gap-2 flex-wrap">
                {sizes.map((size) => (
                  <div
                    key={size}
                    className={`w-10 h-10 border-2 cursor-pointer flex items-center justify-center rounded ${selectedSize === size ? "border-[#FF7004] text-[#FF7004]" : "border-gray-300 hover:border-gray-400"
                      }`}
                    onClick={() => handleSizeChange(size)}
                  >
                    {size}
                  </div>
                ))}
              </div>
            </div>

            {/* Color Swatches */}
            <div className="pt-4">
              <p className="font-semibold text-base pb-2">Color:</p>
              <div className="flex gap-3">
                {colors.map((color) => (
                  <div
                    key={color}
                    className={`w-8 h-8 rounded-full border-2 cursor-pointer flex items-center justify-center transition-all ${selectedColor === color ? "border-[#FF7004] scale-110" : "border-gray-300 hover:scale-105"
                      }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    onClick={() => handleColorChange(color)}
                  >
                    {selectedColor === color && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity + Add to Cart + Buy Now */}
            <div className="flex flex-wrap gap-4 pt-6 items-center">
              <div className="bg-gray-100 text-gray-800 flex items-center text-xl rounded-md border border-gray-300">
                <button
                  onClick={decrementQuantity}
                  className="px-3 py-2 hover:bg-gray-200 transition-colors"
                >
                  -
                </button>
                <div className="px-3 py-2 min-w-[40px] text-center">{quantity}</div>
                <button
                  onClick={incrementQuantity}
                  className="px-3 py-2 hover:bg-gray-200 transition-colors"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => handleAddToCart(product)}
                className="bg-gray-800 text-white py-2 px-6 rounded-md text-sm font-bold hover:bg-gray-900 transition-all flex items-center gap-2"
              >
                <FaShoppingCart /> Add To Cart
              </button>

              <button
                onClick={() => handleBuyNow(product)}
                className="bg-[#FF7004] text-white py-2 px-6 rounded-md text-sm font-bold hover:bg-orange-600 transition-all"
              >
                Buy Now
              </button>
            </div>

            {/* Wishlist, Compare, Share */}
            <div className="flex gap-5 pt-5 items-center">
              <div
                className={`cursor-pointer transition-all duration-300 flex items-center gap-1 ${isWished ? "text-red-500" : "text-gray-500 hover:text-red-500"
                  }`}
                onClick={() => toggleFavorite(product)}
              >
                {isWished ? <FaHeart className="text-xl" /> : <FaRegHeart className="text-xl" />}
                <span className="text-sm">Wishlist</span>
              </div>

              <div
                className={`cursor-pointer transition-all duration-300 flex items-center gap-1 ${compareList.some((item) => item.id === product.id)
                    ? "text-blue-500"
                    : "text-gray-500 hover:text-blue-500"
                  }`}
                onClick={() => toggleCompare(product)}
              >
                <FaCodeCompare className="text-xl" />
                <span className="text-sm">Compare</span>
              </div>

              <div className="relative">
                <div
                  className="cursor-pointer transition-all duration-300 text-gray-500 hover:text-green-500 flex items-center gap-1"
                  onClick={toggleShareOptions}
                >
                  <FaShare className="text-xl" />
                  <span className="text-sm">Share</span>
                </div>

                {showShareOptions && (
                  <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-md p-2 z-10 flex gap-2">
                    <button onClick={() => shareProduct("Facebook")} className="text-blue-600 hover:text-blue-800 p-2">
                      <AiFillFacebook size={20} />
                    </button>
                    <button onClick={() => shareProduct("Twitter")} className="text-blue-400 hover:text-blue-600 p-2">
                      <AiOutlineTwitter size={20} />
                    </button>
                    <button onClick={() => shareProduct("Instagram")} className="text-pink-600 hover:text-pink-800 p-2">
                      <AiFillInstagram size={20} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Product Information Tabs */}
        <div className="mt-16">
          <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="mt-4 bg-white p-4 rounded-md">
            {renderTabContent()}
          </div>
        </div>

        {/* Related Products */}

        <SimilarProductStaticPage />

        {/* {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <Link to={`/product/${relatedProduct.id}`}>
                    <img 
                      src={carouselImages[0]} 
                      alt={relatedProduct.name} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg truncate">{relatedProduct.name}</h3>
                      <div className="flex items-center mt-1">
                        <StarRating rating={relatedProduct.rating || 4} />
                        <span className="ml-1 text-sm text-gray-500">
                          ({relatedProduct.reviewCount || 10})
                        </span>
                      </div>
                      <p className="mt-2 font-bold text-[#FF7004]">${relatedProduct.price}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )} */}
      </div>

      {/* Sticky Add to Cart for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-md flex justify-between py-3 px-4">
        <div className="text-center">
          <p className="text-xs text-gray-500">Price</p>
          <p className="font-bold text-[#FF7004]">${product.price}</p>
        </div>
        <button
          onClick={() => handleAddToCart(product)}
          className="bg-[#FF7004] hover:bg-orange-600 text-white font-bold py-2 px-8 rounded-full flex items-center gap-2"
        >
          <FaShoppingCart /> Add to Cart
        </button>
      </div>
    </>
  );
}
