import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, form);
      const { token, user } = res.data;

      login(user, token); // store in context/localStorage

      // Navigate based on role
      if (user?.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/shop');
      }

    } catch (err) {
      if (err.response?.status === 401) {
        setError('Invalid email or password.');
      } else {
        setError('Server error. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded mt-20">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

      {error && (
        <div className="text-red-600 mb-2 text-center">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          disabled={loading}
          className="w-full border p-2 rounded"
        />

        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
          disabled={loading}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="mt-4 text-sm text-center text-gray-600">
        <p>Admins are redirected to the <strong>Dashboard</strong>.</p>
        <p>Customers are redirected to the <strong>Shop</strong>.</p>
      </div>

      <p className="mt-4 text-center text-sm text-gray-600">
        Don’t have a customer account?{' '}
        <a href="/register" className="text-blue-600 underline">Register here</a>
      </p>
    </div>
  );
};

export default LoginPage;
