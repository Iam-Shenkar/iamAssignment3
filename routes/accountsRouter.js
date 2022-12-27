const express = require("express");
const accountsRouter = new express.Router();
const usersController = require("../controllers/accountsController");

accountsRouter.post("/:account/users/confirmation", usersController.sendConfirmationEmail);

module.exports = {accountsRouter};
