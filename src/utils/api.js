// API endpoint constants
const API_BASE_URL = 'https://6812f392129f6313e20fe2b3.mockapi.io';
const PRODUCTS_ENDPOINT = `${API_BASE_URL}/getproduct/product`;

/**
 * Format a product from the API to match the application's expected format
 * @param {Object} product - Raw product from API
 * @returns {Object} - Formatted product object
 */
export const formatProduct = (product) => {
  return {
    id: product.id,
    name: product.name,
    imgSrc: product.productimage,
    description: product.discription || "No description available",
    price: Number(product.newprice),
    oldPrice: Number(product.oldprice),
    alt: product.name,
    discount: product.discount,
    rating: 4.5, // Default rating since API doesn't provide one
    reviewCount: 24 // Default review count
  };
};

/**
 * Format product data for API submission
 * @param {Object} product - Product with application format
 * @returns {Object} - Formatted product for API
 */
export const formatProductForApi = (product) => {
  return {
    name: product.name,
    discription: product.description,
    productimage: product.imgSrc,
    newprice: product.price,
    oldprice: product.oldPrice,
    discount: product.discount,
    // Add any other fields the API expects
  };
};

/**
 * Create a new product via API
 * @param {Object} productData - The product data to create
 * @returns {Promise<Object>} - The created product
 */
export const createProduct = async (productData) => {
  try {
    const formattedData = formatProductForApi(productData);
    
    const response = await fetch(PRODUCTS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create product');
    }
    
    const data = await response.json();
    return formatProduct(data);
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

/**
 * Fetch all products from the API
 * @returns {Promise<Array>} - Array of formatted products
 */
export const fetchProducts = async () => {
  try {
    const response = await fetch(PRODUCTS_ENDPOINT);
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    
    const data = await response.json();
    return data.map(formatProduct);
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Fetch a single product by ID
 * @param {string} productId - ID of the product to fetch
 * @returns {Promise<Object>} - Formatted product object
 */
export const fetchProductById = async (productId) => {
  try {
    // Option 1: If API supports direct product fetching
    // const response = await fetch(`${PRODUCTS_ENDPOINT}/${productId}`);
    
    // Option 2: Fetch all products and filter (for APIs without direct endpoint)
    const response = await fetch(PRODUCTS_ENDPOINT);
    
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    
    const data = await response.json();
    
    // Find the product with matching ID
    const product = data.find(item => String(item.id) === String(productId));
    
    if (!product) {
      throw new Error('Product not found');
    }
    
    return formatProduct(product);
  } catch (error) {
    console.error(`Error fetching product with ID ${productId}:`, error);
    throw error;
  }
};

/**
 * Fetch related products (products except the one specified)
 * @param {string} productId - ID of the product to exclude
 * @param {number} limit - Maximum number of related products to return
 * @returns {Promise<Array>} - Array of formatted related products
 */
export const fetchRelatedProducts = async (productId, limit = 4) => {
  try {
    const response = await fetch(PRODUCTS_ENDPOINT);
    
    if (!response.ok) {
      throw new Error('Failed to fetch related products');
    }
    
    const data = await response.json();
    
    // Filter out the current product and limit the results
    const relatedProducts = data
      .filter(item => String(item.id) !== String(productId))
      .slice(0, limit)
      .map(formatProduct);
    
    return relatedProducts;
  } catch (error) {
    console.error('Error fetching related products:', error);
    throw error;
  }
};

/**
 * Delete a product from the API
 * @param {string} productId - ID of the product to delete
 * @returns {Promise<void>}
 */
export const deleteProduct = async (productId) => {
  try {
    const response = await fetch(`${PRODUCTS_ENDPOINT}/${productId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete product');
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting product with ID ${productId}:`, error);
    throw error;
  }
}; 