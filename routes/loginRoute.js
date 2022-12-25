const express = require("express");
const loginRouter = new express.Router();
const loginController = require('../controllers/loginController');
const {validation, token} = require("../middleware/validator");


loginRouter.post("/", validation, token, loginController.loginControl);
loginRouter.put("/password", validation, loginController.forgotPassControl)


module.exports = {loginRouter};
