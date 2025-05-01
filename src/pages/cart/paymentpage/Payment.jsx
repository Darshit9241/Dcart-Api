import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaCheckCircle, FaLock, FaShoppingBag, FaShieldAlt } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { SiGooglepay, SiPaypal, SiVisa, SiCashapp } from 'react-icons/si';
import { coupons } from '../../../data/coupons'; // Make sure this file exists
import OrderSuccessModal from '../../../component/OrderSuccessModal';
import CouponModal from '../../../component/CouponModal';
import { toast } from 'react-toastify';
import { loadGooglePayScript, initializeGooglePay, processGooglePayment } from '../../../component/GooglePayService';
import { loadPayPalScript, renderPayPalButtons } from '../../../component/PayPalService';
import { getCurrencySymbol } from '../../../utils/currencyUtils';
import { removeItem } from '../../../redux/cartSlice';

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showOrderSuccessModal, setShowOrderSuccessModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const currentCurrency = useSelector((state) => state.currency.currentCurrency);
  const [paymentsClient, setPaymentsClient] = useState(null);
  const [userInfo, setUserInfo] = useState({
    name: '',
    city: '',
    state: '',
    pincode: '',
    shippingAddress: ''
  });
  const [errors, setErrors] = useState({});
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  // Credit card state
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  const [cardErrors, setCardErrors] = useState({});
  const [paypalSDKReady, setPaypalSDKReady] = useState(false);
  const [paypalButtonsRendered, setPaypalButtonsRendered] = useState(false);
  const paypalButtonRef = React.useRef(null);
  // const [isFirstPurchase, setIsFirstPurchase] = useState(true); // This should be determined by user's purchase history

  const cartItems = useSelector((state) => state.cart.items); // Added to fix ESLint error
  const dispatch = useDispatch();

  useEffect(() => {
    // Load Google Pay script
    const googlePayScript = loadGooglePayScript(() => {
      initializeGooglePay(setPaymentsClient);
    });

    // Load PayPal SDK
    const paypalScript = loadPayPalScript(() => {
      setPaypalSDKReady(true);
    });

    return () => {
      // Cleanup scripts
      if (googlePayScript && googlePayScript.parentNode) {
        document.body.removeChild(googlePayScript);
      }
      if (paypalScript && paypalScript.parentNode) {
        document.body.removeChild(paypalScript);
      }
    };
  }, []);

  // PayPal integration
  useEffect(() => {
    if (paypalSDKReady && paymentMethod === 'paypal' && !paypalButtonsRendered && paypalButtonRef.current) {
      const rendered = renderPayPalButtons(
        paypalButtonRef,
        getFinalPrice(),
        // On success callback
        (details) => {
          handlePlaceOrder();
        },
        // On error callback
        (errorMessage) => {
          toast.error(errorMessage);
        }
      );

      setPaypalButtonsRendered(rendered);
    }
  }, [paypalSDKReady, paymentMethod, paypalButtonsRendered]);

  useEffect(() => {
    // Reset PayPal buttons rendered state when payment method changes
    if (paymentMethod !== 'paypal') {
      setPaypalButtonsRendered(false);
    }
  }, [paymentMethod]);

  const calculateItemTotal = (item) => {
    const price = parseFloat(item.price || 0);
    const discount = Math.abs(parseFloat(item.discount || 0));
    const quantity = parseInt(item.quantity || 0);
    const discountedPrice = price * (1 - discount / 100);
    return discountedPrice * quantity;
  };

  const totalPrice = cartItems.reduce((total, item) => total + calculateItemTotal(item), 0);

  const cartItemCount = cartItems.length;
  const handlePaymentMethodChange = (method) => setPaymentMethod(method);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevState) => ({ ...prevState, [name]: value }));
  };

  const validateFields = () => {
    const newErrors = {};
    if (!userInfo.name) newErrors.name = 'Name is required';
    if (!userInfo.city) newErrors.city = 'City is required';
    if (!userInfo.state) newErrors.state = 'State is required';
    if (!userInfo.pincode) newErrors.pincode = 'Pincode is required';
    if (!userInfo.shippingAddress) newErrors.shippingAddress = 'Shipping Address is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = () => {
    if (!validateFields()) return;

    setIsPlacingOrder(true);

    // Process the order
    processOrder();
  };

  const processOrder = () => {
    const newOrder = {
      id: Math.floor(Math.random() * 100000).toString().padStart(5, '0'),
      date: new Date().toLocaleDateString('en-GB'),
      userInfo,
      cartItems,
      totalPrice: getFinalPrice(),
      paymentMethod,
      shippingCost: getShippingCost(),
      discount: appliedCoupon ? (appliedCoupon.type === 'percentage' || appliedCoupon.type === 'first_purchase'
        ? (totalPrice * appliedCoupon.value / 100)
        : getShippingCost()) : 0
    };

    // Save order to localStorage
    const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const updatedOrders = [...existingOrders, newOrder];
    localStorage.setItem('orders', JSON.stringify(updatedOrders));

    setTimeout(() => {
      setOrderDetails(newOrder);
      setShowOrderSuccessModal(true);
      setIsPlacingOrder(false);
    }, 2000);
  };

  const handleAddCoupon = (couponCode) => {
    setCouponCode(couponCode);
    setAppliedCoupon({
      code: couponCode,
      ...coupons[couponCode],
    });
    setCouponError('');
    setShowCouponModal(false);
  };

  const handleOpenCouponModal = () => {
    setShowCouponModal(true);
  };

  const handleCloseCouponModal = () => {
    setShowCouponModal(false);
  };

  const getFinalPrice = () => {
    let finalPrice = totalPrice;
    let shippingCost = 5; // Default shipping cost

    if (appliedCoupon) {
      switch (appliedCoupon.type) {
        case 'percentage':
          finalPrice = totalPrice * (1 - appliedCoupon.value / 100);
          break;
        case 'first_purchase':
          finalPrice = totalPrice * (1 - appliedCoupon.value / 100);
          break;
        case 'free_shipping':
          shippingCost = 0;
          break;
      }
    }

    return finalPrice + shippingCost;
  };

  const getShippingCost = () => {
    if (appliedCoupon && appliedCoupon.type === 'free_shipping') {
      return 0;
    }
    return 5; // Default shipping cost
  };

  const handleRemoveItem = (index) => {
    dispatch(removeItem({ index }));
    toast.info('Item removed from cart');
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardInfo((prevState) => ({ ...prevState, [name]: value }));

    // Clear error when user starts typing
    if (cardErrors[name]) {
      setCardErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }
  };

  const validateCardFields = () => {
    const newErrors = {};
    if (!cardInfo.cardNumber) newErrors.cardNumber = 'Card number is required';
    else if (!/^\d{16}$/.test(cardInfo.cardNumber.replace(/\s/g, '')))
      newErrors.cardNumber = 'Please enter a valid 16-digit card number';

    if (!cardInfo.cardName) newErrors.cardName = 'Cardholder name is required';

    if (!cardInfo.expiryDate) newErrors.expiryDate = 'Expiry date is required';
    else if (!/^\d{2}\/\d{2}$/.test(cardInfo.expiryDate))
      newErrors.expiryDate = 'Please use MM/YY format';

    if (!cardInfo.cvv) newErrors.cvv = 'CVV is required';
    else if (!/^\d{3,4}$/.test(cardInfo.cvv))
      newErrors.cvv = 'CVV must be 3 or 4 digits';

    setCardErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreditCardPayment = () => {
    if (!validateCardFields()) return false;

    // Simulate card processing
    setIsPlacingOrder(true);

    // In a real application, you would send the card details to your payment processor
    setTimeout(() => {
      // For demo purposes, we'll just simulate a successful payment
      console.log('Credit card payment processed successfully');
      processOrder();
    }, 2000);

    return true;
  };

  const handleGooglePayment = () => {
    processGooglePayment(
      paymentsClient,
      getFinalPrice(),
      // Success callback
      (paymentData) => {
        handlePlaceOrder();
      },
      // Error callback
      (errorMessage) => {
        toast.error(errorMessage);
      }
    );
  };

  const handlePayButtonClick = () => {
    if (!validateFields()) return;

    switch (paymentMethod) {
      case 'google-pay':
        handleGooglePayment();
        break;
      case 'credit-card':
        handleCreditCardPayment();
        break;
      case 'paypal':
        // PayPal is handled by the PayPal button itself
        if (!paypalButtonsRendered) {
          toast.info('Please click the PayPal button to complete payment');
        }
        break;
      default:
        handlePlaceOrder();
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-2 sm:p-4 md:p-6">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl p-3 sm:p-4 md:p-8 space-y-4 sm:space-y-6 md:space-y-8 animate-fadeIn">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <span>Checkout</span>
            <span className="text-blue-500">🛒</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Complete your purchase securely</p>
          <div className="flex items-center justify-center gap-2 mt-2 sm:mt-4 text-green-600 text-xs sm:text-sm">
            <FaShieldAlt />
            <span>Secure Payment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Left Column - Personal Information */}
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-gray-50 p-3 sm:p-4 md:p-6 rounded-xl space-y-4 sm:space-y-6 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 flex items-center gap-2">
                <FaLock className="text-green-500" />
                Personal Details
              </h2>

              <div className="space-y-3 sm:space-y-4">
                {['name', 'city', 'state'].map((field) => (
                  <div key={field}>
                    <label htmlFor={field} className="block text-gray-700 font-medium text-sm mb-2">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      type="text"
                      id={field}
                      name={field}
                      value={userInfo[field]}
                      onChange={handleInputChange}
                      placeholder={`Enter your ${field}`}
                      className={`w-full px-4 py-3 border ${errors[field] ? 'border-red-500' : 'border-gray-200'
                        } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200`}
                      required
                    />
                    {errors[field] && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <span>⚠️</span> {errors[field]}
                      </p>
                    )}
                  </div>
                ))}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="pincode" className="block text-gray-700 font-medium text-sm mb-2">
                      Pincode
                    </label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={userInfo.pincode}
                      onChange={handleInputChange}
                      placeholder="Enter your pincode"
                      className={`w-full px-4 py-3 border ${errors.pincode ? 'border-red-500' : 'border-gray-200'
                        } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200`}
                      required
                    />
                    {errors.pincode && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <span>⚠️</span> {errors.pincode}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="shippingAddress" className="block text-gray-700 font-medium text-sm mb-2">
                    Shipping Address
                  </label>
                  <textarea
                    id="shippingAddress"
                    name="shippingAddress"
                    value={userInfo.shippingAddress}
                    onChange={handleInputChange}
                    placeholder="Enter your shipping address"
                    rows={3}
                    className={`w-full px-4 py-3 border ${errors.shippingAddress ? 'border-red-500' : 'border-gray-200'
                      } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200`}
                    required
                  />
                  {errors.shippingAddress && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <span>⚠️</span> {errors.shippingAddress}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Order Information Section */}
            <div className="bg-gray-50 p-6 rounded-xl space-y-4 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 flex items-center gap-2">
                <FaShoppingBag className="text-blue-500" />
                Your Cart
              </h2>

              <div className="max-h-64 overflow-y-auto pr-2 space-y-3">
                {cartItems.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <p>Your cart is empty</p>
                  </div>
                ) : (
                  cartItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                      <img
                        src={item.imgSrc}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">{item.name}</h3>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>Qty: {item.quantity}</span>
                          <span>{getCurrencySymbol(currentCurrency)}{calculateItemTotal(item).toFixed(2)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="Remove item"
                      >
                        <MdDelete size={20} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="flex justify-between text-sm font-medium border-t border-gray-200 pt-3">
                <span>{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</span>
                <span className="text-blue-600">{getCurrencySymbol(currentCurrency)}{totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Right Column - Payment & Summary */}
          <div className="space-y-6">
            {/* Payment Method Selection */}
            {/* Coupon Section */}
            <div className="bg-gray-50 p-6 rounded-xl space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <span className="text-blue-500">🎟️</span> Promo Code
              </h2>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                />
                <button
                  onClick={handleOpenCouponModal}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#FF7004] to-[#FF9F4A] text-white rounded-lg hover:shadow-lg hover:opacity-90 transition-all duration-200 font-medium shadow-sm"
                >
                  Apply
                </button>
              </div>
              {couponError && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <span className="text-red-500">⚠️</span> {couponError}
                </p>
              )}
              {appliedCoupon && (
                <div className="bg-green-50 p-3 rounded-lg border border-green-100 flex items-center gap-2">
                  <FaCheckCircle className="text-green-500 flex-shrink-0" />
                  <p className="text-green-700 text-sm">{appliedCoupon.description}</p>
                </div>
              )}
              <button
                onClick={handleOpenCouponModal}
                className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1 w-fit"
              >
                <span>View available coupons</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                <span className="text-blue-500">💳</span> Payment Method
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: 'credit-card', label: 'Credit Card', icon: SiVisa, color: 'indigo' },
                  { id: 'google-pay', label: 'Google Pay', icon: SiGooglepay, color: 'blue' },
                  { id: 'paypal', label: 'PayPal', icon: SiPaypal, color: 'blue' },
                  { id: 'cod', label: 'Cash on Delivery', icon: SiCashapp, color: 'green' }
                ].map(({ id, label, icon: Icon, color }) => (
                  <label
                    key={id}
                    className={`relative flex flex-col items-center p-4 rounded-lg cursor-pointer border-2 transition-all duration-200 ${paymentMethod === id
                      ? `border-${color}-500 bg-${color}-50 shadow-md`
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={id}
                      checked={paymentMethod === id}
                      onChange={() => handlePaymentMethodChange(id)}
                      className="sr-only"
                    />
                    <Icon className={`text-4xl text-${color}-600 mb-2`} />
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                    {paymentMethod === id && (
                      <div className="absolute -top-2 -right-2">
                        <FaCheckCircle className={`text-${color}-500 text-xl`} />
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Credit Card Form */}
            {paymentMethod === 'credit-card' && (
              <div className="bg-gray-50 p-3 sm:p-4 md:p-6 rounded-xl space-y-3 sm:space-y-4 animate-fadeIn">
                <div>
                  <label className="block text-gray-700 font-medium text-sm mb-2">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={cardInfo.cardNumber}
                    onChange={handleCardInputChange}
                    placeholder="1234 5678 9012 3456"
                    className={`w-full px-4 py-3 border ${cardErrors.cardNumber ? 'border-red-500' : 'border-gray-200'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm`}
                  />
                  {cardErrors.cardNumber && (
                    <p className="text-red-500 text-xs mt-1">{cardErrors.cardNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium text-sm mb-2">Cardholder Name</label>
                  <input
                    type="text"
                    name="cardName"
                    value={cardInfo.cardName}
                    onChange={handleCardInputChange}
                    placeholder="John Doe"
                    className={`w-full px-4 py-3 border ${cardErrors.cardName ? 'border-red-500' : 'border-gray-200'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm`}
                  />
                  {cardErrors.cardName && (
                    <p className="text-red-500 text-xs mt-1">{cardErrors.cardName}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium text-sm mb-2">Expiry Date</label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={cardInfo.expiryDate}
                      onChange={handleCardInputChange}
                      placeholder="MM/YY"
                      className={`w-full px-4 py-3 border ${cardErrors.expiryDate ? 'border-red-500' : 'border-gray-200'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm`}
                    />
                    {cardErrors.expiryDate && (
                      <p className="text-red-500 text-xs mt-1">{cardErrors.expiryDate}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium text-sm mb-2">CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      value={cardInfo.cvv}
                      onChange={handleCardInputChange}
                      placeholder="123"
                      className={`w-full px-4 py-3 border ${cardErrors.cvv ? 'border-red-500' : 'border-gray-200'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm`}
                    />
                    {cardErrors.cvv && (
                      <p className="text-red-500 text-xs mt-1">{cardErrors.cvv}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 mt-2">
                  <SiVisa className="text-blue-700 text-2xl" />
                  <span className="text-2xl font-bold text-gray-300">|</span>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png" alt="Mastercard" className="h-8" />
                  <span className="text-2xl font-bold text-gray-300">|</span>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/200px-American_Express_logo_%282018%29.svg.png" alt="American Express" className="h-8" />
                </div>
              </div>
            )}

            {/* PayPal Payment */}
            {paymentMethod === 'paypal' && (
              <div className="bg-gray-50 p-3 sm:p-4 md:p-6 rounded-xl space-y-3 sm:space-y-4 animate-fadeIn">
                <div className="text-center mb-4">
                  <p className="text-gray-600 text-sm mb-4">
                    Click the PayPal button below to complete your payment securely via PayPal.
                  </p>
                  {!paypalSDKReady && (
                    <div className="flex justify-center">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <span className="ml-2 text-gray-600">Loading PayPal...</span>
                    </div>
                  )}
                  <div
                    ref={paypalButtonRef}
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {/* Order Summary */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                <span className="text-blue-500">📋</span> Order Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Items ({cartItemCount})</span>
                  <span>{getCurrencySymbol(currentCurrency)}{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{getCurrencySymbol(currentCurrency)}{getShippingCost().toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center gap-1">
                      <FaCheckCircle className="text-xs" />
                      Discount ({appliedCoupon.code})
                    </span>
                    <span>
                      -{getCurrencySymbol(currentCurrency)}{(
                        appliedCoupon.type === 'percentage' || appliedCoupon.type === 'first_purchase'
                          ? totalPrice * appliedCoupon.value / 100
                          : getShippingCost()
                      ).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-blue-600">{getCurrencySymbol(currentCurrency)}{getFinalPrice().toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Taxes included where applicable</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="button"
          className={`w-full bg-gradient-to-r from-[#FF7004] to-[#FF9F4A] text-white py-3 sm:py-4 rounded-xl transition-all duration-300 font-semibold text-base sm:text-lg shadow-md hover:shadow-lg hover:from-[#FF6000] hover:to-[#FF9040] ${isPlacingOrder ? 'opacity-75 cursor-not-allowed' : 'transform hover:-translate-y-1'
            }`}
          onClick={handlePayButtonClick}
          disabled={isPlacingOrder}
        >
          {isPlacingOrder ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <FaLock className="text-white/80" />
              {paymentMethod === 'cod' ? 'Place Order' : paymentMethod === 'paypal' ? 'Pay with PayPal' : 'Pay Now'} - {getCurrencySymbol(currentCurrency)}{getFinalPrice().toFixed(2)}
            </span>
          )}
        </button>

        <style jsx>{`          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out forwards;
          }
        `}</style>
      </div>

      {/* Modals */}
      {showOrderSuccessModal && (
        <OrderSuccessModal
          orderDetails={orderDetails}
          onClose={() => setShowOrderSuccessModal(false)}
        />
      )}

      <CouponModal
        showModal={showCouponModal}
        onClose={handleCloseCouponModal}
        handleAddCoupon={handleAddCoupon}
      />
    </div>
  );
};

export default Payment;

