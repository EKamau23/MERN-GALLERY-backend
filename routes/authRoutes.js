const express = require('express');
const multer = require('multer');
const { register, login } = require('../controllers/authController');
const { verifyToken } = require('../middlewares/verifyToken');  // Import the verifyToken middleware

const router = express.Router();

// Multer storage configuration for uploads (profile photo)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/profile_pictures'), // Ensure 'uploads/' folder exists
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

// Route to register a user
router.post('/register', upload.single('profilePhoto'), register);

// Route to login a user
router.post('/login', login);

// Route to update user profile (requires token verification)
router.post('/update-profile', verifyToken, upload.single('profilePicture'), async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.username = username || user.username;
    user.email = email || user.email;

    if (password) {
      user.password = password; // Ideally, hash the password before saving
    }

    if (req.file) {
      user.profilePicture = req.file.path;
    }

    await user.save();

    res.status(200).json({ message: 'Profile updated successfully!' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

module.exports = router;
