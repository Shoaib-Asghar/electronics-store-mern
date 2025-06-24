import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditProductPage = () => {
  const { id } = useParams();
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/products/${id}`).then(res => setForm(res.data));
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await axios.put(`/api/products/${id}`, form);
    navigate('/products');
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['name', 'brand', 'description', 'category', 'imageUrl'].map(field => (
          <input
            key={field}
            type="text"
            name={field}
            value={form[field] || ''}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        ))}
        <input type="number" name="price" value={form.price || ''} onChange={handleChange} className="w-full border p-2 rounded" />
        <input type="number" name="stock" value={form.stock || ''} onChange={handleChange} className="w-full border p-2 rounded" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
      </form>
    </div>
  );
};

export default EditProductPage;
