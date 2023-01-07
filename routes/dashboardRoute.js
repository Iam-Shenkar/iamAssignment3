const express = require('express');
const path = require('path');
const { authenticateToken } = require('../middleware/authenticate');

const dashboardRouter = new express.Router();

dashboardRouter.get('/', authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/homePage.html'));
});

dashboardRouter.all('/Users', authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/Users.html'));
});

dashboardRouter.all('/AddUser', authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/AddUser.html'));
});

dashboardRouter.all('/Accounts', authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/Accounts.html'));
});

dashboardRouter.all('/MyAccount', authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/MyAccount.html'));
});

dashboardRouter.all('/AddAccount', authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/AddAccount.html'));
});

dashboardRouter.all('/EditProfile', authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/EditProfile.html'));
});

dashboardRouter.all('/MyProfile', authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/MyProfile.html'));
});

dashboardRouter.get('/login', (req, res) => res.sendFile(path.join(__dirname, '../client/Login.html')));

module.exports = { dashboardRouter };
