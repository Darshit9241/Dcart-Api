// src/pages/CouponPage.js
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { coupons } from '../data/coupons';
import { motion } from 'framer-motion';

const Coupon = () => {
    const [copiedCode, setCopiedCode] = useState(null);

    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        toast.success('🎉 Copied! Now paste it at checkout.');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 px-4 py-16">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
                        🎁 Exclusive Deals & Offers
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Browse through our collection of premium coupons and save big on your next purchase!
                    </p>
                </motion.div>

                <motion.ul 
                    className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    {Object.entries(coupons).map(([code, details], idx) => (
                        <motion.li
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ scale: 1.03, translateY: -5 }}
                            className="relative bg-white rounded-3xl p-8 shadow-xl border border-orange-100 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-100 rounded-bl-full opacity-50" />
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-6">
                                    <span className="px-3 py-1 text-xs font-semibold text-orange-600 bg-orange-100 rounded-full">
                                        SAVE NOW
                                    </span>
                                    <div className="w-12 h-12 flex items-center justify-center bg-orange-50 rounded-full">
                                        🏷️
                                    </div>
                                </div>
                                
                                <h3 className="text-3xl font-bold text-gray-800 mb-3 tracking-tight">
                                    {code}
                                </h3>
                                <p className="text-gray-600 mb-8 min-h-[3rem]">{details.description}</p>

                                <button
                                    className={`w-full py-3 px-6 text-lg font-semibold rounded-xl transition-all duration-300 transform ${
                                        copiedCode === code
                                            ? 'bg-green-500 text-white shadow-green-200 shadow-lg'
                                            : 'bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-200'
                                    }`}
                                    onClick={() => handleCopyCode(code)}
                                    disabled={copiedCode === code}
                                    aria-label={`Copy ${code} to clipboard`}
                                >
                                    {copiedCode === code ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            Copied!
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                            </svg>
                                            Copy Code
                                        </span>
                                    )}
                                </button>
                            </div>
                        </motion.li>
                    ))}
                </motion.ul>
            </div>
        </div>
    );
};

export default Coupon;
