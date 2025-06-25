// src/middleware/upload.js
import multer from 'multer';
import path from 'path';

// Set storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Save files to /uploads folder
  },
  filename: function (req, file, cb) {
    // Rename file: product-123456.png
    const ext = path.extname(file.originalname);
    cb(null, `product-${Date.now()}${ext}`);
  },
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG and PNG files are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
