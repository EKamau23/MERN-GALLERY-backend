const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Photo = require('../models/photo');
const Folder = require('../models/folder');
const router = express.Router();

// Set up multer for file uploading
const uploadDir = './uploads';

// Ensure the uploads directory exists and has appropriate permissions
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }, (err) => {
    if (err) {
      console.error('Failed to create uploads directory:', err);
    } else {
      console.log('Uploads directory created');
    }
  });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadDir)) {
      console.error('Uploads directory does not exist');
      return cb(new Error('Uploads directory does not exist'));
    }
    cb(null, uploadDir); // Store uploads in 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate a unique filename
  },
});

const upload = multer({ storage });

// Route to upload multiple photos to a folder
router.post('/upload/:folderId', (req, res, next) => {
  upload.array('files', 30)(req, res, (err) => {
    if (err) {
      console.error('Multer error during file upload:', err);
      return res.status(500).json({ message: 'Multer error', error: err });
    }
    next();
  });
}, async (req, res) => {
  const { folderId } = req.params;
  console.log(`Received request to upload files to folder: ${folderId}`);

  try {
    const folder = await Folder.findById(folderId);
    if (!folder) {
      console.error(`Folder with ID ${folderId} not found`);
      return res.status(404).json({ message: 'Folder not found' });
    }

    if (!req.files || req.files.length === 0) {
      console.warn('No files uploaded');
      return res.status(400).json({ message: 'No files uploaded' });
    }

    // Map the uploaded files into photo objects
    const photos = req.files.map((file) => ({
      folderId,
      name: file.filename,
      url: `/uploads/${file.filename}`,
    }));

    // Save multiple photos to the database
    await Photo.insertMany(photos);
    console.log('Photos uploaded and saved to database:', photos);
    res.json(photos);
  } catch (error) {
    console.error('Error during photo upload:', error);
    res.status(500).json({ message: 'Error uploading photos', error });
  }
});

module.exports = router;
