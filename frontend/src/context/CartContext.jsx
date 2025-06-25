import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  /**
   * Adds an item to the cart.
   * - If it already exists, increases quantity.
   * - If it's new, adds it with quantity 1 or given value.
   */
  const addToCart = (item) => {
    setCartItems(prev => {
      const existing = prev.find(ci => ci._id === item._id);

      if (existing) {
        return prev.map(ci =>
          ci._id === item._id
            ? { ...ci, quantity: ci.quantity + (item.quantity || 1) }
            : ci
        );
      } else {
        return [...prev, { ...item, quantity: item.quantity || 1 }];
      }
    });
  };

  /**
   * Removes an item from the cart by ID.
   */
  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(ci => ci._id !== id));
  };

  /**
   * Updates the quantity of a cart item by ID.
   * If quantity is zero or less, it removes the item.
   */
  const updateQuantity = (id, qty) => {
    if (qty <= 0) {
      removeFromCart(id);
    } else {
      setCartItems(prev =>
        prev.map(ci =>
          ci._id === id ? { ...ci, quantity: qty } : ci
        )
      );
    }
  };

  /**
   * Clears the entire cart.
   */
  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook for consuming cart context
export const useCart = () => useContext(CartContext);
