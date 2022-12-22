const register = require("../services/registerService");
const {userNotExist} = require("../services/authService");
const {ExistOneTimePassList, sendEmailOneTimePass, codeTime} = require("../services/registerService");

const handleRegister = async (req, res, next) => {
    try {
        const newUser = req.body;
        await userNotExist(newUser.email);
        await register.deleteFormOTP(newUser.email);
        const newOneTimePass = await register.createOneTimePass(newUser.email);
        await sendEmailOneTimePass(newUser, newOneTimePass);

        return res.status(200)
            .json({message: "code has been sent"});
    } catch (e) {
        return res.status(401)
            .json({message: e.message});
    }
}

const handleConfirmCode = async (req, res, next) => {
    try {
        const oneTimePassRecord = await ExistOneTimePassList(req.body.email);
        await register.otpCompare(req.body.code, oneTimePassRecord.code);
        await register.createUser(req.body)

        return res.status(200)
            .json({message: "User was added"});
    } catch (e) {
        return res.status(401)
            .json({message: e.message});
    }
}

module.exports = {handleRegister, handleConfirmCode}