import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productRoutes from './routes/product.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.routes.js';
import orderRoutes from './routes/order.routes.js';
import serviceRoutes from './routes/services.routes.js';
import geminiRoutes from './routes/gemini.route.js';



dotenv.config();
connectDB(); //temporarily commented out to avoid connection issues during testing

const app = express();
// This is the main application file for the backend server of the electronics store application.

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




// Middlewares
app.use(cors()); // This middleware allows cross-origin requests, enabling the frontend to communicate with the backend

app.use(express.json()); // This middleware parses incoming JSON requests and makes the data available in req.body

// Serve static files from uploads directory
app.use('/uploads', express.static(path.resolve('uploads'))); // This middleware serves static files from the 'uploads' directory, allowing access to uploaded images and other files

app.use('/api/auth', authRoutes);

app.use('/api/services', serviceRoutes);

app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' }); 
});

app.use('/api/products', productRoutes); //Inventory route handles anything under /api/inventory

app.use('/api/orders', orderRoutes);

app.use('/api/gemini', geminiRoutes);



export default app;
