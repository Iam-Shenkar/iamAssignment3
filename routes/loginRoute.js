const express = require("express");
const loginRouter = new express.Router();
const loginController = require('../controllers/loginController');
const {validation, generateToken} = require("../middleware/validator");

loginRouter.post("/", validation, generateToken, loginController.loginControl);
loginRouter.put("/password", validation, loginController.forgotPassControl)

module.exports = {loginRouter};
