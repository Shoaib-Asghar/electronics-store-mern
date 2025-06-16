import express from 'express';
import cors from 'cors';

const app = express();

// This is the main application file for the backend server of the electronics store application.

// Middlewares
app.use(cors());
app.use(express.json());

// Sample route to test the server
app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});

export default app;
