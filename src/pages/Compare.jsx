import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCompare, clearCompare } from '../redux/compareSlice';
import { MdDelete, MdCompare, MdArrowBack } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

// Separate component for the comparison table
const ComparisonTable = ({ compareList, onRemoveProduct }) => {
    const attributes = [
        {
            key: 'image', label: 'Image', render: (product) => (
                <img
                    src={product.imgSrc}
                    alt={product.alt}
                    className="h-20 md:h-24 mx-auto object-contain rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                />
            )
        },
        {
            key: 'name', label: 'Product Name', render: (product) => (
                <span className="text-gray-800 font-medium">{product.name}</span>
            )
        },
        {
            key: 'oldPrice', label: 'Old Price', render: (product) => (
                <span className="line-through text-gray-500">${product.oldPrice}</span>
            )
        },
        {
            key: 'price', label: 'New Price', render: (product) => (
                <span className="text-green-600 font-semibold">${product.price}</span>
            )
        },
        {
            key: 'discount', label: 'Discount', render: (product) => (
                <span className="text-orange-500 font-medium">
                    {product.discount ? `${product.discount}%` : '0%'}
                </span>
            )
        },
        {
            key: 'finalPrice', label: 'Price After Discount', render: (product) => {
                const price = parseFloat(product.price || 0);
                const discount = parseFloat(product.discount || 0);
                const discountedPrice = price - (price * (Math.abs(discount) / 100));
                return (
                    <span className="font-bold text-green-600">
                        ${discountedPrice.toFixed(2)}
                    </span>
                );
            }
        }
    ];

    return (
        <motion.div
            className="overflow-x-auto w-full rounded-xl shadow-lg bg-white border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <table className="table-auto border-collapse w-full min-w-[600px] text-center">
                <thead>
                    <tr className="bg-gray-100 text-sm md:text-base">
                        <th className="p-3 md:p-4 w-[50px] md:w-[170px] lg:w-[180px] sticky left-0 bg-gray-100 z-10 rounded-tl-lg">Attributes</th>
                        {compareList.map((product) => (
                            <th key={product.id} className="p-3 md:p-4 relative">
                                <div className="flex flex-col items-center justify-center space-y-2">
                                    <button
                                        onClick={() => onRemoveProduct(product)}
                                        className="text-sm text-red-600 hover:text-red-800 transition-colors duration-200"
                                        aria-label="Remove from comparison"
                                    >
                                        <MdDelete className="text-xl" />
                                    </button>
                                    <span className="font-medium text-sm md:text-base text-center line-clamp-2">
                                        {product.name}
                                    </span>
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody className="text-xs md:text-sm">
                    {attributes.map(({ key, label, render }) => (
                        <tr key={key} className="border-t border-gray-200">
                            <td className="p-3 md:p-4 font-semibold sticky left-0 bg-white z-10">
                                {label}
                            </td>
                            {compareList.map((product) => (
                                <td key={`${product.id}-${key}`} className="p-3 md:p-4">
                                    {render(product)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </motion.div>
    );
};

// Main Compare component
const Compare = () => {
    const compareList = useSelector((state) => state.compare);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleRemoveProduct = (product) => {
        dispatch(removeFromCompare(product));
        toast.info(`${product.name} removed from comparison`);
    };

    const handleNavigateToHome = () => {
        navigate('/product');
    };

    const handleClearAndRedirect = () => {
        dispatch(clearCompare());
        toast.success('Comparison list cleared');
        navigate('/');
    };

    if (compareList.length === 0) {
        return (
            <motion.div
                className="flex flex-col items-center justify-center min-h-[60vh] p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="text-center p-10 bg-white rounded-2xl shadow-lg max-w-md w-full">
                    <MdCompare className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">No Products to Compare</h2>
                    <p className="text-gray-500 mb-6">Add some products to start comparing their features.</p>
                    <motion.button
                        onClick={handleNavigateToHome}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 w-full"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <MdArrowBack className="text-xl" />
                        Browse Products
                    </motion.button>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="p-4 md:p-10 max-w-7xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="mb-8 bg-gradient-to-r from-[#FF7004] to-[#FF9F4A] p-6 md:p-10 rounded-2xl text-white text-center">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <MdCompare className="w-12 h-12 mx-auto mb-4 text-blue-200" />
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">
                        Compare Products
                    </h1>
                    <p className="text-blue-100 text-lg">
                        Compare {compareList.length} product{compareList.length !== 1 ? 's' : ''}
                    </p>
                </motion.div>
            </div>

            <ComparisonTable
                compareList={compareList}
                onRemoveProduct={handleRemoveProduct}
            />

            <div className="mt-8 flex flex-col md:flex-row justify-center md:justify-between items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
                <motion.button
                    onClick={handleNavigateToHome}
                    className="bg-gradient-to-r from-[#FF7004] to-[#FF9F4A] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 w-full md:w-auto flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <MdArrowBack className="text-xl" />
                    Back To Products
                </motion.button>
                <motion.button
                    onClick={handleClearAndRedirect}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 w-full md:w-auto flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <MdDelete className="text-xl" />
                    Clear All
                </motion.button>
            </div>
        </motion.div>
    );
};

export default Compare;
