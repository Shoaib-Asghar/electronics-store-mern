import mongoose from 'mongoose';

const serviceProviderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  expertise: { type: String, required: true }, // e.g., "Wiring", "Cables", "Power Backup"
  description: { type: String },
  location: { type: String },
  contactEmail: { type: String, required: true },
  phone: { type: String },
  imageUrl: { type: String }, // optional profile image
  available: { type: Boolean, default: true }
});

export default mongoose.model('ServiceProvider', serviceProviderSchema);