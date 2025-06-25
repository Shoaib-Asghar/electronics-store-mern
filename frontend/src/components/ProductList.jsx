import React from 'react';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGES_BASE_URL;

const ProductList = ({
  products,
  layout = 'table',
  onEdit,
  onDelete,
  deletingId,
  showActions = true,
}) => {
  if (layout === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((item) => (
          <div key={item._id} className="bg-white shadow rounded p-4 border flex flex-col">
            {item.imageUrl && (
              <img
                src={`${IMAGE_BASE_URL}${item.imageUrl}`}
                alt={item.name}
                className="w-full h-40 object-cover rounded mb-4"
              />
            )}
            <h2 className="text-lg font-semibold">{item.name}</h2>
            <p className="text-sm text-gray-600">{item.brand}</p>
            <p className="text-sm text-gray-700 mt-1">{item.description}</p>
            <p className="text-blue-600 font-bold mt-2">${item.price}</p>
            <p className="text-green-600 text-sm">Stock: {item.stock}</p>
            {showActions && (
              <div className="mt-auto pt-4 flex space-x-2">
                <button
                  onClick={() => onEdit(item._id)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(item._id)}
                  className={`bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 ${
                    deletingId === item._id ? 'opacity-50 pointer-events-none' : ''
                  }`}
                  disabled={deletingId === item._id}
                >
                  {deletingId === item._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Table layout
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-3 px-4 text-left">Name</th>
            <th className="py-3 px-4">Brand</th>
            <th className="py-3 px-4">Stock</th>
            <th className="py-3 px-4">Price</th>
            {showActions && <th className="py-3 px-4">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={showActions ? 5 : 4} className="text-center py-6 text-gray-500">
                No products found.
              </td>
            </tr>
          ) : (
            products.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="py-2 px-4">{p.name}</td>
                <td className="py-2 px-4">{p.brand}</td>
                <td className="py-2 px-4">{p.stock}</td>
                <td className="py-2 px-4">${p.price}</td>
                {showActions && (
                  <td className="py-2 px-4 space-x-2">
                    <Link to={`/products/edit/${p._id}`} className="text-blue-600">
                      Edit
                    </Link>
                    <button
                      onClick={() => onDelete(p._id)}
                      className={`text-red-500 ${
                        deletingId === p._id ? 'opacity-50 pointer-events-none' : ''
                      }`}
                      disabled={deletingId === p._id}
                    >
                      {deletingId === p._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;