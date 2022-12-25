const {userExist, statusCheck, validPassword, generateAccessToken} = require("../services/authService");
const {generatePassword, sendEmailPassword} = require("../services/forgotPassword");

const {User} = require("../services/authService");
const bcrypt = require("bcrypt");
const axios = require('axios')
const jwt = require("jsonwebtoken");

const loginControl = async (req, res, next) => {
    try {
        const user = await userExist(req.body.email);
        await validPassword(req.body.password, user.password);
        await statusCheck(user);
        const newRefreshToken = req.refreshToken;

        await User.update({"email": user.email}, {"loginDate": new Date(), "refreshToken": newRefreshToken})

        res.status(200).json({refreshToken: newRefreshToken})
    } catch (err) {
        res.status(401).json({message: err.message})
    }
}


const forgotPassControl = async (req, res, next) => {
    try {
        const user = await userExist(req.body.email);
        await statusCheck(user);
        const newPass = generatePassword();

        const hashedPassword = await bcrypt.hash(newPass, 12);
        await sendEmailPassword(newPass, user);
        await User.update({"email": user.email}, {"password": hashedPassword});

        return res.status(200)
            .json({message: "A new password has been sent to the email"});

    } catch (e) {
        console.log(e);
        return res.status(401).json({message: e.message});
    }
}

module.exports = {loginControl, forgotPassControl}