import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Header = () => {
  const { cartItems } = useCart();

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link to="/">Mughal Electronics</Link>
        </h1>

        <nav className="space-x-6 text-lg">
          <Link to="/shop" className="hover:underline">Shop</Link>
          <Link to="/inventory" className="hover:underline">Inventory</Link>
          <Link to="/cart" className="hover:underline">
            Cart ({cartItems.length})
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
