const instructorsModel = require("../models/instructorsModel");
var validator = require('validator');
var moment = require('moment');

exports.getAll = async (req, res, next) => 
{ 
    let user = req.session.user;
    res.locals.url = req.url;
    await instructorsModel.getInstructors().then(records => 
    {
        res.render('instructors/all', {title:'Instructors',page_title:'Instructors',records:records,user:user});    

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
        res.render('instructors/all', {title:'Instructors',page_title:'Instructors',records:[],user:user}); 
    });
}

exports.addInstructor = (req, res, next) => 
{
    let user = req.session.user;
    res.locals.url = req.url;
    res.render('instructors/add', {user:user,title:'Add Instructor',page_title:'instructors'});    
}

exports.saveInstructor = async (req, res, next) => 
{
    if( validator.isEmail(req.body.email)
        && !validator.isEmpty(req.body.name)
        && !validator.isEmpty(req.body.password) )   
    {
        await instructorsModel.saveInstructor(req).then(response => 
        {
            req.session.error = '';
            req.session.success = response;
            res.redirect('/instructors');

        }).catch(err => {
            req.session.error = err.message;
            req.session.success = '';
            res.redirect('/instructors/add');
        });
    }
    else
    {
        req.session.error = 'Invalid data';
        req.session.success = '';
        res.redirect('/instructors/add');
    }    
}

exports.editInstructor = async (req, res, next) => 
{
    let user = req.session.user;
    res.locals.url = req.url;
    await instructorsModel.getInstructor(req.params.id).then(record => 
    {
        if( record.created_by == user.id )
        {
            res.render('instructors/edit', {user:user,title:'Edit Instructor',page_title:'Instructors',record:record});   
        }
        else
        {
            req.session.error = "You don't have permission.";
            req.session.success = '';
            res.redirect('/instructors');
        }
    }).catch(err => {
        req.session.error = err.message;
        req.session.success = '';
        res.redirect('/instructors');
    });
}

exports.updateInstructor = async (req, res, next) => 
{
    if( validator.isEmail(req.body.email)
        && !validator.isEmpty(req.body.name) )   
    {
        await instructorsModel.updateInstructor(req).then(response => 
        {
            req.session.error = '';
            req.session.success = response;
            res.redirect('/instructors');

        }).catch(err => {
            req.session.error = err.message;
            req.session.success = '';
            res.redirect('/instructors/edit/'+req.params.id);
        });
    }
    else
    {
        req.session.error = 'Invalid data';
        req.session.success = '';
        res.redirect('/instructors/edit/'+req.params.id);
    }    
}

exports.deleteInstructor = async (req, res, next) => 
{
    if( !validator.isEmpty(req.params.id) )   
    {
        if( req.paramsid == req.session.user.id )
        {
            await instructorsModel.deleteInstructor(req.params.id).then(response => 
            {
                req.session.error = '';
                req.session.success = response;
                res.redirect('/instructors');

            }).catch(err => {
                req.session.error = err.message;
                req.session.success = '';
                res.redirect('/instructors');
            });
        } else {

            req.session.error = "You don't have permission";
            req.session.success = '';
            res.redirect('/instructors');
        }
    }
    else
    {
        req.session.error = 'Invalid data';
        req.session.success = '';
        res.redirect('/instructors');
    }    
}