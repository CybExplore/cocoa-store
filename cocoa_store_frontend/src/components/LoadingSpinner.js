// src/components/LoadingSpinner.js

import React from 'react';
import '../styles/LoadingSpinner.css'; // Import spinner CSS styles

const LoadingSpinner = () => {
    return (
        <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading products...</p>
        </div>
    );
};

export default LoadingSpinner;
