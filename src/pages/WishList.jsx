import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromWishlist, clearWishlist } from '../redux/wishlistSlice';
import { useNavigate } from 'react-router-dom';
import { addItem } from '../redux/cartSlice';
import { FaHeart, FaTrash, FaShoppingCart, FaArrowLeft, FaSort } from 'react-icons/fa';
import { MdOutlineFilterAlt } from 'react-icons/md';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const WishList = ({ onCartOpen }) => {
    const wishlistItems = useSelector((state) => state.wishlist);
    const cartItems = useSelector((state) => state.cart.items);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [sortBy, setSortBy] = useState('name');
    const [filterPrice, setFilterPrice] = useState('all');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []); 

    const handleClearCart = async () => {
        try {
            setIsLoading(true);
            await dispatch(clearWishlist());
            toast.success('Wishlist cleared successfully');
            navigate('/');
        } catch (error) {
            toast.error('Failed to clear wishlist');
        } finally {
            setIsLoading(false);
        }
    };

    const handleNavigateToPaymentPage = () => {
        if (cartItems.length > 0) {
            navigate('/product');
        }
    };

    const handleRemoveItem = async (item) => {
        try {
            setIsLoading(true);
            await dispatch(removeFromWishlist(item));
            toast.success('Item removed from wishlist');
        } catch (error) {
            toast.error('Failed to remove item');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddToCart = async (item) => {
        try {
            setIsLoading(true);
            await dispatch(addItem(item));
            onCartOpen();
            toast.success('Item added to cart');
        } catch (error) {
            toast.error('Failed to add item to cart');
        } finally {
            setIsLoading(false);
        }
    };

    const sortedAndFilteredItems = [...wishlistItems]
        .sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    const nameA = a?.name || '';
                    const nameB = b?.name || '';
                    return nameA.localeCompare(nameB);
                case 'price-low':
                    return (a?.price || 0) - (b?.price || 0);
                case 'price-high':
                    return (b?.price || 0) - (a?.price || 0);
                default:
                    return 0;
            }
        })
        .filter(item => {
            if (filterPrice === 'all') return true;
            const price = item?.price || 0;
            if (filterPrice === 'under-50') return price < 50;
            if (filterPrice === '50-100') return price >= 50 && price <= 100;
            if (filterPrice === 'over-100') return price > 100;
            return true;
        });

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header with enhanced styling */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4"
                >
                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.1, backgroundColor: '#f3f4f6' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(-1)}
                            className="text-gray-600 hover:text-gray-900 transition-all p-3 rounded-full hover:bg-gray-100 shadow-sm"
                            aria-label="Go back"
                        >
                            <FaArrowLeft className="text-xl" />
                        </motion.button>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                                My Wishlist 
                                <span className="ml-2 bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">({wishlistItems.length})</span>
                            </h1>
                            <p className="text-gray-500 mt-1 hidden sm:block">Items you've saved for later</p>
                        </div>
                    </div>
                    
                    {/* Enhanced Sort & Filter Controls */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4 sm:mt-0">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSort className="text-gray-400" />
                            </div>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white shadow-sm text-gray-700 hover:border-gray-400 transition-all appearance-none"
                            >
                                <option value="name">Sort by Name</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MdOutlineFilterAlt className="text-gray-400" />
                            </div>
                            <select
                                value={filterPrice}
                                onChange={(e) => setFilterPrice(e.target.value)}
                                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white shadow-sm text-gray-700 hover:border-gray-400 transition-all appearance-none"
                            >
                                <option value="all">All Prices</option>
                                <option value="under-50">Under $50</option>
                                <option value="50-100">$50 - $100</option>
                                <option value="over-100">Over $100</option>
                            </select>
                        </div>
                    </div>
                </motion.div>

                {/* Enhanced Wishlist Grid */}
                {wishlistItems.length > 0 ? (
                    <AnimatePresence>
                        <motion.div 
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, staggerChildren: 0.1 }}
                        >
                            {sortedAndFilteredItems.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -5 }}
                                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                                >
                                    <div className="relative overflow-hidden">
                                        <motion.div
                                            whileHover={{ scale: 1.08 }}
                                            transition={{ duration: 0.4 }}
                                            className="overflow-hidden"
                                        >
                                            <img
                                                src={item.imgSrc}
                                                alt={item.name}
                                                className="w-full h-64 object-cover cursor-pointer transition-transform duration-700 ease-in-out"
                                                onClick={() => navigate(`/product/${item.id}`)}
                                            />
                                        </motion.div>
                                        
                                        {/* Overlay with actions */}
                                        <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <motion.button
                                                whileHover={{ scale: 1.1, backgroundColor: '#ffffff' }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => navigate(`/product/${item.id}`)}
                                                className="m-2 p-3 bg-white bg-opacity-90 rounded-full shadow-lg text-gray-800 hover:text-purple-600 transition-all duration-300"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                </svg>
                                            </motion.button>
                                        </div>
                                        
                                        {item.discount && (
                                            <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-semibold px-4 py-1.5 rounded-full shadow-lg">
                                                {item.discount} OFF
                                            </div>
                                        )}
                                        <motion.button
                                            whileHover={{ scale: 1.1, backgroundColor: '#fee2e2' }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleRemoveItem(item)}
                                            className="absolute top-3 right-3 p-3 bg-white rounded-full shadow-lg hover:bg-red-100 transition-all duration-300"
                                            aria-label="Remove from wishlist"
                                        >
                                            <FaTrash className="text-red-500" />
                                        </motion.button>
                                    </div>
                                    <div className="p-6">
                                        <h3
                                            className="text-lg font-semibold text-gray-800 mb-2 cursor-pointer hover:text-[#FF9F4A] transition-colors line-clamp-2 group-hover:text-[#FF9F4A]"
                                            onClick={() => navigate(`/product/${item.id}`)}
                                        >
                                            {item.name}
                                        </h3>
                                        <div className="flex justify-between items-center mb-4">
                                            <p className="text-2xl font-bold bg-gradient-to-r from-[#FF7004] to-[#FF9F4A] bg-clip-text text-transparent">
                                                ${parseFloat(item.price).toFixed(2)}
                                            </p>
                                            {item.oldPrice && (
                                                <p className="text-sm text-gray-500 line-through">
                                                    ${parseFloat(item.oldPrice).toFixed(2)}
                                                </p>
                                            )}
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.03, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleAddToCart(item)}
                                            disabled={isLoading}
                                            className="w-full bg-gradient-to-r from-[#FF7004] to-[#FF9F4A] text-white py-3.5 rounded-xl hover:from-[#FF9F4A] hover:to-[#FF9F4A] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
                                        >
                                            <FaShoppingCart className="text-lg" />
                                            <span className="font-medium">Add to Cart</span>
                                        </motion.button>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100"
                    >
                        <motion.div
                            animate={{ 
                                scale: [1, 1.2, 1],
                                rotate: [0, 15, -15, 0]
                            }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                            className="relative inline-block"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                            <FaHeart className="mx-auto text-pink-500 text-8xl mb-8 relative z-10" />
                        </motion.div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
                        <p className="text-gray-600 mb-10 text-xl max-w-md mx-auto">Discover and save items you love to your wishlist</p>
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/product')}
                            className="bg-gradient-to-r from-[#FF7004] to-[#FF9F4A] text-white py-4 px-10 rounded-xl hover:from-[#FF9F4A] hover:to-[#FF9F4A] transition-all duration-300 shadow-lg font-medium text-lg"
                        >
                            Explore Products
                        </motion.button>
                    </motion.div>
                )}

                {/* Enhanced Bottom Buttons */}
                {wishlistItems.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-16 flex flex-col sm:flex-row gap-6 items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center">
                            <div className="bg-purple-100 p-3 rounded-full mr-4">
                                <FaHeart className="text-[#FF7004] text-xl" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Wishlist Summary</h3>
                                <p className="text-gray-500">{wishlistItems.length} items saved</p>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <motion.button
                                whileHover={{ scale: 1.03, backgroundColor: '#4b5563' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleClearCart}
                                disabled={isLoading}
                                className="w-full sm:w-auto bg-gray-600 text-white px-8 py-3.5 rounded-xl hover:bg-gray-700 transition-all duration-300 disabled:opacity-50 shadow-md hover:shadow-lg font-medium flex items-center justify-center gap-2"
                            >
                                <FaTrash className="text-sm" />
                                <span>Clear Wishlist</span>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.03, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleNavigateToPaymentPage}
                                disabled={cartItems.length === 0 || isLoading}
                                className="w-full sm:w-auto bg-gradient-to-r from-[#FF7004] to-[#FF9F4A] text-white px-8 py-3.5 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 shadow-md hover:shadow-lg font-medium flex items-center justify-center gap-2"
                            >
                                <FaShoppingCart className="text-sm" />
                                <span>Continue Shopping</span>
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default WishList;
