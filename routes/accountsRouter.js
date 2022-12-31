const express = require('express');

const accountsRouter = new express.Router();
const accountController = require('../controllers/accountsController');

accountsRouter.get('/invite/:email', accountController.inviteUser);
accountsRouter.get('/:accountId/', accountController.getAccount);
accountsRouter.put('/:accountId/', accountController.editAccount);
accountsRouter.put('/disable/:accountId/', accountController.disableAccount);

module.exports = { accountsRouter };
