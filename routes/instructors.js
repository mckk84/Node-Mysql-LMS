const express = require('express');
const moment = require('moment');
const auth = require('../modules/auth.service');

const instructorController = require("../controllers/instructorController");
// --------------------------------------------------------
/**
 * Certificate routes
 */
// --------------------------------------------------------

module.exports = (app) => 
{

	app.get('/instructors', auth.check, instructorController.getAll);

	app.get('/instructors/add', auth.check, instructorController.addInstructor);
	app.post('/instructors/add', auth.check, instructorController.saveInstructor);

	app.get('/instructors/edit/:id', auth.check, instructorController.editInstructor);
	app.post('/instructors/edit/:id', auth.check, instructorController.updateInstructor);	

	app.get('/instructors/delete/:id', auth.check, instructorController.deleteInstructor);
}