const amqp = require('amqplib');
const Movie = require('../models/Movie');

async function startConsumer() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue('movie_queue', { durable: true });

    channel.consume('movie_queue', async (msg) => {
      if (msg !== null) {
        const movieData = JSON.parse(msg.content.toString());
        try {
          const movie = new Movie(movieData);
          await movie.save();
          channel.ack(msg); // Acknowledge message
        } catch (err) {
          console.error('Error saving movie:', err);
          // Optionally requeue or move to dead-letter queue
        }
      }
    }, { noAck: false });
  } catch (err) {
    console.error('RabbitMQ consumer error:', err);
  }
}

startConsumer();