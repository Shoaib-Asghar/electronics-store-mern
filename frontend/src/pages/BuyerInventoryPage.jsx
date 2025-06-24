import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const API = import.meta.env.VITE_API_BASE_URL;

const BuyerInventoryPage = () => {
  const [items, setItems] = useState([]);       // Full inventory from backend
  const [filtered, setFiltered] = useState([]); // Filtered by search term
  const [search, setSearch] = useState('');     // Search input text
  const [quantities, setQuantities] = useState({}); // Quantity input for each item

  const { addToCart, cartItems } = useCart(); // From global cart context

  // Fetch inventory on mount
  useEffect(() => {
    axios.get(`${API}/inventory`)
      .then(res => {
        setItems(res.data);
        setFiltered(res.data);

        // Set default quantity = 1 for each item
        const initialQty = {};
        res.data.forEach(item => {
          initialQty[item._id] = 1;
        });
        setQuantities(initialQty);
      })
      .catch(() => alert('Failed to fetch items'));
  }, []);

  // Handle search filter
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);

    const filteredItems = items.filter(item =>
      item.name.toLowerCase().includes(value) ||
      item.brand.toLowerCase().includes(value)
    );

    setFiltered(filteredItems);
  };

  // Handle quantity change
  const handleQuantityChange = (id, value) => {
    const numericValue = Math.max(1, parseInt(value) || 1);
    setQuantities(prev => ({ ...prev, [id]: numericValue }));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Shop Electronics</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by name or brand..."
        value={search}
        onChange={handleSearch}
        className="w-full p-2 border rounded mb-6"
      />

      {/* Item Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map(item => {
          const isInCart = cartItems.some(ci => ci._id === item._id);
          const quantity = quantities[item._id] || 1;

          return (
            <div key={item._id} className="bg-white p-4 shadow rounded border flex flex-col">
              <h2 className="text-xl font-bold">{item.name}</h2>
              <p className="text-gray-500">{item.brand}</p>
              <p className="text-sm mt-2 text-gray-700">{item.description}</p>

              <div className="mt-2">
                <p className="font-semibold text-blue-600 text-lg">${item.price.toFixed(2)}</p>
                <p className="text-green-700 text-sm">In Stock: {item.stock}</p>
              </div>

              {/* Quantity Input */}
              {!isInCart && (
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                  className="mt-3 p-1 border rounded w-20"
                />
              )}

              {/* Add to Cart Button */}
              <button
                onClick={() => addToCart({ ...item, quantity })}
                disabled={isInCart}
                className={`mt-3 px-3 py-1 rounded ${
                  isInCart
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isInCart ? 'In Cart' : 'Add to Cart'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BuyerInventoryPage;
