// src/services/orderService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api'; // Adjust based on your API endpoint

// Create an axios instance for authenticated requests
const getToken = () => localStorage.getItem('authToken'); // Get token from localStorage

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        Authorization: `Token ${getToken()}`, // Attach the token for authenticated requests
    },
});

// Function to get all orders for the authenticated user
export const getOrders = async () => {
    try {
        const response = await axiosInstance.get('/orders/');
        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error; // Rethrow the error for further handling
    }
};

// Function to create a new order
export const createOrder = async (orderData) => {
    try {
        const response = await axiosInstance.post('/orders/create_order/', orderData);
        return response.data;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error; // Rethrow the error for further handling
    }
};

// Function to update an existing order by ID
export const updateOrder = async (orderId, orderData) => {
    try {
        const response = await axiosInstance.put(`/orders/${orderId}/`, orderData);
        return response.data;
    } catch (error) {
        console.error('Error updating order:', error);
        throw error; // Rethrow the error for further handling
    }
};

// Function to delete an order by ID
export const deleteOrder = async (orderId) => {
    try {
        const response = await axiosInstance.delete(`/orders/${orderId}/`);
        return response.data;
    } catch (error) {
        console.error('Error deleting order:', error);
        throw error; // Rethrow the error for further handling
    }
};

// Function to cancel an order by its ID (optional, if needed)
export const cancelOrder = async (orderId) => {
    try {
        const response = await axiosInstance.post('/orders/cancel_order/', { order_id: orderId });
        return response.data;
    } catch (error) {
        console.error('Error canceling order:', error);
        throw error; // Rethrow the error for further handling
    }
};

// Function to get a specific order by ID
export const getOrderById = async (orderId) => {
    try {
        const response = await axiosInstance.get(`/orders/${orderId}/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching order by ID:', error);
        throw error; // Rethrow the error for further handling
    }
};

// Export all functions for use in components
export default {
    getOrders,
    createOrder,
    updateOrder,
    deleteOrder,
    cancelOrder,
    getOrderById,
};
