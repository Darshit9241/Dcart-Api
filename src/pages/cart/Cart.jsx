import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    removeItem,
    clearCart,
    decrementQuantity,
    incrementQuantity,
} from '../../redux/cartSlice';
import { useNavigate } from 'react-router-dom';
import { MdDelete, MdAdd, MdRemove, MdShoppingCart } from 'react-icons/md';
import { toast } from 'react-toastify';
import { getCurrencySymbol } from '../../utils/currencyUtils';

const Cart = () => {
    const cartItems = useSelector((state) => state.cart.items);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentCurrency = useSelector((state) => state.currency.currentCurrency);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleRemoveItem = (index) => {
        dispatch(removeItem({ index }));
        toast.info('Item removed from cart');
    };

    const handleClearCart = () => {
        dispatch(clearCart());
        toast.info('Cart cleared successfully');
        navigate('/');
    };

    const handleToHome = () => {
        navigate('/product');
    };

    const handleNavigateToPaymentPage = () => {
        if (cartItems.length > 0) {
            navigate('/cart/payment');
        }
    };

    const calculateItemTotal = (item) => {
        const price = parseFloat(item.price || 0);
        const discount = Math.abs(parseFloat(item.discount || 0));
        const quantity = parseInt(item.quantity || 0);
        const discountedPrice = price * (1 - discount / 100);
        return discountedPrice * quantity;
    };

    const totalAmount = cartItems.reduce(
        (total, item) => total + calculateItemTotal(item),
        0
    );

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-gray-100 p-8 rounded-full mb-6">
                    <MdShoppingCart className="w-24 h-24 text-gray-400" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    Your cart is empty
                </h2>
                <p className="text-gray-500 mb-6">
                    Looks like you haven't added any items yet.
                </p>
                <button
                    onClick={handleToHome}
                    className="bg-gradient-to-r from-[#FF7004] to-[#FF9F4A] text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Shopping Cart
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {cartItems.length} items in your cart
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                        <thead className="bg-gray-50">
                            <tr>
                                {['Product', 'Price', 'Discount', 'After Discount', 'Quantity', 'Total', 'Action'].map((text) => (
                                    <th
                                        key={text}
                                        className="p-4 text-left text-sm font-semibold text-gray-600"
                                    >
                                        {text}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {cartItems.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition">
                                    <td className="p-4">
                                        <div className="flex items-center gap-4 max-w-[250px]">
                                            <img
                                                onClick={() => {
                                                    navigate(`/product/${item.id}`);
                                                }}
                                                src={item.imgSrc}
                                                alt={item.name}
                                                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg cursor-pointer shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-gray-900 break-words line-clamp-2">
                                                    {item.name}
                                                </h3>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900">
                                                <span className="font-semibold text-[#FF7004]">{getCurrencySymbol(currentCurrency)}{parseFloat(item.price).toFixed(2)}</span>
                                            </span>
                                            {item.discount > 0 && (
                                                <span className="text-sm text-green-600">
                                                    {getCurrencySymbol(currentCurrency)}{(parseFloat(item.price) * (1 - item.discount / 100)).toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 text-red-500">
                                        {item.discount ? `${item.discount}` : '-0%'}
                                    </td>
                                    <td className="p-4">
                                        {(() => {
                                            const price = parseFloat(item.price || 0);
                                            const discount = Math.abs(parseFloat(item.discount || 0));
                                            const discountAmount = price * (discount / 100);
                                            const discountedPrice = price - discountAmount;

                                            return (
                                                <>
                                                   {getCurrencySymbol(currentCurrency)}{discountedPrice.toFixed(2)} <br />
                                                </>
                                            );
                                        })()}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => dispatch(decrementQuantity({ index }))}
                                                className="p-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg"
                                                disabled={item.quantity <= 1}
                                            >
                                                <MdRemove />
                                            </button>
                                            <span className="w-8 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => dispatch(incrementQuantity({ index }))}
                                                className="p-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg"
                                            >
                                                <MdAdd />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="p-4 font-semibold text-[#FF7004]">
                                    {getCurrencySymbol(currentCurrency)}{calculateItemTotal(item).toFixed(2)}
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleRemoveItem(index)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                        >
                                            <MdDelete />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <button
                            onClick={handleClearCart}
                            className="w-full sm:w-auto px-6 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 flex items-center justify-center gap-2"
                        >
                            <MdDelete />
                            Clear Cart
                        </button>

                        <div className="w-full sm:w-auto text-right">
                            <div className="text-lg font-semibold text-gray-900">
                                Total:{' '}
                                <span className="text-[#FF7004]">{getCurrencySymbol(currentCurrency)}{totalAmount.toFixed(2)}</span>
                            </div>
                            <button
                                onClick={handleNavigateToPaymentPage}
                                className="mt-2 w-full sm:w-auto bg-gradient-to-r from-[#FF7004] to-[#FF9F4A] text-white px-6 py-2.5 rounded-xl font-semibold hover:opacity-90"
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 text-center">
                <button
                    onClick={handleToHome}
                    className="text-gray-600 hover:text-gray-900 transition"
                >
                    ← Continue Shopping
                </button>
            </div>
        </div>
    );
};

export default Cart;
