import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductList from '../components/ProductList';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const IMAGE_BASE_URL = import.meta.env.VITE_IMAGES_BASE_URL;

const PAGE_SIZE = 10;

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const [layout, setLayout] = useState('table'); // 'table' or 'grid'
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

  // Handle search filtering
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const results = products.filter((p) =>
      [p.name, p.brand, p.category].some((field) =>
        field?.toLowerCase().includes(term)
      )
    );
    setFiltered(results);
    setCurrentPage(1); // Reset to first page on search
  }, [searchTerm, products]);

  // Handle delete with confirmation
  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this product?');
    if (!confirm) return;

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
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Products</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setLayout(layout === 'table' ? 'grid' : 'table')}
            className="px-3 py-1 border rounded"
          >
            {layout === 'table' ? 'Grid View' : 'Table View'}
          </button>
          <Link
            to="/products/add"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Product
          </Link>
        </div>
      </div>

      {status.message && (
        <div
          className={`mb-4 p-3 rounded text-sm ${
            status.type === 'success'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {status.message}
        </div>
      )}

      <input
        type="text"
        placeholder="Search by name, brand, or category..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full sm:w-1/2 border p-2 mb-4 rounded"
      />

      <ProductList
        products={paginatedProducts}
        layout={layout}
        onEdit={(id) => navigate(`/products/edit/${id}`)}
        onDelete={handleDelete}
        deletingId={deletingId}
      />

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