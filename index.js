require('dotenv').config({ path: path.join(process.cwd(),".env") });
require('./config/dbConnection');
const login = require("./routes/loginRoute");
const register = require("./routes/registerRoute");
const homePage = require("./routes/homePageRoute");
const path = require("path");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const session = require('express-session');
const passport = require("passport");
const SESSION_SECRET = process.env.secret;
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');


mongoose.set('strictQuery', true);
app.use(bodyParser.json());
app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ extended: true }));

app.use(session({secret: SESSION_SECRET,resave:false, saveUninitialized: true}))
app.use(passport.initialize());
app.use(passport.session());
// app.use(logger(" :method :url :status :res[content-length] - :response-time ms :date[web]", {stream: accessLogStream}));
app.use(express.static('clientPublic'));
// app.get('*.html',function (req, res, next) {res.redirect('/homePage');});
// app.get('/clientPublic/script.js', function(req, res) {res.sendFile(path.join(__dirname , "../clientPublic/script.js"));});
// app.get('/clientPublic/style.css', function(req, res) {res.sendFile(path.join(__dirname , "../clientPublic/style.css"));});
// app.get('/clientPublic/scriptsHome.js', function(req, res) {res.sendFile(path.join(__dirname , "../clientPublic/scriptsHome.js"));});


app.use("/", authinticate, homePage)
app.use("/login", login.loginRouter)
app.use("/register", register.registerRoute)



app.listen(port,() => console.log(`Express server is running on port ${port}`));
