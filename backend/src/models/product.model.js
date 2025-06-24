// src/models/product.model.js
import mongoose from 'mongoose';

// This schema defines the structure of a "product" in the electronics store.
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Every product must have a name
  },
  description: {
    type: String,
    required: true, // Useful for buyers to know what they're purchasing
  },
  price: {
    type: Number,
    required: true,
    min: 0, // Products can't have negative price
  },
  stock: {
    type: Number,
    required: true,
    min: 0, // No negative inventory
  },
  category: {
    type: String,
    required: true, // Helps buyers filter/search by type
  },
  brand: {
    type: String,
    default: '',
  },
  imageUrl: {
    type: String,
    default: '', // URL of uploaded image (Cloudinary or local)
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5, // Optional feature: Buyer reviews
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Track when product was added
  },
});

const Product = mongoose.model('Product', productSchema);
export default Product;
