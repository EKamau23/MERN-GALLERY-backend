const express = require('express');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const User = require('../models/user'); // Assuming you have a User model
const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profile_pictures'); // Directory to store profile pictures
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/; // Allowed file types
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error('Only .jpg, .jpeg, and .png files are allowed!'));
    }
  },
});

// Define the route for setting up an admin
router.post(
  '/setup-admin',
  upload.single('profilePhoto'), // Multer middleware for handling the profile photo
  async (req, res) => {
    const { email, password, username } = req.body;

    try {
      // Check if an admin already exists
      const existingAdmin = await User.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({ message: 'Admin already exists.' });
      }

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      // Handle optional profile photo
      const profilePhoto = req.file ? `/uploads/profile_pictures/${req.file.filename}` : '';

      // Create a new admin user
      const newAdmin = new User({
        email,
        username,
        password: hashedPassword,
        role: 'admin',
        profilePhoto, // Empty if no file was uploaded
      });

      // Save the new admin user to the database
      await newAdmin.save();

      res.status(201).json({
        message: 'Admin user created successfully.',
        admin: newAdmin,
      });
    } catch (error) {
      console.error('Error setting up admin:', error);
      res.status(500).json({ message: 'Error setting up admin.' });
    }
  }
);

module.exports = router;
