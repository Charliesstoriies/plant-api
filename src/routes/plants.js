const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /plants -> toutes les plantes, avec le nom de la catégorie (JOIN)
router.get('/', async (req, res) => {
  try {
    const plants = await db('plants')
      .leftJoin('categories', 'plants.category_id', 'categories.id')
      .select(
        'plants.id',
        'plants.name',
        'plants.species',
        'plants.sunlight',
        'plants.watering',
        'plants.pet_friendly',
        'plants.height_cm',
        'plants.category_id',
        'categories.label as category_name'
      );
    res.json(plants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des plantes.' });
  }
});

// GET /plants/:id -> détails d'une plante spécifique
router.get('/:id', async (req, res) => {
  try {
    const plant = await db('plants')
      .leftJoin('categories', 'plants.category_id', 'categories.id')
      .select(
        'plants.id',
        'plants.name',
        'plants.species',
        'plants.sunlight',
        'plants.watering',
        'plants.pet_friendly',
        'plants.height_cm',
        'plants.category_id',
        'categories.label as category_name'
      )
      .where('plants.id', req.params.id)
      .first();

    if (!plant) {
      return res.status(404).json({ error: 'Plante non trouvée.' });
    }
    res.json(plant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération de la plante.' });
  }
});

// POST /plants -> ajouter une nouvelle plante (avec category_id)
router.post('/', async (req, res) => {
  try {
    const { name, species, sunlight, watering, pet_friendly, height_cm, category_id } = req.body;

    if (!name || !species || !sunlight || !watering || pet_friendly === undefined || !height_cm) {
      return res.status(400).json({
        error: 'Champs requis manquants : name, species, sunlight, watering, pet_friendly, height_cm.'
      });
    }

    if (category_id) {
      const category = await db('categories').where({ id: category_id }).first();
      if (!category) {
        return res.status(404).json({ error: 'La catégorie spécifiée n\'existe pas.' });
      }
    }

    const [id] = await db('plants').insert({
      name,
      species,
      sunlight,
      watering,
      pet_friendly,
      height_cm,
      category_id: category_id || null
    });

    const newPlant = await db('plants').where({ id }).first();
    res.status(201).json(newPlant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur lors de la création de la plante.' });
  }
});

// DELETE /plants/:id -> suppression d'une plante
router.delete('/:id', async (req, res) => {
  try {
    const deletedCount = await db('plants').where({ id: req.params.id }).del();

    if (deletedCount === 0) {
      return res.status(404).json({ error: 'Plante non trouvée.' });
    }
    res.status(200).json({ message: 'Plante supprimée avec succès.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression de la plante.' });
  }
});

module.exports = router;