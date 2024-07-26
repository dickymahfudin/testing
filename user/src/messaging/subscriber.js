const amqp = require('amqplib');
const { User } = require('../models');
const { publishMessage } = require('../messaging/publisher');

const queue = 'user-service';

async function subscribeMessages() {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    
    await channel.assertQueue(queue, { durable: false });
    
    channel.consume(queue, async (msg) => {
      const data = JSON.parse(msg.content.toString());
      const dataUser = await User.findAll({ where: { id: [data.customer_id, data.vendor_id] }, raw: true });
      await publishMessage('transaction-service', JSON.stringify(dataUser));
    }, { noAck: true });
  } catch (error) {
    console.error('Error in subscriber:', error);
  }
}

module.exports = { subscribeMessages };
