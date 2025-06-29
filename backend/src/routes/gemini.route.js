import express from 'express';
import axios from 'axios';
import { faqData } from '../data/faqData.js';
import Service from '../models/serviceprovider.model.js';
import Product from '../models/product.model.js';     

const router = express.Router();

router.post('/chat', async (req, res) => {
  const { message } = req.body;

  let context = '';

  // 1️⃣ FAQs (static)
  context += faqData
    .map(faq => `Q: ${faq.question}\nA: ${faq.answer}`)
    .join('\n\n');

  // 2️⃣ Services (dynamic)
  try {
    const services = await Service.find().select('title description');
    context += '\n\nAvailable Services:\n';
    context += services.map(s => `• ${s.title}: ${s.description}`).join('\n');
  } catch (err) {
    console.error('Service fetch error:', err.message);
  }

  // 3️⃣ Products (dynamic)
  try {
    const products = await Product.find().limit(10).select('name brand category price description');
    context += '\n\nTop Products:\n';
    context += products.map(p =>
      `• ${p.name} (${p.brand}) - ${p.category} - $${p.price}\n  ${p.description}`
    ).join('\n');
  } catch (err) {
    console.error('Product fetch error:', err.message);
  }

  // 4️⃣ Add general order guidance (static for now)
  context += `\n\nOrder Instructions:\n• After placing an order, you'll get an email confirmation.\n• Orders can be tracked from your account dashboard.\n• Returns are possible within 7 days of delivery.`;

  // 5️⃣ Combine with user question
    const prompt = `
    You're a helpful, friendly assistant on an electronics e-commerce website.
    Speak naturally and conversationally like you're chatting with the user.
    Here’s some useful background knowledge about our store:
    ${context}
    Now, based on that info, answer this user query as helpfully and naturally as you can:
    "${message}"
    Respond as if you're helping a real customer. Avoid repeating the full lists unless asked. Just answer what they asked in a human-like tone.
    `;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response.';
    res.json({ reply });
  } catch (error) {
    console.error('Gemini error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to get response from Gemini' });
  }
});

export default router;
