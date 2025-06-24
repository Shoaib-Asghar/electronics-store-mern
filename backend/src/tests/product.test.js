// src/tests/product.test.js

import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../app.js';
import Product from '../models/product.model.js';

dotenv.config();

let testProductId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Product.deleteMany({});

  const item = await Product.create({
    name: 'Laptop',
    brand: 'HP',
    description: 'Test laptop description',
    price: 1000,
    stock: 10,
    category: 'Electronics',
    imageUrl: '/images/laptop.jpg'
  });

  testProductId = item._id;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('📦 GET /api/products', () => {
  it('should return an array of product items', async () => {
    const res = await request(app).get('/api/products');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('name', 'Laptop');
    expect(res.body[0]).toHaveProperty('category');
  });
});

describe('🆕 POST /api/products', () => {
  it('should create a new product', async () => {
    const newItem = {
      name: 'Mouse',
      brand: 'Logitech',
      description: 'Wireless mouse',
      price: 30,
      stock: 100,
      category: 'Accessories',
      imageUrl: '/images/mouse.jpg'
    };

    const res = await request(app).post('/api/products').send(newItem);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.name).toBe('Mouse');
    expect(res.body.stock).toBe(100);
    expect(res.body).toHaveProperty('category', 'Accessories');
  });

  it('should fail if required fields are missing', async () => {
    const incompleteItem = {
      name: '',
      price: 999,
      stock: 5
    };

    const res = await request(app).post('/api/products').send(incompleteItem);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });
});

describe('✏️ PUT /api/products/:id', () => {
  it('should update an existing product', async () => {
    const res = await request(app)
      .put(`/api/products/${testProductId}`)
      .send({ stock: 30 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.stock).toBe(30);
  });

  it('should return 404 for invalid ID', async () => {
    const res = await request(app)
      .put('/api/products/64b3f68b6a01e4bd18891fff')
      .send({ stock: 50 });

    expect(res.statusCode).toBe(404);
  });
});

describe('🗑 DELETE /api/products/:id', () => {
  it('should delete a product', async () => {
    const res = await request(app).delete(`/api/products/${testProductId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');

    const deleted = await Product.findById(testProductId);
    expect(deleted).toBeNull();
  });
});
