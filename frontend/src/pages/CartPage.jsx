import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  // Get cart state and operations from context
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  // Calculate total cart value
  const total = cartItems.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0);

  // Simulate checkout
  const handleCheckout = () => {
    alert("✅ Order placed!");
    clearCart(); // clear the cart after placing order
    navigate('/shop'); // redirect user back to shop
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {/* ✅ DEBUG: Show raw cart data */}
      <pre className="text-sm bg-gray-100 p-2 mb-4 rounded">
        Debug Cart State: {JSON.stringify(cartItems, null, 2)}
      </pre>

      {cartItems.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map(item => (
            <div key={item._id} className="border-b py-4">
              <h2 className="text-lg font-bold">{item.name}</h2>
              <p className="text-gray-700">Price: ${item.price?.toFixed(2) ?? 'N/A'}</p>

              <p className="mt-2">
                Quantity:{" "}
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item._id, parseInt(e.target.value) || 1)
                  }
                  className="border ml-2 w-16 text-center rounded"
                />
              </p>

              <button
                onClick={() => removeFromCart(item._id)}
                className="text-red-500 mt-2 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="mt-6">
            <p className="text-xl font-bold">
              Total: ${total.toFixed(2)}
            </p>
            <button
              onClick={handleCheckout}
              className="bg-green-600 text-white px-4 py-2 rounded mt-4 hover:bg-green-700"
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
