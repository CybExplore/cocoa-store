// src/components/ProductForm.js

import React, { useState } from 'react';

const ProductForm = ({ product, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: product ? product.name : '',
        description: product ? product.description : '',
        price: product ? product.price : '',
        stock: product ? product.stock : '',
        image: product ? product.image : '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" />
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description"></textarea>
            <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" />
            <input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="Stock" />
            <input type="file" name="image" onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })} />
            <button type="submit">{product ? 'Update Product' : 'Add Product'}</button>
        </form>
    );
};

export default ProductForm;
