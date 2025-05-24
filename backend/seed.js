const mongoose = require('mongoose');
const Movie = require('./models/Movie');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    await Movie.deleteMany({});
    await Movie.insertMany([
      {
        title: 'The Shawshank Redemption',
        description: 'Two imprisoned men bond over a number of years...',
        rating: 9.3,
        releaseDate: '1994-09-23',
        duration: 142,
      },
      {
        title: 'The Godfather',
        description: 'The aging patriarch of an organized crime dynasty...',
        rating: 9.2,
        releaseDate: '1972-03-24',
        duration: 175,
      },
      // Add more movies
    ]);
    console.log('Movies seeded');
    mongoose.connection.close();
  })
  .catch(err => console.error(err));