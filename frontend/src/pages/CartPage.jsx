import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const total = cartItems.reduce((acc, item) => {
    const price = parseFloat(item.price);
    const qty = parseInt(item.quantity) || 1;
    return !isNaN(price) ? acc + price * qty : acc;
  }, 0);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">🛒 Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">Your cart is currently empty.</p>
      ) : (
        <>
          <div className="divide-y divide-gray-200 mb-6">
            {cartItems.map((item) => (
              <div key={item._id} className="py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                    <p className="text-sm text-gray-600">Price: ${parseFloat(item.price).toFixed(2)}</p>

                    <div className="mt-2 flex items-center space-x-2">
                      <label htmlFor={`qty-${item._id}`} className="text-sm font-medium">
                        Qty:
                      </label>
                      <input
                        id={`qty-${item._id}`}
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item._id, parseInt(e.target.value) || 1)
                        }
                        className="w-16 border border-gray-300 rounded px-2 py-1 text-center"
                      />
                    </div>
                  </div>

                  <div className="text-right">
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 text-sm hover:underline"
                    >
                      Remove
                    </button>
                    <p className="text-lg font-semibold mt-2 text-gray-700">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-right">
            <p className="text-xl font-bold mb-4">Total: ${total.toFixed(2)}</p>
            <button
              onClick={() => navigate('/checkout')}
              className="bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
