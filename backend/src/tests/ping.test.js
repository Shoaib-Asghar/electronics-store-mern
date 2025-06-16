import request from 'supertest';
import app from '../app.js';

describe('GET /api/ping', () => {
  it('should return pong', async () => {
    const res = await request(app).get('/api/ping');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('pong');
  });
});


// This test checks if the /api/ping endpoint returns a 200 status code and the expected response body.