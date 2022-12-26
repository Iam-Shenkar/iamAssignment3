const OTPRepository = require("../repositories/oneTimePass.repositories");
const {typeUser} = require("../middleware/validatorService");
const {sendEmail} = require("../sendEmail/sendEmail");

const otpGenerator = require("otp-generator");
const {User} = require("../services/authService");
const bcrypt = require("bcrypt");

const oneTimePass = new OTPRepository();


const createOneTimePass = async (email) => {
    let sendCode = otpGenerator.generate(6, {upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false})
    const newOneTimePass = {"email": email, "code": sendCode, "creationDate": new Date()};
    await oneTimePass.create(newOneTimePass);
    return newOneTimePass
}

const deleteFormOTP = async (data) => {
    const email = data.toLowerCase()
    if (await existCode(email))
        await oneTimePass.delete({'email': email});
}

const existCode = async (email) => {
    const userEmail = email.toLowerCase();
    const userCode = await oneTimePass.retrieve(userEmail);
    return userCode;
}

const otpCompare = async (UserCode, userCode) => {
    if (userCode !== UserCode)
        throw new Error("Incorrect code");
}

const sendEmailOneTimePass = async (user, newCode) => {
    const mailData = {
        path: "/sendEmail/oneTimePass.ejs",
        subject: 'Please Verify you Account',
        email: user.email
    }
    const details = {
        name: `${user.name}`,
        code: `${newCode.code}`
    }
    await sendEmail(mailData, details);
}

const createUser = async (user) => {
    user.password = await bcrypt.hash(user.password, 12);
    const domain = typeUser(user.email);
    const newUser = {
        "name": user.name,
        "email": user.email,
        "password": user.password,
        "type": domain
    }
    User.create(newUser)
}

const codeTime = async (user, timeCode) => {
    const time = Math.abs(new Date().getMinutes() - user.creationDate.getMinutes())
    if (time < timeCode)
        return true;
}

module.exports = {
    codeTime,
    sendEmailOneTimePass,
    createUser,
    otpCompare,
    deleteFormOTP,
    existCode,
    createOneTimePass,

}