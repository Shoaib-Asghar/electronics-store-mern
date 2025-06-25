import express from 'express';
import fs from 'fs';
import Product from '../models/product.model.js';
import upload from '../middleware/upload.middleware.js';
import { protect, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();


// -----------------------------------------
// GET /api/products
// Public route — List all products
// -----------------------------------------
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: 'Server error' });
  }
});


// -----------------------------------------
// POST /api/products
// Add a new product (Admins only)
// -----------------------------------------
router.post('/', protect, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const {
      name,
      brand,
      description,
      price,
      stock,
      category,
    } = req.body;

    if (!name || !price || !stock || !category || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const newProduct = await Product.create({
      name,
      brand,
      description,
      price,
      stock,
      category,
      imageUrl,
    });

    res.status(201).json(newProduct);
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ message: 'Server error' });
  }
});


// -----------------------------------------
// GET /api/products/:id
// Public route — Get product by ID
// -----------------------------------------
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: 'Product not found' });

    res.json(product);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ message: 'Server error' });
  }
});


// -----------------------------------------
// PUT /api/products/:id
// Update product (Admins only)
// -----------------------------------------
router.put('/:id', protect, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: 'Product not found' });

    // Update fields
    product.name = req.body.name || product.name;
    product.brand = req.body.brand || product.brand;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.stock = req.body.stock || product.stock;
    product.category = req.body.category || product.category;

    // If new image uploaded
    if (req.file) {
      // Delete old image (optional)
      if (product.imageUrl && product.imageUrl.startsWith('/uploads/')) {
        const oldPath = `.${product.imageUrl}`;
        fs.unlink(oldPath, (err) => {
          if (err) console.warn('Failed to delete old image:', err);
        });
      }

      product.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updated = await product.save();
    res.json(updated);
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Error updating product' });
  }
});


// -----------------------------------------
// DELETE /api/products/:id
// Delete product (Admins only)
// -----------------------------------------
router.delete('/:id', protect, isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: 'Product not found' });

    // Optionally delete image
    if (product.imageUrl && product.imageUrl.startsWith('/uploads/')) {
      const imgPath = `.${product.imageUrl}`;
      fs.unlink(imgPath, (err) => {
        if (err) console.warn('Failed to delete image:', err);
      });
    }

    await product.deleteOne();
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ message: 'Server error during delete' });
  }
});



export default router;
