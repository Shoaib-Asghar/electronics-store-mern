import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const AddProductPage = () => {
  const [form, setForm] = useState({ // Initialize form state with empty fields
    name: '',
    brand: '',
    description: '',
    price: '',
    stock: '',
    category: '',
  });

  const [image, setImage] = useState(null); // Separate state for file upload
  const navigate = useNavigate(); // Hook to programmatically navigate after form submission

  const handleChange = (e) => { // Handle text input changes for form fields
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => { // Handle image file input change
    setImage(e.target.files[0]); // Store the file object in state
  };


  const handleSubmit = async (e) => { // Handle form submission
    e.preventDefault();

    const formData = new FormData(); // Create a FormData object to handle file uploads. FormData allows us to send files and text data together in a single request.

    for (const key in form) { // Append each form field to FormData
      formData.append(key, form[key]);
    }

    if (image) { // If an image file is selected, append it to FormData
      formData.append('image', image); // "image" must match the backend route's multer field
    }

    try { // Send POST request to backend API to create a new product
      await axios.post(`${API_BASE_URL}/products`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Required for file uploads
        },
      });
      
        alert('Product uploaded successfully!'); // Notify user of success
        navigate('/products'); // Go back to admin products page after submission

    } catch (err) {
      console.error('Error uploading product:', err);
      alert('Failed to upload product');
    }
  };


  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['name', 'brand', 'description', 'category'].map((field) => ( // Map through an array of field names to create input fields dynamically
          <input
            key={field} 
            type="text"
            name={field}
            placeholder={field}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        ))}

        {/* Numeric Inputs */}
        <input
          type="number"
          min={0}
          name="price"
          placeholder="Price"
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
            min={0}
          name="stock"
          placeholder="Stock"
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        {/* Actual image file input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full border p-2 rounded"
        />

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Create
        </button>
      </form>
    </div>
  );
};

export default AddProductPage;
