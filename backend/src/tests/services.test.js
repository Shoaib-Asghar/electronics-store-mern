import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../app.js';
import User from '../models/user.model.js';
import ServiceProvider from '../models/serviceprovider.model.js';

dotenv.config();

let adminToken;
let customerToken;
let serviceId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await ServiceProvider.deleteMany({});
  await User.deleteMany({});

  // Create admin and customer users
  await User.create({
    name: 'Admin',
    email: 'admin@services.com',
    password: 'adminpass',
    role: 'admin'
  });
  await User.create({
    name: 'Customer',
    email: 'customer@services.com',
    password: 'customerpass',
    role: 'customer'
  });

  // Login to get tokens
  const adminRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@services.com', password: 'adminpass' });
  adminToken = adminRes.body.token;

  const customerRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'customer@services.com', password: 'customerpass' });
  customerToken = customerRes.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('🛠️ Service Providers API', () => {
  it('should not allow non-admin to create service', async () => {
    const res = await request(app)
      .post('/api/services')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        name: 'Electrician',
        expertise: 'Wiring',
        description: 'All wiring jobs',
        location: 'City Center',
        contactEmail: 'elec@example.com'
      });
    expect(res.statusCode).toBe(403);
  });

  it('should create a new service as admin', async () => {
    const res = await request(app)
      .post('/api/services')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Electrician',
        expertise: 'Wiring',
        description: 'All wiring jobs',
        location: 'City Center',
        contactEmail: 'elec@example.com'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.name).toBe('Electrician');
    expect(res.body.expertise).toBe('Wiring');
    serviceId = res.body._id;
  });

  it('should get all services', async () => {
    const res = await request(app).get('/api/services');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('name');
    expect(res.body[0]).toHaveProperty('expertise');
  });

  it('should get a service by id', async () => {
    const res = await request(app).get(`/api/services/${serviceId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', serviceId);
    expect(res.body.name).toBe('Electrician');
  });

  it('should update a service as admin', async () => {
    const res = await request(app)
      .put(`/api/services/${serviceId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Electrician Pro',
        expertise: 'Wiring',
        description: 'All wiring jobs and more',
        location: 'City Center',
        contactEmail: 'elecpro@example.com'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Electrician Pro');
    expect(res.body.contactEmail).toBe('elecpro@example.com');
  });

  it('should not allow non-admin to update service', async () => {
    const res = await request(app)
      .put(`/api/services/${serviceId}`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ name: 'Hacker' });
    expect(res.statusCode).toBe(403);
  });

  it('should delete a service as admin', async () => {
    const res = await request(app)
      .delete(`/api/services/${serviceId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
    const check = await ServiceProvider.findById(serviceId);
    expect(check).toBeNull();
  });

  it('should not allow non-admin to delete service', async () => {
    // Create a new service to try to delete
    const newService = await ServiceProvider.create({
      name: 'Plumber',
      expertise: 'Pipes',
      description: 'All plumbing jobs',
      location: 'Suburb',
      contactEmail: 'plumber@example.com'
    });
    const res = await request(app)
      .delete(`/api/services/${newService._id}`)
      .set('Authorization', `Bearer ${customerToken}`);
    expect(res.statusCode).toBe(403);
  });
});