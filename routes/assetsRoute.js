const express = require('express');
const assetsController = require('../controllers/assetsController');
const { authenticateToken } = require('../middleware/validator');

const assetsRoute = new express.Router();

assetsRoute.get('/', (req, res) => {
  console.log('HERE');
});

assetsRoute.get('/features/:feature/:email', assetsController.isFeatureAllowed);
assetsRoute.get('/seats/:seat/:email', assetsController.getSeats);

assetsRoute.get('/credits/:credit', assetsController.getCredit);
/*
assets.get('/user', assetsController.getUser);
*/

module.exports = { assetsRoute };
