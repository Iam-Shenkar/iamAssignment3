require('dotenv').config({ path: '.env' });
require('./services/googleStrategy');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const express = require('express');
const cors = require('cors');
const passport = require('passport');

const path = require('path');
const fs = require('fs');

const auth = require('./routes/authRoute');
const users = require('./routes/usersRoute');
const assets = require('./routes/assetsRoute');
const dashboard = require('./routes/dashboardRoute');
const accounts = require('./routes/accountsRouter');

const { validation } = require('./middleware/validator');
const { authenticateToken } = require('./middleware/authenticate');

const { morgan } = require('./middleware/logger');
const { listenToQ } = require('./Q/reciever');

const logPath = path.join(__dirname, '/log', 'access.log');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const port = process.env.PORT || 5000;
app.use(cors('*'));
app.use(express.static(path.join(__dirname, 'client')));

app.use(cookieParser());
app.use(bodyParser.json());

app.use(express.json());

app.use(session({ secret: process.env.secret, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(
  morgan(':date --> :method :url :status :response-time ms', {
    stream: fs.createWriteStream(logPath, { flags: 'a' }),
  }),
);

app.use('/auth', validation, auth.authRouter);
app.use('/assets', authenticateToken, assets.assetsRoute);
app.use('/users', authenticateToken, users.usersRouter);
app.use('/accounts', authenticateToken, accounts.accountsRouter);
app.use('/', dashboard.dashboardRouter);

app.use(errorHandler);

listenToQ();

app.listen(port, () => console.log(`Express server is running on port ${process.env.runningPath}`));
