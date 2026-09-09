const multer = require('multer');
const path = require('path');

// Configure how and where to store uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Generate unique name: timestamp + original filename (spaces replaced by underscores)
    const cleanName = file.originalname.replace(/\s+/g, '_');
    cb(null, `${Date.now()}-${cleanName}`);
  }
});

// Create the multer upload middleware
const upload = multer({ storage });

module.exports = upload;

