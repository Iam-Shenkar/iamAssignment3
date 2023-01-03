const express = require('express');
const path = require('path');

const dashboardRouter = new express.Router();

dashboardRouter.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/homePage.html'));
});
// dashboardRouter.all('/users', dashboardController.myUser);
// dashboardRouter.all('/addUsers', dashboardController.addUsers);
// dashboardRouter.all('/addUser', dashboardController.addUsers);
// dashboardRouter.all('/accounts', dashboardController.accounts);
// dashboardRouter.all('/addAccount', dashboardController.addAccounts);
// dashboardRouter.all('/editProfile', dashboardController.editProfile);
// dashboardRouter.all('/myProfile', dashboardController.myProfile);

module.exports = { dashboardRouter };
