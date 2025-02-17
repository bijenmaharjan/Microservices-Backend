const amqp = require("amqplib");
require("dotenv").config();

// Connection and Channel Setup
const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBIT_URL);
    if (connection) console.log("connected to RabbitMQ");
    const channel = await connection.createChannel();

    return { connection, channel };
  } catch (error) {
    console.error("Error connecting to RabbitMQ", error);
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
