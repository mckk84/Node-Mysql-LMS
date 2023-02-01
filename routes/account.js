const express = require('express');
const auth = require('../modules/auth.service');
const accountController = require("../controllers/accountController");
// --------------------------------------------------------
/**
 * Account routes
 */
// --------------------------------------------------------

module.exports = (app) => 
{
	app.get('/account', auth.check, accountController.account);
	app.post('/account', auth.check, accountController.accountPost);

	app.get('/change-password', auth.check, accountController.changePassword);
	app.post('/change-password', auth.check, accountController.changePasswordPost);

}