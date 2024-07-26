const amqp = require('amqplib');
const EventEmitter = require('events');
const { publishMessage } = require('../messaging/publisher');

const queue = 'transaction-service';

class MessageSubscriber extends EventEmitter {
  async subscribeMessages() {
    try {
      const connection = await amqp.connect('amqp://localhost');
      const channel = await connection.createChannel();
      
      await channel.assertQueue(queue, { durable: false });
      channel.consume(queue, (msg) => {
        const data = JSON.parse(msg.content.toString());
        this.emit('message', data);
      }, { noAck: true });
    } catch (error) {
      console.error('Error in subscriber:', error);
    }
  }
}

module.exports = MessageSubscriber;