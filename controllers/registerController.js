const register = require("../services/registerService");
const dbHandler = require('../data/dbHandler');
const {findUser} = require("../services/registerService");



const handleRegister = async (req, res) => {
    try {
        const user = findUser(req,res)
        await register.isConfirmed(req, res);
        await register.sendEmail(user);
        return res.status(200).json({message: "code has been sent"});

    } catch (e) {
        return res.status(401).json({message: e.message});
    }
}

const handleConfirmCode = async (req, res) => {
    try {
        const user = findUser(req,res)
        await register.otpCompare(user);
        // need to handle errors.
        return res.status(200).json({message: "User was added"});
    } catch (e) {
        return res.status(401).json({message: e.message});
    }
}

module.exports = {handleRegister, handleConfirmCode}