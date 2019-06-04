const express = require('express');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const renderES6 = require('express-es6-template-engine');
const flash = require('connect-flash');
const errorhandler = require('errorhandler');

require('./config/passport')(passport);

const url = process.env.URI;
const port = process.env.PORT;

// initiate the app
const app = express();


// set template engine
app.engine('html', renderES6);
app.set('views', './views');
app.set('view engine', 'html');

// set static folder
app.use('/public', express.static(__dirname + '/public'));

// configure the app
app.use(errorhandler()); // for development only
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies for auth
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(flash());
app.use(session({ 
    secret: process.env.SECRET,
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session()); // needed if app uses persistent login sessions

// database connection
mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true });

// routes
require('./routes/users.js')(app, passport);
require('./routes/tasks.js')(app);

// listen
app.listen(port, () => {
    console.log(`Listening port ${port}...`);
});