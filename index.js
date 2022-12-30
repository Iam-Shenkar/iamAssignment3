require('dotenv').config({ path: '.env' });

const bodyParser = require('body-parser');
require('./services/googleStrategy');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const path = require('path');
const auth = require('./routes/authRoute');
const users = require('./routes/usersRoute');
const { authenticateToken, validation } = require('./middleware/validator');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.static('clientPublic'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(session({ secret: process.env.secret, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', validation, auth.authRouter);
app.use('/users', users.usersRouter);
// authenticateToken

app.all('/', (req, res) => {
  res.sendFile(path.join(__dirname, './clientPublic/POC.html'));
}); // res.redirect('homePage.html')

app.listen(port, () => console.log(`Express server is running on port ${port}`));
