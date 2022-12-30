const express = require('express');

const authRouter = new express.Router();
const passport = require('passport');

const loginController = require('../controllers/loginController');
const { generateToken } = require('../middleware/validator');
const registerController = require('../controllers/registerController');
const googleController = require('../controllers/googleController');

authRouter.all('/', (req, res) => {
  res.sendFile('POC.html');
}); // sendFile('Login.html')

authRouter.post('/login', loginController.loginControl, generateToken);
authRouter.put('/login/password/:email', loginController.forgotPassControl);

authRouter.post('/register', registerController.handleRegister);
authRouter.post('/register/code', registerController.handleConfirmCode);
authRouter.get('/:accountId/users/:email/confirmation', registerController.confirmationUser);

authRouter.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
authRouter.get('/google/callback', passport.authenticate('google', { failureRedirect: '/error' }), googleController.handleGoogleCallBack);

module.exports = { authRouter };
