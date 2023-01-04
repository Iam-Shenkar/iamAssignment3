const express = require('express');

const usersRouter = new express.Router();
const usersController = require('../controllers/usersController');
const { checkPermissionAdmin } = require('../middleware/validatorService');

usersRouter.get('/list', usersController.getUsers);
usersRouter.get('/:email', usersController.getUser);

usersRouter.put('/:email', usersController.updateUser);
usersRouter.delete('/:email', usersController.deleteUser);

module.exports = { usersRouter };
