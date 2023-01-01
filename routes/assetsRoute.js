const express = require('express');
const assetsController = require('../controllers/assetsController');
const { authenticateToken } = require('../middleware/validator');

const assetsRoute = new express.Router();

assetsRoute.get('/features/:email', assetsController.isFeatureAllowed);
assetsRoute.get('/seats/:email', assetsController.getSeats);

assetsRoute.get('/credits/:email', assetsController.getCredit);

module.exports = { assetsRoute };
