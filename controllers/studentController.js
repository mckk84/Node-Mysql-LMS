const studentsModel = require("../models/studentsModel");
const courseAssignModel = require("../models/courseAssignModel");
const lessonsModel = require("../models/lessonsModel");
const certificatesModel = require('../models/certificatesModel');
const coursesModel = require('../models/coursesModel');

var validator = require('validator');
var moment = require('moment');

exports.getAll = async (req, res, next) => 
{ 
    let user = req.session.user;
    res.locals.url = req.url;
    await studentsModel.getStudents().then(records => 
    {
        res.render('students/all', {title:'Students',page_title:'Students',records:records,user:user});    

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
        res.render('students/all', {title:'Students',page_title:'Students',records:[],user:user}); 
    });
}

exports.addStudent = (req, res, next) => 
{
    let user = req.session.user;
    res.locals.url = req.url;
    res.render('students/add', {user:user,title:'Add Student',page_title:'students'});    
}

exports.saveStudent = async (req, res, next) => 
{
    if( validator.isEmail(req.body.email)
        && !validator.isEmpty(req.body.name)
        && !validator.isEmpty(req.body.password) )   
    {
        await studentsModel.saveStudent(req).then(response => 
        {
            req.session.error = '';
            req.session.success = response;
            res.redirect('/students');

        }).catch(err => {
            req.session.error = err.message;
            req.session.success = '';
            res.redirect('/students/add');
        });
    }
    else
    {
        req.session.error = 'Invalid data';
        req.session.success = '';
        res.redirect('/students/add');
    }    
}

exports.editStudent = async (req, res, next) => 
{
    let user = req.session.user;
    res.locals.url = req.url;
    await studentsModel.getStudent(req.params.id).then(student => 
    {
        if( student.created_by == user.id )
        {
            res.render('students/edit', {user:user,title:'Edit Student',page_title:'Students',record:student});   
        }
        else
        {
            req.session.error = "You don't have permission.";
            req.session.success = '';
            res.redirect('/students');
        }
    }).catch(err => {
        req.session.error = err.message;
        req.session.success = '';
        res.redirect('/students');
    });
}

exports.updateStudent = async (req, res, next) => 
{
    if( validator.isEmail(req.body.email)
        && !validator.isEmpty(req.body.name) )   
    {
        await studentsModel.updateStudent(req).then(response => 
        {
            req.session.error = '';
            req.session.success = response;
            res.redirect('/students');

        }).catch(err => {
            req.session.error = err.message;
            req.session.success = '';
            res.redirect('/students/edit/'+req.params.id);
        });
    }
    else
    {
        req.session.error = 'Invalid data';
        req.session.success = '';
        res.redirect('/students/edit/'+req.params.id);
    }    
}

exports.deleteStudent = async (req, res, next) => 
{
    if( !validator.isEmpty(req.params.id) )   
    {
        if( req.paramsid == req.session.user.id )
        {
            await studentsModel.deleteStudent(req.params.id).then(response => 
            {
                req.session.error = '';
                req.session.success = response;
                res.redirect('/students');

            }).catch(err => {
                req.session.error = err.message;
                req.session.success = '';
                res.redirect('/students');
            });
        } else {

            req.session.error = "You don't have permission";
            req.session.success = '';
            res.redirect('/students');
        }
    }
    else
    {
        req.session.error = 'Invalid data';
        req.session.success = '';
        res.redirect('/students');
    }    
}

exports.assignedCourses = async (req, res, next) => 
{
    if( !validator.isEmpty(req.params.id) )   
    {
        await courseAssignModel.courseAssigned(req.params.id).then(response => 
        {
            res.json({error:0, count:response});

        }).catch(err => {
            res.json({error:1, count:err.message});
        });
    }
    else
    {
        res.json({error:1, count:'Invalid data'});
    }    
}

exports.acceptedCourses = async (req, res, next) => 
{
    if( !validator.isEmpty(req.params.id) )   
    {
        await courseAssignModel.courseAccepted(req.params.id).then(response => 
        {
            res.json({error:0, count:response});

        }).catch(err => {
            res.json({error:1, count:err.message});
        });
    }
    else
    {
        res.json({error:1, count:'Invalid data'});
    }    
}

exports.completedCourses = async (req, res, next) => 
{
    if( !validator.isEmpty(req.params.id) )   
    {
        await courseAssignModel.courseCompleted(req.params.id).then(response => 
        {
            res.json({error:0, count:response});

        }).catch(err => {
            res.json({error:1, count:err.message});
        });
    }
    else
    {
        res.json({error:1, count:'Invalid data'});
    }    
}

exports.actionCourse = async(req, res, next) => 
{
    if( !validator.isEmpty(req.body.course) 
        && !validator.isEmpty(req.body.student) )   
    {
        await courseAssignModel.actionCourse(req).then(response => 
        {
            res.json({error:0, message:response});

        }).catch(err => {
            res.json({error:1, message:err.message});
        });
    }
    else
    {
        res.json({error:1, count:'Invalid data'});
    } 
}

exports.completedLesson = async (req, res, next) => 
{
    if( !validator.isEmpty(req.body.course)
        && !validator.isEmpty(req.body.student)
        && !validator.isEmpty(req.body.lesson)
        && !validator.isEmpty(req.body.status) )   
    {
        await lessonsModel.lessonCompleted(req.body.course, req.body.lesson, req.body.student, req.body.status).then(response => 
        {
            res.json({error:0, message:response});

        }).catch(err => {
            res.json({error:1, message:err.message});
        });
    }
    else
    {
        res.json({error:1, count:'Invalid data'});
    }    
}

exports.actionCertificate = async(req, res, next) => 
{
    if( !validator.isEmpty(req.body.course)
        && !validator.isEmpty(req.body.student)
        && !validator.isEmpty(req.body.status) )   
    {
        let course_assigned = await courseAssignModel.getCourseAssigned(req.body.student, req.body.course);
        await certificatesModel.studentAction(req, course_assigned.assigned_by).then(response => 
        {
            res.json({error:0, message:response});
        }).catch(err => {
            res.json({error:1, message:err.message});
        });
    }
    else
    {
        res.json({error:1, count:'Invalid data'});
    }
}