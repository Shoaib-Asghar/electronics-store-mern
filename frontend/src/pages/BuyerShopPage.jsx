import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_ENDPOINT = `${API_BASE_URL}/products`;

const BuyerShopPage = () => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [status, setStatus] = useState({});
  const [filters, setFilters] = useState({ name: '', brand: '', category: '' });
  const [sortBy, setSortBy] = useState('');
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  const { cartItems, addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(API_ENDPOINT);
        const allProducts = res.data;
        setProducts(allProducts);

        setBrands([...new Set(allProducts.map(p => p.brand))]);
        setCategories([...new Set(allProducts.map(p => p.category))]);

        const initialQuantities = {};
        allProducts.forEach(p => initialQuantities[p._id] = 1);
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

    if (!user) {
      showStatus(product._id, "error", "Please login to add items.");
    } else if (isAlreadyInCart) {
      showStatus(product._id, "error", "Already in cart");
    } else if (qty > product.stock) {
      showStatus(product._id, "error", `Only ${product.stock} in stock`);
    } else {
      addToCart({ ...product, quantity: qty });
      showStatus(product._id, "success", "Added to cart");
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

  const filteredProducts = products
    .filter((p) =>
      p.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      (filters.brand ? p.brand === filters.brand : true) &&
      (filters.category ? p.category === filters.category : true)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "priceLow":
          return a.price - b.price;
        case "priceHigh":
          return b.price - a.price;
        case "nameAZ":
          return a.name.localeCompare(b.name);
        case "nameZA":
          return b.name.localeCompare(a.name);
        case "stockHigh":
          return b.stock - a.stock;
        default:
          return 0;
      }
    });

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        🛒 Explore Electronics
      </h1>

      {/* Filter + Sort Bar */}
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <input
          type="text"
          placeholder="Search by name"
          value={filters.name}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, name: e.target.value }))
          }
          className="border p-2 rounded shadow-sm"
        />

        <select
          value={filters.brand}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, brand: e.target.value }))
          }
          className="border p-2 rounded shadow-sm"
        >
          <option value="">All Brands</option>
          {brands.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>

        <select
          value={filters.category}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, category: e.target.value }))
          }
          className="border p-2 rounded shadow-sm"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border p-2 rounded shadow-sm"
        >
          <option value="">Sort by</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="priceHigh">Price: High to Low</option>
          <option value="nameAZ">Name: A to Z</option>
          <option value="nameZA">Name: Z to A</option>
          <option value="stockHigh">Stock: High to Low</option>
        </select>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500">No products match your filters.</p>
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
              isLoggedIn={!!user}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BuyerShopPage;