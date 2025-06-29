import ServiceProvider from '../models/serviceprovider.model.js';

export const createService = async (req, res) => {
  try {
    const {
      name,
      specialty, // from frontend, see below
      description,
      location,
      contact, // from frontend, see below
    } = req.body;

    // Accept both specialty/contact (for backward compatibility) and expertise/contactEmail
    const service = new ServiceProvider({
      name,
      expertise: req.body.expertise || specialty,
      description,
      location,
      contactEmail: req.body.contactEmail || contact,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
    });

    const created = await service.save();
    res.status(201).json(created);
  } catch (err) {
    console.error('Create service error:', err);
    res.status(400).json({ message: err.message || 'Failed to create service' });
  }
};

export const updateService = async (req, res) => {
  try {
    const {
      name,
      specialty,
      description,
      location,
      contact,
    } = req.body;

    const service = await ServiceProvider.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    service.name = name || service.name;
    service.expertise = req.body.expertise || specialty || service.expertise;
    service.description = description || service.description;
    service.location = location || service.location;
    service.contactEmail = req.body.contactEmail || contact || service.contactEmail;

    if (req.file) {
      service.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updated = await service.save();
    res.json(updated);
  } catch (err) {
    console.error('Update service error:', err);
    res.status(400).json({ message: err.message || 'Failed to update service' });
  }
};

export const deleteService = async (req, res) => {
  try {
    const service = await ServiceProvider.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    await ServiceProvider.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message || 'Failed to delete service' });
  }
};

export const getAllServices = async (req, res) => {
  try {
    const services = await ServiceProvider.find({});
    res.json(services);
  } catch (err) {
    res.status(400).json({ message: err.message || 'Failed to fetch services' });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const service = await ServiceProvider.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (err) {
    res.status(400).json({ message: err.message || 'Failed to fetch service' });
  }
};