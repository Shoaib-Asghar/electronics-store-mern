import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // useParams is a hook that allows you to access the URL parameters in your component. In this case, it is used to get the item ID from the URL so that you can fetch the specific item data for editing.
import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL;

const EditInventoryPage = () => {
  const { id } = useParams(); // get item ID from URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    description: '',
    price: '',
    stock: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch existing item data
  useEffect(() => {
    axios
      .get(`${API}/inventory/${id}`)
      .then((res) => {
        setFormData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Item not found');
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API}/inventory/${id}`, formData);
      navigate('/inventory');
    } catch (err) {
      setError('Update failed');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Inventory Item</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['name', 'brand', 'description', 'price', 'stock'].map((field) => (
          <div key={field}>
            <label className="block font-medium">{field}</label>
            <input
              type={field === 'description' ? 'text' : field === 'price' || field === 'stock' ? 'number' : 'text'}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditInventoryPage;
