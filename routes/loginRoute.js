const express = require("express");
const loginRouter = new express.Router();
const loginController = require('../controllers/loginController');
const passport = require('passport');
const cookieParser = require('cookie-parser');
require('../services/googleService')
loginRouter.use(cookieParser());


loginRouter.post("/",loginController.loginControl);
loginRouter.post("/forgotPass", loginController.forgotPassControl)


loginRouter.use('/googleLogIn',passport.authenticate('google', {scope : ['email','profile']}));
loginRouter.get('/google/callback',passport.authenticate('google', { failureRedirect: '/error' }),
    (req, res) => {
        loginController.googleControl(req, res)
    });
loginRouter.get('/authFailure',(req,res)=>{console.log("google auth failed"); res.send('Something Went Wrong..')});




module.exports = {loginRouter};
