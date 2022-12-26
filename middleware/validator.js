const jwt = require('jsonwebtoken');
const valid = require('./validatorService');
const { User } = require('../services/authService');

const generateToken = (req, res, next) => {
  try {
    const accessToken = jwt.sign({
      email: req.body.email,
    }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '5s',
    });

    const refreshToken = jwt.sign({
      email: req.body.email,
    }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.set({ authorization: `Bearer ${accessToken}` });
    req.token = { refreshToken, accessToken: `Bearer ${accessToken}` };
    next();
  } catch (e) {
    return res.sendStatus(401);
  }
};

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5s' });
}

const refreshTokenVerify = async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken == null) return res.status(403).json({ message: 'Unauthorized' });

  const user = await User.retrieve({ refreshToken });
  if (!user) return res.status(403).json({ message: 'Unauthorized' });
  await jwt.verify(user.refreshToken, process.env.REFRESH_TOKEN_SECRET, (err) => {
    if (err) return res.status(403).json({ message: err.message });
    const accessToken = generateAccessToken({ email: user.email });

    res.set('authorization', accessToken);
    req.token = { accessToken: `Bearer ${accessToken}` };
  });
};

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err) => {
    if (err) {
      await refreshTokenVerify(req, res);
      if (res.statusCode !== 200) return res.send();
      next();
    } else {
      req.token = { refreshToken: req.body.refreshToken, accessToken: authHeader };
      next();
    }
  });
};

const validation = (req, res, next) => {
  try {
    if (req.body.email) valid.emailValidator(req.body.email);

    if (req.body.password) valid.PasswordValidator(req.body.password);

    if (req.body.name || req.body.name === '') valid.nameValidator(req.body.name);

    if (req.body.code) valid.codeValidator(req.body.code);

    if (req.body.newPassword) valid.PasswordValidator(req.body.newPassword);

    if (req.body.status) valid.statusValidator(req.body.status);

    if (req.body.type) valid.typeValidator(req.body.type);

    if (req.body.suspensionTime) valid.suspensionTimeValidator(req.body.suspensionTime);

    next();
  } catch (err) {
    res.status(412)
      .json({
        success: false,
        message: err.message,
      });
  }
};

module.exports = { validation, generateToken, authenticateToken };
