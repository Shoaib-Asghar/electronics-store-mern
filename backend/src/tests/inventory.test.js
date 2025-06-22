import request from 'supertest';            // Simulates HTTP requests
import mongoose from 'mongoose';            // To connect/disconnect DB
import dotenv from 'dotenv';
import app from '../app.js';                // Our Express app
import Inventory from '../models/inventory.model.js';

dotenv.config();

let createdItemId; // Variable to store the ID of the created item for later tests

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI); // Connect to the MongoDB database
  await Inventory.deleteMany({});  // Clean up any previous test data from the Inventory collection in the database
  const item =  await Inventory.create({ name: 'Laptop', price: 1000, stock: 5 }); // Create a sample item for testing
  
  createdItemId = item._id; 
});

afterAll(async () => {
  await mongoose.connection.close(); // Close the database connection after all tests are done
});


describe('GET /api/inventory', () => {
  it('should return inventory items', async () => {
    const res = await request(app).get('/api/inventory');

    expect(res.statusCode).toBe(200);  // Expect a success response
    expect(Array.isArray(res.body)).toBe(true);  // Should return an array
    expect(res.body[0]).toHaveProperty('name', 'Laptop');  // Item should match
  });
});


// describe('POST /api/inventory', () => {
//   it('should create a new item', async () => {
//     const newItem = {name: 'Mouse', brand: 'Logitech', description: 'Wireless mouse', price: 30, stock: 100};

//     const res = await request(app)
//       .post('/api/inventory')
//       .send(newItem);

//     expect(res.statusCode).toBe(201);
//     expect(res.body).toHaveProperty('_id');
//     expect(res.body.name).toBe('Mouse');
//     expect(res.body.stock).toBe(100);
//   });
// });


describe('POST /api/inventory', () => {
  it('should create a new item', async () => {
    const newItem = {name: 'Mouse', brand: 'Logitech', description: 'Wireless mouse', price: 30, stock: 100};

    const res = await request(app)
      .post('/api/inventory')
      .send(newItem);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.name).toBe('Mouse');
    expect(res.body.stock).toBe(100);
  });
});



describe('PUT /api/inventory/:id', () => {
  it('should update an existing item', async () => {
    const updatedItem = { stock: 30 };

    const res = await request(app)
      .put(`/api/inventory/${createdItemId}`)
      .send(updatedItem);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.stock).toBe(30);
  });
});

describe('DELETE /api/inventory/:id', () => {
  it('should delete an item', async () => {
    const res = await request(app)
      .delete(`/api/inventory/${createdItemId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Item deleted');

    const itemInDB = await Inventory.findById(createdItemId);
    expect(itemInDB).toBeNull();
  });
});
