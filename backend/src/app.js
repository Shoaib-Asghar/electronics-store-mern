import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import inventoryRoutes from './routes/inventory.routes.js';

dotenv.config();
connectDB();

const app = express();

// This is the main application file for the backend server of the electronics store application.

// Middlewares
// app.use(cors());
app.use(express.json()); // Parse incoming JSON

app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' }); 
});

// Inventory API route
app.use('/api/inventory', inventoryRoutes);

export default app;
