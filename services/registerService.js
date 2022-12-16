const dbHandler = require('../data/dbHandler');
const OTP = require('../models/OTPPass');
const node = require("nodemailer")
const smtp = require("nodemailer-smtp-transport")
const otpGenerator = require('otp-generator')
const ejs = require("ejs");
const USERS = require('../models/users')


const emailSMTP = process.env.email;

// the transport metadata
const transporter = node.createTransport(smtp({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: 'IamTeamShenkar@gmail.com',
        pass: emailSMTP
    }
}));

const isConfirmed = async (req, res)=>{
    const user = findUser(req, res);
    await OTP.findOneAndDelete({'email': user.email});
}

const sendEmail= async (user) => {
    //create an OTP Code
    let OTPcode = otpGenerator.generate(6, {upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false})
    const data = await ejs.renderFile(process.cwd() + "/data/otpEmail.ejs", {name: `${user.name}`, code: OTPcode});

    //the mailing metadata
    const mainOptions = {
        from: 'IamTeamShenkar@gmail.com',
        to: user.email,
        subject: 'Please Verify you Account',
        html: data
    };

    const newOTP = new OTP({"email": mainOptions.to, "code": OTPcode, "creationDate": new Date()});
    await dbHandler.addDoc(newOTP);

    // send the mail with the OTP to the client email
    await transporter.sendMail(mainOptions, (err, info) => {
        if (err) {
            throw new Error("transporter error: mail was not sent")
        } else {
            console.log(`message sent to ${mainOptions.to}`)
        }
    });
}


const findUser = async (req, res) => {
    const user = dbHandler.getUserByEmail(req.body.email)
    if (user) {
         return res.status(401).json({massege: 'User already exists'})
    } else {
        return user
    }
}


const otpCompare = async (user) => {
    user.email = user.email.toLowerCase();
    const findUser = await OTP.findOne({'email': user.email});
    if (user.email === findUser.email) {
        if (user.code === findUser.code && Math.abs(new Date().getMinutes() - findUser.creationDate.getMinutes()) < 15) {
            await dbHandler.addUser(user);
        } else {
            await OTP.findOneAndDelete({'email': user.email});
            throw new Error("code is expired");
        }
    } else {
        throw new Error("user doesn't exist");
    }
}




module.exports = {otpCompare, findUser, sendEmail, isConfirmed}