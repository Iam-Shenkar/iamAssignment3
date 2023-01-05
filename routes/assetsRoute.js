const express = require('express');
const assetsController = require('../controllers/assetsController');
const { authenticateToken } = require('../middleware/validator');

const assetsRoute = new express.Router();

assetsRoute.get('/features', assetsController.getFeatures);
assetsRoute.get('/seats', assetsController.getSeats);
assetsRoute.get('/credits', assetsController.getCredit);
assetsRoute.put('/features/:feature', assetsController.setFeature);
assetsRoute.put('/seats/:seat', assetsController.getSeats);
assetsRoute.put('/credits/:credit', assetsController.getCredit);
assetsRoute.get('/token', assetsController.verifyToken);

module.exports = { assetsRoute };
