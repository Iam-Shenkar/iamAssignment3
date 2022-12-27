require('dotenv')
  .config({ path: '.env' });

const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const logPath = path.join(__dirname, '/log', 'access.log');
const errorHandler = require('./middleware/errorHandler');
const { morgan } = require('./middleware/accessLogger');
const auth = require('./routes/authRoute');
const users = require('./routes/usersRoute');

const {
  authenticateToken,
  validation,
} = require('./middleware/validator');

const app = express();
const port = process.env.PORT || 4000;

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.use(
  morgan(':date --> :method :url :status :response-time ms', {
    stream: fs.createWriteStream(logPath, { flags: 'a' }),
  }),
);

app.use('/auth', validation, auth.authRouter);
app.use('/users', authenticateToken, users.usersRouter);

app.use(errorHandler);

app.listen(port, () => console.log(`Express server is running on port ${port}`));
