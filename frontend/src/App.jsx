import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './components/Header';

import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';

import BuyerInventoryPage from './pages/BuyerShopPage.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import CheckoutSuccessPage from './pages/CheckoutSuccessPage.jsx';

import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import ProductListPage from './pages/ProductListPage.jsx';
import AddProductPage from './pages/AddProductPage.jsx';
import EditProductPage from './pages/EditProductPage.jsx';

import ServicesPage from './pages/ServicesPage.jsx';
import AdminServicesPage from './pages/AdminServicesPage.jsx';
import AddServicePage from './pages/AddServicePage.jsx';
import EditServicePage from './pages/EditServicePage.jsx';

import Chatbot from './components/Chatbot';

import { CartProvider } from './context/CartContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

import PrivateRoute from './components/PrivateRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Header />
          <Chatbot />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/services" element={<ServicesPage />} />

            {/* Customer Routes (Require login) */}
            <Route path="/shop" element={<BuyerInventoryPage />} />
            <Route path="/cart" element={<PrivateRoute><CartPage /></PrivateRoute>} />
            <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
            <Route path="/checkout/success" element={<PrivateRoute><CheckoutSuccessPage /></PrivateRoute>} />

            {/* Admin Routes (Require admin role) */}
            <Route path="/dashboard" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
            <Route path="/products" element={<AdminRoute><ProductListPage /></AdminRoute>} />
            <Route path="/products/add" element={<AdminRoute><AddProductPage /></AdminRoute>} />
            <Route path="/products/edit/:id" element={<AdminRoute><EditProductPage /></AdminRoute>} />

            <Route path="/services/admin" element={<AdminRoute><AdminServicesPage /></AdminRoute>} />
            <Route path="/services/admin/add" element={<AdminRoute><AddServicePage /></AdminRoute>} />
            <Route path="/services/admin/edit/:id" element={<AdminRoute><EditServicePage /></AdminRoute>} />
          </Routes>

        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
