import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getCurrencySymbol } from '../../utils/currencyUtils';

function Box({ onCartOpen }) {
    const cartItems = useSelector((state) => state.cart.items);
    const cartItemCount = cartItems.length;
    const navigate = useNavigate();
    const currentCurrency = useSelector((state) => state.currency.currentCurrency);

    const calculateTotalPrice = () => {
        return cartItems.reduce((total, item) => {
            const quantity = item.quantity || 1;
            const price = item.price;
            const discountStr = item.discount?.toString() || "0";
            const match = discountStr.match(/-?(\d+)%/);
            const percent = match ? parseFloat(match[1]) : 0;
            const itemTotal = price * quantity;
            const discountAmount = (percent / 100) * itemTotal;
            return total + (itemTotal - discountAmount);
        }, 0).toFixed(2);
    };

    const handleAddToCart = () => {
        const userEmail = localStorage.getItem("userEmail");
        if (!userEmail) {
            navigate("/login")
            return; // Exit the function if the user is not logged in
        }
        onCartOpen();
    };

    return (
        <motion.div
            onClick={handleAddToCart}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            whileHover={{ scale: 1.05, boxShadow: '0px 4px 12px rgba(0,0,0,0.2)' }}
            className=" fixed right-0 top-[350px] transform -translate-y-1/2 z-50 cursor-pointer bg-[#292b2c] backdrop-blur-md shadow-lg p-4 rounded-l-2xl w-32 text-white"
        >
            <div style={{ color: "#FF7A04" }} className="flex justify-center items-center mb-2">
                <svg className="w-8 h-8 animate-pulse" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round"
                    strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
            </div>

            <h2 className="text-center font-semibold text-sm mb-1">
                {cartItemCount} {cartItemCount === 1 ? "Item" : "Items"}
            </h2>

            <button
                className="w-full text-sm font-bold text-black bg-white hover:bg-orange-200 transition-all duration-200 rounded-xl p-1 mt-1"
            >
                {getCurrencySymbol(currentCurrency)}{calculateTotalPrice()}
            </button>
        </motion.div>
    );
}

export default Box;
