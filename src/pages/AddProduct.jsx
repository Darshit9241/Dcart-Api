import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addProduct } from '../redux/productSlice';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../context/ApiContext';
import { getProductCategories } from '../utils/categoryUtils';
import { currencies } from '../utils/currencyUtils';

const AddProduct = () => {
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
    const { addNewProduct, refreshData } = useApi();

    const [preview, setPreview] = useState(null);
    const navigate = useNavigate();

    // State for dropdowns
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
    const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
    const [availabilityDropdownOpen, setAvailabilityDropdownOpen] = useState(false);
    const categoryDropdownRef = useRef(null);
    const currencyDropdownRef = useRef(null);
    const availabilityDropdownRef = useRef(null);
    const currentCurrency = useSelector((state) => state.currency.currentCurrency);

    // Loading state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [retryAttempt, setRetryAttempt] = useState(0);

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

    // Monitor online status
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);

        // Close dropdown when clicking outside
        const handleClickOutside = (event) => {
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
                setCategoryDropdownOpen(false);
            }
            if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(event.target)) {
                setCurrencyDropdownOpen(false);
            }
            if (availabilityDropdownRef.current && !availabilityDropdownRef.current.contains(event.target)) {
                setAvailabilityDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Helper function to get currency symbol
    const getCurrencySymbol = (code) => {
        const currency = currencies.find(c => c.code === code);
        return currency ? currency.symbol : '$';
    };

    const handleChange = (e) => {
        const { name, value, files, type } = e.target;

        if (name === 'photo') {
            const file = files?.[0];
            if (file) {
                // Validate file type
                const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
                if (!allowedTypes.includes(file.type)) {
                    toast.error("Please select a valid image file (JPEG, PNG, GIF, or SVG)");
                    return;
                }
                
                // Validate file size (5MB limit)
                const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
                if (file.size > MAX_FILE_SIZE) {
                    toast.error("File size exceeds 5MB limit");
                    return;
                }
                
                // Use functional state update to avoid stale state issues on mobile
                setFormData(prevData => ({ ...prevData, photo: file }));
                
                try {
                    const previewUrl = URL.createObjectURL(file);
                    setPreview(previewUrl);
                } catch (error) {
                    console.error("Error creating preview URL:", error);
                    toast.error("Unable to preview image. Please try another file.");
                }
            } else {
                setFormData(prevData => ({ ...prevData, photo: null }));
                setPreview(null);
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

            // Convert to number and check if discount makes sense
            const discountValue = parseInt(numericValue);

            // Check if we have both price and oldPrice to validate discount
            if (formData.price && formData.oldPrice) {
                const price = parseFloat(formData.price);
                const oldPrice = parseFloat(formData.oldPrice);

                // Calculate what percentage discount would make new price = price
                const maxDiscount = Math.floor((oldPrice - price) / oldPrice * 100);

                // Ensure old price is higher than new price
                if (oldPrice <= price) {
                    toast.error("Old price must be higher than new price for a discount to be valid.");
                    return;
                }

                // Check if the discount is too high or negative
                if (discountValue > maxDiscount) {
                    toast.error(`Discount cannot be more than ${maxDiscount}%. This would make the new price lower than specified price.`);
                    return;
                }
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
            if (!file) {
                reject(new Error('No file selected'));
                return;
            }
            
            // Check file size (5MB limit)
            const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
            if (file.size > MAX_FILE_SIZE) {
                reject(new Error('File size exceeds 5MB limit'));
                return;
            }
            
            // Create a new FileReader for mobile compatibility
            const reader = new FileReader();
            
            // Set up events before reading the file (important for mobile)
            reader.onload = () => {
                // Ensure we have a valid result before resolving
                if (reader.result && typeof reader.result === 'string') {
                    resolve(reader.result);
                } else {
                    reject(new Error('File reading failed'));
                }
            };
            
            reader.onerror = (error) => {
                console.error('Error reading file:', error);
                reject(new Error('Failed to read file'));
            };
            
            // Add additional error handling
            reader.onabort = () => reject(new Error('File reading aborted'));
            
            // Read the file as a data URL
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setUploadError(null);

        // Check if we're online
        if (!isOnline) {
            setUploadError("You appear to be offline. Please check your internet connection and try again.");
            setIsSubmitting(false);
            toast.error("No internet connection detected");
            return;
        }

        // Validate all required fields
        if (!formData.name || !formData.price || formData.categories.length === 0 || !formData.description || !formData.availability) {
            setUploadError("Please fill in all required fields");
            setIsSubmitting(false);
            toast.error("Please fill in all required fields");
            return;
        }

        // Check if the photo is available
        if (!formData.photo) {
            setUploadError("Product image is required");
            setIsSubmitting(false);
            toast.error("Product image is required");
            return;
        }

        try {
            // Convert photo to base64 with retry mechanism for mobile
            let base64Image;
            let retryCount = 0;
            const maxRetries = 2;
            
            while (retryCount <= maxRetries) {
                try {
                    base64Image = await fileToBase64(formData.photo);
                    break; // If successful, exit the loop
                } catch (fileError) {
                    retryCount++;
                    setRetryAttempt(retryCount);
                    if (retryCount > maxRetries) {
                        console.error("Error converting file to base64:", fileError);
                        throw new Error(fileError.message || "Failed to process image file. Try using a smaller image or a different format.");
                    }
                    // Wait before retrying (helps on mobile)
                    await new Promise(resolve => setTimeout(resolve, 500));
                    toast.info(`Processing image... attempt ${retryCount}/${maxRetries + 1}`);
                }
            }

            // Create product object
            const newProduct = {
                name: formData.name,
                price: parseFloat(formData.price) || 0,
                oldPrice: parseFloat(formData.oldPrice) || 0,
                discount: formData.discount,
                description: formData.description,
                category: formData.category,
                categories: formData.categories,
                currency: formData.currency || 'USD',
                availability: formData.availability,
                imgSrc: base64Image,
                alt: formData.name,
            };

            // Add to Redux for immediate UI update
            dispatch(addProduct({
                id: Date.now(), // Temporary ID for Redux
                ...newProduct
            }));

            // Send to API via context
            try {
                let apiRetries = 0;
                const maxApiRetries = 2;
                let apiSuccess = false;
                
                while (apiRetries <= maxApiRetries && !apiSuccess) {
                    try {
                        // Check online status again before making API request
                        if (!navigator.onLine) {
                            throw new Error("Internet connection lost. Please reconnect and try again.");
                        }
                    
                        // Add timeout for mobile connections
                        const apiPromise = addNewProduct(newProduct);
                        const timeoutPromise = new Promise((_, reject) => 
                            setTimeout(() => reject(new Error('API request timed out')), 15000)
                        );
                        
                        // Race between API request and timeout
                        await Promise.race([apiPromise, timeoutPromise]);
                        apiSuccess = true;
                        
                        toast.success("Product uploaded successfully and added to API!");
                        
                        // Reset form
                        setFormData({
                            name: '',
                            price: '',
                            oldPrice: '',
                            discount: '',
                            description: '',
                            category: '',
                            categories: [],
                            currency: 'USD',
                            availability: '',
                            photo: null,
                        });
                        setPreview(null);
                        setRetryAttempt(0);
                        
                        // Navigate after successful submission
                        navigate('/product');
                        
                    } catch (apiError) {
                        apiRetries++;
                        setRetryAttempt(apiRetries);
                        console.error(`API Error (attempt ${apiRetries}/${maxApiRetries + 1}):`, apiError);
                        
                        if (apiRetries > maxApiRetries) {
                            // If we've exceeded retries, throw the error
                            throw new Error(apiError.message || "Failed to save product to database. Please check your internet connection and try again.");
                        }
                        
                        // Wait longer between retries (mobile connections may be slower)
                        await new Promise(resolve => setTimeout(resolve, 1500));
                        
                        // Show retrying toast
                        toast.info(`Connection issue. Retrying... (${apiRetries}/${maxApiRetries + 1})`);
                    }
                }
            } catch (apiError) {
                console.error("API Error:", apiError);
                throw new Error("Failed to save product to database. Please check your internet connection and try again.");
            }
        } catch (error) {
            const errorMessage = error.message || "Failed to upload product";
            toast.error(errorMessage);
            setUploadError(errorMessage);
            console.error(error);
            
            // Keep the form data so user doesn't lose their input
        } finally {
            setIsSubmitting(false);
            setRetryAttempt(0);
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

    const handleAvailabilitySelect = (availability) => {
        setFormData({ ...formData, availability });
        setAvailabilityDropdownOpen(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-white py-12 px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Add New Product</h2>
                    <p className="mt-3 text-gray-600 max-w-2xl mx-auto">Complete the form below to add a new product to your inventory</p>
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
                                <h3 className="text-sm font-medium text-red-800">Upload failed</h3>
                                <div className="mt-1 text-sm text-red-700">
                                    <p>{uploadError}</p>
                                </div>
                                <div className="mt-2">
                                    <ul className="list-disc pl-5 space-y-1 text-xs text-red-700">
                                        {uploadError.includes("database") && (
                                            <>
                                                <li>Check your internet connection (mobile data or Wi-Fi)</li>
                                                <li>Try switching to a different network</li>
                                                <li>Reduce image size if possible</li>
                                            </>
                                        )}
                                        {uploadError.includes("image") && (
                                            <>
                                                <li>Use a smaller image (under 1MB if possible)</li>
                                                <li>Try a different image format (JPG works best on mobile)</li>
                                                <li>Clear your browser cache and try again</li>
                                            </>
                                        )}
                                        <li>Verify image size (max 5MB recommended)</li>
                                        <li>Try uploading in a different file format</li>
                                        <li>Ensure all required fields are completed</li>
                                    </ul>
                                </div>
                                <div className="mt-3 flex space-x-2">
                                    <button
                                        onClick={() => setUploadError(null)}
                                        className="text-sm font-medium text-red-600 hover:text-red-500"
                                    >
                                        Dismiss
                                    </button>
                                    {!isOnline && (
                                        <button
                                            onClick={() => window.location.reload()}
                                            className="text-sm font-medium text-blue-600 hover:text-blue-500"
                                        >
                                            Try Again (Refresh)
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {retryAttempt > 0 && !uploadError && (
                    <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-yellow-800">Upload in progress</h3>
                                <div className="mt-1 text-sm text-yellow-700">
                                    <p>Retry attempt {retryAttempt} - Please wait while we process your request...</p>
                                </div>
                                <p className="text-xs text-yellow-600 mt-1">Mobile uploads may take longer due to connection limitations.</p>
                            </div>
                        </div>
                    </div>
                )}

                <form 
                    onSubmit={handleSubmit} 
                    className="bg-white p-8 rounded-2xl shadow-xl backdrop-blur-sm bg-opacity-90 border border-gray-100"
                    encType="multipart/form-data"
                    noValidate
                >
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
                                                className={`px-4 py-2 hover:bg-indigo-50 cursor-pointer transition-colors flex items-center justify-between ${formData.categories.includes(category) ? 'bg-indigo-50' : ''
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

                                <input
                                    type="hidden"
                                    name="categories"
                                    value={formData.categories}
                                    required
                                />
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
                                        required
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
                                            <span className="absolute left-4 top-3 text-gray-500">{getCurrencySymbol(currentCurrency)}</span>
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
                                            <span className="absolute left-4 top-3 text-gray-500">{getCurrencySymbol(currentCurrency)}</span>
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
                                        Enter a numeric value only. Old price must be higher than current price.
                                    </p>
                                </div>

                                {formData.price && formData.oldPrice && (
                                    <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100">
                                        <p className="text-sm font-medium text-indigo-800 flex items-center">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                                            <span className="font-semibold">Savings: </span>
                                            <span className="ml-1">
                                                {getCurrencySymbol(currentCurrency)}{(parseFloat(formData.oldPrice) - parseFloat(formData.price)).toFixed(2)}
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
                                                    <span className="font-bold text-xl text-gray-900">{getCurrencySymbol(currentCurrency)}{parseFloat(formData.price || 0).toFixed(2)}</span>
                                                    {formData.oldPrice && (
                                                        <span className="text-gray-500 line-through text-sm">{getCurrencySymbol(currentCurrency)}{parseFloat(formData.oldPrice).toFixed(2)}</span>
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
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-8 mt-8 border-t border-gray-100">
                        <button
                            type="submit"
                            disabled={isSubmitting || !formData.photo || !formData.name || !formData.price || formData.categories.length === 0 || !formData.description || !formData.availability}
                            onClick={(e) => {
                                if (e) e.preventDefault();
                                handleSubmit(e);
                            }}
                            className={`w-full inline-flex justify-center items-center px-6 py-4 border border-transparent text-base font-medium rounded-xl shadow-md text-white ${isSubmitting || !formData.photo || !formData.name || !formData.price || formData.categories.length === 0 || !formData.description || !formData.availability ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 active:from-indigo-800 active:to-purple-800'} transition-all duration-300`}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                    Upload Product
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;