const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Configure storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'automotive-commerce', // Folder name in Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'],
  }
});

const upload = multer({ storage });

module.exports = upload;
