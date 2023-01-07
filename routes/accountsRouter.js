const express = require('express');

const accountsRouter = new express.Router();
const accountController = require('../controllers/accountsController');
const { checkPermissionAdmin } = require('../middleware/validatorService');

accountsRouter.get('/', checkPermissionAdmin, accountController.getAccounts); // done
accountsRouter.get('/:account/link/:email', accountController.inviteUser); // done
accountsRouter.get('/:id/', accountController.getAccount); // done
accountsRouter.put('/:id', checkPermissionAdmin, accountController.editAccount); // done
accountsRouter.put('/status/:id', checkPermissionAdmin, accountController.disableAccount);

module.exports = { accountsRouter };
