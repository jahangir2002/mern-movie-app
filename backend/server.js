const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const movieRoutes = require('./routes/movies');
const authRoutes = require('./routes/auth');

dotenv.config();
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('RABBITMQ_URL:', process.env.RABBITMQ_URL);

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

try {
  require('./queue/consumer');
} catch (err) {
  console.error('Failed to start RabbitMQ consumer:', err);
}

app.use('/api/movies', movieRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => res.send('API running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));