import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AddServicePage = () => {
  const [form, setForm] = useState({
    name: '',
    expertise: '',
    description: '',
    location: '',
    contactEmail: '',
  });

  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }

    if (image) {
      formData.append('image', image);
    }

    try {
      await axios.post(`${API_BASE_URL}/services`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Service provider added successfully!');
      navigate('/services/admin');
    } catch (err) {
      console.error('Error uploading service:', err);
      alert('Failed to upload service');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Add Service Provider</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="expertise"
          placeholder="e.g. Electrician, Cable Installer"
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <textarea
          name="description"
          placeholder="Service Description"
          rows="3"
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="location"
          placeholder="City or Area"
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="contactEmail"
          placeholder="Contact Email"
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200"
        >
          Add Service
        </button>
      </form>
    </div>
  );
};

export default AddServicePage;