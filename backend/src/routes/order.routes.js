import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { checkoutOrder } from '../controllers/orderController.js';

const router = express.Router();

router.post('/checkout', protect, checkoutOrder);

export default router;