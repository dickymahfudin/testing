const express = require('express');
const router = express.Router();
const { Material } = require('../models');

// Create Material
router.post('/', async (req, res) => {
  try {
    const material = await Material.create(req.body);
    res.status(201).json(material);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: 'internal error' });
  }
});

// Get All Materials
router.get('/', async (req, res) => {
  try {
    const materials = await Material.findAll();
    res.status(200).json(materials);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: 'internal error' });
  }
});

// Get Material by ID
router.get('/:id', async (req, res) => {
  try {
    const material = await Material.findByPk(req.params.id);
    if (material) {
      res.status(200).json(material);
    } else {
      res.status(404).json({ error: 'Material not found' });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: 'internal error' });
  }
});

// Update Material
router.put('/:id', async (req, res) => {
  try {
    const material = await Material.findByPk(req.params.id);
    if (material) {
      await material.update(req.body);
      res.status(200).json(material);
    } else {
      res.status(404).json({ error: 'Material not found' });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: 'internal error' });
  }
});

// Delete Material
router.delete('/:id', async (req, res) => {
  try {
    const material = await Material.findByPk(req.params.id);
    if (material) {
      await material.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Material not found' });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: 'internal error' });
  }
});

module.exports = router;
