const express = require('express');

const accountsRouter = new express.Router();
const accountController = require('../controllers/accountsController');
const { checkPermission, checkPermissionAdmin } = require('../middleware/validatorService');

accountsRouter.get('/:account/link/:email', accountController.inviteUser); // done
accountsRouter.get('/' /*checkPermissionAdmin*/, accountController.getAccounts); // done
accountsRouter.get('/:id/', accountController.getAccount); // done
accountsRouter.put('/edit/:id' /*checkPermission*/, accountController.editAccount); // done
accountsRouter.put('/status/:id' /*checkPermission*/, accountController.disableAccount);

module.exports = { accountsRouter };
