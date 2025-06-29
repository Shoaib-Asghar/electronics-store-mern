import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app.js';

describe('GET /api/ping', () => {
  it('should return pong', async () => {
    const res = await request(app).get('/api/ping');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('pong');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});