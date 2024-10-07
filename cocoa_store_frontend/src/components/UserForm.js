// src/components/UserForm.js

import React, { useEffect, useState } from 'react';

const UserForm = ({ onSubmit, selectedUser }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (selectedUser) {
            setUsername(selectedUser.username);
            setEmail(selectedUser.email);
        } else {
            setUsername('');
            setEmail('');
            setPassword('');
        }
    }, [selectedUser]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const userData = { username, email, password };
        onSubmit(userData);
        setPassword(''); // Reset password after submit
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={!selectedUser} // Only require password when creating a new user
            />
            <button type="submit">{selectedUser ? 'Update User' : 'Create User'}</button>
        </form>
    );
};

export default UserForm;
