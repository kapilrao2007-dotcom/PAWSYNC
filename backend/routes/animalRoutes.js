const express = require('express');
const { listAnimals, getAnimal } = require('../controllers/animalController');

const router = express.Router();

router.get('/', listAnimals);
router.get('/:id', getAnimal);

module.exports = router;
