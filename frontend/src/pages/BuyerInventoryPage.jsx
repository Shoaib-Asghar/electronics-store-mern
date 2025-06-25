// src/pages/BuyerInventoryPage.jsx

import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_ENDPOINT = `${API_BASE_URL}/products`;

// ---------------------- Product Card ----------------------
const ProductCard = ({
  product,
  quantity,
  onQuantityChange,
  onAddToCart,
  status,
  isInCart,
}) => {
  const isOutOfStock = product.stock === 0;
  const isOverStock = quantity > product.stock;

  return (
    <div className="bg-white shadow rounded-xl overflow-hidden flex flex-col">
      <img
        src={`${API_BASE_URL}${product.imageUrl}`}
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
          <p className="text-sm text-gray-600">In stock: {product.stock}</p>
        </div>

        {isOutOfStock ? (
          <p className="mt-3 text-red-500 text-sm font-medium">Out of Stock</p>
        ) : (
          <div className="mt-4 flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) =>
                  onQuantityChange(product._id, parseInt(e.target.value, 10))
                }
                className="border w-16 text-center rounded p-1"
              />

              <button
                disabled={isOverStock || isInCart}
                onClick={() => onAddToCart(product)}
                className={`px-3 py-2 rounded ${
                  isOverStock || isInCart
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {isInCart ? "In Cart" : "Add to Cart"}
              </button>
            </div>

            {status[product._id] && (
              <p
                className={`text-sm ${
                  status[product._id].type === "success"
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {status[product._id].message}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ---------------------- Buyer Inventory Page ----------------------
const BuyerInventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [status, setStatus] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const { cartItems, addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(API_ENDPOINT);
        if (!Array.isArray(res.data)) {
          console.error("Expected an array, but got:", typeof res.data);
          return;
        }

        setProducts(res.data);

        const initialQuantities = {};
        res.data.forEach((product) => {
          initialQuantities[product._id] = 1;
        });
        setQuantities(initialQuantities);
      } catch (err) {
        console.error("Error fetching products:", err.message);
      }
    };

    fetchProducts();
  }, []);

  const handleQuantityChange = (id, qty) => {
    if (qty >= 1) {
      setQuantities((prev) => ({ ...prev, [id]: qty }));
    }
  };

  const handleAddToCart = (product) => {
    const qty = quantities[product._id];
    const isAlreadyInCart = cartItems.some((item) => item._id === product._id);

    if (isAlreadyInCart) {
      showStatus(product._id, "error", "Already in cart");
    } else if (qty > product.stock) {
      showStatus(product._id, "error", `Only ${product.stock} in stock`);
    } else {
      addToCart({ ...product, quantity: qty });
      showStatus(product._id, "success", "Added to cart ");
    }
  };

  const showStatus = (productId, type, message) => {
    setStatus((prev) => ({
      ...prev,
      [productId]: { type, message },
    }));

    setTimeout(() => {
      setStatus((prev) => {
        const newStatus = { ...prev };
        delete newStatus[productId];
        return newStatus;
      });
    }, 3000);
  };

  const filteredProducts = products.filter((product) => {
    const term = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(term) ||
      product.brand.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        🛒 Shop Products
      </h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name, brand or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/2 border p-2 rounded-md shadow-sm"
        />
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500">
          No products match your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              quantity={quantities[product._id] || 1}
              onQuantityChange={handleQuantityChange}
              onAddToCart={handleAddToCart}
              status={status}
              isInCart={cartItems.some((item) => item._id === product._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BuyerInventoryPage;
