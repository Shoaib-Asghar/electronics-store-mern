import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProductPage = () => {
  const [form, setForm] = useState({
    name: '',
    brand: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    imageUrl: ''
  });

  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await axios.post('/api/products', form);
    navigate('/admin/products');
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['name', 'brand', 'description', 'category', 'imageUrl'].map(field => (
          <input
            key={field}
            type="text"
            name={field}
            placeholder={field}
            onChange={handleChange}
            required={field !== 'imageUrl'}
            className="w-full border p-2 rounded"
          />
        ))}
        <input type="number" name="price" placeholder="Price" onChange={handleChange} className="w-full border p-2 rounded" />
        <input type="number" name="stock" placeholder="Stock" onChange={handleChange} className="w-full border p-2 rounded" />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Create</button>
      </form>
    </div>
  );
};

export default AddProductPage;
