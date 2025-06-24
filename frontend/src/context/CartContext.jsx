// Using React Context API to manage cart state in a simple e-commerce application. It allows components to access and modify 
// the cart state without prop drilling. Buyer can add items to cart from anywhere and access the cart globally. Without using
// Context API, you would have to pass cart state and functions down through props, which can become cumbersome in larger applications.
import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

// Provider wrapper
export const CartProvider = ({ children }) => { // Create a context provider which is a component that wraps around your application and provides the cart state and functions to all components within it. It takes children as a prop, which are the components that will have access to the cart context.
  const [cartItems, setCartItems] = useState([]); // Initialize cart state as an empty array. This state will hold the items added to the cart, each item will have an _id and quantity. 

//   const addToCart = (item) => { // Thiis function adds an item to the cart. It takes an item object as a parameter, which should have an _id and other properties. 
//     const exists = cartItems.find(ci => ci._id === item._id); // Check if the item already exists in the cart by looking for an item with the same _id.
//     if (!exists) {
//       setCartItems(prev => [...prev, { ...item, quantity: 1 }]); // If the item does not exist, add it to the cart with a quantity of 1. S
//     }
//   };


    const addToCart = (item) => { 
        const exists = cartItems.find(ci => ci._id === item._id); // Check if the item already exists in the cart by looking for an item with the same _id.

        if (!exists) {
            setCartItems(prev => [...prev, { ...item, quantity: item.quantity || 1 }]); // If the item does not exist, add it to the cart with a quantity of 1 or the quantity specified in the item object.
        }
    };





  const removeFromCart = (id) => { // This function removes an item from the cart by its _id. It takes the item's _id as a parameter.
    setCartItems(prev => prev.filter(ci => ci._id !== id)); //Prev is the previous state of the cartItems. It filters out the item with the given _id, effectively removing it from the cart.
  };

  const updateQuantity = (id, qty) => {
    setCartItems(prev =>
      prev.map(ci =>
        ci._id === id ? { ...ci, quantity: qty } : ci  // This function uses the map method to iterate over the cart items. If the item's _id matches the given id, it updates the quantity to the new value (qty). Otherwise, it returns the item unchanged.
      )
    );
  };

  const clearCart = () => setCartItems([]); // This function clears the cart by setting the cartItems state to an empty array.

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}> {/* Provide the cart state and functions to all components within this provider */ }
      {children} 
    </CartContext.Provider>
  );
};

// Custom hook
export const useCart = () => useContext(CartContext); // Custom hook to access the CartContext easily in any component. It uses useContext to get the context value and return it, allowing components to use the cart state and functions without needing to import CartContext directly.
//UseContext in React is a hook that allows you to access the value of a context directly without needing to use the Context.Consumer component. It simplifies the process of consuming context values in functional components. In this case, it is used to access the CartContext value, which contains the cart state and functions, making it easier to use in any component that needs access to the cart functionality.
// Usage example in a component: 
// const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart } = useCart();
