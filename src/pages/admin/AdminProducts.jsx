import React, { useState, useEffect, useCallback } from 'react';
import { useAdminTheme, AdminThemeProvider } from '../../component/admin/AdminThemeContext';
import ProductManagement from '../../component/admin/ProductManagement';
import AdminLayout from './AdminLayout';
import { useSelector, useDispatch } from 'react-redux';
import { removeProduct } from '../../redux/productSlice';
import { useNavigate } from 'react-router-dom';
import defaultProducts from '../../component/ProductData';
import { fetchProducts } from '../../utils/api';

const AdminProducts = () => {
  const { isDarkMode } = useAdminTheme();
  const navigate = useNavigate();
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });
  const currentCurrency = useSelector((state) => state.currency.currentCurrency);
  const dispatch = useDispatch();
  const reduxProducts = useSelector((state) => state.products);
  
  // Products state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        // Fetch products from the API using api.js
        const formattedProducts = await fetchProducts();
        setProducts(formattedProducts);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products from API. Using fallback data.');
        
        // Fallback to Redux products or default products
        if (reduxProducts && reduxProducts.length > 0) {
          setProducts(reduxProducts);
        } else {
          setProducts(defaultProducts);
        }
      } finally {
        setLoading(false);
      }
    };
    
    getProducts();
  }, [reduxProducts]);

  // Selected product modal state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);

  // Event handlers
  const handleAddProduct = () => {
    navigate('/addproduct');
  };

  const handleViewProductDetails = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleEditProduct = (product) => {
    navigate('/edit-product', { state: { product } });
  };

  const handleDeleteProduct = useCallback((productId) => {
    dispatch(removeProduct(productId));
    
    // Close the modal if the deleted product was being viewed
    if (selectedProduct && selectedProduct.id === productId) {
      setShowProductModal(false);
      setSelectedProduct(null);
    }
  }, [dispatch, selectedProduct]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const calculateDiscountPercentage = (oldPrice, price) => {
    if (!oldPrice || !price || oldPrice <= price) return 0;
    return Math.round(((oldPrice - price) / oldPrice) * 100);
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product => {
    return (
      (product.name && product.name.toLowerCase().includes(productSearchTerm.toLowerCase())) ||
      (product.id && product.id.toString().includes(productSearchTerm))
    );
  }).sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    if (sortConfig.key === 'price' || sortConfig.key === 'oldPrice') {
      const aValue = parseFloat(a[sortConfig.key]) || 0;
      const bValue = parseFloat(b[sortConfig.key]) || 0;
      
      if (sortConfig.direction === 'ascending') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    } else {
      const aValue = a[sortConfig.key] || '';
      const bValue = b[sortConfig.key] || '';
      
      if (sortConfig.direction === 'ascending') {
        return aValue.toString().localeCompare(bValue.toString());
      } else {
        return bValue.toString().localeCompare(aValue.toString());
      }
    }
  });

  return (
    <AdminLayout activeTab="products">
      <ProductManagement
        products={filteredProducts}
        loading={loading}
        error={error}
        isDarkMode={isDarkMode}
        productSearchTerm={productSearchTerm}
        setProductSearchTerm={setProductSearchTerm}
        handleAddProduct={handleAddProduct}
        handleViewProductDetails={handleViewProductDetails}
        handleEditProduct={handleEditProduct}
        handleDeleteProduct={handleDeleteProduct}
        requestSort={requestSort}
        sortConfig={sortConfig}
        calculateDiscountPercentage={calculateDiscountPercentage}
        currentCurrency={currentCurrency}
      />
    </AdminLayout>
  );
};

// Wrap with ThemeProvider
const AdminProductsWithTheme = () => {
  return (
    <AdminThemeProvider>
      <AdminProducts />
    </AdminThemeProvider>
  );
};

export default AdminProductsWithTheme; 