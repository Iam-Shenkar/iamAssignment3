const jwt = require('jsonwebtoken');
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
  const refreshToken = req.cookies.jwt;
  if (refreshToken == null) return res.redirect('/');

  const user = await User.retrieve({ refreshToken });
  if (!user) return res.redirect('/').end();
  await jwt.verify(user.refreshToken, process.env.REFRESH_TOKEN_SECRET, (err) => {
    if (err) return res.redirect('/').end();
    const accessToken = generateAccessToken({ email: user.email });

    res.set('authorization', accessToken);
    req.user = user.email;

    req.token = { accessToken: `Bearer ${accessToken}` };
  });
};

const authenticateToken = async (req, res, next) => {
  console.log('checked token');

  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.redirect('/');
  await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err) => {
    if (err) {
      await refreshTokenVerify(req, res);
      res.redirect('/');
      res.end();

      next();
    } else {
      const user = await User.retrieve({ refreshToken: req.cookies.jwt });
      req.user = user.email;
      req.token = { refreshToken: req.body.refreshToken, accessToken: authHeader };
      next();
    }
  });
};

module.exports = { generateToken, authenticateToken };
