// src/pages/BuyerInventoryPage.jsx

import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const BuyerInventoryPage = () => {
  const [products, setProducts] = useState([]);           // All fetched products
  const [quantities, setQuantities] = useState({});       // Quantity for each product
  const { addToCart } = useCart();                        // Cart context for adding items

  // Fetch product list from backend API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/products');

        if (!Array.isArray(res.data)) {
          console.error("❌ Expected an array, but got:", typeof res.data);
          return;
        }

        setProducts(res.data);

        // Initialize all product quantities to 1
        const initialQuantities = {};
        res.data.forEach(product => {
          initialQuantities[product._id] = 1;
        });
        setQuantities(initialQuantities);
      } catch (err) {
        console.error("❌ Error fetching products:", err.message);
      }
    };

    fetchProducts();
  }, []);

  // Update quantity for a specific product
  const handleQuantityChange = (id, qty) => {
    if (qty >= 1) {
      setQuantities(prev => ({ ...prev, [id]: qty }));
    }
  };

  // Add selected product to cart
  const handleAddToCart = (product) => {
    const qty = quantities[product._id];
    if (qty <= product.stock) {
      addToCart({ ...product, quantity: qty });
    } else {
      alert(`Only ${product.stock} items in stock`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        🛒 Shop Products
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">
            No products available at the moment.
          </p>
        ) : (
          products.map((product) => (
            <div
              key={product._id}
              className="bg-white shadow rounded-xl overflow-hidden flex flex-col"
            >
              {/* Optional image fallback */}
              <img
                src={product.imageUrl || "/placeholder.jpg"}
                alt={product.name}
                className="h-48 w-full object-cover"
              />

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{product.name}</h2>
                  <p className="text-sm text-gray-500">
                    {product.brand} | {product.category}
                  </p>
                  <p className="mt-2 text-gray-700 text-sm">{product.description}</p>
                  <p className="mt-2 text-blue-600 font-bold text-lg">${product.price}</p>
                  <p className="text-sm text-gray-600">
                    In stock: {product.stock}
                  </p>
                </div>

                {/* Purchase options */}
                {product.stock > 0 ? (
                  <div className="mt-4 flex items-center space-x-2">
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantities[product._id] || 1}
                      onChange={(e) =>
                        handleQuantityChange(product._id, parseInt(e.target.value))
                      }
                      className="border w-16 text-center rounded p-1"
                    />

                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                      disabled={quantities[product._id] > product.stock}
                    >
                      Add to Cart
                    </button>
                  </div>
                ) : (
                  <p className="mt-3 text-red-500 text-sm font-medium">
                    Out of Stock
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BuyerInventoryPage;





















// import React, { useEffect, useState } from 'react';
// import { useCart } from '../context/CartContext';
// import axios from 'axios';

// const BuyerInventoryPage = () => {
//   const [products, setProducts] = useState([]); // All products
//   const [quantities, setQuantities] = useState({}); // Quantity for each product
//   const { addToCart } = useCart();

//   // Fetch all products from the backend
// //   useEffect(() => {
// //     const fetchProducts = async () => {
// //       try {
// //         const res = await axios.get('/api/products');
// //         setProducts(res.data);

// //         // Initialize quantity state for each product
// //         const initialQuantities = {};
// //         res.data.forEach((product) => {
// //           initialQuantities[product._id] = 1;
// //         });
// //         setQuantities(initialQuantities);
// //       } catch (err) {
// //         console.error("Error fetching products", err);
// //       }
// //     };

// //     fetchProducts();
// //   }, []);

// useEffect(() => {
//   const fetchProducts = async () => {
//     try {
//       const res = await axios.get('/api/products');
//       console.log("API response:", res.data); // 👈 Check what you're actually getting

//       if (!Array.isArray(res.data)) {
//         console.error("Expected array but got:", typeof res.data);
//         return;
//       }

//       setProducts(res.data);

//       const initialQuantities = {};
//       res.data.forEach((product) => {
//         initialQuantities[product._id] = 1;
//       });
//       setQuantities(initialQuantities);
//     } catch (err) {
//       console.error("Error fetching products", err);
//     }
//   };

//   fetchProducts();
// }, []);


//   // Handle adding to cart
//   const handleAddToCart = (product) => {
//     const qty = quantities[product._id];
//     addToCart({ ...product, quantity: qty });
//   };

//   // Update quantity
//   const handleQuantityChange = (id, qty) => {
//     if (qty >= 1) {
//       setQuantities((prev) => ({ ...prev, [id]: qty }));
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-6 py-8">
//       <h1 className="text-3xl font-bold mb-6 text-center">Shop Products</h1>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//         {products.map((product) => (
//           <div
//             key={product._id}
//             className="bg-white shadow rounded-xl overflow-hidden flex flex-col"
//           >
//             {product.imageUrl && (
//               <img
//                 src={product.imageUrl}
//                 alt={product.name}
//                 className="h-48 w-full object-cover"
//               />
//             )}

//             <div className="p-4 flex-1 flex flex-col justify-between">
//               <div>
//                 <h2 className="text-xl font-semibold">{product.name}</h2>
//                 <p className="text-gray-500">{product.brand} | {product.category}</p>
//                 <p className="mt-2 text-gray-700">{product.description}</p>
//                 <p className="mt-2 text-blue-600 font-bold text-lg">${product.price}</p>
//                 <p className="text-sm text-gray-600">In stock: {product.stock}</p>
//               </div>

//               <div className="mt-4 flex items-center space-x-2">
//                 <input
//                   type="number"
//                   min="1"
//                   value={quantities[product._id] || 1}
//                   onChange={(e) =>
//                     handleQuantityChange(product._id, parseInt(e.target.value))
//                   }
//                   className="border w-16 text-center rounded p-1"
//                 />
//                 <button
//                   onClick={() => handleAddToCart(product)}
//                   className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
//                 >
//                   Add to Cart
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default BuyerInventoryPage;












// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useCart } from '../context/CartContext';

// const API = import.meta.env.VITE_API_BASE_URL;

// const BuyerInventoryPage = () => {
//   const [items, setItems] = useState([]);       // Full inventory from backend
//   const [filtered, setFiltered] = useState([]); // Filtered by search term
//   const [search, setSearch] = useState('');     // Search input text
//   const [quantities, setQuantities] = useState({}); // Quantity input for each item

//   const { addToCart, cartItems } = useCart(); // From global cart context

//   // Fetch inventory on mount
//   useEffect(() => {
//     axios.get(`${API}/inventory`)
//       .then(res => {
//         setItems(res.data);
//         setFiltered(res.data);

//         // Set default quantity = 1 for each item
//         const initialQty = {};
//         res.data.forEach(item => {
//           initialQty[item._id] = 1;
//         });
//         setQuantities(initialQty);
//       })
//       .catch(() => alert('Failed to fetch items'));
//   }, []);

//   // Handle search filter
//   const handleSearch = (e) => {
//     const value = e.target.value.toLowerCase();
//     setSearch(value);

//     const filteredItems = items.filter(item =>
//       item.name.toLowerCase().includes(value) ||
//       item.brand.toLowerCase().includes(value)
//     );

//     setFiltered(filteredItems);
//   };

//   // Handle quantity change
//   const handleQuantityChange = (id, value) => {
//     const numericValue = Math.max(1, parseInt(value) || 1);
//     setQuantities(prev => ({ ...prev, [id]: numericValue }));
//   };

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <h1 className="text-3xl font-bold mb-6 text-center">Shop Electronics</h1>

//       {/* Search Bar */}
//       <input
//         type="text"
//         placeholder="Search by name or brand..."
//         value={search}
//         onChange={handleSearch}
//         className="w-full p-2 border rounded mb-6"
//       />

//       {/* Item Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {filtered.map(item => {
//           const isInCart = cartItems.some(ci => ci._id === item._id);
//           const quantity = quantities[item._id] || 1;

//           return (
//             <div key={item._id} className="bg-white p-4 shadow rounded border flex flex-col">
//               <h2 className="text-xl font-bold">{item.name}</h2>
//               <p className="text-gray-500">{item.brand}</p>
//               <p className="text-sm mt-2 text-gray-700">{item.description}</p>

//               <div className="mt-2">
//                 <p className="font-semibold text-blue-600 text-lg">${item.price.toFixed(2)}</p>
//                 <p className="text-green-700 text-sm">In Stock: {item.stock}</p>
//               </div>

//               {/* Quantity Input */}
//               {!isInCart && (
//                 <input
//                   type="number"
//                   min={1}
//                   value={quantity}
//                   onChange={(e) => handleQuantityChange(item._id, e.target.value)}
//                   className="mt-3 p-1 border rounded w-20"
//                 />
//               )}

//               {/* Add to Cart Button */}
//               <button
//                 onClick={() => addToCart({ ...item, quantity })}
//                 disabled={isInCart}
//                 className={`mt-3 px-3 py-1 rounded ${
//                   isInCart
//                     ? 'bg-gray-400 text-white cursor-not-allowed'
//                     : 'bg-blue-600 text-white hover:bg-blue-700'
//                 }`}
//               >
//                 {isInCart ? 'In Cart' : 'Add to Cart'}
//               </button>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default BuyerInventoryPage;
