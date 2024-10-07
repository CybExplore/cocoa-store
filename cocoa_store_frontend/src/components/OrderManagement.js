import React, { useState, useEffect } from 'react';
import { getOrders, createOrder, updateOrder, deleteOrder } from '../services/orderService';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [newOrder, setNewOrder] = useState({
        customer: {
            name: '',
            email: '',
        },
        products: [], // You can add a product selection here, e.g., product IDs and quantities
        total: 0,
        status: 'Pending', // Default status
    });
    const [editOrder, setEditOrder] = useState(null); // To store the order being edited
    const [editOrderData, setEditOrderData] = useState({
        customer: {
            name: '',
            email: '',
        },
        products: [],
        total: 0,
        status: 'Pending',
    });

    // Fetch orders on component mount
    useEffect(() => {
        const loadOrders = async () => {
            try {
                const ordersData = await getOrders();
                setOrders(ordersData);
            } catch (error) {
                console.error('Error loading orders:', error);
            }
        };

        loadOrders();
    }, []);

    // Handle creating a new order
    const handleCreateOrder = async (e) => {
        e.preventDefault();
        try {
            const createdOrder = await createOrder(newOrder);
            setOrders([...orders, createdOrder]); // Add new order to the list
            setNewOrder({
                customer: { name: '', email: '' },
                products: [],
                total: 0,
                status: 'Pending',
            }); // Reset form after submission
        } catch (error) {
            console.error('Error creating order:', error);
        }
    };

    // Handle editing an order
    const handleEditOrder = (order) => {
        setEditOrder(order.id);
        setEditOrderData({
            customer: {
                name: order.customer.name,
                email: order.customer.email,
            },
            products: order.products,
            total: order.total,
            status: order.status,
        });
    };

    // Handle updating an order
    const handleUpdateOrder = async (e) => {
        e.preventDefault();
        try {
            const updatedOrder = await updateOrder(editOrder, editOrderData);
            setOrders(orders.map(order => (order.id === editOrder ? updatedOrder : order)));
            setEditOrder(null); // Reset edit state
            setEditOrderData({
                customer: { name: '', email: '' },
                products: [],
                total: 0,
                status: 'Pending',
            }); // Reset form after update
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    // Handle deleting an order
    const handleDeleteOrder = async (id) => {
        try {
            await deleteOrder(id);
            setOrders(orders.filter(order => order.id !== id)); // Remove deleted order from the list
        } catch (error) {
            console.error('Error deleting order:', error);
        }
    };

    return (
        <div>
            <h1>Order Management</h1>

            <h2>Create New Order</h2>
            <form onSubmit={handleCreateOrder}>
                <input
                    type="text"
                    value={newOrder.customer.name}
                    onChange={(e) =>
                        setNewOrder({ ...newOrder, customer: { ...newOrder.customer, name: e.target.value } })
                    }
                    placeholder="Customer Name"
                    required
                />
                <input
                    type="email"
                    value={newOrder.customer.email}
                    onChange={(e) =>
                        setNewOrder({ ...newOrder, customer: { ...newOrder.customer, email: e.target.value } })
                    }
                    placeholder="Customer Email"
                    required
                />
                {/* You can add a product selection here */}
                <input
                    type="number"
                    value={newOrder.total}
                    onChange={(e) => setNewOrder({ ...newOrder, total: parseFloat(e.target.value) })}
                    placeholder="Total Amount"
                    required
                />
                <select
                    value={newOrder.status}
                    onChange={(e) => setNewOrder({ ...newOrder, status: e.target.value })}
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
                        <p>Customer: {order.customer.name} ({order.customer.email})</p>
                        <p>Status: {order.status}</p>
                        <p>Total: ${order.total}</p>
                        {/* Render products associated with the order if any */}
                        <button onClick={() => handleEditOrder(order)}>Edit</button>
                        <button onClick={() => handleDeleteOrder(order.id)}>Delete</button>
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
                            onChange={(e) =>
                                setEditOrderData({
                                    ...editOrderData,
                                    customer: { ...editOrderData.customer, name: e.target.value },
                                })
                            }
                            placeholder="Customer Name"
                            required
                        />
                        <input
                            type="email"
                            value={editOrderData.customer.email}
                            onChange={(e) =>
                                setEditOrderData({
                                    ...editOrderData,
                                    customer: { ...editOrderData.customer, email: e.target.value },
                                })
                            }
                            placeholder="Customer Email"
                            required
                        />
                        <input
                            type="number"
                            value={editOrderData.total}
                            onChange={(e) => setEditOrderData({ ...editOrderData, total: parseFloat(e.target.value) })}
                            placeholder="Total Amount"
                            required
                        />
                        <select
                            value={editOrderData.status}
                            onChange={(e) => setEditOrderData({ ...editOrderData, status: e.target.value })}
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
