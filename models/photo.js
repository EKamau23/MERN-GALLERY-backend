const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  folderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gallery',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Photo = mongoose.model('Photo', photoSchema);
module.exports = Photo;
