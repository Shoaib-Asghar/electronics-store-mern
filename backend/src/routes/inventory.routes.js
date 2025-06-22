import express from 'express';
import Inventory from '../models/inventory.model.js';

const router = express.Router();

// GET /api/inventory
router.get('/', async (req, res) => {
  try {
    const items = await Inventory.find(); // use the Inventory model to find all items in the inventory
    res.json(items); // this will return the items in JSON format
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


// POST /api/inventory — Add a new item to the inventory
router.post('/', async (req, res) => {
  try {
    const { name, brand, description, price, stock } = req.body;     // Extract item details from request body (sent from frontend or Postman)
    // Validation: Ensure required fields are present
    if (!name || !price || !stock) {
      return res.status(400).json({ message: 'Name, price, and stock are required' });
    }
    
    const newItem = await Inventory.create({ name, brand, description, price, stock }); // Create a new item using the Inventory model
    res.status(201).json(newItem);
  } catch (err) {
    console.error("Create item error:", err); // Log the error for debugging
    res.status(500).json({ message: 'Server error during item creation' });
  } 

});




// PUT /api/inventory/:id — Update an existing item by ID
router.put('/:id', async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id) // Get the item ID from the URL

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // const { name, brand, description, price, stock } = req.body; // Get updated details from request body

    // Update fields if provided in request body
    item.name = req.body.name || item.name; // Use the new name if provided, otherwise keep the existing one
    item.brand = req.body.brand || item.brand;
    item.description = req.body.description || item.description;
    item.price = req.body.price || item.price;
    item.stock = req.body.stock || item.stock;

    // Save the updated item
    const updatedItem = await item.save(); // Save function is used to update the item in the database and updatedI

    res.json(updatedItem); // Return the updated item in JSON format

    // const { name, brand, description, price, stock } = req.body; // Get updated details from request body

    // Find the item by ID and update it
    // const updatedItem = await Inventory.findByIdAndUpdate(

  } catch (err) {
    res.status(500).json({ message: 'Server error during item update' });
  }
      
});



// DELETE /api/inventory/:id — Remove item from inventory
router.delete('/:id', async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id); // Get the item ID from the URL

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    await item.deleteOne(); // delete one item from the database

    res.json({ message: 'Item deleted' }); 
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item' });
  }
});





export default router;
