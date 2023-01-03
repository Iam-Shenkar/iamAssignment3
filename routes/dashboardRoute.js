const express = require('express');
const path = require('path');

const dashboardRouter = new express.Router();

dashboardRouter.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/homePage.html'));
});

dashboardRouter.all('/Users', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/Users.html'));
});

dashboardRouter.all('/AddUser', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/AddUser.html'));
});

dashboardRouter.all('/Accounts', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/Accounts.html'));
});

dashboardRouter.all('/MyAccount', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/MyAccount.html'));
});

dashboardRouter.all('/AddAccount', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/AddAccount.html'));
});

dashboardRouter.all('/EditProfile', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/EditProfile.html'));
});

dashboardRouter.all('/MyProfile', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/MyProfile.html'));
});

module.exports = { dashboardRouter };
