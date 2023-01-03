const express = require('express');

const authRouter = new express.Router();
const passport = require('passport');

const { loginControl, forgotPassControl } = require('../controllers/loginController');
const { generateToken } = require('../middleware/authenticate');
const { handleRegister, handleConfirmCode, confirmationUser } = require('../controllers/registerController');
const googleController = require('../controllers/googleController');

authRouter.all('/', (req, res) => {
  res.sendFile('index.html');
}); // sendFile('Login.html')

authRouter.post('/login', generateToken, loginControl);
authRouter.put('/login/password', forgotPassControl);

authRouter.post('/register', handleRegister);
authRouter.post('/register/code', handleConfirmCode);
authRouter.get('/:accountId/users/:email/confirmation', confirmationUser);

authRouter.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
authRouter.get('/google/callback', passport.authenticate('google', { failureRedirect: '/error' }), googleController.handleGoogleCallBack);

module.exports = { authRouter };
