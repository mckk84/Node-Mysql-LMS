const coursesModel = require("../models/coursesModel");
const courseAssignModel = require("../models/courseAssignModel");
const lessonsModel = require("../models/lessonsModel");
const studentsModel = require("../models/studentsModel");
const certificatesModel = require('../models/certificatesModel');
var validator = require('validator');
var moment = require('moment');

exports.getAll = async (req, res, next) => 
{ 
    let user = req.session.user;
    res.locals.url = req.url;
    switch(req.session.user.type)
    {
        case 'Student': 
            await coursesModel.getStudentCourses(req.session.user.id).then(records => 
            {
                res.render('courses/all', {user:user,title:'Courses',page_title:'Courses',records:records});    

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

                res.render('courses/all', {user:user,title:'Courses',page_title:'Courses',records:[]}); 
            });
            break;

        case 'Instructor':
            await coursesModel.getInstructorCourses(req.session.user.id).then(records => 
            {
                res.locals.url = req.url;
                res.render('courses/all', {user:user,title:'Courses',page_title:'Courses',records:records});    

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

                res.render('courses/all', {user:user,title:'Courses',page_title:'Courses',records:[]}); 
            });
            break;
        default:
            await coursesModel.getCourses().then(records => 
            {
                res.locals.url = req.url;
                res.render('courses/all', {user:user,title:'Courses',page_title:'Courses',records:records});    

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
            });
            break;
    }
}

exports.addCourse = (req, res, next) => 
{
    let user = req.session.user;
    res.locals.url = req.url;
    res.render('courses/add', {user:user,title:'Add Course',page_title:'Courses'});    
}

exports.saveCourse = async (req, res, next) => 
{
    if( !validator.isEmpty(req.body.course_code)
        && !validator.isEmpty(req.body.name)
        && !validator.isEmpty(req.body.type) )   
    {
        await coursesModel.saveCourse(req).then(response => 
        {
            req.session.error = '';
            req.session.success = response;
            res.redirect('/courses');

        }).catch(err => {
            req.session.error = err.message;
            req.session.success = '';
            res.redirect('/courses/add');
        });
    }
    else
    {
        req.session.error = 'Invalid data';
        req.session.success = '';
        res.redirect('/courses/add');
    }    
}

exports.assignCourse = async (req, res, next) => 
{
    if( !validator.isEmpty(req.body.course_id)
        && !validator.isEmpty(req.body.student_id)
        && !validator.isEmpty(req.body.assigned_by) )   
    {
        await courseAssignModel.assignCourse(req).then(response => 
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

exports.viewCourse = async (req, res, next) => 
{
    let user = req.session.user;
    res.locals.url = req.url;
    try 
    {
        let course_student_status = "";
        let students = await studentsModel.getStudents();
        let course = await coursesModel.getCourse(req.params.id);
        let lessons = await lessonsModel.getLessons(course.id); 
        let lessons_status = await lessonsModel.getStudentLessons(course.id, user.id); 
        let course_assigned = await courseAssignModel.getStudentsAssignedCourse(course.id);
        if( user.type == 'Student' )
        {
            course_student_status = await courseAssignModel.getStudentsAssignedCourseStatus(course.id, user.id);
            certificate_student_status = await certificatesModel.getStudentCertificatesStatus(course.id, user.id);            
        }
        res.render('courses/view', {user:user,
                                    title:'Course',
                                    page_title:'Courses',
                                    record:course,
                                    lessons:lessons,
                                    students:students,
                                    course_student_status:course_student_status,
                                    lessons_status:lessons_status,
                                    students_assigned:course_assigned     
                                });   
    } catch(err) {
        req.session.error = err.message;
        req.session.success = '';
        res.redirect('/courses');
    }
}

exports.editCourse = async (req, res, next) => 
{
    let user = req.session.user;
    res.locals.url = req.url;
    await coursesModel.getCourse(req.params.id).then(course => 
    {
        res.render('courses/edit', {user:user,title:'Edit Course',page_title:'Courses',record:course});   

    }).catch(err => {
        req.session.error = err.message;
        req.session.success = '';
        res.redirect('/courses');
    });
}

exports.updateCourse = async (req, res, next) => 
{
    if( !validator.isEmpty(req.body.course_code)
        && !validator.isEmpty(req.body.name)
        && !validator.isEmpty(req.body.type) )   
    {
        await coursesModel.updateCourse(req).then(response => 
        {
            req.session.error = '';
            req.session.success = response;
            res.redirect('/courses');

        }).catch(err => {
            req.session.error = err.message;
            req.session.success = '';
            res.redirect('/courses/edit/'+req.params.id);
        });
    }
    else
    {
        req.session.error = 'Invalid data';
        req.session.success = '';
        res.redirect('/courses/edit/'+req.params.id);
    }    
}

exports.deleteCourse = async (req, res, next) => 
{
    if( !validator.isEmpty(req.params.id) )   
    {
        await coursesModel.deleteCourse(req.params.id).then(response => 
        {
            req.session.error = '';
            req.session.success = response;
            res.redirect('/courses');

        }).catch(err => {
            req.session.error = err.message;
            req.session.success = '';
            res.redirect('/courses/edit/'+req.params.id);
        });
    }
    else
    {
        req.session.error = 'Invalid data';
        req.session.success = '';
        res.redirect('/courses/edit/'+req.params.id);
    }    
}

exports.deleteAssignCourse = async (req, res, next) => 
{
    if( !validator.isEmpty(req.params.id) )   
    {
        await courseAssignModel.removeAssignCourse(req.params.id).then(response => 
        {
            req.session.error = '';
            req.session.success = response;
            res.redirect('/courses/view/'+req.params.course_id);

        }).catch(err => {
            req.session.error = err.message;
            req.session.success = '';
            res.redirect('/courses/view/'+req.params.course_id);
        });
    }
    else
    {
        req.session.error = 'Invalid data';
        req.session.success = '';
        res.redirect('/courses/view/'+req.params.course_id);
    }    
}
