const { producer, consumer } = require('../databases/kafka');

const kafkaService = {
  sendMessage: async (topic, message) => {
    await producer.connect();
    await producer.send({
      topic: topic,
      messages: JSON.stringify(message)
    });
    await producer.disconnect();
  },

  consumeMessages: async (topic, handleMessage) => {
    await consumer.connect();
    await consumer.subscribe({ topic: topic, fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        await handleMessage(message);
      },
    });
  }
};

module.exports = kafkaService;