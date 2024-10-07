// Order.js
import React, { useEffect, useState } from 'react';
import { createOrder, getOrders, cancelOrder } from '../services/orderService';

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getOrders();
                setOrders(data);
            } catch (error) {
                setError("Failed to load orders. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleCreateOrder = async () => {
        try {
            const newOrder = await createOrder();
            // Refresh the orders list after creating an order
            setOrders(prevOrders => [...prevOrders, newOrder]);
        } catch (error) {
            setError("Failed to create order.");
        }
    };

    const handleCancelOrder = async (orderId) => {
        try {
            await cancelOrder(orderId);
            // Refresh the orders list after cancelling an order
            setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
        } catch (error) {
            setError("Failed to cancel order.");
        }
    };

    return (
        <div className="order">
            <h2>Your Orders</h2>
            <button onClick={handleCreateOrder}>Create Order</button>
            {loading ? (
                <p>Loading orders...</p>
            ) : error ? (
                <p>{error}</p>
            ) : orders.length > 0 ? (
                orders.map(order => (
                    <div key={order.id}>
                        <h3>Order ID: {order.id}</h3>
                        <p>Status: {order.status}</p>
                        <button onClick={() => handleCancelOrder(order.id)}>Cancel Order</button>
                    </div>
                ))
            ) : (
                <p>No orders found.</p>
            )}
        </div>
    );
};

export default Order;
