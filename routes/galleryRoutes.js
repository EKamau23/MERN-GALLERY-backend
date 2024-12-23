const express = require('express');
const multer = require('multer');
const path = require('path');
const Folder = require('../models/folder');
const Photo = require('../models/photo');

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
const upload = multer({ storage });

// Route to create a new folder
router.post('/create-folder', (req, res) => {
  const { name } = req.body;
  const newFolder = new Folder({ name });

  newFolder
    .save()
    .then((folder) => res.json(folder))
    .catch((err) => res.status(500).json({ message: 'Error creating folder', error: err }));
});

// Route to get all folders
router.get('/folders', (req, res) => {
  Folder.find()
    .then((folders) => res.json(folders))
    .catch((err) => res.status(500).json({ message: 'Error fetching folders', error: err }));
});

// Route to get photos in a folder
router.get('/folder/:folderId/photos', (req, res) => {
  const { folderId } = req.params;
  Photo.find({ folderId })
    .then((photos) => res.json(photos))
    .catch((err) => res.status(500).json({ message: 'Error fetching photos', error: err }));
});

// Route to upload multiple photos to a folder
router.post('/upload/:folderId', upload.array('files', 30), (req, res) => {  // Adjusted to handle multiple files
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

module.exports = router;
