require("dotenv").config({path: '.env'});
const {authenticateToken, validation} = require("./middleware/validator");

const users = require("./routes/usersRoute");
const auth = require("./routes/authRoute");
const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');
const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.use("/auth", validation, auth.authRouter);
app.use("/users", authenticateToken, users.usersRouter);

app.listen(port, () => console.log(`Express server is running on port ${port}`));
