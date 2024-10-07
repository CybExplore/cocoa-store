// src/components/admin/ProductManagement.js

import React, { useEffect, useState } from 'react';
import { addProduct, deleteProduct, getProducts, updateProduct } from '../services/productService';
import '../styles/ProductManagement.css'; // Import your CSS for styling

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        image: null,
    });
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [editProduct, setEditProduct] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    // Fetch products on component mount
    useEffect(() => {
        const loadProducts = async () => {
            try {
                const productsData = await getProducts();
                setProducts(productsData);
            } catch (error) {
                setError('Error loading products.'); // Set error state
            } finally {
                setLoading(false); // Set loading to false when done
            }
        };

        loadProducts();
    }, []);

    // Reset the form data
    const resetForm = () => {
        setFormData({ name: '', description: '', price: '', stock: '', image: null });
        setImagePreviewUrl(null);
        setEditProduct(null);
    };

    // Handle form submission for both Add and Edit
    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData();
        form.append('name', formData.name);
        form.append('description', formData.description);
        form.append('price', formData.price);
        form.append('stock', formData.stock);
        if (formData.image) {
            form.append('image', formData.image);
        }

        try {
            if (editProduct) {
                // Update existing product
                const updatedProduct = await updateProduct(editProduct, form);
                setProducts(products.map((product) => (product.id === editProduct ? updatedProduct : product)));
            } else {
                // Add new product
                const addedProduct = await addProduct(form);
                setProducts([...products, addedProduct]);
            }

            resetForm();
        } catch (error) {
            setError('Error submitting form.'); // Set error state
        }
    };

    // Handle editing a product
    const handleEditProduct = (product) => {
        setEditProduct(product.id);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price || '',
            stock: product.stock || '',
            image: null,
        });
        setImagePreviewUrl(product.image);
    };

    // Handle deleting a product with confirmation
    const handleDeleteProduct = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this product?');
        if (!confirmDelete) return;

        try {
            await deleteProduct(id);
            setProducts(products.filter((product) => product.id !== id));
        } catch (error) {
            setError('Error deleting product.'); // Set error state
        }
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle file input change and generate image preview
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setImagePreviewUrl(URL.createObjectURL(file));
        }
    };

    if (loading) {
        return <div>Loading products...</div>; // Loading indicator
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>; // Display error message
    }

    return (
        <div className="product-management">
            <h1>Product Management</h1>
            <h2>{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Product Name"
                    required
                />
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Description"
                    required
                />
                <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Price"
                    required
                />
                <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="Stock"
                    required
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                />

                {/* Image Preview */}
                {imagePreviewUrl && (
                    <div>
                        <img
                            src={imagePreviewUrl}
                            alt="Product Preview"
                            style={{ width: '200px', marginTop: '10px' }}
                        />
                    </div>
                )}

                <button type="submit">{editProduct ? 'Update Product' : 'Add Product'}</button>
                {editProduct && (
                    <button type="button" onClick={resetForm}>Cancel Edit</button>
                )}
            </form>

            <h2>Existing Products</h2>
            <ul>
                {products.map((product) => (
                    <li key={product.id}>
                        <h3>{product.name}</h3>
                        <p>Price: ${product.price}</p>
                        <p>Description: {product.description}</p>
                        <p>Stock: {product.stock}</p>
                        {product.image && <img src={product.image} alt={product.name} style={{ width: '100px' }} />}
                        <button onClick={() => handleEditProduct(product)}>Edit</button>
                        <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductManagement;
