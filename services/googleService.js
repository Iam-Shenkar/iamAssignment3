const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const dbHandler = require('../data/dbHandler');
const User = require("../models/users");
const jwt = require('jsonwebtoken');

const GOOGLE_CLIENT_ID = process.env.ClientId;
const GOOGLE_CLIENT_SECRET = process.env.ClientSecret;
const runningPath = process.env.runningPath

passport.use(new GoogleStrategy({
        clientID:     GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: runningPath + "/google/callback"
    },
    async (request, accessToken, refreshToken, profile, done)=> {
        const {
            id: googleId,
            displayName: username,
            given_name: firstName,
            family_name: lastName,
            picture: photo,
            email: email,
        } = profile;

        let findUser = await dbHandler.getUserByEmail(email);
        if (!findUser) {
            const newUser = new User({'googleId': googleId, 'name': username, 'email': email, 'password': 'null', 'loginDate': new Date()});
            await dbHandler.addDoc(newUser)
            findUser = await dbHandler.getUserByEmail(email);
        }
        const user = new User(findUser._id, findUser.type, findUser.email);
        const token = jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
        const data = {"token" : token, "email":email,"type":findUser.type}
        return done(null,findUser,data);
    }
));

function handleGoogleCookies(req, res, next){
    res.cookie("token",req.authInfo.token)
    res.cookie("email",req.authInfo.email)
    res.cookie("type",req.authInfo.type)
    res.redirect('/homePage');
}


passport.serializeUser((user,done)=>{
    done(null,user)
})
passport.deserializeUser((user,done)=>{
    done(null,user)
})

module.exports = {handleGoogleCookies};