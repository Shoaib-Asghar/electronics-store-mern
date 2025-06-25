import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../app.js';
import User from '../models/user.model.js';
import Product from '../models/product.model.js';

dotenv.config();

let customerToken;
let productId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany({});
  await Product.deleteMany({});

  // Create customer
  await request(app)
    .post('/api/auth/register')
    .send({ name: 'OrderCustomer', email: 'ordercustomer@example.com', password: 'pw123', role: 'customer' });

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'ordercustomer@example.com', password: 'pw123' });
  customerToken = loginRes.body.token;

  // Create product
  const product = await Product.create({
    name: 'Keyboard',
    brand: 'Logitech',
    description: 'Mechanical keyboard',
    price: 50,
    stock: 5,
    category: 'Accessories',
    imageUrl: '/images/keyboard.jpg'
  });
  productId = product._id;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('🛒 POST /api/orders/checkout', () => {
  it('should fail if not authenticated', async () => {
    const res = await request(app)
      .post('/api/orders/checkout')
      .send({ cart: [{ productId, quantity: 1 }] });
    expect(res.statusCode).toBe(401);
  });

  it('should fail if cart is empty', async () => {
    const res = await request(app)
      .post('/api/orders/checkout')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ cart: [] });
    expect(res.statusCode).toBe(400);
  });

  it('should fail if not enough stock', async () => {
    const res = await request(app)
      .post('/api/orders/checkout')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ cart: [{ productId, quantity: 10 }] });
    expect(res.statusCode).toBe(400);
  });

  it('should succeed and update stock', async () => {
    const res = await request(app)
      .post('/api/orders/checkout')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ cart: [{ productId, quantity: 2 }] });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Checkout successful/);

    const updated = await Product.findById(productId);
    expect(updated.stock).toBe(3);
  });
});