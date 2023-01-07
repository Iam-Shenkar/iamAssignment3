const express = require('express');

const usersRouter = new express.Router();
const usersController = require('../controllers/usersController');
const { checkPermissionAdmin, checkPermission } = require('../middleware/validatorService');

usersRouter.get('/', usersController.getUsers);
usersRouter.get('/:email', usersController.getUser);

usersRouter.put('/:email', checkPermission, usersController.updateUser);
usersRouter.delete('/:email', checkPermissionAdmin, usersController.deleteUser);

module.exports = { usersRouter };
