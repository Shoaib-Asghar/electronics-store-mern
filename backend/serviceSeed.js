
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ServiceProvider from './src/models/serviceprovider.model.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const dummyServices = [
  {
    name: 'Ali Khan',
    expertise: 'Wiring & Circuit Setup',
    description: 'Expert in house wiring, circuit setup, and appliance installations.',
    location: 'Lahore, Pakistan',
    contactEmail: 'ali.wiring@example.com',
    phone: '0301-2345678',
    imageUrl: '/uploads/services/ali.jpg',
    available: true,
  },
  {
    name: 'Sara Tech',
    expertise: 'Cable Management',
    description: 'Specializes in professional cable routing and organization for homes and offices.',
    location: 'Karachi, Pakistan',
    contactEmail: 'sara.cables@example.com',
    phone: '0307-9876543',
    imageUrl: '/uploads/services/sara.jpg',
    available: true,
  },
  {
    name: 'PowerFix Co.',
    expertise: 'Power Backup Installation',
    description: 'UPS, inverter, and solar system setup and maintenance services.',
    location: 'Islamabad, Pakistan',
    contactEmail: 'support@powerfix.com',
    phone: '0333-4455667',
    imageUrl: '/uploads/services/powerfix.jpg',
    available: false,
  },
];

const seedServices = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected');

    await ServiceProvider.deleteMany();
    console.log('Existing services removed');

    await ServiceProvider.insertMany(dummyServices);
    console.log('Dummy service providers added');

    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedServices();
