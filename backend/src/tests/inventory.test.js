import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../app.js';
import Inventory from '../models/inventory.model.js';

dotenv.config();

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Inventory.deleteMany({});
  await Inventory.create({ name: 'Laptop', price: 1000, stock: 5 });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('GET /api/inventory', () => {
  it('should return inventory items', async () => {
    const res = await request(app).get('/api/inventory');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('name', 'Laptop');
  });
});
