const express = require('express');
const multer = require('multer');
const path = require('path');
const photoController = require('../controllers/photoController');  // Import the controller

const Photo = require('../models/photo'); // Assuming the Photo model is defined
const Folder = require('../models/folder'); // Assuming Folder model is defined

const router = express.Router();

// Set up multer for file uploading
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Store uploads in 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate a unique filename
  },
});

// Increase file size limit to 50MB per file
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB per file limit
});

// Route to get all photos
router.get('/', (req, res) => {
  Photo.find()
    .then((photos) => res.json(photos))
    .catch((err) => res.status(500).json({ message: 'Error fetching photos', error: err }));
});

// Route to get photos in a specific folder
router.get('/folder/:folderId', (req, res) => {
  const { folderId } = req.params;
  Photo.find({ folderId })
    .then((photos) => res.json(photos))
    .catch((err) => res.status(500).json({ message: 'Error fetching photos for folder', error: err }));
});

// Route to upload multiple photos to a folder
router.post('/upload/:folderId', upload.array('files', 30), (req, res) => {  // Limit to 30 files
  const { folderId } = req.params;

  // Ensure files are uploaded
  if (!req.files || req.files.length === 0) {
    return res.status(400).send({ message: 'No files uploaded' });
  }

  // Map the uploaded files into photo objects
  const photos = req.files.map((file) => ({
    folderId,
    name: file.filename,
    url: `/uploads/${file.filename}`,
  }));

  // Save multiple photos to the database
  Photo.insertMany(photos)
    .then((photos) => res.json(photos))
    .catch((err) => res.status(500).json({ message: 'Error uploading photos', error: err }));
});

// Route to delete a photo (using controller)
router.delete('/photo/:id', photoController.deletePhoto);  // Fixed route path

module.exports = router;
