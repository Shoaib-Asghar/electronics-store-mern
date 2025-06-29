import express from 'express';
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from '../controllers/servicesController.js';

import { protect, isAdmin } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

router.get('/', getAllServices);
router.get('/:id', getServiceById);

router.post('/', protect, isAdmin, upload.single('image'), createService);
router.put('/:id', protect, isAdmin, upload.single('image'), updateService);
router.delete('/:id', protect, isAdmin, deleteService);

export default router;