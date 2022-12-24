const {sendEmail} = require("../sendEmail/sendEmail");
const generator = require('generate-password');

const generatePassword = () => {
    const password = generator.generate({
        length: 10,
        numbers: true
    });
    return password;
}

const sendEmailPassword = async (newPass, user) => {
    const mailData = {
        path: "/sendEmail/newPassMail.ejs",
        subject: 'New Password',
        email: user.email
    }
    const details = {
        name: `${user.name}`,
        pass: `${newPass}`
    }
    await sendEmail(mailData, details);
}

module.exports = {generatePassword, sendEmailPassword}