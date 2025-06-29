import React from 'react';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((item) => (
          <ProductCard
            key={item._id}
            product={item}
            showActions={showActions}
            onEdit={onEdit}
            onDelete={onDelete}
            isDeleting={deletingId === item._id}
          />
        ))}
      </div>
    );
  }

  // Table View
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden text-sm">
        <thead className="bg-gray-100 text-gray-700 text-left">
          <tr>
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4">Brand</th>
            <th className="py-3 px-4 text-center">Stock</th>
            <th className="py-3 px-4 text-right">Price</th>
            {showActions && <th className="py-3 px-4 text-center">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td
                colSpan={showActions ? 5 : 4}
                className="text-center py-6 text-gray-500"
              >
                No products found.
              </td>
            </tr>
          ) : (
            products.map((product) => {
              const isDeleting = deletingId === product._id;
              return (
                <tr
                  key={product._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4">{product.name}</td>
                  <td className="py-3 px-4">{product.brand}</td>
                  <td className="py-3 px-4 text-center">{product.stock}</td>
                  <td className="py-3 px-4 text-right">${product.price}</td>
                  {showActions && (
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center gap-3">
                        <Link
                          to={`/products/edit/${product._id}`}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => onDelete(product._id)}
                          disabled={isDeleting}
                          className={`text-red-500 hover:underline ${
                            isDeleting ? 'opacity-50 pointer-events-none' : ''
                          }`}
                        >
                          {isDeleting ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;