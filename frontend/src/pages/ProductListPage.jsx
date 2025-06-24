import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const res = await axios.get('/api/products');
    setProducts(res.data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    await axios.delete(`/api/products/${id}`);
    fetchProducts(); // Refresh after deletion
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Products</h2>
        <Link to="/products/add" className="bg-blue-600 text-white px-4 py-2 rounded">Add Product</Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4">Stock</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id} className="border-t">
                <td className="py-2 px-4">{p.name}</td>
                <td className="py-2 px-4">{p.stock}</td>
                <td className="py-2 px-4">${p.price}</td>
                <td className="py-2 px-4 space-x-2">
                  <Link to={`/products/edit/${p._id}`} className="text-blue-600">Edit</Link> {/* Edit link to navigate to edit page. The route should be defined in your router. for example, <Route path="/products/edit/:id" element={<EditProductPage />} /> */}
                  <button onClick={() => handleDelete(p._id)} className="text-red-500">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductListPage;
