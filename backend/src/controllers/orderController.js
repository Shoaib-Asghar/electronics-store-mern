import Product from '../models/product.model.js';

export const checkoutOrder = async (req, res) => {
  const cartItems = req.body.cart; // [{ productId, quantity }]

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return res.status(400).json({ message: 'Cart is empty or invalid.' });
  }

  try {
    const updatedProducts = [];

    for (const item of cartItems) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }

      if (item.quantity > product.stock) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }

      product.stock -= item.quantity;
      await product.save();

      updatedProducts.push({
        name: product.name,
        remaining: product.stock,
      });
    }

    res.status(200).json({
      message: 'Checkout successful. Inventory updated.',
      updated: updatedProducts,
    });

  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ message: 'Checkout failed' });
  }
};