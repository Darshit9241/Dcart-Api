import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addToWishlist, removeFromWishlist } from '../../redux/wishlistSlice';
import { addToCompare, removeFromCompare } from "../../redux/compareSlice";
import { toast } from "react-toastify";
import { FaHeart, FaRegHeart, FaTruck, FaShieldAlt, FaUndo, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { FaCodeCompare, FaCircleCheck, FaChevronRight } from "react-icons/fa6";
import { addItem } from "../../redux/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import SimilarProductDynamicPage from "../../component/SimilarProductDynamicPage";
import { getCurrencySymbol } from "../../utils/currencyUtils";
import { fetchProductById } from '../../utils/api';

export default function DynamicProductDetail({ onCartClick, onCartOpen }) {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("description");
    const [currentImage, setCurrentImage] = useState(0);
    const currentCurrency = useSelector((state) => state.currency.currentCurrency);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const loadProduct = async () => {
            try {
                setLoading(true);
                const productData = await fetchProductById(id);
                setProduct(productData);
                // Set initial color and size after product is loaded
                setSelectedColor(colors[0]);
                setSelectedSize(sizes[0]);
            } catch (error) {
                console.error('Error loading product details:', error);
                toast.error('Failed to load product details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        
        loadProduct();
        window.scrollTo(0, 0);
    }, [id]);

    // Sample product images for gallery
    const productImages = product ? [
        product.imgSrc,
        "../../images/product/img1.jpg",
        "../../images/product/img2.jpg",
        "../../images/product/img3.jpg",
    ] : [];

    const colors = ["Red", "Blue", "Green", "Black"];
    const sizes = ["S", "M", "L", "XL"];
    const wishlist = useSelector((state) => state.wishlist);
    const compareList = useSelector((state) => state.compare);
    const isWished = wishlist.some((item) => item.id === product?.id);
    const isCompared = compareList.some((item) => item.id === product?.id);

    const incrementQuantity = () => setQuantity(quantity + 1);
    const decrementQuantity = () => quantity > 1 && setQuantity(quantity - 1);

    const handleAddToCart = () => {
        if (!product) return;

        if (!selectedColor) {
            toast.error("Please select a color");
            return;
        }

        if (!selectedSize) {
            toast.error("Please select a size");
            return;
        }

        dispatch(addItem({
            ...product,
            quantity,
            selectedColor,
            selectedSize
        }));
        toast.success(`${product.name} added to cart`);
        onCartClick();
        onCartOpen();
    };

    const handleBuyNow = () => {
        if (!product) return;

        if (!selectedColor) {
            toast.error("Please select a color");
            return;
        }

        if (!selectedSize) {
            toast.error("Please select a size");
            return;
        }

        dispatch(addItem({
            ...product,
            quantity,
            selectedColor,
            selectedSize
        }));

        // Check if user is logged in
        const token = localStorage.getItem("token");
        if (token) {
            // Navigate directly to payment page
            navigate('/cart/payment');
        } else {
            // Navigate to login if not logged in
            toast.info("Please login to continue with purchase");
            navigate('/login');
        }
    };

    const toggleFavorite = () => {
        if (!product) return;

        if (isWished) {
            dispatch(removeFromWishlist(product));
            toast.info(`Removed from wishlist`);
        } else {
            dispatch(addToWishlist(product));
            toast.success(`Added to wishlist`);
        }
    };

    const toggleCompare = () => {
        if (!product) return;

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

    const renderRatingStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<FaStar key={i} className="text-amber-400" />);
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(<FaStarHalfAlt key={i} className="text-amber-400" />);
            } else {
                stars.push(<FaRegStar key={i} className="text-amber-400" />);
            }
        }

        return stars;
    };

    if (!product) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
                    <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h1>
                    <p className="text-gray-600 mb-6">The product you are looking for does not exist or has been removed.</p>
                    <a href="/products" className="inline-block bg-[#FF9F4A] text-white px-6 py-2 rounded-lg hover:bg-[#FF9F4A] transition-colors">
                        Browse Products
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-16 md:pb-0">
            {/* Breadcrumb */}
            <div className="container mx-auto px-4 py-4">
                <nav className="flex" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-2">
                        <li className="inline-flex items-center">
                            <a href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#FF9F4A] transition-colors">
                                Home
                            </a>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <FaChevronRight className="w-3 h-3 text-gray-400 mx-1" />
                                <a href="/product" className="ml-1 text-sm font-medium text-gray-500 hover:text-[#FF9F4A] transition-colors md:ml-2">
                                    Product
                                </a>
                            </div>
                        </li>
                        <li aria-current="page">
                            <div className="flex items-center">
                                <FaChevronRight className="w-3 h-3 text-gray-400 mx-1" />
                                <span className="ml-1 text-sm font-medium text-gray-800 md:ml-2">{product.id}</span>
                            </div>
                        </li>
                    </ol>
                </nav>
            </div>

            {/* Product Display */}
            <div className="container mx-auto px-4 py-6">
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="flex flex-col lg:flex-row">
                        {/* Product Gallery */}
                        <div className="w-full lg:w-1/2 p-4 md:p-6">
                            <div className="sticky top-6">
                                {/* Main Image */}
                                <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden mb-4">
                                    <img
                                        src={productImages[currentImage]}
                                        alt={product.name}
                                        className="object-contain w-full h-full p-8 transition-opacity duration-300"
                                    />

                                    {/* Badges */}
                                    <div className="absolute top-4 left-4 flex flex-col space-y-2">
                                        {product.isNew && (
                                            <div className="bg-emerald-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                                                NEW
                                            </div>
                                        )}
                                        {product.isBestSeller && (
                                            <div className="bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                                                BEST SELLER
                                            </div>
                                        )}
                                        {product.discount && (
                                            <div className="bg-rose-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                                                {product.discount} OFF
                                            </div>
                                        )}
                                    </div>

                                    {/* Wishlist Button */}
                                    <button
                                        onClick={toggleFavorite}
                                        className={`absolute top-4 right-4 p-2 rounded-full shadow-sm ${isWished
                                            ? 'bg-rose-50 text-rose-500'
                                            : 'bg-white text-gray-400 hover:text-gray-600'
                                            } transition-colors focus:outline-none`}
                                        aria-label="Add to wishlist"
                                    >
                                        {isWished ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
                                    </button>
                                </div>

                                {/* Thumbnail Gallery */}
                                <div className="grid grid-cols-4 gap-3">
                                    {productImages.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImage(index)}
                                            className={`aspect-square bg-gray-50 rounded-md overflow-hidden border-2 ${currentImage === index
                                                ? 'border-[#FF9F4A]'
                                                : 'border-transparent hover:border-gray-200'
                                                } transition-colors`}
                                        >
                                            <img
                                                src={img}
                                                alt={`Thumbnail ${index + 1}`}
                                                className="object-contain w-full h-full p-2"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="w-full lg:w-1/2 p-4 md:p-6 lg:p-8">
                            <div className="flex flex-col h-full">
                                {/* Product Header */}
                                <div className="mb-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                                {product.name}
                                            </h1>
                                            <div className="flex items-center mb-3">
                                                <div className="flex mr-2">
                                                    {renderRatingStars(product.rating || 4.5)}
                                                </div>
                                                <span className="text-sm text-gray-500">
                                                    ({product.reviews || 24} reviews)
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={toggleCompare}
                                            className={`p-2 rounded-full ${isCompared
                                                ? "bg-indigo-100 text-[#FF9F4A]"
                                                : "bg-gray-100 text-gray-500 hover:text-gray-700"
                                                } transition-colors`}
                                            aria-label="Compare product"
                                        >
                                            <FaCodeCompare size={18} />
                                        </button>
                                    </div>

                                    <div className="flex items-baseline mb-4">
                                        <span className="text-2xl font-bold text-emerald-500 mr-2">
                                            {getCurrencySymbol(currentCurrency)}{product.price.toLocaleString()}
                                        </span>
                                        {product.oldPrice && (
                                            <span className="text-lg text-gray-500 line-through">
                                                {getCurrencySymbol(currentCurrency)}{product.oldPrice.toLocaleString()}
                                            </span>
                                        )}
                                        {product.discount && (
                                            <span className="ml-2 text-sm font-medium bg-rose-100 text-rose-800 px-2 py-0.5 rounded">
                                                Save {product.discount}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center text-sm text-gray-600 mb-6">
                                        <span className="flex items-center mr-4">
                                            <FaCircleCheck className="text-emerald-500 mr-1" />
                                            {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                                        </span>
                                        
                                        {/* Add availability status */}
                                        {product.availability && (
                                            <span className={`flex items-center mr-4 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                product.availability === 'In Stock' ? 'bg-green-100 text-green-800' : 
                                                product.availability === 'Out of Stock' ? 'bg-red-100 text-red-800' :
                                                product.availability === 'Limited Stock' ? 'bg-orange-100 text-orange-800' :
                                                product.availability === 'Pre-order' ? 'bg-blue-100 text-blue-800' :
                                                product.availability === 'Back-order' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {product.availability}
                                            </span>
                                        )}
                                        
                                        <span>SKU: {product.id}</span>
                                    </div>
                                </div>

                                {/* Color Selection */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Color: <span className="font-semibold text-gray-900">{selectedColor}</span>
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {colors.map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                className={`
                                                    w-10 h-10 rounded-full border-2 flex items-center justify-center
                                                    ${selectedColor === color
                                                        ? "ring-2 ring-offset-2 ring-[#FF9F4A]"
                                                        : "border-gray-200 hover:border-gray-300"
                                                    }
                                                    transition-all
                                                `}
                                                style={{ backgroundColor: color.toLowerCase() }}
                                                aria-label={color}
                                            >
                                                {selectedColor === color && (
                                                    <FaCircleCheck className="text-white text-opacity-80" size={14} />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Size Selection */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Size: <span className="font-semibold text-gray-900">{selectedSize}</span>
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {sizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`
                                                    px-4 py-2 border rounded-md text-sm font-medium
                                                    ${selectedSize === size
                                                        ? "bg-[#FF9F4A] text-white border-[#FF9F4A]"
                                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                                    }
                                                    transition-colors
                                                `}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                    <a href="#" className="inline-block mt-2 text-sm text-[#FF9F4A] hover:text-[#FF9F4A]">
                                        Size Guide
                                    </a>
                                </div>

                                {/* Quantity Selector */}
                                <div className="mb-8">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Quantity
                                    </label>
                                    <div className="flex items-center">
                                        <button
                                            onClick={decrementQuantity}
                                            className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l-md bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
                                            aria-label="Decrease quantity"
                                        >
                                            -
                                        </button>
                                        <div className="w-16 h-10 flex items-center justify-center border-t border-b border-gray-300 bg-white text-gray-900 font-medium">
                                            {quantity}
                                        </div>
                                        <button
                                            onClick={incrementQuantity}
                                            className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-r-md bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
                                            aria-label="Increase quantity"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                                    <button
                                        onClick={handleAddToCart}
                                        className="flex-1  bg-gradient-to-r from-[#FF7004] to-[#FF9F4A] text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                    >
                                        Add to Cart
                                    </button>
                                    <button
                                        onClick={handleBuyNow}
                                        className="flex-1 bg-white border border-[#FF7004] text-[#FF9F4A] py-3 px-6 rounded-lg font-medium transition-colors hover:bg-indigo-50 flex items-center justify-center gap-2"
                                    >
                                        Buy Now
                                    </button>
                                </div>

                                {/* Product benefits */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-t border-gray-200">
                                    <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg">
                                        <FaTruck className="text-[#FF9F4A] text-xl mb-2" />
                                        <span className="text-sm font-medium text-gray-700">Free Shipping</span>
                                        <span className="text-xs text-gray-500">On orders over $50</span>
                                    </div>
                                    <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg">
                                        <FaShieldAlt className="text-[#FF9F4A] text-xl mb-2" />
                                        <span className="text-sm font-medium text-gray-700">2 Year Warranty</span>
                                        <span className="text-xs text-gray-500">Hassle-free returns</span>
                                    </div>
                                    <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg">
                                        <FaUndo className="text-[#FF9F4A] text-xl mb-2" />
                                        <span className="text-sm font-medium text-gray-700">30-Day Returns</span>
                                        <span className="text-xs text-gray-500">No questions asked</span>
                                    </div>
                                </div>

                                {/* Product Details Tabs */}
                                <div className="mt-auto">
                                    <div className="border-b border-gray-200">
                                        <nav className="-mb-px flex space-x-8">
                                            <button
                                                onClick={() => setActiveTab("description")}
                                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "description"
                                                    ? "border-[#FF9F4A] text-[#FF9F4A]"
                                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                                    }`}
                                            >
                                                Description
                                            </button>
                                            <button
                                                onClick={() => setActiveTab("features")}
                                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "features"
                                                    ? "border-[#FF9F4A] text-[#FF9F4A]"
                                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                                    }`}
                                            >
                                                Features
                                            </button>
                                            <button
                                                onClick={() => setActiveTab("specs")}
                                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "specs"
                                                    ? "border-[#FF9F4A] text-[#FF9F4A]"
                                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                                    }`}
                                            >
                                                Specifications
                                            </button>
                                            <button
                                                onClick={() => setActiveTab("reviews")}
                                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "reviews"
                                                    ? "border-[#FF9F4A] text-[#FF9F4A]"
                                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                                    }`}
                                            >
                                                Reviews
                                            </button>
                                        </nav>
                                    </div>

                                    <div className="py-4">
                                        {activeTab === "description" && (
                                            <div className="prose prose-sm max-w-none text-gray-600">
                                                <p>{product.description}</p>
                                                <p className="mt-3">Our premium product combines cutting-edge technology with elegant design to deliver exceptional performance. Each component is carefully crafted to ensure durability and reliability.</p>
                                            </div>
                                        )}

                                        {activeTab === "features" && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <h4 className="font-medium text-gray-900 mb-2">Premium Materials</h4>
                                                    <p className="text-sm text-gray-600">Made with high-quality, durable materials that stand the test of time.</p>
                                                </div>
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <h4 className="font-medium text-gray-900 mb-2">Advanced Technology</h4>
                                                    <p className="text-sm text-gray-600">Incorporates the latest innovations for superior performance.</p>
                                                </div>
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <h4 className="font-medium text-gray-900 mb-2">Ergonomic Design</h4>
                                                    <p className="text-sm text-gray-600">Carefully designed for maximum comfort during extended use.</p>
                                                </div>
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <h4 className="font-medium text-gray-900 mb-2">Easy Maintenance</h4>
                                                    <p className="text-sm text-gray-600">Simple to clean and maintain with minimal effort required.</p>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === "specs" && (
                                            <div className="space-y-4">
                                                <div className="border-b border-gray-200 pb-4">
                                                    <h4 className="font-medium text-gray-900 mb-2">Dimensions</h4>
                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                        <div>
                                                            <span className="text-gray-500">Height:</span> 12.5 in
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-500">Width:</span> 8.2 in
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-500">Depth:</span> 3.4 in
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-500">Weight:</span> 2.2 lbs
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="border-b border-gray-200 pb-4">
                                                    <h4 className="font-medium text-gray-900 mb-2">Materials</h4>
                                                    <div className="text-sm">
                                                        <p>Aluminum alloy frame, tempered glass, premium plastics</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900 mb-2">Compatibility</h4>
                                                    <div className="text-sm">
                                                        <p>Works with all standard systems and accessories</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === "reviews" && (
                                            <div className="space-y-6">
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <div className="flex items-center mb-2">
                                                        <div className="flex mr-2">
                                                            {renderRatingStars(5)}
                                                        </div>
                                                        <span className="text-sm font-medium">John D.</span>
                                                    </div>
                                                    <h4 className="font-medium text-gray-900 mb-1">Excellent product!</h4>
                                                    <p className="text-sm text-gray-600">This exceeded all my expectations. The quality is outstanding and it works perfectly.</p>
                                                    <div className="text-xs text-gray-400 mt-2">Posted on January 15, 2023</div>
                                                </div>
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <div className="flex items-center mb-2">
                                                        <div className="flex mr-2">
                                                            {renderRatingStars(4)}
                                                        </div>
                                                        <span className="text-sm font-medium">Sarah M.</span>
                                                    </div>
                                                    <h4 className="font-medium text-gray-900 mb-1">Great value</h4>
                                                    <p className="text-sm text-gray-600">Very happy with my purchase. The only reason I didn't give 5 stars is because the color was slightly different than pictured.</p>
                                                    <div className="text-xs text-gray-400 mt-2">Posted on December 5, 2022</div>
                                                </div>
                                                <button className="mt-4 text-[#FF9F4A] hover:text-indigo-800 text-sm font-medium">
                                                    See all 24 reviews →
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Products Section */}
            <SimilarProductDynamicPage />

            {/* Mobile Sticky Add to Cart Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-10">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <div>
                        <div className="text-lg font-bold text-[#FF9F4A]">${product.price}</div>
                        {product.oldPrice && (
                            <div className="text-sm text-gray-500 line-through">${product.oldPrice}</div>
                        )}
                    </div>
                    <button
                        onClick={handleAddToCart}
                        className="bg-[#FF9F4A] hover:bg-[#FF9F4A] text-white font-medium px-6 py-3 rounded-lg transition-colors"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}