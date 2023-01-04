const express = require('express');
const assetsController = require('../controllers/assetsController');
const { authenticateToken } = require('../middleware/validator');

const assetsRoute = new express.Router();

assetsRoute.get('/features/', assetsController.isFeatureAllowed);
assetsRoute.get('/seats/', assetsController.getSeats);

assetsRoute.get('/credits/', assetsController.getCredit);

module.exports = { assetsRoute };
