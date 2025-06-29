import React from 'react';

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGES_BASE_URL;

const ProductCard = ({
  product,
  quantity = 1,
  onQuantityChange,
  onAddToCart,
  status,
  isInCart,
  isLoggedIn,
  showActions = false,
  onEdit,
  onDelete,
  isDeleting,
}) => {
  const isOutOfStock = product.stock === 0;
  const isOverStock = quantity > product.stock;

  return (
    <div className="bg-white shadow rounded-xl overflow-hidden flex flex-col border hover:shadow-xl transition">
      <img
        src={`${IMAGE_BASE_URL}${product.imageUrl}`}
        alt={product.name}
        className="h-48 w-full object-cover"
      />

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{product.name}</h2>
          <p className="text-sm text-gray-500">{product.brand} | {product.category}</p>
          <p className="mt-2 text-gray-700 text-sm">{product.description}</p>
          <p className="mt-2 text-blue-600 font-bold text-lg">${product.price}</p>
          <p className="text-sm text-gray-600">In stock: {product.stock}</p>
        </div>

        {/* Customer Actions */}
        {!showActions && (
          isOutOfStock ? (
            <p className="mt-3 text-red-500 text-sm font-medium">Out of Stock</p>
          ) : (
            <div className="mt-4 flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                {onQuantityChange && (
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
                )}
                {onAddToCart && (
                  <button
                    disabled={!isLoggedIn || isOverStock || isInCart}
                    onClick={() => onAddToCart(product)}
                    className={`px-3 py-2 rounded transition ${
                      !isLoggedIn || isOverStock || isInCart
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    {!isLoggedIn
                      ? "Login to Add"
                      : isInCart
                      ? "In Cart"
                      : "Add to Cart"}
                  </button>
                )}
              </div>
              {status && status[product._id] && (
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
          )
        )}

        {/* Admin Actions */}
        {showActions && (
          <div className="mt-auto pt-4 flex gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(product._id)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(product._id)}
                disabled={isDeleting}
                className={`bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition ${
                  isDeleting ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;