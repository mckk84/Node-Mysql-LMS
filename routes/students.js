const express = require('express');
const moment = require('moment');
const auth = require('../modules/auth.service');

const studentController = require("../controllers/studentController");
// --------------------------------------------------------
/**
 * Certificate routes
 */
// --------------------------------------------------------

module.exports = (app) => 
{
	app.get('/students', auth.check, studentController.getAll);

	app.get('/students/add', auth.check, studentController.addStudent);
	app.post('/students/add', auth.check, studentController.saveStudent);

	app.get('/students/edit/:id', auth.check, studentController.editStudent);
	app.post('/students/edit/:id', auth.check, studentController.updateStudent);	

	app.get('/students/delete/:id', auth.check, studentController.deleteStudent);

	app.get('/students/assigned/:id', auth.check, studentController.assignedCourses);
	app.get('/students/accepted/:id', auth.check, studentController.acceptedCourses);
	app.get('/students/completed/:id', auth.check, studentController.completedCourses);
	app.post('/students/status/course', auth.check, studentController.actionCourse);

	app.post('/students/status/lesson', auth.check, studentController.completedLesson);
	
	app.post('/students/request/certificate', auth.check, studentController.actionCertificate);

}