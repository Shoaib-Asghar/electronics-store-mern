import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import InventoryPage from './pages/InventoryPage.jsx';
import AddInventoryPage from './pages/AddInventoryPage.jsx';
// import EditInventoryPage from './pages/EditInventoryPage.jsx';
import BuyerInventoryPage from './pages/BuyerInventoryPage.jsx';
import CartPage from './pages/CartPage.jsx';
import Header from './components/Header';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';  
import ProductListPage from './pages/ProductListPage.jsx';
import AddProductPage from './pages/AddProductPage.jsx';
import EditProductPage from './pages/EditProductPage.jsx';  

import { CartProvider } from './context/CartContext.jsx';
import { RoleProvider } from './context/RoleContext';


const App = () => {
  return (
    <BrowserRouter>
      <RoleProvider>
        <CartProvider>
          {/* Global Layout (like header/nav) can go here later */}
          <Header /> {/* This will be rendered on every page */}
          <Routes>
            <Route
              path="/"
              element={
                <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                  <h1 className="text-4xl font-bold text-blue-600">
                    Mughal Electronics Store App
                  </h1>
                </div>
              }
            />
            
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/inventory/add" element={<AddInventoryPage />} />
            {/* <Route path="/inventory/edit/:id" element={<EditInventoryPage />} /> */}
            <Route path="/shop" element={<BuyerInventoryPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/dashboard" element={<AdminDashboardPage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/add" element={<AddProductPage />} />
            <Route path="/products/edit/:id" element={<EditProductPage />} />
                        
            {/* Add more routes as needed */}
          </Routes>
        </CartProvider>
      </RoleProvider>
    </BrowserRouter>
  );
};

export default App;




// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// const App = () => {
//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//       <h1 className="text-4xl font-bold text-blue-600">Mughal Electronics Store App</h1>
//     </div>
//   );
// };

// export default App;
