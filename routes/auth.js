const express = require('express');
const authController = require("../controllers/authController");
// --------------------------------------------------------
/**
 * Auth routes - Register, Login, Logout
 */
// --------------------------------------------------------

module.exports = (app) => {

  	const checkerrors = (req, res, next) => 
	{
		var error = req.session.error;
		var message = req.session.success;
		delete req.session.error;
		delete req.session.success;
		res.locals.message = '';
		res.locals.error = '';
		if (error) res.locals.error = error;
		if (message) res.locals.message = message;
		next();
	}

	app.get('/login', checkerrors, authController.login);
	app.post('/login', authController.loginPost);

	app.get('/logout', authController.logout);

	app.get('/register', authController.register);
	app.post('/register', authController.registerPost);

}