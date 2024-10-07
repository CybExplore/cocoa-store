import React, { useEffect, useState } from 'react';
import { fetchUserData } from '../services/authService'; // Adjust the import as needed

const UserProfile = () => {
    const [user, setUser] = useState(null); // State to hold user data
    const [error, setError] = useState(''); // State to hold error messages

    useEffect(() => {
        const getUserData = async () => {
            try {
                const userData = await fetchUserData(); // Fetch user data
                setUser(userData); // Set user data in state
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError(error.message); // Set error message for user feedback
            }
        };

        getUserData(); // Call the function to fetch user data
    }, []); // Empty dependency array means this effect runs once after the initial render

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>; // Display error message
    }

    if (!user) {
        return <p>Loading...</p>; // Show loading message while fetching data
    }

    return (
        <div>
            <h1>User Profile</h1>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
            <p>Staff: {user.is_staff}</p>
            {/* Add more user details as needed */}
        </div>
    );
};

export default UserProfile;
