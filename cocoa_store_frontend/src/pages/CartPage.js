import React, { useEffect, useState } from 'react';
import { getCart, removeFromCart } from '../services/cartService'; // Import removeFromCart

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]); // Initialize as empty array
    const [loading, setLoading] = useState(true); // Track loading state

    useEffect(() => {
        const loadCartItems = async () => {
            try {
                console.log("Fetching cart items..."); // Log fetching action
                const items = await getCart(); // Fetch cart items
                console.log("Fetched cart items:", items); // Log fetched items
                setCartItems(items); // Update state with fetched items
            } catch (error) {
                console.error('Error fetching cart items:', error); // Log error
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
        }
    };

    if (loading) {
        return <div>Loading...</div>; // Display loading message while fetching data
    }

    return (
        <div>
            <h1>Your Cart</h1>
            {cartItems.length === 0 ? ( // Check if cartItems is empty
                <p>Your cart is empty.</p>
            ) : (
                <ul>
                    {cartItems[0].items.map(item => ( // Access items from the first cart entry
                        <li key={item.id}>
                            <div>
                                <img src={item.product.image} alt={item.product.name} style={{ width: '100px', height: 'auto' }} />
                                <h3>{item.product.name}</h3>
                                <p>Price: ${item.product.price} x {item.quantity}</p>
                                <p>Total: ${item.get_total_price}</p>
                                <button onClick={() => handleRemoveFromCart(item.product.id)}>Remove</button> {/* Button to remove item */}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <h2>Total Price: ${cartItems[0].total_price}</h2>
            <h2>Total Quantity: {cartItems[0].total_quantity}</h2>
        </div>
    );
};

export default CartPage;
