const amqp = require("amqplib");
require("dotenv").config();

// Connection and Channel Setup with automatic reconnection
const connectRabbitMQ = async () => {
  let connection, channel;
  const maxAttempts = 5;
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      connection = await amqp.connect(process.env.RABBIT_URL);
      console.log("Connected to RabbitMQ");
      channel = await connection.createChannel();
      connection.on("error", (err) => {
        console.error("Connection error:", err);
      });
      connection.on("close", () => {
        console.log("RabbitMQ connection closed. Reconnecting...");
        connectRabbitMQ(); // Retry the connection on close
      });

      return { connection, channel };
    } catch (error) {
      attempts += 1;
      console.error("Error connecting to RabbitMQ", error);
      if (attempts >= maxAttempts) {
        console.error("Max connection attempts reached. Exiting...");
        process.exit(1); // Exit after max attempts
      }
      console.log(`Retrying connection attempt ${attempts}...`);
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Retry after 5 seconds
    }
  }
};

// Publish to Queue
const publishToQueue = async (queueName, message) => {
  try {
    const { connection, channel } = await connectRabbitMQ();
    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(message), { persistent: true });
    console.log(`Sent message to ${queueName}:`, message);

    // Close connection after sending
    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.error("Error publishing to queue", error);
  }
};

// Subscribe to Queue
const subscribeToQueue = async (queueName, callback) => {
  try {
    const { connection, channel } = await connectRabbitMQ();
    await channel.assertQueue(queueName, { durable: true });

    console.log(`Waiting for messages in ${queueName}`);
    channel.consume(queueName, (msg) => {
      if (msg !== null) {
        const message = msg.content.toString();
        console.log(`Received message: ${message}`);
        callback(message);
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error("Error subscribing to queue", error);
  }
};

module.exports = { subscribeToQueue, publishToQueue, connectRabbitMQ };
