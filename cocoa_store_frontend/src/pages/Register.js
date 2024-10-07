import React, { useState } from 'react';
import { registerUser } from '../services/authService';

const Register = () => {
    const [userData, setUserData] = useState({ username: '', email: '', password1: '', password2: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerUser(userData);
            // Optionally, redirect to login or show success message
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={userData.username}
                onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                placeholder="Username"
            />
            <input
                type="email"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                placeholder="Email"
            />
            <input
                type="password"
                value={userData.password1}
                onChange={(e) => setUserData({ ...userData, password1: e.target.value })}
                placeholder="Password"
            />
            <input
                type="password"
                value={userData.password2}
                onChange={(e) => setUserData({ ...userData, password2: e.target.value })}
                placeholder="Confirm Password"
            />
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;
