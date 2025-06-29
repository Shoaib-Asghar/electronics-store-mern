// seed.js
import mongoose from 'mongoose';
import Product from './src/models/product.model.js';
import connectDB from './src/config/db.js';

await connectDB();

await Product.deleteMany(); // Clear old

await Product.insertMany([
  {
    name: 'Samsung Galaxy A54',
    description: 'Mid-range phone with AMOLED screen',
    price: 499,
    stock: 25,
    category: 'Phones',
    brand: 'Samsung',
    imageUrl: '/mouse.png',
  },
  {
    name: 'Dell XPS 13',
    description: 'Powerful ultrabook laptop',
    price: 1399,
    stock: 10,
    category: 'Laptops',
    brand: 'Dell',
    imageUrl: '/mouse.png',
  },
  {
    name: 'Prod 3',
    description: 'Powerful ultrabook laptop',
    price: 1399,
    stock: 10,
    category: 'Laptops',
    brand: 'Dell',
    imageUrl: '/mouse.png',
  },
  {
    name: 'Prod 4',
    description: 'Powerful ultrabook laptop',
    price: 1399,
    stock: 10,
    category: 'Laptops',
    brand: 'Dell',
    imageUrl: '/mouse.png',
  },
  {
    name: 'Prod 5',
    description: 'Powerful ultrabook laptop',
    price: 1399,
    stock: 10,
    category: 'Laptops',
    brand: 'Dell',
    imageUrl: '/mouse.png',
  },
]);

console.log('Seeded database!');
process.exit();
