const debug = require('debug')('app:database');
const { MongoClient, ObjectId } = require('mongodb');
const config = require('config');
const { func } = require('joi');

/** Global variable storing the open connection, do not use it directly. */
let _db = null;

/** Connect to the database */
async function connect() {
  if (!_db) {
    const dbUrl = config.get('db.url');
    const dbName = config.get('db.name');
    const client = await MongoClient.connect(dbUrl);
    _db = client.db(dbName);
  }
  return _db;
}

/** Connect to the database and verify the connection */
async function ping() {
  const db = await connect();
  await db.command({ ping: 1 });
  debug('Ping!');
  //return db;
}

ping();
/** Generate/Parse an ObjectId */
const newId = (str) => ObjectId(str);

// FIXME: add more functions here

async function findAllPets() {
  const db = await connect();
  const pets = 
    await db.collection('pets')
      .find({})
      .toArray();
  return pets;
}

async function findPetById(petId) {
  const db = await connect();

  const pet = 
    await db.collection('pets')
      .findOne({_id : {$eq: petId}});
  
  return pet;
}

async function insertOnePet(pet) {
  const db = await connect();
  db.collection('pets').insertOne(pet);
}

async function updatePetName(petId, petName) {
  const db = await connect();  
  await db.collection('pets').updateOne(
    { _id: { $eq: petId } },
    { $set: { name: petName } } 
  );
}

async function updatePetSpecies(petId, petSpecies) {
  const db = await connect();  
  await db.collection('pets').updateOne(
    { _id: { $eq: petId } },
    { $set: { species: petSpecies } } 
  );
}

async function updatePetAge(petId, petAge) {
  const db = await connect();  
  await db.collection('pets').updateOne(
    { _id: { $eq: petId } },
    { $set: { age: petAge } } 
  );
}

async function updatePetGender(petId, petGender) {
  const db = await connect();  
  await db.collection('pets').updateOne(
    { _id: { $eq: petId } },
    { $set: { gender: petGender } } 
  );
}

async function deletePetById(petId) {
  const db = await connect();
  await db.collection('pets').deleteOne(
    { _id: { $eq: petId } }
  );
}

// export functions
module.exports = {
  connect,
  ping,
  newId,
  findAllPets,
  findPetById,
  insertOnePet,
  updatePetName,
  updatePetSpecies,
  updatePetAge,
  updatePetGender,
  deletePetById
  // FIXME: remember to export your functions
};