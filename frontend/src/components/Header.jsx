// src/components/Header.jsx

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between">
      <Link to="/" className="font-bold text-lg">Electronics Store</Link>
      <nav className="flex gap-4 items-center">
        {!user && (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        )}

        {user?.role === 'admin' && (
          <>
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            <Link to="/products" className="hover:underline">Products</Link>
          </>
        )}

        {user?.role === 'customer' && (
          <>
            <Link to="/shop" className="hover:underline">Shop</Link>
            <Link to="/cart" className="hover:underline">Cart</Link>
          </>
        )}

        {user && (
          <button
            onClick={logout}
            className="bg-red-500 px-2 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
