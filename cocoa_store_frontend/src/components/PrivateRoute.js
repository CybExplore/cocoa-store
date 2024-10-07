import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getToken, fetchUserData } from '../services/authService'; // Import necessary functions

const PrivateRoute = ({ children, isStaff }) => {
    const [user, setUser] = useState(null); // State to hold user data
    const token = getToken(); // Retrieve the token from localStorage

    // Fetch user data when the component mounts
    useEffect(() => {
        const getUserData = async () => {
            if (token) { // Only fetch user data if token exists
                try {
                    const userData = await fetchUserData();
                    setUser(userData); // Set user data in state
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        getUserData();
    }, [token]); // Fetch user data when the token changes

    // If there is no token, redirect to the login page
    if (!token) {
        return <Navigate to="/login" />;
    }

    // If user is not a staff member and trying to access a protected route, redirect to login or another page
    if (isStaff && (!user || !user.is_staff)) {
        return <Navigate to="/" />; // Redirect to login or a forbidden page
    }

    // If token exists and user is staff (if applicable), render the children (protected components)
    return children;
};

export default PrivateRoute;
