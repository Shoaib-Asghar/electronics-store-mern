import React, { useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL; // backend API base URL

const AddInventoryPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        description: '',
        price: '',
        stock: '',
    });

    const [success, setSuccess] = useState(null); 
    const [error, setError] = useState(null);    



    const handleChange = (e) => {
        const { name, value } = e.target;
        
        setFormData((prev) => ({
        ...prev,
        [name]: value,
        }));
    };

    

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload
        setError(null);
        setSuccess(null);

    try {
        // Send POST request to backend
        const res = await axios.post(`${API}/inventory`, formData);
        if (res.status === 201) {
            setSuccess('Item successfully added!');
            setFormData({ name: '', brand: '', description: '', price: '', stock: '' });
        }
    } catch (err) {
        console.error(err);
        setError('Failed to add item. Please check fields and try again.');
    }
};



    return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add New Inventory Item</h1>

      {success && <p className="text-green-600 mb-2">{success}</p>}
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input: Name */}
        <div>
          <label className="block mb-1 font-medium">Item Name</label>
          <input
            name="name"
            type="text"
            className="w-full p-2 border rounded"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Input: Brand */}
        <div>
          <label className="block mb-1 font-medium">Brand</label>
          <input
            name="brand"
            type="text"
            className="w-full p-2 border rounded"
            value={formData.brand}
            onChange={handleChange}
            required
          />
        </div>

        {/* Input: Description */}
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            className="w-full p-2 border rounded"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        {/* Input: Price */}
        <div>
          <label className="block mb-1 font-medium">Price ($)</label>
          <input
            name="price"
            type="number"
            step="0.01"
            className="w-full p-2 border rounded"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        {/* Input: Stock */}
        <div>
          <label className="block mb-1 font-medium">Stock</label>
          <input
            name="stock"
            type="number"
            className="w-full p-2 border rounded"
            value={formData.stock}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Item
        </button>
      </form>
    </div>
  );


}

export default AddInventoryPage;
