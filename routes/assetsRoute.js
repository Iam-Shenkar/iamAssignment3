const express = require('express');
const assetsController = require('../controllers/assetsController');

const assets = new express.Router();

/* check if user exists*/
assets.get('/features/feature', assetsController.isFeatureAllowed);
assets.get('/seats/:seat', assetsController.getSeats);
assets.get('/credits/:credit', assetsController.getCredit);
/*
assets.get('/user', assetsController.getUser);
*/
