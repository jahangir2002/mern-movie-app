const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const movieRoutes = require('./routes/movies');
const authRoutes = require('./routes/auth');
// require('./queue/consumer'); // Start RabbitMQ consumer

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Debug: Log environment variables
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('RABBITMQ_URL:', process.env.RABBITMQ_URL);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/movies', movieRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => res.send('API running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));