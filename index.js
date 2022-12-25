require("dotenv").config({path: '.env'});

const register = require("./routes/registerRoute");
const homePage = require("./routes/homePageRoute");
const login = require("./routes/loginRoute");
const auth = require("./middleware/authenticate");
const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');
const express = require("express");
const cors = require("cors");
const {authenticateToken} = require("./middleware/validator");
const app = express();
const port = process.env.PORT || 5000;

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.use("/login", login.loginRouter);
app.use("/register", register.registerRoute);
app.use("/homePage", authenticateToken, homePage.homePageRouter);


app.listen(port, () => console.log(`Express server is running on port ${port}`));
