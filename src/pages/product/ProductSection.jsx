import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { FaCodeCompare } from 'react-icons/fa6';
import { HiOutlineViewGrid } from 'react-icons/hi';
import { IoIosCloseCircle } from 'react-icons/io';
import { addItem, removeItem } from '../../redux/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../redux/wishlistSlice';
import { addToCompare, removeFromCompare } from '../../redux/compareSlice';
import { toast } from 'react-toastify';
import { getCurrencySymbol } from '../../utils/currencyUtils';
import { fetchProducts } from '../../redux/productSlice';

const ProductSection = ({ onCartOpen }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const wishlist = useSelector((state) => state.wishlist);
    const compareList = useSelector((state) => state.compare);
    const currentCurrency = useSelector((state) => state.currency.currentCurrency);
    const cart = useSelector((state) => state.cart.items);
    
    // Get products from Redux store
    const { items: products = [], status, error } = useSelector((state) => state.products || { items: [], status: 'idle', error: null });
    const [cartItems, setCartItems] = useState([]);

    // Initialize cartItems based on the redux state
    useEffect(() => {
        if (cart) {
            setCartItems(cart.map(item => item.id));
        }
    }, [cart]);

    useEffect(() => {
        // Always fetch products when component mounts to ensure latest data
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleViewDetails = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
    };

    const toggleCompare = (product) => {
        const isCompared = compareList.some(item => item.id === product.id);
        if (isCompared) {
            dispatch(removeFromCompare(product));
        } else {
            if (compareList.length >= 4) {
                toast.warning("You can only compare up to 4 products");
                return;
            }
            dispatch(addToCompare(product));
        }
    };

    const handleAddToCart = (product) => {
        const userEmail = localStorage.getItem("userEmail");
        if (!userEmail) {
            navigate("/login");
            return;
        }

        const isInCart = cartItems.includes(product.id);
        
        if (isInCart) {
            const itemIndex = cart.findIndex(item => item.id === product.id);
            if (itemIndex !== -1) {
                dispatch(removeItem({ index: itemIndex }));
                setCartItems(cartItems.filter(id => id !== product.id));
            }
        } else {
            dispatch(addItem({ ...product, quantity: 1 }));
            setCartItems([...cartItems, product.id]);
            if (onCartOpen) onCartOpen();
        }
    };

    const toggleFavorite = (product) => {
        const isWished = wishlist.some(item => item.id === product.id);
        if (isWished) {
            dispatch(removeFromWishlist(product));
        } else {
            dispatch(addToWishlist(product));
        }
    };

    const filteredProducts = products?.filter((product) => {
        if (!searchTerm || !product) return true;
        
        const lowerSearch = searchTerm.toLowerCase();
        const name = product?.name?.toLowerCase() || "";
        const price = typeof product?.price === "number" ? product.price.toFixed(2) : "";
        const oldPrice = typeof product?.oldPrice === "number" ? product.oldPrice.toFixed(2) : "";

        return (
            name.includes(lowerSearch) ||
            price === searchTerm ||
            oldPrice === searchTerm
        );
    }) || [];

    // Sort products by id in descending order (newest first)
    const sortedProducts = [...(filteredProducts || [])].sort((a, b) => (b.id || 0) - (a.id || 0));

    // Add a function to manually refresh products
    const refreshProducts = () => {
        dispatch(fetchProducts());
    };

    if (status === 'loading') {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div className="text-center py-10">
                <div className="text-red-500 text-xl">Error loading products: {error}</div>
                <button 
                    onClick={() => dispatch(fetchProducts())}
                    className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                        Our Products
                    </h1>
                    <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
                        We are passionate about transforming houses into beautiful homes with our exquisite collection of handcrafted furniture.
                    </p>
                </div>

                <div className="flex justify-between items-center mb-8">
                    <div className="max-w-xl w-full">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={refreshProducts}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded inline-flex items-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                        </svg>
                        Refresh
                    </button>
                </div>

                {status === 'loading' && (
                    <div className="text-center my-4">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                        <p className="mt-2 text-gray-600">Loading products...</p>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {sortedProducts.length === 0 ? (
                        <div className="col-span-full text-center py-10">
                            <p className="text-gray-500 text-lg">No products found.</p>
                        </div>
                    ) : (
                        sortedProducts.map((product) => {
                            const isWished = wishlist.some(item => item.id === product.id);
                            
                            return (
                                <div key={product.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                                    <div className="relative">
                                        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-2xl">
                                            <img
                                                onClick={() => navigate(`/product/${product.id}`)}
                                                src={product.imgSrc && !product.imgSrc.includes('..') ? product.imgSrc : 'https://via.placeholder.com/300x200'}
                                                alt={product.alt || product.name}
                                                className="w-full h-[300px] object-cover transform group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                                            />
                                        </div>

                                        <div className="absolute top-4 right-4 flex flex-col gap-2">
                                            <button
                                                onClick={() => toggleFavorite(product)}
                                                className={`p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200 ${isWished ? 'text-red-500' : 'text-gray-600'}`}
                                            >
                                                {isWished ? <FaHeart className="text-xl" /> : <FaRegHeart className="text-xl" />}
                                            </button>

                                            <button
                                                onClick={() => handleViewDetails(product)}
                                                className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white text-gray-600 transition-all duration-200"
                                            >
                                                <HiOutlineViewGrid className="text-xl" />
                                            </button>

                                            <button
                                                onClick={() => toggleCompare(product)}
                                                className={`p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200 ${compareList.some(item => item.id === product.id) ? 'text-blue-500' : 'text-gray-600'}`}
                                            >
                                                <FaCodeCompare className="text-xl" />
                                            </button>
                                        </div>

                                        {product?.discount && (
                                            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-lg">
                                                {product.discount}
                                            </div>
                                        )}

                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            className={`m-3 rounded-2xl absolute bottom-0 left-0 right-0 ${cartItems.includes(product.id) ? 'bg-black' : 'bg-black'} text-white py-3 text-center font-medium transform translate-y-0 group-hover:translate-y-0 transition-transform duration-300`}
                                        >
                                            {cartItems.includes(product.id) ? 'Remove from Cart' : 'Add to Cart'}
                                        </button>
                                    </div>

                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                                        <div className="flex items-center gap-3">
                                            {typeof product.oldPrice === "number" && product.oldPrice > 0 && (
                                                <span className="text-gray-400 line-through">{getCurrencySymbol(currentCurrency)}{product.oldPrice.toFixed(2)}</span>
                                            )}
                                            {typeof product.price === "number" && (
                                                <span className="text-xl font-bold text-gray-900">{getCurrencySymbol(currentCurrency)}{product.price.toFixed(2)}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductSection; 