const express = require('express');

const usersRouter = new express.Router();
const usersController = require('../controllers/usersController');
const { checkPermissionAdmin } = require('../middleware/validatorService');

usersRouter.post('/invite', usersController.handleAddUser);
usersRouter.get('/list', usersController.handleGetUsers);
usersRouter.get('/:email', usersController.handleGetUser);

usersRouter.put('/:email', usersController.handleUpdateUser);
usersRouter.delete('/:email', usersController.handleDeleteUser);

module.exports = { usersRouter };
