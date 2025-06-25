// src/controllers/authController.js
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

// REGISTER
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const userRole = role || 'customer';

    const user = await User.create({ name, email, password, role: userRole });

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET);

    res.json({ token, user: { name: user.name, role: user.role } });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: 'Registration failed' });
  }
};


// LOGIN
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET);

    res.json({ token, user: { name: user.name, role: user.role } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: 'Login failed' });
  }
};
