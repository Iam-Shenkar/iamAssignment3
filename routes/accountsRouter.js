const express = require('express');

const accountsRouter = new express.Router();
const accountController = require('../controllers/accountsController');
const { checkPermission, checkPermissionAdmin } = require('../middleware/validatorService');


accountsRouter.get('/invite/:email', accountController.inviteUser); // done
accountsRouter.get('/getAll/'/* , checkPermissionAdmin*/, accountController.getAccounts); // done
accountsRouter.get('/:email/', accountController.getAccount); // done
accountsRouter.put('/edit/'/* , checkPermission */, accountController.editAccount); // done
accountsRouter.put('/disable/'/* , checkPermission */, accountController.disableAccount);


module.exports = { accountsRouter };
