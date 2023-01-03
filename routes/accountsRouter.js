const express = require('express');

const accountsRouter = new express.Router();
const accountController = require('../controllers/accountsController');
const { checkPermission, checkPermissionAdmin } = require('../middleware/validatorService');

accountsRouter.get('/:account/invite/:email', accountController.inviteUser); // done
accountsRouter.get('/list', checkPermissionAdmin, accountController.getAccounts); // done
accountsRouter.get('/:accountId/', accountController.getAccount); // done
accountsRouter.put('/edit/', checkPermission, accountController.editAccount); // done
accountsRouter.put('/disable/', checkPermission, accountController.disableAccount);

module.exports = { accountsRouter };
