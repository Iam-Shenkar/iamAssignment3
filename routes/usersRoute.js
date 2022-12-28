const express = require('express');

const usersRouter = new express.Router();
// const usersController = require('../controllers/usersController');
usersRouter.post('/', (req, res) => {
  console.log(req.user);
  res.status(200);
});
module.exports = { usersRouter };
