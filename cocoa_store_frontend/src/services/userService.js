// src/services/userService.js

import api from './api';

// Fetch all user profiles
export const fetchUserProfile = async () => {
    const response = await api.get('user-profiles/');
    return response.data;
};

// Fetch a single user profile by ID
export const fetchUserProfileById = async (userId) => {
    const response = await api.get(`user-profiles/${userId}/`);
    return response.data;
};

// Update user profile by ID
export const updateUserProfile = async (userId, userData) => {
    const response = await api.put(`user-profiles/${userId}/`, userData);
    return response.data;
};

// Delete user profile by ID
export const deleteUserProfile = async (userId) => {
    await api.delete(`user-profiles/${userId}/`);
};

// Fetch all users
export const fetchUsers = async () => {
    const response = await api.get('users/');
    return response.data;
};

// Create a new user
export const createUser = async (userData) => {
    const response = await api.post('users/', userData);
    return response.data;
};

// Fetch user by ID
export const fetchUserById = async (userId) => {
    const response = await api.get(`users/${userId}/`);
    return response.data;
};

// Update user by ID
export const updateUser = async (userId, userData) => {
    const response = await api.put(`users/${userId}/`, userData);
    return response.data;
};

// Delete user by ID
export const deleteUser = async (userId) => {
    await api.delete(`users/${userId}/`);
};
