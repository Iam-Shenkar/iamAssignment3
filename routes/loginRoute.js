const express = require("express");
const loginRouter = new express.Router();
const loginController = require('../controllers/loginController');
const cookieParser = require('cookie-parser');
const {validation} = require("../Validation/validator");

loginRouter.use(cookieParser());

loginRouter.post("/", validation, loginController.loginControl);
loginRouter.put("/password", validation, loginController.forgotPassControl)

module.exports = {loginRouter};
