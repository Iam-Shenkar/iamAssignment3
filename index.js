require("dotenv").config({path: '.env'});

const login = require("./routes/loginRoute");
const register = require("./routes/registerRoute");
const bodyParser = require('body-parser');

const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(express.json());
app.use(cors())

app.use("/login", login.loginRouter)
app.use("/register", register.registerRoute)

app.listen(port, () => console.log(`Express server is running on port ${port}`));
