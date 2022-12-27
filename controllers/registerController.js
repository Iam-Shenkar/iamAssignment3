const register = require('../services/registerService');
const { userNotExist } = require('../services/authService');
const { existCode, sendEmailOneTimePass } = require('../services/registerService');

const handleRegister = async (req, res, next) => {
  try {
    const newUser = req.body;
    await userNotExist(newUser.email);
    await register.deleteFormOTP(newUser.email);
    const newOneTimePass = await register.createOneTimePass(newUser.email);
    await sendEmailOneTimePass(newUser, newOneTimePass);

    return res.status(200)
      .json({ message: 'code has been sent' });
  } catch (err) {
    next(err);
  }
};

const handleConfirmCode = async (req, res, next) => {
  try {
    const oneTimePassRecord = await existCode(req.body.email);
    await register.otpCompare(req.body.code, oneTimePassRecord.code);
    await register.createUser(req.body);

    return res.status(200)
      .json({ message: 'User was added' });
  } catch (err) {
    next(err);
  }
};

module.exports = { handleRegister, handleConfirmCode };
