const Gallery = require('../models/gallery');

// Create a gallery item
exports.createGalleryItem = async (req, res) => {
  try {
    const { title, description } = req.body;
    const image = req.file ? req.file.path : '';

    const galleryItem = new Gallery({
      title,
      description,
      image,
      createdBy: req.user.id,
    });

    await galleryItem.save();
    res.status(201).json({ message: 'Gallery item created successfully', galleryItem });
  } catch (error) {
    console.error('Error creating gallery item:', error);
    res.status(500).json({ message: 'Failed to create gallery item' });
  }
};

// Get all gallery items
exports.getAllGalleryItems = async (req, res) => {
  try {
    const galleryItems = await Gallery.find().populate('createdBy', 'username');
    res.status(200).json(galleryItems);
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    res.status(500).json({ message: 'Failed to fetch gallery items' });
  }
};
