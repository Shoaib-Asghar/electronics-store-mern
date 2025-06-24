import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productRoutes from './routes/product.routes.js';

dotenv.config();
connectDB(); //temporarily commented out to avoid connection issues during testing

const app = express();
// This is the main application file for the backend server of the electronics store application.



// Middlewares
app.use(cors()); // This middleware allows cross-origin requests, enabling the frontend to communicate with the backend

app.use(express.json()); // This middleware parses incoming JSON requests and makes the data available in req.body

app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' }); 
});

app.use('/api/products', productRoutes); //Inventory route handles anything under /api/inventory

export default app;
