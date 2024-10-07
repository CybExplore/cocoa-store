// src/components/admin/OrderManagement.js

import React, { useState, useEffect } from 'react';
import { getOrders, createOrder, updateOrder, deleteOrder } from '../services/orderService';
import '../styles/OrderManagement.css'; // Import CSS for styling
import LoadingSpinner from './LoadingSpinner';

// Form component for creating and editing orders
const OrderForm = ({ orderData, onSubmit, onCancel }) => (
    <form onSubmit={onSubmit} className="order-form">
        <input
            type="text"
            value={orderData.customer.name}
            onChange={(e) => {
                orderData.customer.name = e.target.value;
            }}
            placeholder="Customer Name"
            required
        />
        <input
            type="email"
            value={orderData.customer.email}
            onChange={(e) => {
                orderData.customer.email = e.target.value;
            }}
            placeholder="Customer Email"
            required
        />
        <input
            type="number"
            value={orderData.total}
            onChange={(e) => {
                orderData.total = parseFloat(e.target.value);
            }}
            placeholder="Total Amount"
            required
        />
        <select
            value={orderData.status}
            onChange={(e) => {
                orderData.status = e.target.value;
            }}
        >
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
        </select>
        <button type="submit">{orderData.id ? 'Update Order' : 'Create Order'}</button>
        {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
    </form>
);

// Component for displaying a single order
const OrderItem = ({ order, onEdit, onDelete }) => (
    <li className="order-item">
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
        <button onClick={() => onEdit(order)}>Edit Order</button>
        <button onClick={() => onDelete(order.id)}>Delete Order</button>
    </li>
);

// Main OrderManagement component
const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [newOrder, setNewOrder] = useState({
        customer: { name: '', email: '' },
        products: [],
        total: 0,
        status: 'Pending',
    });
    const [editOrder, setEditOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch orders on component mount
    useEffect(() => {
        const loadOrders = async () => {
            try {
                const ordersData = await getOrders();
                setOrders(ordersData);
            } catch (error) {
                setError('Error loading orders.');
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, []);

    // Handle creating a new order
    const handleCreateOrder = async (e) => {
        e.preventDefault();
        try {
            const createdOrder = await createOrder(newOrder);
            setOrders([...orders, createdOrder]);
            setNewOrder({ customer: { name: '', email: '' }, products: [], total: 0, status: 'Pending' });
        } catch (error) {
            setError('Error creating order.');
        }
    };

    // Handle editing an order
    const handleEditOrder = (order) => {
        setEditOrder(order.id);
        setNewOrder({
            customer: { name: order.customer?.name || '', email: order.customer?.email || '' },
            products: order.products,
            total: order.total,
            status: order.status,
        });
    };

    // Handle updating an order
    const handleUpdateOrder = async (e) => {
        e.preventDefault();
        try {
            const updatedOrder = await updateOrder(editOrder, newOrder);
            setOrders(orders.map(order => (order.id === editOrder ? updatedOrder : order)));
            setEditOrder(null);
            setNewOrder({ customer: { name: '', email: '' }, products: [], total: 0, status: 'Pending' });
        } catch (error) {
            setError('Error updating order.');
        }
    };

    // Handle deleting an order
    const handleDeleteOrder = async (id) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            try {
                await deleteOrder(id);
                setOrders(orders.filter(order => order.id !== id));
            } catch (error) {
                setError('Error deleting order.');
            }
        }
    };

    // Loading and error handling
    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    return (
        <div className="order-management">
            <h1>Order Management</h1>

            <h2>Create New Order</h2>
            <OrderForm orderData={newOrder} onSubmit={handleCreateOrder} />

            <h2>Existing Orders</h2>
            <ul>
                {orders.map((order) => (
                    <OrderItem key={order.id} order={order} onEdit={handleEditOrder} onDelete={handleDeleteOrder} />
                ))}
            </ul>

            {editOrder && (
                <div>
                    <h2>Edit Order</h2>
                    <OrderForm orderData={newOrder} onSubmit={handleUpdateOrder} onCancel={() => setEditOrder(null)} />
                </div>
            )}
        </div>
    );
};

export default OrderManagement;
