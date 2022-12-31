const express = require('express');

const accountsRouter = new express.Router();
const accountController = require('../controllers/accountsController');

accountsRouter.get('/invite/:email', accountController.inviteUser);

module.exports = { accountsRouter };
