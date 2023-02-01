const express = require('express');
const moment = require('moment');
const auth = require('../modules/auth.service');

const lessonController = require("../controllers/lessonController");
// --------------------------------------------------------
/**
 * Certificate routes
 */
// --------------------------------------------------------

module.exports = (app) => 
{
	app.get('/lessons/:course_id', auth.check, lessonController.getAll);

	app.post('/lessons/add/:course_id', auth.check, lessonController.saveLesson);
	
	app.get('/lessons/view/:lesson_id', auth.check, lessonController.viewLesson);

	app.get('/lessons/delete/:course_id/:lesson_id', auth.check, lessonController.deleteLesson);	
	
}