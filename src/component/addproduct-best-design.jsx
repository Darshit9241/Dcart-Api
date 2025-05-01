import React, { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { addProduct } from '../../redux/productSlice';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        oldPrice: '',
        discount: '',
        description: '',
        category: '',
        photo: null,
    });
    const dispatch = useDispatch();

    const [preview, setPreview] = useState(null);
    const navigate = useNavigate();
    
    // New state for dropdown
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    
    const categories = [
        "Electronics", 
        "Clothing", 
        "Home & Kitchen", 
        "Beauty & Personal Care", 
        "Toys & Games", 
        "Books", 
        "Sports & Outdoors", 
        "Automotive", 
        "Health & Wellness", 
        "Grocery", 
        "Other"
    ];

    // Additional states for form steps
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        
        // Close dropdown when clicking outside
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleChange = (e) => {
        const { name, value, files, type } = e.target;

        if (name === 'photo') {
            const file = files?.[0];
            if (file) {
                setFormData({ ...formData, photo: file });
                setPreview(URL.createObjectURL(file));
            } else {
                setFormData({ ...formData, photo: null });
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
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const base64Image = await fileToBase64(formData.photo);
            const newProduct = {
                id: Date.now(),
                name: formData.name,
                price: parseFloat(formData.price),
                oldPrice: parseFloat(formData.oldPrice),
                discount: formData.discount,
                description: formData.description,
                category: formData.category,
                imgSrc: base64Image,
                alt: formData.name,
            };
            
            dispatch(addProduct(newProduct));
            toast.success("Product uploaded successfully!");
            setFormData({
                name: '',
                price: '',
                oldPrice: '',
                discount: '',
                description: '',
                category: '',
                photo: null,
            });
            setPreview("");
            navigate('/');
        } catch (error) {
            toast.error("Failed to upload product. Please try again.");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCategorySelect = (category) => {
        setFormData({ ...formData, category });
        setDropdownOpen(false);
    };

    const nextStep = () => {
        if (currentStep === 1 && (!formData.name || !formData.category || !formData.description)) {
            toast.error("Please fill in all required fields before proceeding");
            return;
        }
        if (currentStep === 2 && (!formData.price)) {
            toast.error("Please enter at least the current price");
            return;
        }
        setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    // Render form steps
    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Basic Information</h3>
                        
                        <div>
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

                        <div className="relative" ref={dropdownRef}>
                            <label className="block mb-1 text-gray-700 font-medium">Category <span className="text-red-500">*</span></label>
                            <div 
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 flex justify-between items-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 hover:bg-gray-50 transition"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                <span className={formData.category ? "text-gray-800" : "text-gray-400"}>
                                    {formData.category || "Select a category"}
                                </span>
                                <svg 
                                    className={`w-5 h-5 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24" 
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                            
                            {dropdownOpen && (
                                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                    {categories.map((category, index) => (
                                        <div 
                                            key={index} 
                                            className="px-4 py-2 hover:bg-indigo-50 cursor-pointer transition-colors"
                                            onClick={() => handleCategorySelect(category)}
                                        >
                                            {category}
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            <input 
                                type="hidden" 
                                name="category" 
                                value={formData.category} 
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
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Pricing Details</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-1 text-gray-700 font-medium">Price <span className="text-red-500">*</span></label>
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

                        <div>
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
                                Enter a numeric value only. Old price must be higher than current price.
                            </p>
                        </div>
                        
                        {formData.price && formData.oldPrice && (
                            <div className="bg-indigo-50 p-3 rounded-lg">
                                <p className="text-sm text-indigo-700">
                                    <span className="font-medium">Savings: </span>
                                    ${(parseFloat(formData.oldPrice) - parseFloat(formData.price)).toFixed(2)} 
                                    {' '}({Math.round((1 - parseFloat(formData.price)/parseFloat(formData.oldPrice)) * 100)}% off)
                                </p>
                            </div>
                        )}
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Product Image</h3>
                        
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
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
                                    <p className="text-indigo-600 font-medium">Click to upload product image</p>
                                    <p className="text-gray-500 text-sm mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
                                </label>
                            ) : (
                                <div>
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="w-48 h-48 object-cover rounded-lg mx-auto shadow"
                                    />
                                    <div className="mt-4 flex justify-center space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setFormData({ ...formData, photo: null });
                                                setPreview(null);
                                            }}
                                            className="text-red-500 font-medium text-sm"
                                        >
                                            Remove
                                        </button>
                                        <label htmlFor="product-photo" className="text-indigo-600 font-medium text-sm cursor-pointer">
                                            Change
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div className="bg-yellow-50 p-3 rounded-lg">
                            <p className="text-sm text-yellow-700">
                                <span className="font-medium">Note: </span>
                                Adding a high-quality image can increase product views by up to 40%.
                            </p>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Review and Submit</h3>
                        
                        <div className="bg-white rounded-lg overflow-hidden shadow">
                            <div className="grid grid-cols-3">
                                {preview && (
                                    <div className="col-span-1 bg-gray-100 flex items-center justify-center p-4">
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="w-full h-40 object-contain"
                                        />
                                    </div>
                                )}
                                
                                <div className={`${preview ? 'col-span-2' : 'col-span-3'} p-4`}>
                                    <h4 className="font-medium text-lg">{formData.name || "Product Name"}</h4>
                                    <p className="text-gray-500 text-sm mb-2">{formData.category || "Category"}</p>
                                    
                                    <div className="flex items-center space-x-3 mb-3">
                                        <span className="font-bold text-lg">${parseFloat(formData.price || 0).toFixed(2)}</span>
                                        {formData.oldPrice && (
                                            <span className="text-gray-500 line-through">${parseFloat(formData.oldPrice).toFixed(2)}</span>
                                        )}
                                        {formData.discount && (
                                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                                                {formData.discount}
                                            </span>
                                        )}
                                    </div>
                                    
                                    <p className="text-gray-700 text-sm line-clamp-3">{formData.description || "No description provided"}</p>
                                </div>
                            </div>
                        </div>
                        
                        {(!formData.photo || !formData.name || !formData.price || !formData.category || !formData.description) && (
                            <div className="bg-red-50 p-3 rounded-lg">
                                <p className="text-sm text-red-700">
                                    <span className="font-medium">Warning: </span>
                                    Some required fields are missing. Please go back and complete all required fields.
                                </p>
                            </div>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white py-12 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Add New Product</h2>
                    <p className="mt-2 text-gray-600">Complete the form below to add a new product to your inventory</p>
                </div>
                
                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        {["Basic Info", "Pricing", "Image", "Review"].map((step, index) => (
                            <div key={index} className="flex-1 text-center">
                                <div 
                                    className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center mb-2 
                                    ${currentStep > index + 1 ? 'bg-indigo-600 text-white' : 
                                      currentStep === index + 1 ? 'bg-white border-2 border-indigo-600 text-indigo-600' : 
                                      'bg-gray-200 text-gray-500'}`}
                                >
                                    {currentStep > index + 1 ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    ) : (
                                        index + 1
                                    )}
                                </div>
                                <p className={`text-xs font-medium ${currentStep === index + 1 ? 'text-indigo-600' : 'text-gray-500'}`}>{step}</p>
                            </div>
                        ))}
                    </div>
                    <div className="relative mt-2">
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200"></div>
                        <div 
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-indigo-600 transition-all duration-300" 
                            style={{ width: `${(currentStep - 1) * 100 / 3}%` }}
                        ></div>
                    </div>
                </div>
                
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg">
                    {renderStep()}
                    
                    <div className="mt-8 pt-5 border-t border-gray-200 flex justify-between">
                        {currentStep > 1 && (
                            <button
                                type="button"
                                onClick={prevStep}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                            >
                                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                </svg>
                                Previous
                            </button>
                        )}
                        
                        {currentStep < 4 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className={`${currentStep > 1 ? 'ml-auto' : ''} inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition`}
                            >
                                Next
                                <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={isSubmitting || !formData.photo || !formData.name || !formData.price || !formData.category || !formData.description}
                                className={`${currentStep > 1 ? 'ml-auto' : ''} inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white ${isSubmitting || !formData.photo || !formData.name || !formData.price || !formData.category || !formData.description ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'} transition`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Submit Product
                                        <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
