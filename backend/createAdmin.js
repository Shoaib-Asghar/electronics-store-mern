// scripts/createAdmin.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/user.model.js';

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);

const adminExists = await User.findOne({ email: 'admin@store.com' });
if (!adminExists) {
  await User.create({
    name: 'Admin',
    email: 'admin@store.com',
    password: 'admin123',
    role: 'admin',
  });
  console.log('Admin user created.');
} else {
  console.log('Admin already exists.');
}

process.exit();
