import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const router = express.Router();

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

// REGISTER
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const user = await User.create({ name, email, password, role });
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET);

    res.json({ token, user: { name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET);
    res.json({ token, user: { name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
});

export default router;
