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
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white py-12 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Edit Product</h2>
                    <p className="mt-2 text-gray-600">Update the details of your product</p>
                </div>

                {uploadError && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
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

                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left column - Basic Info & Image */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Basic Information</h3>

                                <div className="mt-4">
                                    <label className="block mb-1 text-gray-700 font-medium">Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter product name"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="relative" ref={categoryDropdownRef}>
                                <label className="block mb-1 text-gray-700 font-medium">Categories <span className="text-red-500">*</span></label>
                                <div
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 flex justify-between items-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 hover:bg-gray-50 transition"
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
                                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
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
                                <label className="block mb-1 text-gray-700 font-medium">Availability <span className="text-red-500">*</span></label>
                                <div
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 flex justify-between items-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 hover:bg-gray-50 transition"
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
                                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
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
                                <label className="block mb-1 text-gray-700 font-medium">Description <span className="text-red-500">*</span></label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Enter product description"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                                    rows="4"
                                    required
                                />
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Product Image</h3>

                                <div className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
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
                                            <div className="mx-auto w-14 h-14 mb-3 rounded-full bg-indigo-50 flex items-center justify-center">
                                                <svg className="w-7 h-7 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                                </svg>
                                            </div>
                                            <p className="text-indigo-600 font-medium text-sm">Click to upload image</p>
                                            <p className="text-gray-500 text-xs mt-1">SVG, PNG, JPG or GIF</p>
                                        </label>
                                    ) : (
                                        <div>
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="w-32 h-32 object-cover rounded-lg mx-auto shadow"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://via.placeholder.com/150?text=Image+Error";
                                                }}
                                            />
                                            <div className="mt-3 flex justify-center space-x-3">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData({ ...formData, photo: null });
                                                        setPreview(null);
                                                    }}
                                                    className="text-red-500 font-medium text-xs"
                                                >
                                                    Remove
                                                </button>
                                                <label htmlFor="product-photo" className="text-indigo-600 font-medium text-xs cursor-pointer">
                                                    Change
                                                </label>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right column - Pricing */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Pricing Details</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-1 text-gray-700 font-medium">New Price <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-3 text-gray-500">$</span>
                                            <input
                                                type="number"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleChange}
                                                placeholder="0.00"
                                                className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                                                required
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block mb-1 text-gray-700 font-medium">Old Price</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-3 text-gray-500">$</span>
                                            <input
                                                type="number"
                                                name="oldPrice"
                                                value={formData.oldPrice}
                                                onChange={handleChange}
                                                placeholder="0.00"
                                                className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="block mb-1 text-gray-700 font-medium">Discount</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="discount"
                                            value={formData.discount}
                                            onChange={handleChange}
                                            placeholder="Enter discount percentage"
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                                        />
                                        {!formData.discount && (
                                            <span className="absolute right-3 top-3 text-gray-400">%</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Enter a numeric value only. Old price must be higher than new price for a discount to be valid.
                                    </p>
                                </div>

                                {formData.price && formData.oldPrice && (
                                    <div className="mt-4 bg-indigo-50 p-3 rounded-lg">
                                        <p className="text-sm text-indigo-700">
                                            <span className="font-medium">Savings: </span>
                                            ${(parseFloat(formData.oldPrice) - parseFloat(formData.price)).toFixed(2)}
                                            {' '}({Math.round((1 - parseFloat(formData.price) / parseFloat(formData.oldPrice)) * 100)}% off)
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Preview Card */}
                            <div className="mt-6">
                                <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Product Preview</h3>

                                <div className="mt-4 bg-white border border-gray-200 rounded-lg overflow-hidden shadow">
                                    <div className="p-4">
                                        <div className="flex items-start space-x-4">
                                            {preview ? (
                                                <img
                                                    src={preview}
                                                    alt="Preview"
                                                    className="w-20 h-20 object-cover rounded-lg shadow"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "https://via.placeholder.com/150?text=Image+Error";
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                    </svg>
                                                </div>
                                            )}

                                            <div>
                                                <h4 className="font-medium text-gray-800">{formData.name || "Product Name"}</h4>
                                                <p className="text-gray-500 text-sm">{formData.category || "Category"}</p>
                                                
                                                {/* Display availability status in preview */}
                                                {formData.availability && (
                                                    <p className={`text-sm mt-1 ${
                                                        formData.availability === 'In Stock' ? 'text-green-600' : 
                                                        formData.availability === 'Out of Stock' ? 'text-red-600' : 
                                                        formData.availability === 'Limited Stock' ? 'text-orange-600' : 
                                                        'text-yellow-600'
                                                    }`}>
                                                        {formData.availability}
                                                    </p>
                                                )}

                                                <div className="flex items-center space-x-2 mt-2">
                                                    <span className="font-bold text-gray-900">${parseFloat(formData.price || 0).toFixed(2)}</span>
                                                    {formData.oldPrice && (
                                                        <span className="text-gray-500 line-through text-sm">${parseFloat(formData.oldPrice).toFixed(2)}</span>
                                                    )}
                                                    {formData.discount && (
                                                        <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full font-medium">
                                                            {formData.discount}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-gray-600 text-sm mt-3 line-clamp-2">{formData.description || "No description provided"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => navigate('/product')}
                                        className="w-1/3 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !formData.name || !formData.price || !formData.categories.length || !formData.description || !formData.availability}
                                        className={`w-2/3 inline-flex justify-center items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white ${isSubmitting || !formData.name || !formData.price || !formData.categories.length || !formData.description || !formData.availability ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'} transition`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Updating...
                                            </>
                                        ) : (
                                            <>
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