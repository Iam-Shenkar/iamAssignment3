const express = require("express");
const registerController = require("../controllers/registerController")
const {validation} = require("../middleware/validator");

const registerRoute = new express.Router()

registerRoute.post('/', validation, registerController.handleRegister);
registerRoute.post("/code", validation, registerController.handleConfirmCode)


module.exports = {registerRoute}