import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products for dashboard stats
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/products');
        setProducts(res.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };

    fetchProducts();
  }, []);

  // Calculate dashboard stats
  const totalProducts = products.length;
  const lowStock = products.filter(p => p.stock <= 5).length;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 shadow rounded-lg">
          <h2 className="text-xl font-semibold">Total Products</h2>
          <p className="text-2xl">{totalProducts}</p>
        </div>
        <div className="bg-white p-6 shadow rounded-lg">
          <h2 className="text-xl font-semibold">Low Stock Items</h2>
          <p className="text-2xl text-red-600">{lowStock}</p>
        </div>
        <div className="bg-white p-6 shadow rounded-lg">
          <h2 className="text-xl font-semibold">Orders (Coming Soon)</h2>
          <p className="text-gray-500">Under Development</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 justify-center">
        <Link
          to="/products"
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          Manage Products
        </Link>
        <Link
          to="/products/add"
          className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
        >
          Add New Product
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
