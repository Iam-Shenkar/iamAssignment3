const EmailValidator = require("email-validator");
const passwordValidator = require('password-validator');
const schema = new passwordValidator();

const PasswordValidator = (password) => {

    const notValid = schema.validate(password, {details: true})
    if (notValid.length > 0)
        throw new Error(notValid[0].message);
}

const emailValidator = (email) => {
    if (!EmailValidator.validate(email))
        throw new Error("email not valid");
}

const typeValidator = (userType) => {
    const type = userType.toLowerCase();
    const validType = ['user', 'admin'];
    if (!validType.find(element => element === type))
        throw new Error("type not valid")
}

const statusValidator = (status) => {
    console.log('status')
    const validStatus = ['active', 'closed', 'suspended']
    if (!validStatus.find(element => element === status))
        throw new Error("status not valid")
}

const suspensionTimeValidator = (suspensionTime) => {
}

const nameValidator = (name) => {
}


const codeValidator = (code) => {
}

const typeUser = (email) => {
    let domain = email.split("@");
    domain = domain[1].split(".");
    if (domain.find(element => element === process.env.adminEmail)) {
        return "admin"
    } else {
        return "user"
    }
}

schema
    .is().min(8)        // Minimum length 8
    .is().max(100)      // Maximum length 100
    .has().uppercase()       // Must have uppercase letters
    .has().lowercase()       // Must have lowercase letters
    .has().digits(2)   // Must have at least 2 digits
    .has().not().spaces()    // Should not have spaces


module.exports = {
    suspensionTimeValidator,
    statusValidator,
    typeValidator,
    codeValidator,
    nameValidator,
    emailValidator,
    PasswordValidator,
    typeUser
}

