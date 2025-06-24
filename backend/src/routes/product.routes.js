// src/routes/product.routes.js

import express from 'express';
import Product from '../models/product.model.js';

const router = express.Router();


// -----------------------------------------
// GET /api/products
// List all products (for customers or admins)
// -----------------------------------------
router.get('/', async (req, res) => {
  try {
    const products = await Product.find(); // Retrieve all products
    res.json(products); // Return JSON response
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: 'Server error' });
  }
});


// -----------------------------------------
// POST /api/products
// Add a new product (for Admins only)
// -----------------------------------------
router.post('/', async (req, res) => {
  try {
    const {
      name,
      brand,
      description,
      price,
      stock,
      category,
      imageUrl, // optional initially
    } = req.body;

    // Basic validation
    if (!name || !price || !stock || !category || !description) {
      return res
        .status(400)
        .json({ message: 'Missing required fields: name, price, stock, category, description' });
    }

    // Create product
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
    res.status(500).json({ message: 'Server error during product creation' });
  }
});


// -----------------------------------------
// GET /api/products/:id
// Get a single product by ID
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
// Update a product by ID (Admin only)
// -----------------------------------------
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: 'Product not found' });

    // Update fields if provided
    product.name = req.body.name || product.name;
    product.brand = req.body.brand || product.brand;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.stock = req.body.stock || product.stock;
    product.category = req.body.category || product.category;
    product.imageUrl = req.body.imageUrl || product.imageUrl;

    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ message: 'Server error during update' });
  }
});


// -----------------------------------------
// DELETE /api/products/:id
// Delete a product (Admin only)
// -----------------------------------------
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: 'Product not found' });

    await product.deleteOne();

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ message: 'Server error during delete' });
  }
});


export default router;
