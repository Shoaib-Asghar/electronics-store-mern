import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductList from '../components/ProductList';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const PAGE_SIZE = 10;

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({ name: '', brand: '', category: '' });
  const [sortBy, setSortBy] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const [layout, setLayout] = useState('table');
  const navigate = useNavigate();

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/products`);
      setProducts(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
      setStatus({ type: 'error', message: 'Failed to load products.' });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Apply filters and sort
  useEffect(() => {
    let results = [...products];

    // Filtering
    results = results.filter((p) => {
      const matchName = p.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchBrand = p.brand.toLowerCase().includes(filters.brand.toLowerCase());
      const matchCategory = p.category.toLowerCase().includes(filters.category.toLowerCase());
      return matchName && matchBrand && matchCategory;
    });

    // Sorting
    if (sortBy === 'name') {
      results.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'price') {
      results.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'stock') {
      results.sort((a, b) => a.stock - b.stock);
    }

    setFiltered(results);
    setCurrentPage(1);
  }, [filters, sortBy, products]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setDeletingId(id);
    try {
      await axios.delete(`${API_BASE_URL}/products/${id}`);
      setStatus({ type: 'success', message: 'Product deleted successfully.' });
      fetchProducts();
    } catch (err) {
      console.error('Delete error:', err);
      setStatus({ type: 'error', message: 'Failed to delete product.' });
    } finally {
      setDeletingId(null);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginatedProducts = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const changePage = (delta) => {
    setCurrentPage((prev) => Math.min(Math.max(prev + delta, 1), totalPages));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-3xl font-bold text-gray-800">🗂 Product Management</h2>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setLayout(layout === 'table' ? 'grid' : 'table')}
            className="px-4 py-2 border rounded bg-white hover:bg-gray-100 text-sm"
          >
            {layout === 'table' ? 'Grid View' : 'Table View'}
          </button>
          <Link
            to="/products/add"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
          >
            ➕ Add Product
          </Link>
        </div>
      </div>

      {/* Status Message */}
      {status.message && (
        <div
          className={`mb-4 p-4 rounded text-sm font-medium ${
            status.type === 'success'
              ? 'bg-green-100 text-green-800 border border-green-300'
              : 'bg-red-100 text-red-700 border border-red-300'
          }`}
        >
          {status.message}
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          placeholder="Filter by name"
          value={filters.name}
          onChange={(e) => setFilters((prev) => ({ ...prev, name: e.target.value }))}
          className="border p-2 rounded shadow-sm"
        />
        <input
          type="text"
          placeholder="Filter by brand"
          value={filters.brand}
          onChange={(e) => setFilters((prev) => ({ ...prev, brand: e.target.value }))}
          className="border p-2 rounded shadow-sm"
        />
        <input
          type="text"
          placeholder="Filter by category"
          value={filters.category}
          onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
          className="border p-2 rounded shadow-sm"
        />
      </div>

      {/* Sort Dropdown */}
      <div className="flex justify-end mb-4">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border p-2 rounded shadow-sm"
        >
          <option value="">Sort by...</option>
          <option value="name">Name</option>
          <option value="price">Price (Low → High)</option>
          <option value="stock">Stock (Low → High)</option>
        </select>
      </div>

      {/* Product List */}
      <ProductList
        products={paginatedProducts}
        layout={layout}
        onEdit={(id) => navigate(`/products/edit/${id}`)}
        onDelete={handleDelete}
        deletingId={deletingId}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={() => changePage(-1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => changePage(1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductListPage;