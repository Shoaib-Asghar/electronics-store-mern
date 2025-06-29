// import React from 'react';
// import { useAuth } from '../context/AuthContext';
// import { Link } from 'react-router-dom';

// const Header = () => {
//   const { user, logout } = useAuth();

//   const isAdmin = user?.role === 'admin';
//   const isCustomer = user?.role === 'customer';

//   const renderLink = (to, label) => (
//     <Link
//       to={to}
//       className="hover:text-blue-300 transition duration-200"
//     >
//       {label}
//     </Link>
//   );

//   return (
//     <header className="bg-gradient-to-r from-gray-900 to-blue-900 text-white shadow-md">
//       <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
//         {/* Logo / Brand */}
//         <Link
//           to="/"
//           className="text-2xl font-extrabold tracking-wide text-white hover:text-blue-300 transition"
//         >
//           Mughal Electronics
//         </Link>

//         {/* Navigation Links */}
//         <nav className="flex flex-wrap items-center gap-4 text-sm sm:text-base font-medium">
//           {/* If not logged in */}
//           {!user && (
//             <>
//               {renderLink('/login', 'Login')}
//               {renderLink('/register', 'Register')}
//             </>
//           )}

//           {/* Admin links */}
//           {isAdmin && (
//             <>
//               {renderLink('/dashboard', 'Dashboard')}
//               {renderLink('/products', 'Products')}
//             </>
//           )}

//           {/* Customer links */}
//           {isCustomer && (
//             <>
//               {renderLink('/shop', 'Shop')}
//               {renderLink('/cart', 'Cart')}
//             </>
//           )}

//           {/* Logout button */}
//           {user && (
//             <button
//               onClick={logout}
//               className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
//             >
//               Logout
//             </button>
//           )}
//         </nav>
//       </div>
//     </header>
//   );
// };

// export default Header;


// src/components/Header.jsx

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gray-900 text-white px-6 py-4 shadow-md">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/" className="text-xl font-bold text-blue-400 hover:text-white transition">
          Mughal Electronics
        </Link>

        <nav className="flex items-center gap-5 text-sm">
          <Link to="/services" className="hover:underline hover:text-blue-300">
              Services
              </Link>
      
          {!user && (
            <>
              
              <Link to="/shop" className="hover:underline hover:text-blue-300">
                Shop
              </Link>
              <Link to="/login" className="hover:underline hover:text-blue-300">
                Login
              </Link>
              <Link to="/register" className="hover:underline hover:text-blue-300">
                Register
              </Link>
            </>
          )}

          {user?.role === 'admin' && (
            <>
              <Link to="/dashboard" className="hover:underline hover:text-blue-300">
                Dashboard
              </Link>
              <Link to="/products" className="hover:underline hover:text-blue-300">
                Products
              </Link>
            </>
          )}

          {user?.role === 'customer' && (
            <>
              
              <Link to="/cart" className="hover:underline hover:text-blue-300">
                Cart
              </Link>
            </>
          )}

          {user && (
            <button
              onClick={logout}
              className="ml-2 bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
