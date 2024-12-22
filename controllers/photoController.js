const fs = require('fs');
const path = require('path');
const Photo = require('../models/photo');

exports.deletePhoto = async (req, res, next) => {
  const photoId = req.params.id;

  try {
    console.log(`Attempting to delete photo with ID: ${photoId}`);

    const photo = await Photo.findById(photoId);
    if (!photo) {
      console.log('Photo not found in the database');
      return res.status(404).json({ message: 'Photo not found' });
    }

    const filePath = path.join(__dirname, '..', 'uploads', photo.name);
    console.log(`File path resolved to: ${filePath}`);

    // Delete the photo file from the filesystem
    fs.unlink(filePath, async (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          console.warn(`File not found at path: ${filePath}. Skipping deletion.`);
        } else {
          console.error('Failed to delete photo file:', err);
          return res.status(500).json({ message: 'Failed to delete photo file' });
        }
      } else {
        console.log('Photo file deleted successfully from filesystem');
      }

      // Delete the photo record from the database, even if the file was not found
      try {
        await Photo.findByIdAndDelete(photoId);
        console.log('Photo record deleted successfully from database');
        res.status(200).json({ message: 'Photo deleted successfully' });
      } catch (dbErr) {
        console.error('Failed to delete photo record from database:', dbErr);
        res.status(500).json({ message: 'Failed to delete photo record' });
      }
    });
  } catch (error) {
    console.error('Error during photo deletion process:', error);
    next(error); // Pass error to the error handler middleware
  }
};
