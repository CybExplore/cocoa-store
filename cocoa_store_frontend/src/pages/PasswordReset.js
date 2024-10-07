// src/pages/PasswordReset.js

import React, { useState } from 'react';
import { resetPassword } from '../services/authService'; // Assume this service exists
import { useNavigate } from 'react-router-dom';

const PasswordReset = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // try {
        //     await resetPassword({ email });
        //     alert('Password reset link sent to your email!');
        //     navigate('/login'); // Redirect to login page after successful reset
        // } catch (error) {
        //     console.error('Password reset failed:', error.message);
        // }
    };

    return (
        <div>
            <h2>Password Reset</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Reset Password</button>
            </form>
        </div>
    );
};

export default PasswordReset;
