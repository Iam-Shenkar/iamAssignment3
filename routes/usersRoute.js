const express = require('express');

const usersRouter = new express.Router();
const usersController = require('../controllers/usersController');

usersRouter.post('/', usersController.getUsers);

module.exports = { usersRouter };
