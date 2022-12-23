const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const UsersRepository = require("../repositories/Users.repositories");

const User = new UsersRepository();

const unSuspend = async (user) => {
    await User.update(user.email, {"status": "active", "suspensionTime": 0, "suspensionDate": 0});
}

const validPassword = async (pass, userPassword) => {
    if (!await bcrypt.compare(pass, userPassword))
        throw new Error("incorrect password");
}

const userExist = async (email) => {
    const userEmail = email.toLowerCase();
    const user = await User.retrieve(userEmail);
    if (!user) throw new Error("user doesn't exist");
    return user;
}

const userNotExist = async (email) => {
    const userEmail = email.toLowerCase();
    const user = await User.retrieve(userEmail);
    if (user) throw new Error("User already exists");
}

async function handleCookies(req, res, next) {
    const userFind = await User.retrieve(req.body.email);
    const user = new userClass(userFind._id, userFind.type, userFind.email);
    const accessToken = jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
    res.cookie('token', accessToken, {httponly: true});
    res.cookie('email', userFind.email, {httponly: true});
    res.cookie('type', userFind.type, {httponly: true});
}

const statusCheck = async (user) => {

    switch (user.status) {
        case "active":
            break;

        case 'closed':
            throw new Error("User is closed")
            break;

        case "suspended":
            const suspendTime = parseInt(user.suspensionTime);
            const suspendStartDate = user.suspensionDate;
            let dateExpired = suspendStartDate;

            dateExpired.setDate(suspendStartDate.getDate() + suspendTime)
            if (dateExpired > new Date()) {
                console.log(`user: ${user["email"]} is suspended- login failed`, 'ERROR');
                throw new Error(`User is suspended until ${dateExpired}`)
            } else {
                await unSuspend(user);
            }
            break;
    }
}

module.exports = {User, handleCookies, userNotExist, statusCheck, userExist, validPassword}
