import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: String,
    description: String,
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
  },
  { timestamps: true } // adds createdAt and updatedAt fields
);

const Inventory = mongoose.model('Inventory', inventorySchema);

export default Inventory;