// api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/', // Update this with your backend URL
});

// Intercept requests to include the token if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }
    return config;
});

export default api;
