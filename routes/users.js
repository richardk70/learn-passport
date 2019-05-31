// routes/users.js
const User = require('../models/user');

module.exports = function(app, passport) {

app.get('/', function(req, res) {
    res.render('index.html', { locals: {
        msgExists: ''
    }});
});

app.get('/register', function(req, res) {
    res.render('register.html', { locals: {
        msgExists: ''
    }});
});

app.post('/register', passport.authenticate('local-register', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/register', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

app.get('/login', function(req, res) {
    res.render('login.html', { locals: {
        msgExists: ''
    }});
});

app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile',
        failureRedirect : '/login',
        failureFlash : true
    }));

app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.html', { locals: {
        msgExists: '',
        name: req.user.name,
        email: req.user.email
    }});
});

app.get('/users', isLoggedIn, async function(req, res) {
    try {
        let users = await User.find({});
        if (!users)
            return res.status(404).send(e);

        res.render('users.html', { locals: {
            users: users
        }})
    } catch (e) {
        res.status(500).send(e);
    }
  });

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

};


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    // otherwise return to home page
    res.render('index', { locals: {
        msgExists: 'Must be logged in'
    }});
}