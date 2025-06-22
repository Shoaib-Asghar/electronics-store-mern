import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import inventoryRoutes from './routes/inventory.routes.js';

dotenv.config();
// connectDB(); //temporarily commented out to avoid connection issues during testing

const app = express();

// This is the main application file for the backend server of the electronics store application.

// Middlewares
// app.use(cors());
app.use(express.json()); // This middleware parses incoming JSON requests and makes the data available in req.body

app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' }); 
});

app.use('/api/inventory', inventoryRoutes); //Inventory route handles anything under /api/inventory

export default app;
