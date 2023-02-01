const certificatesModel = require("../models/certificatesModel");
const coursesModel = require("../models/coursesModel");
const instructorsModel = require("../models/instructorsModel");
const usersModel = require("../models/usersModel");
const studentsModel = require("../models/studentsModel");
const path = require('path');
const pdf = require('../modules/pdf.service');

var validator = require('validator');
var moment = require('moment');

exports.getAll = async (req, res, next) => 
{ 
    let user = req.session.user;
    res.locals.url = req.url;
    switch(req.session.user.type)
    {
        case 'Student': 
            await certificatesModel.getStudentCertificates(req.session.user.id).then(records => 
            {
                res.render('certificates/all', {user:user,title:'Certificates',page_title:'Certificates',records:records});    

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

                res.render('certificates/all', {user:user,title:'Certificates',page_title:'Certificates',records:[]}); 
            });
            break;

        case 'Instructor':
            await certificatesModel.getInstructorCertificates(req.session.user.id).then(records => 
            {
                res.locals.url = req.url;
                res.render('certificates/all', {user:user,title:'Certificates',page_title:'Certificates',records:records});    

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

                res.render('certificates/all', {user:user,title:'Certificates',page_title:'Certificates',records:[]}); 
            });
            break;
        default:
            await certificatesModel.getCertificates(req.session.user).then(records => 
            {
                res.locals.url = req.url;
                res.render('certificates/all', {user:user,title:'Certificates',page_title:'Certificates',records:records});    

            }).catch(err => {
                req.session.error = err.message;
                req.session.success = '';
                res.redirect('/certificates/all');
            });
            break;
    }
}

exports.addCertificate = async (req, res, next) => {

    let user = req.session.user;
    res.locals.url = req.url;

    if( user.type != 'Instructor' )
    {
        req.session.error = "Access Denied";
        req.session.success = '';
        res.redirect('/certificates');
    }
    else
    {
        let certificate = await certificatesModel.getCertificate(req.params.id);
        let course = await coursesModel.getCourse(certificate.course_id);
        let student = await usersModel.getUser(certificate.student_id);

        res.render('certificates/add', {user:user,title:'Create Certificate',page_title:'Create Certificate', certificate:certificate, course:course, student:student}); 
    }
}

exports.saveCertificate = async (req, res, next) => {

    let user = req.session.user;
    res.locals.url = req.url;

    if( user.type != 'Instructor' )
    {
        req.session.error = "Access Denied";
        req.session.success = '';
        res.redirect('/certificates');
    }
    else
    {
        if( !validator.isEmpty(req.body.id)
            && !validator.isEmpty(req.body.score) )   
        {
            await certificatesModel.saveCertificate(req).then(response => 
            {
                req.session.error = '';
                req.session.success = response;
                res.redirect('/certificates');
            }).catch(err => {
                req.session.error = err.message;
                req.session.success = '';
                res.redirect('/certificates/add');
            });
        }
        else
        {
            req.session.error = 'Invalid data';
            req.session.success = '';
            res.redirect('/certificates');
        }    
    }
}

exports.viewCertificate = async (req, res, next) => {

    if( !validator.isEmpty(req.params.id) )   
    {
        try{
            let certificate = await certificatesModel.getCertificate(req.params.id);
            let student = await studentsModel.getStudent(certificate.student_id);
            let instructor = await instructorsModel.getInstructor(certificate.instructor_id);
            let course = await coursesModel.getCourse(certificate.course_id);
            
            let data = {
                    studentName:student.name, 
                    courseName:course.name, 
                    certificateScore:certificate.score, 
                    instructorName:instructor.name
                    };
            let template = path.join(__dirname, '../assets/pdf/certificate.html');   
            let pdfpath = path.join(__dirname, '../assets/pdf/certificate'+certificate.id+'.pdf');
            await pdf.generatePdf(data, template, pdfpath).then(response => {

                console.log('PDF Generated');
                res.sendFile(pdfpath);

            }).catch(err => 
            {
                req.session.error = err.message;
                req.session.success = '';
                res.redirect('/certificates');
            });
        }
        catch(err)
        {
            req.session.error = 'Certificate create error:'+err.message;
            req.session.success = '';
            res.redirect('/certificates');
        }
    }
    else
    {
        req.session.error = 'Invalid data';
        req.session.success = '';
        res.redirect('/certificates');
    } 

}