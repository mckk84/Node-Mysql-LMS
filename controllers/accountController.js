const usersModel = require("../models/usersModel");
var validator = require('validator');

exports.account = async (req, res, next) => 
{ 
    await usersModel.getUser(req.session.user.id).then(userRecord => 
    {
        res.locals.url = req.url;
        res.locals.isAuth = 1;
        res.render('auth/account', {title:'Account',page_title:'Account',user:userRecord});    

    }).catch(err => {
        req.session.error = err.message;
        req.session.success = '';
        res.redirect('/account');
    });
}

exports.accountPost = async (req, res, next) => 
{ 
    if( !validator.isEmpty(req.body.name)
        && validator.isEmail(req.body.email) )   
    {
        await usersModel.saveUser(req).then(user => 
        {
            req.session.error = '';
            req.session.success = 'Account Updated';
            res.redirect('/account');

        }).catch(err => {
            req.session.error = err.message;
            req.session.success = '';
            res.redirect('/account');
        });
    }
    else
    {
        req.session.error = 'Invalid data';
        req.session.success = '';
        res.redirect('/account');
    }
}

exports.changePassword = async (req, res, next) => 
{ 
    await usersModel.getUser(req.session.user.id).then(userRecord => 
    {
        res.locals.url = req.url;
        res.locals.isAuth = 1;
        res.render('auth/change-password', {title:'Change Password',page_title:'Change Password',user:userRecord});    

    }).catch(err => {
        req.session.error = err.message;
        req.session.success = '';
        res.redirect('/change-password');
    });
}

exports.changePasswordPost = async (req, res, next) => 
{ 
    if( !validator.isEmpty(req.body.current_password)
        && !validator.isEmpty(req.body.new_password)
        && !validator.isEmpty(req.body.retype_password) )   
    {
        await usersModel.updatePassword(req).then(response => 
        {
            req.session.error = '';
            req.session.success = response;
            res.redirect('/logout');

        }).catch(err => {
            req.session.error = err.message;
            req.session.success = '';
            res.redirect('/change-password');
        });
    }
    else
    {
        req.session.error = 'Invalid data';
        req.session.success = '';
        res.redirect('/change-password');
    }
}
