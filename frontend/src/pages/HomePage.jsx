import React from 'react';
import { Link } from 'react-router-dom'; // React Router is a library for routing in React applications, example usage: <Link to="/path">Link Text</Link>

const categories = [    // Array of product category objects for displaying on the homepage
  { name: 'Laptops', image: 'src/assets/mouse.png' },
  { name: 'Smartphones', image: 'src/assets/mouse.png' },
  { name: 'Accessories', image: 'src/assets/mouse.png' },
];

const CategoryCard = ({ name, image }) => (   // Functional component to render each category card, takes name and image as props
  <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
    <img src={image} alt={name} className="h-40 w-full object-cover" />
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-700">{name}</h3>
    </div>
  </div>
);

const HomePage = () => {  // Main HomePage component
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 flex flex-col items-center justify-center px-4 py-16">
      
      {/* ---------- Hero Section ---------- */}
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-extrabold text-blue-700 mb-4">
          Welcome to <span className="text-gray-800">Mughal Electronics</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Your one-stop shop for quality gadgets and electronics. Explore our top deals and stay ahead with cutting-edge technology.
        </p>

        {/* --- Action Buttons for navigation --- */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/shop" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded shadow" >
            Start Shopping
          </Link>

          <Link to="/login" className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-6 rounded shadow" >
            Admin / Customer Login
          </Link>

          <Link to="/register" className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold py-2 px-6 rounded shadow">
            Register as Customer
          </Link>
        </div>
      </div>

      {/* -------- Featured Product Categories -------- */}
      <div className="mt-16 w-full max-w-6xl px-4">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">Popular Categories</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((cat) => (  // Map through categories array to render each category card
            <CategoryCard key={cat.name} name={cat.name} image={cat.image} />
          ))}
        </div>

      </div>
      
    </div>
  );
};

export default HomePage;
