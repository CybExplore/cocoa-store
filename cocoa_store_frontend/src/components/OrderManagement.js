// src/components/admin/OrderManagement.js

import React, { useState, useEffect } from 'react';
import { getOrders, createOrder, updateOrder, deleteOrder } from '../services/orderService';
import '../styles/OrderManagement.css'; // Import CSS for styling
import LoadingSpinner from './LoadingSpinner';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [newOrder, setNewOrder] = useState({
        customer: { name: '', email: '' },
        products: [],
        total: 0,
        status: 'Pending',
    });
    const [editOrder, setEditOrder] = useState(null);
    const [editOrderData, setEditOrderData] = useState({
        customer: { name: '', email: '' },
        products: [],
        total: 0,
        status: 'Pending',
    });
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    // Fetch orders on component mount
    useEffect(() => {
        const loadOrders = async () => {
            console.log('Loading orders...');
            try {
                const ordersData = await getOrders();
                console.log('Orders loaded successfully:', ordersData);
                setOrders(ordersData);
            } catch (error) {
                console.error('Error loading orders:', error);
                setError('Error loading orders.'); // Set error state
            } finally {
                setLoading(false); // Set loading to false when done
            }
        };

        loadOrders();
    }, []);

    // Handle creating a new order
    const handleCreateOrder = async (e) => {
        e.preventDefault();
        console.log('Creating new order:', newOrder);
        try {
            const createdOrder = await createOrder(newOrder);
            console.log('Order created successfully:', createdOrder);
            setOrders([...orders, createdOrder]);
            setNewOrder({ customer: { name: '', email: '' }, products: [], total: 0, status: 'Pending' }); // Reset form
        } catch (error) {
            console.error('Error creating order:', error);
            setError('Error creating order.'); // Set error state
        }
    };

    // Handle editing an order
    const handleEditOrder = (order) => {
        console.log('Editing order:', order);
        setEditOrder(order.id);
        setEditOrderData({
            customer: {
                name: order.customer?.name || '',
                email: order.customer?.email || '',
            },
            products: order.products,
            total: order.total,
            status: order.status,
        });
    };

    // Handle updating an order
    const handleUpdateOrder = async (e) => {
        e.preventDefault();
        console.log('Updating order:', editOrder, editOrderData);
        try {
            const updatedOrder = await updateOrder(editOrder, editOrderData);
            console.log('Order updated successfully:', updatedOrder);
            setOrders(orders.map(order => (order.id === editOrder ? updatedOrder : order)));
            setEditOrder(null);
            setEditOrderData({ customer: { name: '', email: '' }, products: [], total: 0, status: 'Pending' }); // Reset form
        } catch (error) {
            console.error('Error updating order:', error);
            setError('Error updating order.'); // Set error state
        }
    };

    // Handle deleting an order
    const handleDeleteOrder = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this order?');
        if (!confirmDelete) return;

        console.log('Deleting order with ID:', id);
        try {
            await deleteOrder(id);
            console.log('Order deleted successfully:', id);
            setOrders(orders.filter(order => order.id !== id)); // Remove deleted order from the list
        } catch (error) {
            console.error('Error deleting order:', error);
            setError('Error deleting order.'); // Set error state
        }
    };

    if (loading) {
        return <LoadingSpinner />; // Loading indicator
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>; // Display error message
    }

    return (
        <div className="order-management">
            <h1>Order Management</h1>

            <h2>Create New Order</h2>
            <form onSubmit={handleCreateOrder}>
                <input
                    type="text"
                    value={newOrder.customer.name}
                    onChange={(e) => {
                        console.log('Updating customer name:', e.target.value);
                        setNewOrder({ ...newOrder, customer: { ...newOrder.customer, name: e.target.value } });
                    }}
                    placeholder="Customer Name"
                    required
                />
                <input
                    type="email"
                    value={newOrder.customer.email}
                    onChange={(e) => {
                        console.log('Updating customer email:', e.target.value);
                        setNewOrder({ ...newOrder, customer: { ...newOrder.customer, email: e.target.value } });
                    }}
                    placeholder="Customer Email"
                    required
                />
                <input
                    type="number"
                    value={newOrder.total}
                    onChange={(e) => {
                        console.log('Updating total amount:', e.target.value);
                        setNewOrder({ ...newOrder, total: parseFloat(e.target.value) });
                    }}
                    placeholder="Total Amount"
                    required
                />
                <select
                    value={newOrder.status}
                    onChange={(e) => {
                        console.log('Updating order status:', e.target.value);
                        setNewOrder({ ...newOrder, status: e.target.value });
                    }}
                >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
                <button type="submit">Create Order</button>
            </form>

            <h2>Existing Orders</h2>
            <ul>
                {orders.map((order) => (
                    <li key={order.id}>
                        <h3>Order ID: {order.id}</h3>
                        <p>Status: {order.status}</p>
                        <p>Total: ${parseFloat(order.total_price).toFixed(2)}</p>
                        <p>Created At: {new Date(order.created_at).toLocaleString()}</p>
                        <h4>Items:</h4>
                        <ul>
                            {order.items.map((item) => (
                                <li key={item.id}>
                                    <h5>Product: {item.product.name}</h5>
                                    <p>Description: {item.product.description}</p>
                                    <p>Quantity: {item.quantity}</p>
                                    <p>Price at Purchase: ${parseFloat(item.price_at_purchase).toFixed(2)}</p>
                                    <p>Total Price: ${parseFloat(item.get_total_price).toFixed(2)}</p>
                                    <img src={item.product.image} alt={item.product.name} style={{ width: '100px', height: '100px' }} />
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => handleDeleteOrder(order.id)}>Delete Order</button>
                    </li>
                ))}
            </ul>

            {editOrder && (
                <div>
                    <h2>Edit Order</h2>
                    <form onSubmit={handleUpdateOrder}>
                        <input
                            type="text"
                            value={editOrderData.customer.name}
                            onChange={(e) => {
                                console.log('Updating edited customer name:', e.target.value);
                                setEditOrderData({ ...editOrderData, customer: { ...editOrderData.customer, name: e.target.value } });
                            }}
                            placeholder="Customer Name"
                            required
                        />
                        <input
                            type="email"
                            value={editOrderData.customer.email}
                            onChange={(e) => {
                                console.log('Updating edited customer email:', e.target.value);
                                setEditOrderData({ ...editOrderData, customer: { ...editOrderData.customer, email: e.target.value } });
                            }}
                            placeholder="Customer Email"
                            required
                        />
                        <input
                            type="number"
                            value={editOrderData.total}
                            onChange={(e) => {
                                console.log('Updating edited total amount:', e.target.value);
                                setEditOrderData({ ...editOrderData, total: parseFloat(e.target.value) });
                            }}
                            placeholder="Total Amount"
                            required
                        />
                        <select
                            value={editOrderData.status}
                            onChange={(e) => {
                                console.log('Updating edited order status:', e.target.value);
                                setEditOrderData({ ...editOrderData, status: e.target.value });
                            }}
                        >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                        <button type="submit">Update Order</button>
                        <button type="button" onClick={() => setEditOrder(null)}>Cancel</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;
