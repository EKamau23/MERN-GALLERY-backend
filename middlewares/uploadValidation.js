exports.validateUpload = (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }
    next();
  };
  