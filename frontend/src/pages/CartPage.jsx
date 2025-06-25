import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Calculate total value with fallback for invalid prices
  const total = cartItems.reduce((acc, item) => {
    const price = parseFloat(item.price);
    const qty = parseInt(item.quantity) || 1;

    return !isNaN(price) ? acc + price * qty : acc;
  }, 0);

  const handleCheckout = async () => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      // Only include items with valid prices
      const cartPayload = cartItems
        .filter((item) => item.price && item._id)
        .map((item) => ({
          productId: item._id,
          quantity: item.quantity,
        }));

      if (cartPayload.length === 0) {
        alert('No valid items in cart.');
        setIsLoading(false);
        return;
      }

      const res = await axios.post(
        '/api/orders/checkout',
        { cart: cartPayload },
        config
      );

      alert(res.data.message || 'Checkout successful!');
      clearCart();
      navigate('/orders/success');
    } catch (err) {
      console.error('Checkout failed:', err);
      alert(err.response?.data?.message || 'Checkout failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div key={item._id} className="border-b pb-4">
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-gray-700">
                  Price:{' '}
                  {item.price ? `$${parseFloat(item.price).toFixed(2)}` : 'N/A'}
                </p>

                <div className="mt-2 flex items-center">
                  <label htmlFor={`qty-${item._id}`} className="mr-2">
                    Quantity:
                  </label>
                  <input
                    id={`qty-${item._id}`}
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item._id, parseInt(e.target.value) || 1)
                    }
                    className="border w-16 text-center rounded"
                  />
                </div>

                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-500 mt-2 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <p className="text-xl font-bold">
              Total: ${total.toFixed(2)}
            </p>
            <button
              onClick={handleCheckout}
              disabled={isLoading}
              className={`mt-4 px-4 py-2 rounded text-white ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isLoading ? 'Processing...' : 'Checkout'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
