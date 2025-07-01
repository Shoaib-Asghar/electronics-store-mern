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

import PrivateRoute from './components/PrivateRoute.jsx'; // This component checks if the user is authenticated before rendering the children components
import AdminRoute from './components/AdminRoute.jsx'; // This component checks if the user is an admin before rendering the children components

const App = () => {
  return (
    <BrowserRouter> {/*BrowserRouter is used to enable routing in the application.*/}
      <AuthProvider> {/* AuthProvider provides authentication context to the application. */}
        <CartProvider> {/* CartProvider provides cart context to the application. It is wrrapped in AuthProvider to ensure cart access is available after authentication. */}
          <Header /> {/*This will render on every page as it's outside the Routes.*/}
          <Chatbot /> {/* Chatbot component for customer support, rendered on every page. */}
          <Routes> {/* Routes define the different paths in the application and their corresponding components. */}

            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/services" element={<ServicesPage />} />

            <Route path="/shop" element={<BuyerInventoryPage />} />
            {/* Customer Routes (Require login) */}
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
