import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getToken, logoutUser, fetchUserData } from '../services/authService'; // Import necessary functions
import { getCart } from '../services/cartService'; // Import the cart service to get cart items
import '../styles/Navbar.css'; // Import the CSS file for styling

const Navbar = () => {
    const navigate = useNavigate();
    const token = getToken(); // Get the token from localStorage to check authentication
    const [user, setUser] = useState(null); // State to hold user data
    const [totalCartItems, setTotalCartItems] = useState(0); // State for total items in cart

    // Fetch user data when the component mounts
    useEffect(() => {
        const getUserData = async () => {
            try {
                if (token) { // Only fetch user data if token exists
                    const userData = await fetchUserData();
                    setUser(userData); // Set user data in state
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        getUserData();
    }, [token]); // Fetch user data when the token changes

    // Fetch cart items to get total number of items
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                if (token) {
                    const cartItems = await getCart();
                    if (cartItems.length > 0) {
                        setTotalCartItems(cartItems[0].total_quantity); // Set total quantity from cart
                    } else {
                        setTotalCartItems(0); // Reset to 0 if cart is empty
                    }
                }
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        fetchCartItems();
    }, [token]); // Fetch cart items when token changes (user logs in/out)

    const handleLogout = () => {
        logoutUser(); // Clear the token from localStorage
        setUser(null); // Clear user data
        setTotalCartItems(0); // Reset cart item count
        navigate('/login'); // Redirect to the login page after logout
    };

    return (
        <nav className="navbar" aria-label="Main Navigation">
            <h1 className="logo">Cocoa Store</h1>
            <ul className="nav-links">
                <li>
                    <NavLink to="/" activeclassname="active">Home</NavLink>
                </li>
                <li>
                    <NavLink to="/products" activeclassname="active">Products</NavLink>
                </li>
                <li>
                    <NavLink to="/cart" activeclassname="active">Cart {totalCartItems > 0 && `(${totalCartItems})`}</NavLink>
                </li>
                <li>
                    <NavLink to="/checkout" activeclassname="active">Checkout</NavLink>
                </li>

                {/* Link to User Profile */}
                {token && (
                    <li>
                        <NavLink to="/profile" activeclassname="active">Profile</NavLink>
                    </li>
                )}

                {/* Conditionally render Admin Dashboard if the user is a staff member */}
                {token && user && user.is_staff && ( // Check for is_staff instead of isAdmin
                    <li>
                        <NavLink to="/admin-dashboard" activeclassname="active">Admin Dashboard</NavLink>
                    </li>
                )}

                {/* Show Logout if user is logged in, else show Login */}
                {token ? (
                    <li>
                        <button className="logout-button" onClick={handleLogout} aria-label="Logout">Logout</button>
                    </li>
                ) : (
                    <li>
                        <NavLink to="/login" activeclassname="active">Login</NavLink>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
