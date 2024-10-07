import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Checkout from './pages/Checkout';
import Home from './pages/Home';
import CartPage from './pages/CartPage';
import Products from './pages/Products';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserProfile from './pages/UserProfile';
import UserManagement from './components/UserManagement';
import ProductManagement from './components/ProductManagement';
import OrderManagement from './components/OrderManagement';
import ProductDetails from './pages/ProductDetails';
import { fetchUserData, isAuthenticated } from './services/authService'; // Import user authentication service
import { getCart } from './services/cartService'; // Import cart service

const App = () => {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      if (isAuthenticated()) {
        try {
          const userData = await fetchUserData();
          setUser(userData);
          
          // Fetch cart data
          const cartData = await getCart();
          setCartCount(cartData.total_quantity || 0); // Adjust based on your cart API response
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  return (
    <>
      <Router>
        <Navbar user={user} cartCount={cartCount} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:slug" element={<ProductDetails />} />
          <Route path="/cart" element={<PrivateRoute><CartPage /></PrivateRoute>} />
          <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>}>
          {/* <Route path="/admin-dashboard" element={<PrivateRoute isStaff={true}><AdminDashboard /></PrivateRoute>}> */}
            <Route path="users" element={<UserManagement />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="orders" element={<OrderManagement />} />
          </Route>
          <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
