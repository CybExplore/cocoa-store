// src/components/admin/UserManagement.js

import React, { useEffect, useState } from 'react';
import { fetchUsers, deleteUser } from '../services/userService';

const UserManagement = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const getUsers = async () => {
            const data = await fetchUsers();
            setUsers(data);
        };
        getUsers();
    }, []);

    const handleDelete = async (id) => {
        await deleteUser(id);
        setUsers(users.filter(user => user.id !== id));
    };

    return (
        <div>
            <h1>User Management</h1>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.username} 
                        <button onClick={() => handleDelete(user.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserManagement;
