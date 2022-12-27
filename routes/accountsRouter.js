const express = require('express');

const accountsRouter = new express.Router();
const accountController = require('../controllers/accountsController');

accountsRouter.post('/:accountId', accountController.addUser);

module.exports = { accountsRouter };
