const express = require('express');
const assetsController = require('../controllers/assetsController');
const { authenticateToken } = require('../middleware/validator');

const assetsRoute = new express.Router();

assetsRoute.get('/features/:feature/:email', assetsController.isFeatureAllowed);
assetsRoute.get('/seats/:seat/:email', assetsController.getSeats);

assetsRoute.get('/credits/:credit/:email', assetsController.getCredit);
/*
assets.get('/user', assetsController.getUser);
*/

module.exports = { assetsRoute };
