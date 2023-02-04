const lessonsModel = require("../models/lessonsModel");
const coursesModel = require("../models/coursesModel");
const courseAssignModel = require('../models/courseAssignModel');

var validator = require('validator');
var moment = require('moment');

exports.getAll = async (req, res, next) => 
{ 
    let user = req.session.user;
    res.locals.url = req.url;
    
    await lessonsModel.getCourses().then(records => 
    {
        res.locals.url = req.url;
        res.render('lessons/all', {user:user,title:'Lessons',page_title:'Lessons',records:records});    

    }).catch(err => {
        var error = err.message;
        var message = '';
        delete req.session.error;
        delete req.session.success;
        res.locals.message = '';
        res.locals.error = '';
        if (error) res.locals.error = error;
        if (message) res.locals.message = message;
        
        // moment for frontend date formatting
        res.locals.moment = moment;
        res.render('lessons/all', {user:user,title:'Lessons',page_title:'Lessons',records:[]});
    });
}

exports.saveLesson = async (req, res, next) => 
{
    if( !validator.isEmpty(req.params.course_id)
        && !validator.isEmpty(req.body.name)
        && !validator.isEmpty(req.body.description) )   
    {
        await lessonsModel.saveLesson(req).then(response => 
        {
            res.json({error:0, message:response});

        }).catch(err => {
            res.json({error:1, message:err.message});
        });
    }
    else
    {
        res.json({error:1, message:"Invalid data"});
    }    
}

exports.viewLesson = async (req, res, next) => 
{
    let user = req.session.user;
    res.locals.url = req.url;
    try{
        let lesson = await lessonsModel.getLessonById(req.params.lesson_id);
        let course = await coursesModel.getCourse(lesson.course_id);
        let lessonStatus = await lessonsModel.StudentLessonStatus(course.id, user.id, req.params.lesson_id);
        if( user.type == 'Student' )
        {
            let course_assigned = await courseAssignModel.getCourseAssigned(user.id, course.id);
            if( course.status == 'Assigned' )
            {
                req.session.error = 'Please accept the course before accessing lessions.';
                req.session.success = '';
                res.redirect('/courses/view/'+course.id);
            }
        }
        
        res.render('lessons/view', {user:user,title:'Lessons',page_title:'Lessons',course:course,lesson:lesson,lesson_status:lessonStatus});  
        
    } catch (err){
        req.session.error = err.message;
        req.session.success = '';
        res.redirect('/');
    }
}

exports.editLesson = async (req, res, next) => 
{
    let user = req.session.user;
    res.locals.url = req.url;
    await coursesModel.getCourse(req.params.id).then(course => 
    {
        res.render('lessons/edit', {user:user,title:'Edit Course',page_title:'Courses',record:course});   

    }).catch(err => {
        req.session.error = err.message;
        req.session.success = '';
        res.redirect('/lessons');
    });
}

exports.updateLesson = async (req, res, next) => 
{
    if( !validator.isEmpty(req.body.course_code)
        && !validator.isEmpty(req.body.name)
        && !validator.isEmpty(req.body.type) )   
    {
        await coursesModel.updateCourse(req).then(response => 
        {
            req.session.error = '';
            req.session.success = response;
            res.redirect('/lessons');

        }).catch(err => {
            req.session.error = err.message;
            req.session.success = '';
            res.redirect('/lessons/edit/'+req.params.id);
        });
    }
    else
    {
        req.session.error = 'Invalid data';
        req.session.success = '';
        res.redirect('/lessons/edit/'+req.params.id);
    }    
}

exports.deleteLesson = async (req, res, next) => 
{
    if( !validator.isEmpty(req.params.id) )   
    {
        await coursesModel.deleteCourse(req.params.id).then(response => 
        {
            req.session.error = '';
            req.session.success = response;
            res.redirect('/lessons');

        }).catch(err => {
            req.session.error = err.message;
            req.session.success = '';
            res.redirect('/lessons/edit/'+req.params.id);
        });
    }
    else
    {
        req.session.error = 'Invalid data';
        req.session.success = '';
        res.redirect('/lessons/edit/'+req.params.id);
    }    
}