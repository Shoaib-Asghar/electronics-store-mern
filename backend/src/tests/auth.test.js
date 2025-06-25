import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../app.js';
import User from '../models/user.model.js';

dotenv.config();

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('🔑 Auth Routes', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'TestUser', email: 'testuser@example.com', password: 'pw123', role: 'customer' });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.name).toBe('TestUser');
  });

  it('should not register with existing email', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'TestUser', email: 'testuser@example.com', password: 'pw123', role: 'customer' });
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'TestUser', email: 'testuser@example.com', password: 'pw123', role: 'customer' });
    expect(res.statusCode).toBe(400);
  });

  it('should login with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'testuser@example.com', password: 'pw123' });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.name).toBe('TestUser');
  });

  it('should not login with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'testuser@example.com', password: 'wrongpw' });
    expect(res.statusCode).toBe(401);
  });
});