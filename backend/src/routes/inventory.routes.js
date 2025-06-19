import express from 'express';
import Inventory from '../models/inventory.model.js';

const router = express.Router();

// GET /api/inventory
router.get('/', async (req, res) => {
  try {
    const items = await Inventory.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
