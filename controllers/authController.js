const usersModel = require("../models/usersModel");
var validator = require('validator');
const logservice = require('../modules/log.service');

exports.logout = (req, res, next) => {
    req.session.user = null;
    req.session.save(function (err) 
    {
        if (err) next(err);
        req.session.regenerate(function (err) {
            if (err) next(err)

            logservice.setJson("");

            res.redirect('/');
        })
    })
}

exports.login = (req, res, next) => 
{
    res.render('auth/login', {title: 'Login'});
}

exports.loginPost = async (req, res, next) => 
{ 
    if( validator.isEmail(req.body.email) 
        && !validator.isEmpty(req.body.password)
        && validator.isLength(req.body.password , {min:6, max:15})    
         )
    {
        await usersModel.authenticate(req).then(user => {
            req.session.user = user;
            req.session.loggedIn = true;
            req.session.error = '';
            req.session.success = 'Login Successful';
            logservice.setJson(user);
            res.redirect('/');

        }).catch(err => {
            req.session.error = err.message;
            req.session.success = '';
            res.redirect('/login');
        });
    }
    else
    {
        req.session.error = 'Invalid credentials';
        req.session.success = '';
        res.redirect('/login');
    }
}

exports.register = (req, res, next) => 
{ 
    res.locals = req.session;
    res.render('auth/register', {title:'Register'});
}

exports.registerPost = async (req, res, next) => 
{ 
    if( !validator.isEmpty(req.body.name)
        && validator.isEmail(req.body.email)
        && !validator.isEmpty(req.body.type) 
        && !validator.isEmpty(req.body.password)
        && validator.isLength(req.body.password , {min:6, max:15})    
         )
    {
        await usersModel.addUser(req).then(user => {
            req.session.error = '';
            req.session.success = 'Register Successful';
            res.redirect('/login');

        }).catch(err => {
            req.session.error = err.message;
            req.session.success = '';
            res.redirect('/register');
        });
    }
    else
    {
        req.session.error = 'Invalid entry';
        req.session.success = '';
        res.redirect('/register');
    }
}