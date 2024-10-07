import React, { useEffect, useState } from 'react';
import { getProducts } from '../services/productService';
import '../styles/Products.css'; // Import your CSS styles for better design
import { Link } from 'react-router-dom';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch products on component mount
    useEffect(() => {
        const loadProducts = async () => {
            try {
                const productsData = await getProducts();
                setProducts(productsData);
            } catch (error) {
                console.error('Error loading products:', error);
                setError('Failed to load products');
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    // Render loading state
    if (loading) {
        return <div>Loading products...</div>;
    }

    // Render error state
    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="products">
            <h1>Our Products</h1>
            <div className="product-list">
                {products.map((product) => (
                    <div key={product.id} className="product-card">
                        <h2>{product.name}</h2>
                        <img src={product.image} alt={product.name} className="product-image" />
                        <p>{product.description}</p>
                        <p>Price: ${product.price}</p>
                        <p>Stock: {product.stock}</p>
                        <Link to={`/product/${product.slug}`}>View Details</Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Products;
