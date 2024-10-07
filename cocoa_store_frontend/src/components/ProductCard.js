// src/components/ProductCard.js

import React from 'react';
import '../styles/ProductCard.css'; // Import CSS for styling
import { Link } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart }) => {
    return (
        <div className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <Link to={`product/${product.slug}`}> View Details</Link>
            <p>${product.price}</p>
            <button onClick={() => onAddToCart(product)}>Add to Cart</button>
        </div>
    );
};

export default ProductCard;

