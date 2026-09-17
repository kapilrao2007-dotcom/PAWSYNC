const asyncHandler = require('express-async-handler');
const Animal = require('../models/Animal');
const AppError = require('../utils/appError');

// @desc    Public adoption marketplace listing
// @route   GET /api/animals
// @access  Public
const listAnimals = asyncHandler(async (req, res) => {
  const { species, adoptionStatus = 'available', page = 1, limit = 12 } = req.query;
  const filter = {};
  if (species) filter.species = species;
  if (adoptionStatus !== 'all') filter.adoptionStatus = adoptionStatus;

  const animals = await Animal.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Animal.countDocuments(filter);
  res.json({ success: true, count: animals.length, total, page: Number(page), animals });
});

// @desc    Single animal profile
// @route   GET /api/animals/:id
// @access  Public
const getAnimal = asyncHandler(async (req, res) => {
  const animal = await Animal.findById(req.params.id).populate('rescueCase', 'caseId status');
  if (!animal) throw new AppError('Animal not found', 404);
  res.json({ success: true, animal });
});

module.exports = { listAnimals, getAnimal };
