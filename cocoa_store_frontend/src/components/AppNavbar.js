import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getToken, logoutUser, fetchUserData } from '../services/authService';
import { getCart } from '../services/cartService';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'; // Import Bootstrap components
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import '../styles/Navbar.css'; // Import custom styles

const AppNavbar = () => {
    const navigate = useNavigate();
    const token = getToken();
    const [user, setUser] = useState(null);
    const [totalCartItems, setTotalCartItems] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserDataAndCart = async () => {
            setLoading(true);
            try {
                if (token) {
                    const userData = await fetchUserData();
                    setUser(userData);
                    const cartItems = await getCart();
                    setTotalCartItems(cartItems.length > 0 ? cartItems[0].total_quantity : 0);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserDataAndCart();
    }, [token]);

    const handleLogout = () => {
        logoutUser();
        setUser(null);
        setTotalCartItems(0);
        navigate('/login');
    };

    return (
        <Navbar className="navbar-custom" expand="lg">
            <Container>
                <Navbar.Brand href="/">Cocoa Store</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <NavLink to="/products" className="nav-link" activeclassname="active">Products</NavLink>
                        <NavLink to="/cart" className="nav-link" activeclassname="active">
                            Cart {totalCartItems > 0 && `(${totalCartItems})`}
                        </NavLink>
                        <NavLink to="/checkout" className="nav-link" activeclassname="active">Checkout</NavLink>
                        {token && (
                            <NavDropdown title="Profile" id="basic-nav-dropdown">
                                <NavDropdown.Item as={NavLink} to="/profile">Profile</NavDropdown.Item>
                                {user?.is_staff && (
                                    <NavDropdown.Item as={NavLink} to="/admin-dashboard">Admin Dashboard</NavDropdown.Item>
                                )}
                                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        )}
                        {!token && (
                            <NavLink to="/login" className="nav-link" activeclassname="active">Login</NavLink>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;
