import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchProducts, createProduct, deleteProduct } from '../utils/api';
import { toast } from 'react-toastify';
import { filterByCategory } from '../utils/categoryUtils';

// Create context
const ApiContext = createContext();

// Custom hook to use the API context
export const useApi = () => useContext(ApiContext);

// Provider component
export const ApiProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch products on initial load
  useEffect(() => {
    loadProducts();
  }, []);

  // Function to load products from API
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProducts();
      setProducts(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error loading products:', err);
      setError(err.message);
      toast.error('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Function to add a new product
  const addNewProduct = async (productData) => {
    try {
      setLoading(true);
      const newProduct = await createProduct(productData);
      
      // Update local state with the new product
      setProducts(prevProducts => [...prevProducts, newProduct]);
      setLastUpdated(new Date());
      
      return newProduct;
    } catch (err) {
      console.error('Error adding product:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a product
  const removeProductFromApi = async (productId) => {
    try {
      setLoading(true);
      await deleteProduct(productId);
      
      // Update local state by removing the deleted product
      setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
      setLastUpdated(new Date());
      
      return true;
    } catch (err) {
      console.error('Error deleting product:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh data
  const refreshData = () => {
    return loadProducts();
  };

  // Search products by term
  const searchProducts = (term) => {
    if (!term) return products;
    
    const lowerTerm = term.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(lowerTerm) ||
      (product.description && product.description.toLowerCase().includes(lowerTerm))
    );
  };

  // Filter products by category
  const filterProductsByCategory = (category) => {
    return filterByCategory(products, category);
  };

  // Combined search and filter
  const searchAndFilterProducts = (term, category) => {
    let filtered = products;
    
    // Apply search filter if term exists
    if (term) {
      const lowerTerm = term.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(lowerTerm) ||
        (product.description && product.description.toLowerCase().includes(lowerTerm))
      );
    }
    
    // Apply category filter
    return filterByCategory(filtered, category);
  };

  // Get product by ID
  const getProductById = (id) => {
    return products.find(product => String(product.id) === String(id));
  };

  // Get related products (optionally by category)
  const getRelatedProducts = (productId, category = null, limit = 4) => {
    let relatedProducts = products.filter(product => String(product.id) !== String(productId));
    
    // Filter by category if provided
    if (category && category !== "All") {
      relatedProducts = relatedProducts.filter(product => product.category === category);
    }
    
    return relatedProducts.slice(0, limit);
  };

  // Context value
  const value = {
    products,
    loading,
    error,
    lastUpdated,
    refreshData,
    addNewProduct,
    removeProductFromApi,
    searchProducts,
    filterProductsByCategory,
    searchAndFilterProducts,
    getProductById,
    getRelatedProducts
  };

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
}; 