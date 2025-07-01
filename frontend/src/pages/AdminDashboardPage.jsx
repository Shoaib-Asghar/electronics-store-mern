import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);

  // Fetch products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, servicesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/products`),
          axios.get(`${API_BASE_URL}/services`),
        ]);
        setProducts(productsRes.data);
        setServices(servicesRes.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };

    fetchData();
  }, []);

  const totalProducts = products.length;
  const lowStock = products.filter((p) => p.stock <= 5).length;
  const totalServices = services.length;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Page Heading */}
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          ⚙️ Admin Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          <DashboardCard
            title="Total Products"
            value={totalProducts}
            color="blue"
          />
          <DashboardCard
            title="Low Stock Items"
            value={lowStock}
            color="red"
            subtitle="Stock ≤ 5"
          />
          <DashboardCard
            title="Orders"
            value="📦 Coming Soon"
            color="yellow"
          />
          <DashboardCard
            title="Service Providers"
            value={totalServices}
            color="green"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
          {/* Product Management */}
          <Link
            to="/products"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition duration-200"
          >
            🧾 Manage Products
          </Link>
          <Link
            to="/products/add"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition duration-200"
          >
            ➕ Add New Product
          </Link>

          {/* Service Management */}
          <Link
            to="/services/admin"
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition duration-200"
          >
            🛠️ Manage Services
          </Link>
          <Link
            to="/services/admin/add"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition duration-200"
          >
            ➕ Add Service Provider
          </Link>
        </div>
      </div>
    </div>
  );
};

// Reusable Card component
const DashboardCard = ({ title, value, color = 'gray', subtitle }) => {
  const borderColor = {
    blue: 'border-blue-600',
    red: 'border-red-500',
    yellow: 'border-yellow-400',
    green: 'border-green-600',
    gray: 'border-gray-400',
  }[color];

  const textColor = {
    blue: 'text-blue-700',
    red: 'text-red-600',
    yellow: 'text-yellow-600',
    green: 'text-green-600',
    gray: 'text-gray-700',
  }[color];

  return (
    <div className={`bg-white shadow-md rounded-xl p-6 border-t-4 ${borderColor}`}>
      <h2 className="text-lg font-semibold text-gray-700 mb-2">{title}</h2>
      <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
};

export default AdminDashboard;
