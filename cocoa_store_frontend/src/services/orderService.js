import axios from 'axios';
import { getToken } from './authService'; // Assume this is where your token is stored

const API_URL = 'http://localhost:8000/api/orders'; // Your API endpoint for orders

// Set up the config with token
const getConfigWithToken = () => {
    const token = getToken(); // Retrieve token from localStorage
    return {
        headers: {
            Authorization: `Bearer ${token}`, // Add the token to the Authorization header
        },
    };
};

// Fetch all orders
export const getOrders = async () => {
    const config = getConfigWithToken();
    const response = await axios.get(API_URL, config);
    return response.data;
};

// Create a new order
export const createOrder = async (orderData) => {
    const config = getConfigWithToken();
    const response = await axios.post(API_URL, orderData, config);
    return response.data;
};

// Update an existing order
export const updateOrder = async (orderId, updateData) => {
    const config = getConfigWithToken();
    const response = await axios.put(`${API_URL}/${orderId}/`, updateData, config);
    return response.data;
};

// Delete an order
export const deleteOrder = async (orderId) => {
    const config = getConfigWithToken();
    const response = await axios.delete(`${API_URL}/${orderId}/`, config);
    return response.data;
};
