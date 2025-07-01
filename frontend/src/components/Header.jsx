import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gray-900 text-white px-6 py-4 shadow-md">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/" className="text-xl font-bold text-blue-400 hover:text-white transition">
          Mughal Electronics
        </Link>

        <nav className="flex items-center gap-5 text-sm">
          <Link to="/services" className="hover:underline hover:text-blue-300">  
              Services
              </Link>
      
          {!user && (
            <>
              
              <Link to="/shop" className="hover:underline hover:text-blue-300">
                Shop
              </Link>
              <Link to="/login" className="hover:underline hover:text-blue-300">
                Login
              </Link>
              <Link to="/register" className="hover:underline hover:text-blue-300">
                Register
              </Link>
            </>
          )}

          {user?.role === 'admin' && (
            <>
              <Link to="/dashboard" className="hover:underline hover:text-blue-300">
                Dashboard
              </Link>
              <Link to="/products" className="hover:underline hover:text-blue-300">
                Products
              </Link>
            </>
          )}

          {user?.role === 'customer' && (
            <>
            
              <Link to="/shop" className="hover:underline hover:text-blue-300">
                Shop
              </Link>
              <Link to="/cart" className="hover:underline hover:text-blue-300">
                Cart
              </Link>
            </>
          )}

          {user && (
            <button
              onClick={logout}
              className="ml-2 bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
