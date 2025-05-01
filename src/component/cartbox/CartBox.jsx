import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { MdOutlineClose, MdDelete, MdAdd, MdRemove } from "react-icons/md";
import { removeItem, incrementQuantity, decrementQuantity, clearCart } from '../../redux/cartSlice';
import { useNavigate } from "react-router-dom";
import { getCurrencySymbol } from '../../utils/currencyUtils';

const CartBox = ({ isOpen, closeSidebar }) => {
  const cartRef = useRef();
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentCurrency = useSelector((state) => state.currency.currentCurrency);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        closeSidebar();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, closeSidebar]);

  const handleIncrement = (index) => {
    dispatch(incrementQuantity({ index }));
  };

  const handleDecrement = (index) => {
    dispatch(decrementQuantity({ index }));
  };

  const handleRemoveItem = (index) => {
    dispatch(removeItem({ index }));
  };

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

  const handleNavigateToCart = () => {
    navigate('/cart');
    closeSidebar()
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const getPercentageDiscount = (price, quantity, discount) => {
    const total = price * (quantity || 1);
    const match = discount?.toString().match(/-?(\d+)%/);
    const percent = match ? parseFloat(match[1]) : 0;
    const discountAmount = (percent / 100) * total;
    return (total - discountAmount).toFixed(2);
  };

  return (
    <div
      ref={cartRef}
      className={`fixed right-0 top-0 h-full bg-gradient-to-b from-white to-gray-50 shadow-2xl transform transition-all duration-300 ease-in-out z-[60] ${isOpen ? "translate-x-0" : "translate-x-full"
        } w-full md:w-[450px] flex flex-col`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-white">
        <h1 className="font-bold text-2xl bg-gradient-to-r from-[#FF7004] to-[#FF9F4A] bg-clip-text text-transparent">
          Shopping Cart
        </h1>
        <button
          onClick={closeSidebar}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <MdOutlineClose className="size-6 text-gray-600 hover:text-[#FF7004] transition" />
        </button>
      </div>

      {/* Clear Cart Button */}
      {cartItems.length > 0 && (
        <div className="p-4 bg-white">
          <button
            onClick={handleClearCart}
            className="w-full bg-red-50 text-red-600 font-medium py-2.5 rounded-xl hover:bg-red-100 transition flex items-center justify-center gap-2"
          >
            <MdDelete className="size-5" />
            Clear Cart
          </button>
        </div>
      )}

      {/* Cart Items */}
      <div className="flex-grow overflow-y-auto px-4 py-2">
        {cartItems.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-full text-center p-8">
            <div className="bg-gray-50 p-8 rounded-2xl mb-6">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
                alt="Empty Cart"
                className="w-32 h-32 opacity-70"
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Your cart is empty</h3>
            <p className="text-gray-500">Looks like you haven't added any items yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  <img
                    onClick={() => {
                      closeSidebar();
                      navigate(`/product/${item.id}`);
                    }}
                    src={item.imgSrc}
                    alt={item.alt}
                    className="w-24 h-28 object-cover rounded-lg cursor-pointer hover:opacity-90 transition"
                  />
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-1">{item.name}</h2>
                        <p className="text-sm text-gray-500 mb-2">s / purple / Metal</p>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(index)}
                        className="p-1.5 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <MdOutlineClose className="text-gray-400 hover:text-red-500 size-5" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Price:</span>
                        <span className="font-semibold text-[#FF7004]">{getCurrencySymbol(currentCurrency)}{item.price.toFixed(2)}</span>
                      </div>

                      {item.discount && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Discount:</span>
                          <span className="text-sm text-red-500">{item.discount}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Total Countity:</span>
                        <span className="text-sm text-red-500">{item.quantity || 1}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Total:</span>
                        <span className="font-semibold text-green-600">
                          {getCurrencySymbol(currentCurrency)}{getPercentageDiscount(item.price, item.quantity, item.discount)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => handleDecrement(index)}
                        className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
                      >
                        <MdRemove className="size-5" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity || 1}</span>
                      <button
                        onClick={() => handleIncrement(index)}
                        className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
                      >
                        <MdAdd className="size-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer - Total */}
      {cartItems.length > 0 && (
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="mb-4">
            <div className="flex justify-between items-center text-lg font-semibold mb-2">
              <span>Total Amount</span>
              <span className="text-[#FF7004]">{getCurrencySymbol(currentCurrency)}{calculateTotalPrice()}</span>
            </div>
            <p className="text-sm text-gray-500 text-right">Including all taxes and discounts</p>
          </div>
          <button
            onClick={handleNavigateToCart}
            className="w-full bg-gradient-to-r from-[#FF7004] to-[#FF9F4A] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default CartBox;