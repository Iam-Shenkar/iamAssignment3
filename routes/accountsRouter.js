const express = require('express');

const accountsRouter = new express.Router();
const accountController = require('../controllers/accountsController');
const { checkPermission, checkPermissionAdmin } = require('../middleware/validatorService');

accountsRouter.get('/invite/:email', accountController.inviteUser); // done
accountsRouter.get('/getAll/'/* , checkPermissionAdmin*/, accountController.getAccounts);
accountsRouter.get('/:accountId/', accountController.getAccount); // done
accountsRouter.put('/:accountId/', checkPermission, accountController.editAccount);
accountsRouter.put('/disable/:accountId/', checkPermission, accountController.disableAccount);

module.exports = { accountsRouter };
