const express = require('express');

const accountsRouter = new express.Router();
const accountController = require('../controllers/accountsController');
const { checkPermission } = require('../middleware/validatorService');

accountsRouter.get('/invite/:email', accountController.inviteUser);
accountsRouter.get('/:accountId/', accountController.getAccount);
accountsRouter.put('/:accountId/', accountController.editAccount);
accountsRouter.put('/disable/:accountId/', checkPermission, accountController.disableAccount);

module.exports = { accountsRouter };
