import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/products'; // Adjust to your API endpoint

// Fetch all products
export const getProducts = async () => {
    try {
        const response = await axios.get(BASE_URL);
        console.log('Fetched products:', response.data);
        return response.data; // Return the array of products
    } catch (error) {
        console.error('Error fetching products:', error);
        throw new Error('Could not fetch products');
    }
};

// Fetch a single product by ID
export const fetchProductById = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/${id}/`);
        console.log('Fetched product:', response.data);
        return response.data; // Return the product data
    } catch (error) {
        console.error('Error fetching product:', error);
        throw new Error('Could not fetch product');
    }
};

// Add a new product
export const addProduct = async (productData) => {
    try {
        const response = await axios.post(BASE_URL, productData);
        console.log('Product added:', response.data);
        return response.data; // Return the newly created product data
    } catch (error) {
        console.error('Error adding product:', error);
        throw new Error('Could not add product');
    }
};

// Update an existing product by ID
export const updateProduct = async (id, productData) => {
    try {
        const response = await axios.put(`${BASE_URL}/${id}/`, productData);
        console.log('Product updated:', response.data);
        return response.data; // Return the updated product data
    } catch (error) {
        console.error('Error updating product:', error);
        throw new Error('Could not update product');
    }
};

// Delete a product by ID
export const deleteProduct = async (id) => {
    try {
        const response = await axios.delete(`${BASE_URL}/${id}/`);
        console.log('Product deleted:', response.data);
        return response.data; // Return the response from deletion
    } catch (error) {
        console.error('Error deleting product:', error);
        throw new Error('Could not delete product');
    }
};

export default {
    getProducts,
    fetchProductById,
    addProduct,
    updateProduct,
    deleteProduct,
};
