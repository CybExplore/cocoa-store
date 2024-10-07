// src/components/admin/UserManagement.js

import React, { useEffect, useState } from 'react';
import { fetchUsers, deleteUser } from '../services/userService';
import '../styles/UserManagement.css'; // Import your CSS file for styles

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true); // Track loading state
    const [error, setError] = useState(null); // State for error handling

    useEffect(() => {
        const getUsers = async () => {
            try {
                const data = await fetchUsers();
                setUsers(data);
            } catch (error) {
                setError('Failed to load users.');
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false); // Set loading to false when done
            }
        };
        getUsers();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this user?');
        if (!confirmDelete) return;

        try {
            await deleteUser(id);
            setUsers(users.filter(user => user.id !== id));
        } catch (error) {
            console.error('Error deleting user:', error);
            setError('Failed to delete user.');
        }
    };

    if (loading) {
        return <div>Loading users...</div>; // Loading state
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>; // Display error message
    }

    return (
        <div>
            <h1>User Management</h1>
            {users.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <ul>
                    {users.map(user => (
                        <li key={user.id} className="user-item">
                            {user.username} 
                            <button className="delete-button" onClick={() => handleDelete(user.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UserManagement;
