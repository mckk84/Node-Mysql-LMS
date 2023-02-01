const express = require('express');
const moment = require('moment');
const auth = require('../modules/auth.service');

const certificateController = require("../controllers/certificateController");
// --------------------------------------------------------
/**
 * Certificate routes
 */
// --------------------------------------------------------

module.exports = (app) => 
{
	
	app.get('/certificates', auth.check, certificateController.getAll);

	app.get('/certificates/add/:id', auth.check, certificateController.addCertificate);

	app.post('/certificates/add', auth.check, certificateController.saveCertificate);

	app.get('/certificates/view/:id', auth.check, certificateController.viewCertificate);	
}