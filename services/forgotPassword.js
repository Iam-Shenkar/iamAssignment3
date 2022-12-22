const {sendEmail} = require("../sendEmail/sendEmail");

function generatePassword() {
    let length = 12,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.random() * n);
    }
    return retVal;
}

const sendEmailPassword = async (newPass, user) => {
    const path = "/sendEmail/newPassMail.ejs"
    const value = {name: `${user.name}`, code: newPass}
    const email = user.email;
    await sendEmail({path, value, email});
}

module.exports = {generatePassword, sendEmailPassword}