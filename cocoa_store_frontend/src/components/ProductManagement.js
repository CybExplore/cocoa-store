import React, { useEffect, useState } from 'react';
import { addProduct, deleteProduct, getProducts, updateProduct } from '../services/productService';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        image: null
    });
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null); // For image preview
    const [editProduct, setEditProduct] = useState(null);

    // Fetch products on component mount
    useEffect(() => {
        const loadProducts = async () => {
            try {
                const productsData = await getProducts();
                setProducts(productsData);
            } catch (error) {
                console.error('Error loading products:', error);
            }
        };

        loadProducts();
    }, []);

    // Reset the form data
    const resetForm = () => {
        setFormData({ name: '', description: '', price: '', stock: '', image: null });
        setImagePreviewUrl(null); // Reset the image preview
        setEditProduct(null); // Reset edit state
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
            form.append('image', formData.image); // Add the image file to the form data
        }

        try {
            if (editProduct) {
                // If editing, update the product
                const updatedProduct = await updateProduct(editProduct, form);
                setProducts(products.map(product => (product.id === editProduct ? updatedProduct : product)));
            } else {
                // If adding, add a new product
                const addedProduct = await addProduct(form);
                setProducts([...products, addedProduct]);
            }

            resetForm(); // Reset form after submission
        } catch (error) {
            console.error('Error submitting form:', error);
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
            image: null // Reset image when editing
        });
        setImagePreviewUrl(product.image); // Set existing image URL as the preview
    };

    // Handle deleting a product
    const handleDeleteProduct = async (id) => {
        try {
            await deleteProduct(id);
            setProducts(products.filter(product => product.id !== id)); // Remove the deleted product from the list
        } catch (error) {
            console.error('Error deleting product:', error);
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
            setImagePreviewUrl(URL.createObjectURL(file)); // Generate image preview URL
        }
    };

    return (
        <div>
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
