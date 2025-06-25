import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../app.js';
import Product from '../models/product.model.js';
import User from '../models/user.model.js';

dotenv.config();

let adminToken;
let customerToken;
let testProductId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Product.deleteMany({});
  await User.deleteMany({});

  // Create admin and customer users
  const admin = await User.create({
    name: 'Admin',
    email: 'admin@test.com',
    password: 'adminpass',
    role: 'admin'
  });
  const customer = await User.create({
    name: 'Customer',
    email: 'customer@test.com',
    password: 'customerpass',
    role: 'customer'
  });

  // Login to get tokens
  const adminRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@test.com', password: 'adminpass' });
  adminToken = adminRes.body.token;

  const customerRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'customer@test.com', password: 'customerpass' });
  customerToken = customerRes.body.token;

  // Create a product as admin
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
    expect(res.body.some(p => p.name === 'Laptop')).toBe(true);
    expect(res.body[0]).toHaveProperty('category');
  });
});

describe('🆕 POST /api/products', () => {
  it('should fail if not authenticated', async () => {
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
    expect(res.statusCode).toBe(401);
  });

  it('should fail if not admin', async () => {
    const newItem = {
      name: 'Mouse',
      brand: 'Logitech',
      description: 'Wireless mouse',
      price: 30,
      stock: 100,
      category: 'Accessories',
      imageUrl: '/images/mouse.jpg'
    };
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${customerToken}`)
      .send(newItem);
    expect(res.statusCode).toBe(403);
  });

  it('should create a new product as admin', async () => {
    const newItem = {
      name: 'Mouse',
      brand: 'Logitech',
      description: 'Wireless mouse',
      price: 30,
      stock: 100,
      category: 'Accessories',
      imageUrl: '/images/mouse.jpg'
    };

    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newItem);

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

    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(incompleteItem);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });
});

describe('✏️ PUT /api/products/:id', () => {
  it('should fail if not authenticated', async () => {
    const res = await request(app)
      .put(`/api/products/${testProductId}`)
      .send({ stock: 30 });
    expect(res.statusCode).toBe(401);
  });

  it('should fail if not admin', async () => {
    const res = await request(app)
      .put(`/api/products/${testProductId}`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ stock: 30 });
    expect(res.statusCode).toBe(403);
  });

  it('should update an existing product as admin', async () => {
    const res = await request(app)
      .put(`/api/products/${testProductId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ stock: 30 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.stock).toBe(30);
  });

  it('should return 404 for invalid ID', async () => {
    const res = await request(app)
      .put('/api/products/64b3f68b6a01e4bd18891fff')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ stock: 50 });

    expect(res.statusCode).toBe(404);
  });
});

describe('🗑 DELETE /api/products/:id', () => {
  it('should fail if not authenticated', async () => {
    const res = await request(app).delete(`/api/products/${testProductId}`);
    expect(res.statusCode).toBe(401);
  });

  it('should fail if not admin', async () => {
    const res = await request(app)
      .delete(`/api/products/${testProductId}`)
      .set('Authorization', `Bearer ${customerToken}`);
    expect(res.statusCode).toBe(403);
  });

  it('should delete a product as admin', async () => {
    const res = await request(app)
      .delete(`/api/products/${testProductId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');

    const deleted = await Product.findById(testProductId);
    expect(deleted).toBeNull();
  });
});