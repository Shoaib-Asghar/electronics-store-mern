// Seed script to populate the inventory collection in MongoDB

// DELETE THIS FILE AFTER CREATING REAL ITEMS 


import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Inventory from './src/models/inventory.model.js';

dotenv.config(); // Load DB URI from .env

await mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

console.log('Connected to MongoDB. Seeding...');

// Sample items
const items = [
  {
    name: 'Dell Monitor 24"',
    brand: 'Dell',
    description: 'Full HD IPS monitor with HDMI input',
    price: 149.99,
    stock: 12,
  },
  {
    name: 'Logitech Wireless Mouse',
    brand: 'Logitech',
    description: 'Comfortable wireless mouse with long battery life',
    price: 29.99,
    stock: 30,
  },
  {
    name: 'Corsair Gaming Keyboard',
    brand: 'Corsair',
    description: 'Mechanical RGB gaming keyboard',
    price: 99.0,
    stock: 15,
  },
  {
    name: 'HP Ink Cartridge 901XL',
    brand: 'HP',
    description: 'High yield black ink cartridge',
    price: 34.5,
    stock: 25,
  },
  {
    name: 'Lenovo ThinkPad Charger',
    brand: 'Lenovo',
    description: '65W laptop charger compatible with ThinkPad series',
    price: 39.99,
    stock: 18,
  },
];

// Clear existing inventory and insert new ones
await Inventory.deleteMany();
await Inventory.insertMany(items);

console.log('Seeding complete.');
process.exit();
