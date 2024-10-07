import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api'; // Adjust based on your API endpoint

// Function to create an axios instance with an up-to-date token
const createAxiosInstance = () => {
    const token = localStorage.getItem('authToken'); // Always get the latest token
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            Authorization: `Token ${token}` // Attach token dynamically
        }
    });
};

// Function to retrieve the cart for the authenticated user
export const getCart = async () => {
    try {
        const axiosInstance = createAxiosInstance();
        const response = await axiosInstance.get(`${BASE_URL}/cart/`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching cart:", error);
        throw error; // Propagate error to be handled in UI
    }
};

// Function to add an item to the cart
export const addToCart = async (productId, quantity = 1) => { // Default quantity to 1
    try {
        const axiosInstance = createAxiosInstance();
        const response = await axiosInstance.post(`${BASE_URL}/cart/add_to_cart/`, { product_id: productId, quantity });
        return response.data;
    } catch (error) {
        console.error("Error adding to cart:", error);
        throw error; // Propagate error to be handled in UI
    }
};

// Function to update the quantity of an item in the cart
export const updateCartItemQuantity = async (productId, quantity) => {
    try {
        const axiosInstance = createAxiosInstance();
        const response = await axiosInstance.post(`${BASE_URL}/cart/update_cart_item/`, { product_id: productId, quantity });
        return response.data;
    } catch (error) {
        console.error("Error updating cart item quantity:", error);
        throw error; // Propagate error to be handled in UI
    }
};

// Function to remove an item from the cart
export const removeFromCart = async (productId) => {
    try {
        const axiosInstance = createAxiosInstance();
        const response = await axiosInstance.post(`${BASE_URL}/cart/remove_from_cart/`, { product_id: productId });
        return response.data;
    } catch (error) {
        console.error("Error removing from cart:", error);
        throw error; // Propagate error to be handled in UI
    }
};

// Function to clear the entire cart
export const clearCart = async () => {
    try {
        const axiosInstance = createAxiosInstance();
        const response = await axiosInstance.post(`${BASE_URL}/cart/clear_cart/`);
        return response.data;
    } catch (error) {
        console.error("Error clearing cart:", error);
        throw error; // Propagate error to be handled in UI
    }
};

// Export all functions for use in components
export default {
    getCart,
    addToCart,
    updateCartItemQuantity, // Add this line to export the new function
    removeFromCart,
    clearCart,
};
