const express = require('express');

const usersRouter = new express.Router();
const {
  addUser, getUsers, getUser, updateUser, deleteUser,
} = require('../controllers/usersController');
const { checkPermissionAdmin, checkPermission } = require('../middleware/validatorService');

usersRouter.post('/', checkPermissionAdmin, addUser);
usersRouter.get('/', getUsers);
usersRouter.get('/:email', getUser);
usersRouter.put('/:email', updateUser);
usersRouter.delete('/:email', checkPermission, deleteUser);

module.exports = { usersRouter };
