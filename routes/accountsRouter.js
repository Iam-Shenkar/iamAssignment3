const express = require('express');

const accountsRouter = new express.Router();
const accountController = require('../controllers/accountsController');
const { checkPermission, checkPermissionAdmin } = require('../middleware/validatorService');

accountsRouter.get('/invite/:email', accountController.inviteUser);
accountsRouter.get('/accounts/', checkPermissionAdmin, accountController.getAccounts);
accountsRouter.get('/:accountId/:email', accountController.getAccount);
accountsRouter.put('/:accountId/', checkPermission, accountController.editAccount);
accountsRouter.put('/disable/:accountId/', checkPermission, accountController.disableAccount);

module.exports = { accountsRouter };
