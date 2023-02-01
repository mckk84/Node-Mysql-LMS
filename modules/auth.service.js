const fs = require('fs');
const moment = require('moment');
const logfile = __dirname+"/../assets/login.json";
const logservice = require('./log.service');
const mysql = require('./mysql.service');

class auth 
{
	check = (req, res, next) => 
	{
		var error = req.session.error;
	    var message = req.session.success;
	    delete req.session.error;
	    delete req.session.success;
	    res.locals.message = '';
	    res.locals.error = '';
	    if (error) res.locals.error = error;
	    if (message) res.locals.message = message;
	    
	    // moment for frontend date formatting
	    res.locals.moment = moment;

	    if ( req.session.user ) 
	    {
	    	next();      
	    }
	    else
	    {
	    	let login = logservice.getJson();
	        if( login == false)
	        {
	            res.redirect('/login');
	        }
	        else
	        {
	            req.session.user = login;
	            next(); 
	        }
	    }
	}
}

module.exports = new auth;