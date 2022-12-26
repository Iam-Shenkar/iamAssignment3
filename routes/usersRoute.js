const express = require("express");
const usersRouter = new express.Router();
const usersController = require("../controllers/usresController");

usersRouter.post("/", usersController.getUsers);

module.exports = {usersRouter};
