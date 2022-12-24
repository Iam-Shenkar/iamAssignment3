require("dotenv").config({path: '.env'});

const register = require("./routes/registerRoute");
const homePage = require("./routes/homePageRoute");
const login = require("./routes/loginRoute");
const bodyParser = require('body-parser');

const express = require("express");
const cors = require("cors");
const {isAuthenticated} = require("./middleware/authenticate");

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());


app.use("/login", login.loginRouter);
app.use("/register", register.registerRoute);
app.use("/homePage", isAuthenticated, homePage.homePageRouter);

app.listen(port, () => console.log(`Express server is running on port ${port}`));
