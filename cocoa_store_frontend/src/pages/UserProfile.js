import React, { useEffect, useState } from 'react';
import { fetchUserData, updateUserProfile } from '../services/authService'; // Adjust the import as needed
import LoadingSpinner from '../components/LoadingSpinner'; // Import a loading spinner component
import '../styles/UserProfile.css'; // Optional: Import your styles

const UserProfile = () => {
    const [user, setUser] = useState(null); // State to hold user data
    const [error, setError] = useState(''); // State to hold error messages
    const [loading, setLoading] = useState(true); // Track loading state
    const [isEditing, setIsEditing] = useState(false); // Track edit mode
    const [formData, setFormData] = useState({ username: '', email: '' }); // Form data for editing
    const [message, setMessage] = useState(''); // Success message after update

    useEffect(() => {
        const getUserData = async () => {
            try {
                const userData = await fetchUserData(); // Fetch user data
                setUser(userData); // Set user data in state
                setFormData({ username: userData.username, email: userData.email }); // Initialize form data
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError(error.message); // Set error message for user feedback
            } finally {
                setLoading(false); // End loading state
            }
        };

        getUserData(); // Call the function to fetch user data
    }, []); // Empty dependency array means this effect runs once after the initial render

    const handleEditToggle = () => {
        setIsEditing(!isEditing); // Toggle edit mode
    };

    const handleChange = (e) => {
        const { name, value } = e.target; // Destructure name and value from event target
        setFormData({ ...formData, [name]: value }); // Update form data
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setLoading(true); // Set loading state during submission
        setMessage(''); // Reset message

        try {
            await updateUserProfile(formData); // Call update function with form data
            setUser({ ...user, ...formData }); // Update user state with new values
            setMessage('Profile updated successfully!'); // Set success message
        } catch (error) {
            console.error('Error updating user profile:', error);
            setError('Failed to update profile.'); // Set error message
        } finally {
            setLoading(false); // End loading state
            setIsEditing(false); // Exit edit mode
        }
    };

    if (loading) {
        return <LoadingSpinner />; // Display loading spinner while fetching or updating
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>; // Display error message
    }

    return (
        <div className="user-profile">
            <h1>User Profile</h1>
            {isEditing ? (
                <form onSubmit={handleSubmit} className="edit-profile-form">
                    <div>
                        <label>
                            Username:
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Email:
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </label>
                    </div>
                    <button type="submit">Update Profile</button>
                    <button type="button" onClick={handleEditToggle}>Cancel</button>
                    {message && <p style={{ color: 'green' }}>{message}</p>} {/* Display success message */}
                </form>
            ) : (
                <div>
                    <p>Username: {user.username}</p>
                    <p>Email: {user.email}</p>
                    <p>Staff: {user.is_staff ? 'Yes' : 'No'}</p>
                    <button onClick={handleEditToggle}>Edit Profile</button>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
