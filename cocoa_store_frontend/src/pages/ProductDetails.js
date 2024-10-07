import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { addToCart } from '../services/cartService'; // Import the addToCart service
import axios from 'axios';
import '../styles/ProductDetails.css'; // Import your styles

const ProductDetails = () => {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true); // Track loading state

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/products/${slug}/`); // Adjust the API endpoint
                setProduct(response.data);
            } catch (error) {
                console.error('Error fetching product details:', error);
            } finally {
                setLoading(false); // Set loading to false after fetch
            }
        };

        fetchProductDetails();
    }, [slug]);

    // Function to handle adding to cart
    const handleAddToCart = async () => {
        try {
            if (!product) {
                console.error("Product is not defined.");
                return;
            }
            const response = await addToCart(product.id, 1); // Add product to cart with a quantity of 1
            console.log("Add to cart response:", response); // Log the response
            alert(`${product.name} has been added to your cart.`);
        } catch (error) {
            console.error('Error adding to cart:', error); // Log any errors
            alert('Failed to add product to cart.'); // Inform the user about the failure
        }
    };

    return (
        <div className="product-details">
            {loading ? ( // Display loading state
                <p>Loading...</p>
            ) : (
                product ? ( // Display product details if available
                    <div>
                        <h1>{product.name}</h1>
                        <p>{product.description}</p>
                        <h3>Price: ${product.price}</h3>
                        <button onClick={handleAddToCart}>Add to Cart</button>
                    </div>
                ) : (
                    <p>Product not found.</p>
                )
            )}
        </div>
    );
};

export default ProductDetails;
