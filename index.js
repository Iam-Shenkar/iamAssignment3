require("dotenv").config({path: '.env'});

const register = require("./routes/registerRoute");
const homePage = require("./routes/homePageRoute");
const login = require("./routes/loginRoute");
const auth = require("./middleware/authenticate");
const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');
const express = require("express");
const cors = require("cors");
const jwt = require('jsonwebtoken')
const app = express();
const port = process.env.PORT || 5000;


app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15s'})
}

function authenticateToken(req, res, next) {
    console.log(req.body)
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    console.log(token)
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        console.log(err)
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}


app.use("/auth", auth.authJwt)
app.use("/login", login.loginRouter);
app.use("/register", register.registerRoute);

app.use("/homePage", authenticateToken, homePage.homePageRouter);


app.listen(port, () => console.log(`Express server is running on port ${port}`));
