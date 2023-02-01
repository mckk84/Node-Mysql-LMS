const express = require('express');
const moment = require('moment');
const auth = require('../modules/auth.service');

const courseController = require("../controllers/courseController");
// --------------------------------------------------------
/**
 * Certificate routes
 */
// --------------------------------------------------------

module.exports = (app) => 
{
	app.get('/courses', auth.check, courseController.getAll);

	app.get('/courses/add', auth.check, courseController.addCourse);
	app.post('/courses/add', auth.check, courseController.saveCourse);

	app.get('/courses/view/:id', auth.check, courseController.viewCourse);

	app.post('/courses/assign/:id', auth.check, courseController.assignCourse);	

	app.get('/courses/edit/:id', auth.check, courseController.editCourse);
	app.post('/courses/edit/:id', auth.check, courseController.updateCourse);	

	app.get('/courses/delete/:id', auth.check, courseController.deleteCourse);

	app.get('/courses/deleteassign/:course_id/:id', auth.check, courseController.deleteAssignCourse);
		
}