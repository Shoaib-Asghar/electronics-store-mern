import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import InventoryPage from './pages/InventoryPage.jsx';
// import AddInventoryPage from './pages/AddInventoryPage.jsx';
// import EditInventoryPage from './pages/EditInventoryPage.jsx';
import BuyerInventoryPage from './pages/BuyerInventoryPage.jsx';
import CartPage from './pages/CartPage.jsx';
import Header from './components/Header';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';  
import ProductListPage from './pages/ProductListPage.jsx';
import AddProductPage from './pages/AddProductPage.jsx';
import EditProductPage from './pages/EditProductPage.jsx';  
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import HomePage from './pages/HomePage.jsx';

import { CartProvider } from './context/CartContext.jsx';
// import { RoleProvider } from './context/RoleContext';
import { AuthProvider } from './context/AuthContext.jsx';

import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* <RoleProvider> */}
          <CartProvider>
            <Header />

            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />}
              />

              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />


              {/* Customer Routes (Protected via PrivateRoute) */}
              <Route path="/shop" element={ 
                <BuyerInventoryPage />
                }
              />

              <Route path="/cart" element={
                  <PrivateRoute> <CartPage /> </PrivateRoute>
                }
              />


              {/* Admin Routes (Strictly via AdminRoute) */}
              <Route path="/dashboard" element={
                <AdminRoute> <AdminDashboardPage /> </AdminRoute>
                }
              />

              <Route path="/products" element={
                <AdminRoute> <ProductListPage /> </AdminRoute>
                }
              />

              <Route path="/products/add" element={
                <AdminRoute> <AddProductPage /> </AdminRoute>
                }
              />

              <Route path="/products/edit/:id" element={
                <AdminRoute> <EditProductPage /> </AdminRoute>
                }
              />
              <Route path="/inventory" element={
                <AdminRoute> <InventoryPage /> </AdminRoute>
                }
              />
              {/* <Route path="/inventory/add" element={
                  <AdminRoute> <AddInventoryPage /> </AdminRoute>
                }
              /> */}

              {/* Optional future route */}
            </Routes>
          </CartProvider>
        {/* </RoleProvider> */}
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
