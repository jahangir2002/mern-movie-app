const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  rating: { type: Number },
  releaseDate: { type: Date },
  duration: { type: Number }, // in minutes
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Movie', movieSchema);