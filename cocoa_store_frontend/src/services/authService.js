import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api'; // Adjust to your API endpoint

// Store token in localStorage
export const storeToken = (token) => {
    console.log('Storing token in localStorage:', token);
    localStorage.setItem('authToken', token);
};

// Remove token from localStorage
export const removeToken = () => {
    console.log('Removing token from localStorage');
    localStorage.removeItem('authToken');
};

// Get token from localStorage
export const getToken = () => {
    const token = localStorage.getItem('authToken');
    console.log('Retrieved token from localStorage:', token);
    return token;
};

// Login function
export const loginUser = async (credentials) => {
    console.log('Attempting to log in with credentials:', credentials);
    try {
        const response = await axios.post(`${BASE_URL}/auth/login/`, credentials);
        console.log('Login response:', response.data); // Log full response

        // Adjust based on your actual response structure
        const token = response.data['key'] || response.data.token; // Check both ways
        
        if (!token) {
            throw new Error('Token is undefined in the response.');
        }

        console.log('Login successful, received token:', token);
        storeToken(token); // Store token in localStorage
        return response.data; // Return the whole data including user info
    } catch (error) {
        console.error('Error logging in:', error.message);
        if (error.response) {
            throw new Error(error.response.data.detail || 'Login failed');
        } else {
            throw new Error('An error occurred during login.');
        }
    }
};

// Register function
export const registerUser = async (userData) => {
    console.log('Attempting to register with user data:', userData);
    try {
        const response = await axios.post(`${BASE_URL}/auth/register/`, userData);
        const token = response.data['key']; // Assuming the token is under 'key'
        console.log('Registration successful, received token:', token);
        storeToken(token); // Store token in localStorage after registration
        return response.data; // Return the whole data including user info
    } catch (error) {
        console.error('Error registering user:', error);
        if (error.response) {
            throw new Error(error.response.data.detail || 'Registration failed');
        } else {
            throw new Error('An error occurred during registration.');
        }
    }
};

// Fetch authenticated user data (requires a valid token)
export const fetchUserData = async () => {
    const token = getToken();
    if (!token) {
        console.warn('No token found, user data cannot be fetched');
        throw new Error('No token found');
    }

    console.log('Fetching user data with token:', token);
    try {
        const response = await axios.get(`${BASE_URL}/user/`, {
            headers: {
                Authorization: `Token ${token}`,
            },
        });

        console.log('User data fetched successfully:', response.data);
        return response.data; // Return the user data
    } catch (error) {
        console.error('Error fetching user data:', error);
        // If token is invalid or expired, clear token from storage
        if (error.response && error.response.status === 401) {
            removeToken();
        }
        throw new Error(error.response?.data?.detail || 'Failed to fetch user data');
    }
};

// Update user profile function
export const updateUserProfile = async (userData) => {
    const token = getToken();
    if (!token) {
        throw new Error('No token found');
    }

    console.log('Updating user profile with data:', userData);
    try {
        const response = await axios.put(`${BASE_URL}/user/`, userData, {
            headers: {
                Authorization: `Token ${token}`,
            },
        });
        console.log('User profile updated successfully:', response.data);
        return response.data; // Return the updated user data
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw new Error(error.response?.data?.detail || 'Failed to update user profile');
    }
};

// Logout function: clears token and logs the user out
export const logoutUser = () => {
    console.log('Logging out user');
    removeToken(); // Clear the token from localStorage
};

// Check if the user is authenticated (returns true/false)
export const isAuthenticated = () => {
    const token = getToken();
    const isAuthenticated = !!token; // Returns true if token exists, false otherwise
    console.log('Is user authenticated?', isAuthenticated);
    return isAuthenticated;
};

// Password Reset function
export const resetPassword = async (data) => {
    console.log('Attempting to reset password for email:', data.email);
    try {
        await axios.post(`${BASE_URL}/auth/password_reset/`, data);
        console.log('Password reset request sent successfully');
    } catch (error) {
        console.error('Error resetting password:', error);
        if (error.response) {
            throw new Error(error.response.data.detail || 'Password reset failed');
        } else {
            throw new Error('An error occurred during password reset.');
        }
    }
};

export default {
    loginUser,
    registerUser,
    fetchUserData,
    updateUserProfile, // Export the new function
    logoutUser,
    isAuthenticated,
    resetPassword,
};
