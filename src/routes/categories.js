const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /categories -> liste des catégories disponibles
router.get('/', async (req, res) => {
  try {
    const categories = await db('categories').select('*');
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des catégories.' });
  }
});

// GET /categories/:id/plants -> toutes les plantes d'une catégorie donnée
router.get('/:id/plants', async (req, res) => {
  try {
    const category = await db('categories').where({ id: req.params.id }).first();

    if (!category) {
      return res.status(404).json({ error: 'Catégorie non trouvée.' });
    }

    const plants = await db('plants').where({ category_id: req.params.id });
    res.json({ category, plants });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des plantes de la catégorie.' });
  }
});

module.exports = router;