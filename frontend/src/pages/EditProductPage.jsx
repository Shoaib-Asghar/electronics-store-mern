import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    brand: '',
    description: '',
    price: '',
    stock: '',
    category: '',
  });

  const [existingImageUrl, setExistingImageUrl] = useState('');
  const [newImageFile, setNewImageFile] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/products/${id}`);
        const product = res.data;

        setForm({
          name: product.name || '',
          brand: product.brand || '',
          description: product.description || '',
          price: product.price || '',
          stock: product.stock || '',
          category: product.category || '',
        });

        setExistingImageUrl(product.imageUrl || '');
      } catch (err) {
        console.error('Error fetching product:', err);
        setStatus({ type: 'error', message: 'Failed to fetch product data.' });
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setNewImageFile(e.target.files[0]);
  };

  const isValidNumber = (val) => /^\d+(\.\d{1,2})?$/.test(val) && Number(val) >= 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidNumber(form.price) || !isValidNumber(form.stock)) {
      setStatus({ type: 'error', message: 'Price and stock must be valid non-negative numbers.' });
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));

    if (newImageFile) {
      formData.append('image', newImageFile);
    }

    try {
      await axios.put(`${API_BASE_URL}/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setStatus({ type: 'success', message: 'Product updated successfully' });
      setTimeout(() => navigate('/products'), 2000);
    } catch (err) {
      console.error('Error updating product:', err);
      setStatus({ type: 'error', message: 'Failed to update product. Try again.' });
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>

      {status.message && (
        <div
          className={`p-3 rounded mb-4 text-sm ${
            status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {['name', 'brand', 'description', 'category'].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            value={form[field]}
            onChange={handleChange}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            required
            className="w-full border p-2 rounded"
          />
        ))}

        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          required
          min="0"
          step="0.01"
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          name="stock"
          value={form.stock}
          onChange={handleChange}
          placeholder="Stock"
          required
          min="0"
          step="1"
          className="w-full border p-2 rounded"
        />

        {existingImageUrl && (
          <div>
            <p className="text-sm text-gray-600">Current Image:</p>
            <img
              src={`${API_BASE_URL}${existingImageUrl}`}
              alt="Product"
              className="w-32 h-32 object-cover border rounded"
            />
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
