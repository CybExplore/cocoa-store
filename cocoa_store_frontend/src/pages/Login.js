import React, { useState } from 'react';
import { loginUser } from '../services/authService'; // Adjust the import as needed
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate
    const [user, setUser] = useState(null); // State to hold user data

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting login form with credentials:', credentials);

        try {
            const data = await loginUser(credentials);
            console.log('Login successful, user data:', data);
            console.log('Storing token:', data['key']); // Ensure this is correct
            localStorage.setItem('authToken', data['key']); // Assuming token is in data['key']
            
            // Redirect the user to the profile page after successful login
            navigate('/profile');

        } catch (error) {
            console.error('Login error:', error);
            setError(error.message); // Set error message for user feedback
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                placeholder="Username"
                required
            />
            <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                placeholder="Password"
                required
            />
            <button type="submit">Login</button>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
        </form>
    );
};

export default Login;
