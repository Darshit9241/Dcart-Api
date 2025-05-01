import React, { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { updateProduct as updateProductRedux } from '../redux/productSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { useApi } from '../context/ApiContext';
import { getProductCategories } from '../utils/categoryUtils';

const EditProduct = () => {
    const { productId } = useParams();
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        oldPrice: '',
        discount: '',
        description: '',
        category: '',
        categories: [],
        photo: null,
        currency: 'USD',
        availability: '',
    });
    const dispatch = useDispatch();
    const { getProductById, updateProduct } = useApi();

    const [preview, setPreview] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    // State for dropdowns
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
    const [availabilityDropdownOpen, setAvailabilityDropdownOpen] = useState(false);
    const categoryDropdownRef = useRef(null);
    const availabilityDropdownRef = useRef(null);

    // Loading state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadError, setUploadError] = useState(null);

    // Get product categories from utility (excludes "All" category)
    const categories = getProductCategories();

    // Availability options
    const availabilityOptions = [
        "In Stock",
        "Out of Stock",
        "Pre-order",
        "Back-order",
        "Limited Stock",
        "Discontinued"
    ];

    // Load product data when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
        loadProductData();

        // Close dropdown when clicking outside
        const handleClickOutside = (event) => {
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
                setCategoryDropdownOpen(false);
            }
            if (availabilityDropdownRef.current && !availabilityDropdownRef.current.contains(event.target)) {
                setAvailabilityDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [productId]);

    const loadProductData = async () => {
        try {
            setLoading(true);
            // Get product from the context
            const product = getProductById(productId);
            
            if (!product) {
                toast.error("Product not found");
                navigate('/product');
                return;
            }

            // Set the form data with the product details
            setFormData({
                name: product.name || '',
                price: product.price ? product.price.toString() : '',
                oldPrice: product.oldPrice ? product.oldPrice.toString() : '',
                discount: product.discount || '',
                description: product.description || '',
                category: product.category || '',
                categories: initializeCategories(product),
                availability: product.availability || '',
                currency: 'USD', // Default
                photo: null,
            });

            // Set preview image
            setPreview(product.imgSrc);
        } catch (error) {
            console.error("Error loading product:", error);
            toast.error("Error loading product details");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, files, type } = e.target;

        if (name === 'photo') {
            const file = files?.[0];
            if (file) {
                setFormData({ ...formData, photo: file });
                setPreview(URL.createObjectURL(file));
            }
        } else if (name === 'discount') {
            // Remove any non-numeric characters except for dash at the beginning
            let numericValue = value.replace(/[^0-9-]/g, '');
            if (numericValue.startsWith('-')) {
                numericValue = '-' + numericValue.substring(1).replace(/-/g, '');
            } else {
                numericValue = numericValue.replace(/-/g, '');
            }

            // Ensure it's a valid number
            if (numericValue === '' || numericValue === '-') {
                setFormData({ ...formData, discount: '' });
                return;
            }

            // Format with percentage sign
            let formattedValue = numericValue + '%';
            setFormData({ ...formData, discount: formattedValue });
        } else if (type === 'number') {
            // Allow only positive numbers for price and old price
            if (name === 'price' || name === 'oldPrice') {
                if (parseFloat(value) < 0) {
                    toast.error("Price and Old Price cannot be negative.");
                    return;
                }
            }
            setFormData({ ...formData, [name]: value });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setUploadError(null);

        try {
            // Prepare updated product data
            const updatedProduct = {
                id: productId,
                name: formData.name,
                price: parseFloat(formData.price),
                oldPrice: parseFloat(formData.oldPrice),
                discount: formData.discount,
                description: formData.description,
                category: formData.category,
                categories: formData.categories,
                availability: formData.availability,
                alt: formData.name,
            };

            // If there's a new photo, convert it to base64
            if (formData.photo) {
                updatedProduct.imgSrc = await fileToBase64(formData.photo);
            } else {
                // Keep the existing image
                updatedProduct.imgSrc = preview;
            }

            // Update product in API
            await updateProduct(productId, updatedProduct);
            
            // Update Redux state
            dispatch(updateProductRedux(updatedProduct));
            
            toast.success("Product updated successfully!");
            
            // Navigate back to products page
            navigate('/product');
        } catch (error) {
            const errorMessage = error.message || "Failed to update product";
            toast.error(errorMessage);
            setUploadError(errorMessage);
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCategorySelect = (category) => {
        // Check if category is already selected
        if (formData.categories.includes(category)) {
            // Remove category if already selected
            setFormData({
                ...formData,
                categories: formData.categories.filter(cat => cat !== category)
            });
        } else {
            // Add category if not already selected
            setFormData({
                ...formData,
                categories: [...formData.categories, category]
            });
        }
    };

    const handleAvailabilitySelect = (availability) => {
        setFormData({ ...formData, availability });
        setAvailabilityDropdownOpen(false);
    };

    // For backward compatibility, also update the single category field
    useEffect(() => {
        if (formData.categories.length > 0) {
            setFormData(prev => ({
                ...prev,
                category: formData.categories.join(', ')
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                category: ''
            }));
        }
    }, [formData.categories]);

    // Add initializeCategories function
    const initializeCategories = (product) => {
        // If product already has a categories array, use it
        if (product.categories && Array.isArray(product.categories)) {
            return [...product.categories];
        }
        // If product has comma-separated category string, convert to array
        else if (product.category && product.category.includes(',')) {
            return product.category.split(',').map(cat => cat.trim());
        }
        // Otherwise use single category as array element
        else if (product.category) {
            return [product.category];
        }
        return [];
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-white py-12 px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Edit Product</h2>
                    <p className="mt-3 text-gray-600 max-w-2xl mx-auto">Update the details of your product</p>
                </div>

                {uploadError && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Update failed</h3>
                                <div className="mt-1 text-sm text-red-700">
                                    <p>{uploadError}</p>
                                </div>
                                <div className="mt-2">
                                    <ul className="list-disc pl-5 space-y-1 text-xs text-red-700">
                                        <li>Check your internet connection</li>
                                        <li>Verify image size (max 5MB recommended)</li>
                                        <li>Try uploading in a different file format</li>
                                        <li>Ensure all required fields are completed</li>
                                    </ul>
                                </div>
                                <button 
                                    onClick={() => setUploadError(null)}
                                    className="mt-3 text-sm font-medium text-red-600 hover:text-red-500"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl backdrop-blur-sm bg-opacity-90 border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left column - Basic Info & Image */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                    Basic Information
                                </h3>

                                <div className="mt-5">
                                    <label className="block mb-2 text-gray-700 font-medium">Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter product name"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200 shadow-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="relative" ref={categoryDropdownRef}>
                                <label className="block mb-2 text-gray-700 font-medium">Categories <span className="text-red-500">*</span></label>
                                <div
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 flex justify-between items-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 hover:bg-gray-50 transition duration-200 shadow-sm"
                                    onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                                >
                                    <span className={formData.categories.length > 0 ? "text-gray-800" : "text-gray-400"}>
                                        {formData.categories.length > 0 
                                            ? formData.categories.join(', ')
                                            : "Select categories"}
                                    </span>
                                    <svg
                                        className={`w-5 h-5 transition-transform duration-300 ${categoryDropdownOpen ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>

                                {categoryDropdownOpen && (
                                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-xl max-h-60 overflow-y-auto animate-fadeIn">
                                        {categories.map((category, index) => (
                                            <div
                                                key={index}
                                                className={`px-4 py-2 hover:bg-indigo-50 cursor-pointer transition-colors flex items-center justify-between ${
                                                    formData.categories.includes(category) ? 'bg-indigo-50' : ''
                                                }`}
                                                onClick={() => handleCategorySelect(category)}
                                            >
                                                <span>{category}</span>
                                                {formData.categories.includes(category) && (
                                                    <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                                    </svg>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Add Availability Dropdown */}
                            <div className="relative" ref={availabilityDropdownRef}>
                                <label className="block mb-2 text-gray-700 font-medium">Availability <span className="text-red-500">*</span></label>
                                <div
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 flex justify-between items-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 hover:bg-gray-50 transition duration-200 shadow-sm"
                                    onClick={() => setAvailabilityDropdownOpen(!availabilityDropdownOpen)}
                                >
                                    <span className={formData.availability ? "text-gray-800" : "text-gray-400"}>
                                        {formData.availability || "Select availability"}
                                    </span>
                                    <svg
                                        className={`w-5 h-5 transition-transform duration-300 ${availabilityDropdownOpen ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>

                                {availabilityDropdownOpen && (
                                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-xl max-h-60 overflow-y-auto animate-fadeIn">
                                        {availabilityOptions.map((option, index) => (
                                            <div
                                                key={index}
                                                className="px-4 py-2 hover:bg-indigo-50 cursor-pointer transition-colors"
                                                onClick={() => handleAvailabilitySelect(option)}
                                            >
                                                {option}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <input
                                    type="hidden"
                                    name="availability"
                                    value={formData.availability}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-gray-700 font-medium">Description <span className="text-red-500">*</span></label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Enter product description"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200 shadow-sm"
                                    rows="4"
                                    required
                                />
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    Product Image
                                </h3>

                                <div className="mt-5 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center transition-all hover:border-indigo-300 hover:bg-indigo-50/30">
                                    <input
                                        type="file"
                                        name="photo"
                                        id="product-photo"
                                        accept="image/*"
                                        onChange={handleChange}
                                        className="hidden"
                                    />

                                    {!preview ? (
                                        <label htmlFor="product-photo" className="cursor-pointer block">
                                            <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-indigo-50 flex items-center justify-center">
                                                <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                                </svg>
                                            </div>
                                            <p className="text-indigo-600 font-medium">Click to upload image</p>
                                            <p className="text-gray-500 text-xs mt-1">SVG, PNG, JPG or GIF</p>
                                        </label>
                                    ) : (
                                        <div>
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="w-40 h-40 object-cover rounded-xl mx-auto shadow-md transition-transform hover:scale-105 duration-300"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://via.placeholder.com/150?text=Image+Error";
                                                }}
                                            />
                                            <div className="mt-4 flex justify-center space-x-3">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData({ ...formData, photo: null });
                                                        setPreview(null);
                                                    }}
                                                    className="text-red-500 font-medium text-sm px-3 py-1 rounded-lg hover:bg-red-50"
                                                >
                                                    Remove
                                                </button>
                                                <label htmlFor="product-photo" className="text-indigo-600 font-medium text-sm cursor-pointer px-3 py-1 rounded-lg hover:bg-indigo-50">
                                                    Change
                                                </label>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right column - Pricing */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    Pricing Details
                                </h3>
                                <div className="mt-5 grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block mb-2 text-gray-700 font-medium">New Price <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-3 text-gray-500">$</span>
                                            <input
                                                type="number"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleChange}
                                                placeholder="0.00"
                                                className="w-full border border-gray-300 rounded-xl pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200 shadow-sm"
                                                required
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block mb-2 text-gray-700 font-medium">Old Price</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-3 text-gray-500">$</span>
                                            <input
                                                type="number"
                                                name="oldPrice"
                                                value={formData.oldPrice}
                                                onChange={handleChange}
                                                placeholder="0.00"
                                                className="w-full border border-gray-300 rounded-xl pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200 shadow-sm"
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <label className="block mb-2 text-gray-700 font-medium">Discount</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="discount"
                                            value={formData.discount}
                                            onChange={handleChange}
                                            placeholder="Enter discount percentage"
                                            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200 shadow-sm"
                                        />
                                        {!formData.discount && (
                                            <span className="absolute right-4 top-3 text-gray-400">%</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Enter a numeric value only. Old price must be higher than new price for a discount to be valid.
                                    </p>
                                </div>

                                {formData.price && formData.oldPrice && (
                                    <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100">
                                        <p className="text-sm font-medium text-indigo-800 flex items-center">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                                            <span className="font-semibold">Savings: </span>
                                            <span className="ml-1">
                                                ${(parseFloat(formData.oldPrice) - parseFloat(formData.price)).toFixed(2)}
                                                {' '}({Math.round((1 - parseFloat(formData.price) / parseFloat(formData.oldPrice)) * 100)}% off)
                                            </span>
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Preview Card */}
                            <div className="mt-6">
                                <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                    Product Preview
                                </h3>

                                <div className="mt-5 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <div className="p-5">
                                        <div className="flex items-start space-x-5">
                                            {preview ? (
                                                <img
                                                    src={preview}
                                                    alt="Preview"
                                                    className="w-24 h-24 object-cover rounded-xl shadow-md"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "https://via.placeholder.com/150?text=Image+Error";
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center">
                                                    <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                    </svg>
                                                </div>
                                            )}

                                            <div>
                                                <h4 className="font-medium text-lg text-gray-800">{formData.name || "Product Name"}</h4>
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {formData.categories.length > 0 ? (
                                                        formData.categories.map((cat, index) => (
                                                            <span key={index} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">
                                                                {cat}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <p className="text-gray-500 text-sm">No categories selected</p>
                                                    )}
                                                </div>
                                                
                                                {/* Display availability status in preview */}
                                                {formData.availability && (
                                                    <p className={`text-sm mt-2 px-2 py-0.5 rounded-md inline-block ${
                                                        formData.availability === 'In Stock' ? 'text-green-700 bg-green-50' : 
                                                        formData.availability === 'Out of Stock' ? 'text-red-700 bg-red-50' : 
                                                        formData.availability === 'Limited Stock' ? 'text-orange-700 bg-orange-50' : 
                                                        'text-yellow-700 bg-yellow-50'
                                                    }`}>
                                                        {formData.availability}
                                                    </p>
                                                )}

                                                <div className="flex items-center space-x-2 mt-3">
                                                    <span className="font-bold text-xl text-gray-900">${parseFloat(formData.price || 0).toFixed(2)}</span>
                                                    {formData.oldPrice && (
                                                        <span className="text-gray-500 line-through text-sm">${parseFloat(formData.oldPrice).toFixed(2)}</span>
                                                    )}
                                                    {formData.discount && (
                                                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                                                            {formData.discount}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 text-sm mt-4 line-clamp-2">{formData.description || "No description provided"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-8 mt-8 border-t border-gray-100">
                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => navigate('/product')}
                                        className="w-1/3 px-6 py-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 shadow-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !formData.name || !formData.price || !formData.categories.length || !formData.description || !formData.availability}
                                        className={`w-2/3 inline-flex justify-center items-center px-6 py-4 border border-transparent text-base font-medium rounded-xl shadow-md text-white ${isSubmitting || !formData.name || !formData.price || !formData.categories.length || !formData.description || !formData.availability ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'} transition-all duration-300`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                                                Update Product
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProduct; 