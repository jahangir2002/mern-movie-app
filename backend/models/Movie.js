const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  rating: { type: Number, required: true },
  releaseDate: { type: Date, required: true },
  duration: { type: Number, required: true },
});

module.exports = mongoose.model('Movie', movieSchema);