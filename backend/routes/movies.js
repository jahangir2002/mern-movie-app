const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const { auth, adminOnly } = require('../middleware/auth');
const amqp = require('amqplib');

// Initialize RabbitMQ
let channel;
async function connectRabbitMQ() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();
  await channel.assertQueue('movie_queue', { durable: true });
}
connectRabbitMQ();

// GET all movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET sorted movies
router.get('/sorted', async (req, res) => {
  const { sortBy } = req.query;
  const validSortFields = ['title', 'rating', 'releaseDate', 'duration'];
  if (!validSortFields.includes(sortBy)) {
    return res.status(400).json({ message: 'Invalid sort field' });
  }
  try {
    const movies = await Movie.find().sort(sortBy);
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET search movies
router.get('/search', async (req, res) => {
  const { query } = req.query;
  try {
    const movies = await Movie.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ],
    });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST add movie (admin only)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const movieData = req.body;
    channel.sendToQueue('movie_queue', Buffer.from(JSON.stringify(movieData)), { persistent: true });
    res.status(202).json({ message: 'Movie added to queue' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT edit movie (admin only)
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