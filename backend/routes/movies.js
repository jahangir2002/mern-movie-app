const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const { auth, adminOnly } = require('../middleware/auth');
const amqp = require('amqplib');

const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

let channel = null;
async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    channel = await connection.createChannel();
    await channel.assertQueue('movie_queue', { durable: true });
    console.log('Connected to RabbitMQ');
  } catch (err) {
    console.error('Failed to connect to RabbitMQ:', err.message);
    channel = null;
  }
}
connectRabbitMQ();

// GET all movies with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const movies = await Movie.find().skip(skip).limit(limit);
    const totalMovies = await Movie.countDocuments();

    res.json({
      movies,
      totalPages: Math.ceil(totalMovies / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST add movie (admin only)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const movieData = req.body;
    if (channel) {
      channel.sendToQueue('movie_queue', Buffer.from(JSON.stringify(movieData)), { persistent: true });
      res.status(202).json({ message: 'Movie added to queue' });
    } else {
      const movie = new Movie(movieData);
      await movie.save();
      res.status(201).json({ message: 'Movie added directly to database', movie });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET sorted movies
router.get('/sorted', async (req, res) => {
  try {
    const movies = await Movie.find().sort({ rating: -1 }).limit(10);
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET search movies
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    console.log('Search query received:', q);
    if (!q || q.trim() === '') {
      return res.status(400).json({ message: 'Search query is required' });
    }
    const escapedQuery = escapeRegex(q);
    const movies = await Movie.find({
      $or: [
        { title: { $regex: escapedQuery, $options: 'i' } },
        { description: { $regex: escapedQuery, $options: 'i' } },
      ],
    });
    console.log('Search results:', movies);
    res.json(movies || []);
  } catch (err) {
    console.error('Search route error:', err);
    res.status(500).json({ message: 'Server error while searching movies' });
  }
});

// PUT update movie (admin only)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE movie (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json({ message: 'Movie deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;