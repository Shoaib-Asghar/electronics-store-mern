import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Custom hook for authentication context, hooks are basically functions that allow you to use state and other React features without writing a class.
//Hooks are of two types: built-in hooks and custom hooks. Built-in hooks are provided by React, such as useState, useEffect, and useContext. Custom hooks are user-defined functions that can encapsulate complex logic and state management, making it reusable across components.
// The useAuth hook is a custom hook that provides authentication functionality, such as logging in and logging out users. It uses the AuthContext to access the current user and token, and provides methods to update them.
// The useNavigate hook is a built-in React Router hook that allows you to programmatically navigate

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 

const LoginPage = () => {  
  const [form, setForm] = useState({ email: '', password: '' });  // UseState is a React hook that lets you add state to functional components. It returns an array with two elements: the current state value and a function to update it. The initial state is set to an object with email and password properties, both initialized to empty strings.
  const [error, setError] = useState('');   // Initialize error state to an empty string, which will be used to display any error messages during login.
  const [loading, setLoading] = useState(false); // Initialize loading state to false, which will be set to true when the login request is in progress, and false when it completes.

  const { login } = useAuth();  // login is a function from the AuthContext that will be used to log in the user. It updates the user and token in the context and localStorage.
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    const { name, value } = e.target; // Destructure the name and value from the event target, which is the input field that triggered the change event.
    setForm(prev => ({ ...prev, [name]: value }));  // Update the form state by spreading the previous state and updating the specific field that changed. This ensures that only the field that was changed is updated, while keeping the other fields intact
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, form); // Send a POST request to the backend API to log in the user with the email and password provided in the form state.
      const { token, user } = res.data; // Destructure the token and user from the response data. The token is used for authentication in subsequent requests, and the user contains the user's information such as name, email, and role.

      login(user, token); // Call the login function from the AuthContext to update the user and token in the context and localStorage. This allows the application to know that the user is logged in and can access protected routes.

      // Navigate based on role
      if (user?.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/shop');
      }

    } catch (err) {
      if (err.response?.status === 401) {
        setError('Invalid email or password.');
      } else {
        setError('Server error. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded mt-20">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

      {error && ( // If there is an error, display it in a red text box above the form.
        <div className="text-red-600 mb-2 text-center">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          disabled={loading}
          className="w-full border p-2 rounded"
        />

        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
          disabled={loading}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition ${ 
            loading ? 'opacity-50 cursor-not-allowed' : '' // the ${loading ? 'opacity-50 cursor-not-allowed' : ''} part conditionally applies styles to the button when loading is true, making it look disabled.
          }`}
        >
          {loading ? 'Logging in...' : 'Login'} {/* If loading is true, show "Logging in...", otherwise show "Login" */}
        </button>
      </form>

      <div className="mt-4 text-sm text-center text-gray-600">
        <p>Admins are redirected to the <strong>Dashboard</strong>.</p>
        <p>Customers are redirected to the <strong>Shop</strong>.</p>
      </div>

      <p className="mt-4 text-center text-sm text-gray-600">
        Don’t have a customer account?{' '}
        <a href="/register" className="text-blue-600 underline">Register here</a>
      </p>
    </div>
  );
};

export default LoginPage;
