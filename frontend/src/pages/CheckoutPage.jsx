// src/pages/CheckoutPage.jsx

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  const handleConfirm = async () => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const cartPayload = cartItems.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
      }));

      const res = await axios.post(`${API_BASE_URL}/orders/checkout`, { cart: cartPayload }, config);

      setStatus({ type: 'success', message: res.data.message || 'Checkout successful!' });
      clearCart();

      setTimeout(() => navigate('/checkout/success'), 2000);
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Checkout failed.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded mt-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Confirm Your Order</h1>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <ul className="divide-y divide-gray-200 mb-6">
            {cartItems.map((item) => (
              <li key={item._id} className="py-4 flex justify-between">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <p className="text-gray-700">${(item.price * item.quantity).toFixed(2)}</p>
              </li>
            ))}
          </ul>

          {status && (
            <p
              className={`mb-4 text-center ${
                status.type === 'success' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {status.message}
            </p>
          )}

          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Processing...' : 'Confirm and Checkout'}
          </button>
        </>
      )}
    </div>
  );
};

export default CheckoutPage;
