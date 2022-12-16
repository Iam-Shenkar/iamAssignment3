const express = require("express");
const registerController = require("../controllers/registerController")

const registerRoute = new express.Router()

registerRoute.post('/', registerController.handleRegister);
registerRoute.post("/confirmCode",registerController.handleConfirmCode)


module.exports= { registerRoute }