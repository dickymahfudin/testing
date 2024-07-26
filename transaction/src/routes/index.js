const express = require('express');
const router = express.Router();
const { Transaction } = require('../models');
const { publishMessage } = require('../messaging/publisher');
const MessageSubscriber = require('../messaging/subscriber');


const subscriber = new MessageSubscriber();

// Create Transaction
router.post('/', async (req, res) => {
  try {
    await publishMessage('user-service', JSON.stringify(req.body));    
    await subscriber.subscribeMessages();
    const handleMessage = async (data) => {
      const customer = data.find(user => user.id === req.body.customer_id);
      const vendor = data.find(user => user.id === req.body.vendor_id);
  
      if(!customer || !vendor) {
        res.status(400).json({ error: 'Customer or Vendor not found' });
      } 
      await Transaction.create({
        customer_id: req.body.customer_id,
        vendor_id: req.body.vendor_id,
        name: "test"
      });
      res.status(201).json({ok: true});
      subscriber.off('message', handleMessage);
    };
    subscriber.on('message', handleMessage);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: 'internal error' });
  }
});

// Get All Transactions
router.get('/', async (req, res) => {
  try {
    const transaction = await Transaction.findAll();
    const data = {
      vendor_id: 1,
      customer_id: 1
    }
    await publishMessage('user-service', JSON.stringify(data));
    res.status(200).json(transaction);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: 'internal error' });
  }
});

// Get Transaction by ID
router.get('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (transaction) {
      res.status(200).json(transaction);
    } else {
      res.status(404).json({ error: 'Transaction not found' });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: 'internal error' });
  }
});

// Update Transaction
router.put('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (transaction) {
      await transaction.update(req.body);
      res.status(200).json(transaction);
    } else {
      res.status(404).json({ error: 'Transaction not found' });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: 'internal error' });
  }
});

// Delete Transaction
router.delete('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (transaction) {
      await transaction.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Transaction not found' });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: 'internal error' });
  }
});

module.exports = router;
