import React, { useState, useEffect } from 'react';
import { getCart } from '../services/cartService'; // Fetch cart items
import { createOrder } from '../services/orderService'; // Create a new order
import { getToken } from '../services/authService'; // Get the authentication token
import LoadingSpinner from '../components/LoadingSpinner'; // Import the loading spinner
import '../styles/Checkout.css'; // Import CSS for styling

const Checkout = () => {
    const [cartItems, setCartItems] = useState([]);
    const [orderDetails, setOrderDetails] = useState({
        customer: {
            name: '',
            email: '',
        },
        total: 0,
        status: 'Pending',
    });
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [loading, setLoading] = useState(false); // Track loading state
    const [error, setError] = useState(''); // Track error message

    // Fetch cart items on component mount
    useEffect(() => {
        const loadCartItems = async () => {
            try {
                console.log("Fetching cart items..."); // Log fetching action
                const items = await getCart();
                console.log("Fetched cart items:", items); // Log fetched items
                setCartItems(items);

                // Calculate the total price of items from the first cart object
                if (items.length > 0) {
                    const total = items[0].items.reduce((acc, item) => acc + item.get_total_price, 0);
                    console.log("Calculated total price:", total); // Log total price
                    setOrderDetails(prev => ({ ...prev, total })); // Update the total in orderDetails
                }
            } catch (error) {
                console.error('Error fetching cart items:', error);
                setError('Failed to load cart items.'); // Set error message
            }
        };

        loadCartItems();
    }, []);

    // Handle order creation
    const handleCheckout = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading

        try {
            const token = getToken(); // Get the authentication token
            console.log("Using token for order creation:", token); // Log token usage
            
            const orderData = {
                ...orderDetails,
                products: cartItems[0].items.map(item => ({
                    productId: item.product.id, // Accessing the product ID correctly
                    quantity: item.quantity,
                })),
            };
            console.log("Order data to be sent:", orderData); // Log order data
            
            await createOrder(orderData, token); // Create the order using the token
            console.log("Order created successfully!"); // Log success
            setOrderSuccess(true); // Update order success state
        } catch (error) {
            console.error('Error creating order:', error); // Log error
            setError('Failed to create order. Please try again.'); // Set error message
        } finally {
            setLoading(false); // End loading
        }
    };

    return (
        <div className="checkout-page">
            <h1>Checkout</h1>

            {orderSuccess ? (
                <div className="order-success">
                    <h2>Order Placed Successfully!</h2>
                    <p>Thank you for your purchase.</p>
                </div>
            ) : (
                <form onSubmit={handleCheckout} className="checkout-form">
                    <h2>Order Summary</h2>
                    <ul className="order-summary">
                        {cartItems.length > 0 && cartItems[0].items.map(item => (
                            <li key={item.id}>
                                {item.product.name} - ${item.product.price} x {item.quantity}
                            </li>
                        ))}
                    </ul>
                    <p>Total: ${orderDetails.total}</p>

                    <h3>Customer Information</h3>
                    <input
                        type="text"
                        value={orderDetails.customer.name}
                        onChange={(e) => setOrderDetails({ ...orderDetails, customer: { ...orderDetails.customer, name: e.target.value } })}
                        placeholder="Customer Name"
                        required
                    />
                    <input
                        type="email"
                        value={orderDetails.customer.email}
                        onChange={(e) => setOrderDetails({ ...orderDetails, customer: { ...orderDetails.customer, email: e.target.value } })}
                        placeholder="Customer Email"
                        required
                    />
                    <button type="submit" disabled={loading}>Place Order</button>

                    {loading && <LoadingSpinner />} {/* Show loading spinner while processing */}
                    {error && <div className="error-message">{error}</div>} {/* Display error message if exists */}
                </form>
            )}
        </div>
    );
};

export default Checkout;
