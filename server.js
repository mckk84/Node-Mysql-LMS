// --------------------------------------------------------
/** Load environment validationResult */
// --------------------------------------------------------
require('dotenv').config(); // npm install --save dotenv

// --------------------------------------------------------
/** Import dependancies */
// --------------------------------------------------------
const path = require('path');
const jwt = require('jsonwebtoken');                  // *** use json web token
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');        // *** Use cookie parser
const expressLayouts = require('express-ejs-layouts')
var session = require('express-session');
var moment = require('moment');

// --------------------------------------------------------
/** Start Express */
// --------------------------------------------------------
const app = express();
// Check the environment
const isDevelopment  = app.get('env') !== "production";

// --------------------------------------------------------
/** Setup middleware */
// --------------------------------------------------------
app.use(cookieParser()); // *** set up cookie parser as middleware.

// Set up a static directory
app.use('/assets', express.static(path.join(__dirname, 'assets')));
// Use Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'KeyBoardCat',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge:3600000
  }
}));

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('views', path.join(__dirname, 'views'));
app.set('layout', './layouts/layout');
const logservice = require('./modules/log.service');
const auth = require('./modules/auth.service');
const mysql = require('./modules/mysql.service');
// --------------------------------------------------------
/** Set templating with handlebars */
// --------------------------------------------------------

// --------------------------------------------------------
/* Auth Routes */
// --------------------------------------------------------
require('./routes/auth')(app);

// Home
app.get('/', auth.check, (req, res) => 
{
    res.locals = req.session;
    const user = req.session.user;
    res.locals.url = req.url;
    res.render( user.type.toLowerCase()+'s/home', {title:'LMS - Home',page_title:'Home'});
});

require('./routes/account')(app);
require('./routes/students')(app);
require('./routes/instructors')(app);
require('./routes/courses')(app);
require('./routes/certificates')(app);
require('./routes/lessons')(app);

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res)
{
    res.render('404page', {title:'Not Found',page:req.originalUrl});
});

app.get('dberror', function(req, res)
{
    res.render('dberror', {title:'DB Error',page:req.originalUrl});
});

/** Start the app */
// --------------------------------------------------------

mysql.dbconnect().then(res => 
{
  app.set("port", 3000);
  app.listen(app.get("port"), () => {
    console.log('Server is running on port 3000');
  });

}).catch(err => {
    console.log('Mysql service is unavailable.');
});
