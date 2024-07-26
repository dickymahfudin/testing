const express = require('express');
const router = express.Router();
const { User } = require('../models');

// Create User
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: 'internal error' });
  }
});

// Get All Users
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: 'internal error' });
  }
});

// Get User by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: 'internal error' });
  }
});

// Update User
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.update(req.body);
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: 'internal error' });
  }
});

// Delete User
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: 'internal error' });
  }
});

module.exports = router;
