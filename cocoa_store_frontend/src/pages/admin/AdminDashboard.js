// src/components/AdminDashboard.js

import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import '../../styles/AdminDashboard.css'; // Import the CSS file

const AdminDashboard = () => {
    return (
        <div className="admin-dashboard">
            <nav className="admin-nav">
                <h1>Admin Dashboard</h1>
                <ul>
                    <li><Link to="/admin-dashboard/users">User Management</Link></li>
                    <li><Link to="/admin-dashboard/products">Product Management</Link></li>
                    <li><Link to="/admin-dashboard/orders">Order Management</Link></li>
                </ul>
            </nav>
            <div className="admin-content">
                <Outlet /> {/* This will render child routes */}
            </div>
        </div>
    );
};

export default AdminDashboard;
