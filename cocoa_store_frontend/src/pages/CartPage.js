import React, { useEffect, useState } from 'react';
import { getCart, removeFromCart } from '../services/cartService'; // Import removeFromCart
import LoadingSpinner from '../components/LoadingSpinner'; // Import the LoadingSpinner
import '../styles/CartPage.css'; // Import CSS for styling

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]); // Initialize as empty array
    const [loading, setLoading] = useState(true); // Track loading state
    const [error, setError] = useState(''); // Track error state

    useEffect(() => {
        const loadCartItems = async () => {
            try {
                console.log("Fetching cart items..."); // Log fetching action
                const items = await getCart(); // Fetch cart items
                console.log("Fetched cart items:", items); // Log fetched items
                setCartItems(items); // Update state with fetched items
            } catch (error) {
                console.error('Error fetching cart items:', error); // Log error
                setError('Failed to load cart items. Please try again later.'); // Set error message
            } finally {
                setLoading(false); // Set loading to false once fetching is complete
            }
        };

        loadCartItems(); // Load cart items on component mount
    }, []);

    const handleRemoveFromCart = async (productId) => {
        try {
            await removeFromCart(productId); // Call removeFromCart function
            // Refresh cart items after removing
            const updatedCartItems = await getCart(); // Fetch updated cart items
            setCartItems(updatedCartItems); // Update state with refreshed cart items
        } catch (error) {
            console.error('Error removing item from cart:', error); // Log error
            setError('Failed to remove item from cart. Please try again.'); // Set error message
        }
    };

    if (loading) {
        return <LoadingSpinner />; // Display loading spinner while fetching data
    }

    return (
        <div className="cart-page">
            <h1>Your Cart</h1>
            {error && <div className="error-message">{error}</div>} {/* Display error message if exists */}
            {cartItems.length === 0 ? ( // Check if cartItems is empty
                <p>Your cart is empty.</p>
            ) : (
                <ul className="cart-list">
                    {cartItems[0].items.map(item => ( // Access items from the first cart entry
                        <li key={item.id} className="cart-item">
                            <div className="item-details">
                                <img src={item.product.image} alt={item.product.name} className="item-image" />
                                <div className="item-info">
                                    <h3>{item.product.name}</h3>
                                    <p>Price: ${item.product.price} x {item.quantity}</p>
                                    <p>Total: ${item.get_total_price}</p>
                                </div>
                            </div>
                            <button className="remove-button" onClick={() => handleRemoveFromCart(item.product.id)}>Remove</button>
                        </li>
                    ))}
                </ul>
            )}
            <div className="cart-summary">
                <h2>Total Price: ${cartItems[0].total_price}</h2>
                <h2>Total Quantity: {cartItems[0].total_quantity}</h2>
            </div>
        </div>
    );
};

export default CartPage;
