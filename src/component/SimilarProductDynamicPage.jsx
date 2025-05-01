import React, { useRef } from 'react';
import { FaRegHeart, FaRegStar, FaStar, FaStarHalfAlt, FaChevronLeft, FaChevronRight, FaHeart } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addToWishlist, removeFromWishlist } from '../redux/wishlistSlice';
import { getCurrencySymbol } from '../utils/currencyUtils';

function SimilarProductDynamicPage() {
    const productStates = useSelector((state) => state.products);;
    console.log('productStates: ', productStates);
    const scrollRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const wishlist = useSelector((state) => state.wishlist);
    const currentCurrency = useSelector((state) => state.currency.currentCurrency);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    const toggleFavorite = (product) => {
        const isWished = wishlist.some(item => item.id === product.id);
        if (isWished) {
            dispatch(removeFromWishlist(product));
            toast.info(`Removed from wishlist`);
        } else {
            dispatch(addToWishlist(product));
            toast.success(`Added to wishlist`);
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

    return (
        <div className="relative w-full max-w-7xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>

            {/* Left Arrow */}
            <button
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-10"
                onClick={() => scroll('left')}
            >
                <FaChevronLeft />
            </button>

            {/* Scrollable Product List */}
            <div
                ref={scrollRef}
                className="flex overflow-x-auto space-x-4 scrollbar-hidden scroll-smooth"
            >
                {productStates.map((item) => {
                    // Check if the product is in the wishlist
                    const isWished = wishlist.some((wishlistItem) => wishlistItem.id === item.id);

                    return (
                        <div
                            key={item.id}
                            className="w-[250px] flex-shrink-0 bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
                        >
                            <div className="aspect-square bg-gray-100 relative">
                                <img
                                    onClick={() => navigate(`/product/${item.id}`)}
                                    src={item.imgSrc}
                                    alt={item.alt}
                                    className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                                />
                                <button
                                    onClick={() => toggleFavorite(item)} // Pass the `item` here
                                    className={`absolute top-3 right-3 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity ${isWished ? 'text-red-500' : 'text-gray-600'}`}
                                >
                                    {isWished ? <FaHeart className="text-xl" /> : <FaRegHeart className="text-xl" />}
                                </button>
                            </div>
                            <div className="p-4">
                                <h3 className="text-sm font-medium text-gray-800 truncate">{item.name}</h3>
                                <div className="flex items-center mt-1 mb-2">
                                    <div className="flex mr-1">{renderRatingStars(4)}</div>
                                    <span className="text-xs text-gray-500">(12)</span>
                                </div>
                                <div className="flex items-baseline">
                                    <span className="text-lg font-bold text-[#FF9F4A]">{getCurrencySymbol(currentCurrency)}{item.price}</span>
                                    <span className="text-sm text-gray-500 line-through ml-2">{getCurrencySymbol(currentCurrency)}{item.oldPrice}</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Right Arrow */}
            <button
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-10"
                onClick={() => scroll('right')}
            >
                <FaChevronRight />
            </button>
        </div>
    );
}

export default SimilarProductDynamicPage;
