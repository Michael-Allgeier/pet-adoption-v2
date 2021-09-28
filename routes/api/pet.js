const debug = require('debug')('app:routes:api:pet');
const debugError = require('debug')('app:error');
const express = require('express');
const { nanoid } = require('nanoid');
const dbmodule = require('../../database');

const petsArray = [
  { _id: '1', name: 'Fido', createdDate: new Date() },
  { _id: '2', name: 'Watson', createdDate: new Date() },
  { _id: '3', name: 'Loki', createdDate: new Date() },
];

// create a router
const router = express.Router();

// define routes
router.get('/list', async (req, res, next) => {
  try {
    const pets = await dbmodule.findAllPets();
    res.json(pets);
  } catch (err) {
    next(err);
  }
});
router.get('/:petId', async (req, res, next) => {
  try {
    const petId = dbmodule.newId(req.params.petId);
    const pet = await dbmodule.findPetById(petId);
    if(!pet) {
      res.status(404).json({ error: 'Pet not found.' });
    } else {
      res.json(pet);
    }
  } catch (err) {
    next(err);
  }
});
router.put('/new', async (req, res, next) => {
  try {
  const pet = {
    _id: dbmodule.newId(),
    name: req.body.name,
    age: parseInt(req.body.age),
    species: req.body.species,
    gender: req.body.gender,
    createdDate: new Date(),
  };

  if (!pet.species) {
    res.status(400).json({ error: 'Species required.' });
  } else if (!pet.name) {
    res.status(400).json({ error: 'Name required.' });
  } else if (!pet.age) {
    res.status(400).json({ error: 'Age required.' });
  } else if (!pet.gender) {
    res.status(400).json({ error: 'Gender required.' });
  } else {
    await dbmodule.insertOnePet(pet);
    res.json({message: 'pet inserted'});
  }
} catch (err) {
  next(err);
}
});
router.put('/:petId', (req, res, next) => {
  const petId = req.params.petId;
  const { species, name, age, gender } = req.body;

  const pet = petsArray.find((x) => x._id == petId);
  if (!pet) {
    res.status(404).json({ error: 'Pet not found.' });
  } else {
    if (species != undefined) {
      pet.species = species;
    }
    if (name != undefined) {
      pet.name = name;
    }
    if (age != undefined) {
      pet.age = parseInt(age);
    }
    if (gender != undefined) {
      pet.gender = gender;
    }
    pet.lastUpdated = new Date();
    res.json(pet);
  }
});
router.delete('/:petId', (req, res, next) => {
  const petId = req.params.petId;
  const index = petsArray.findIndex((x) => x._id == petId);
  if (index < 0) {
    res.status(404).json({ error: 'Pet not found.' });
  } else {
    petsArray.splice(index, 1);
    res.json({ message: 'Pet deleted.' });
  }
});

// export router
module.exports = router;
