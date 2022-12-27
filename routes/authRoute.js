const express = require('express');

const authRouter = new express.Router();
const loginController = require('../controllers/loginController');
const { generateToken } = require('../middleware/validator');
const registerController = require('../controllers/registerController');

authRouter.post('/login', generateToken, loginController.loginControl);
authRouter.put('/login/password/:email', loginController.forgotPassControl);

authRouter.post('/register', registerController.handleRegister);
authRouter.post('/register/code', generateToken, registerController.handleConfirmCode);

module.exports = { authRouter };
