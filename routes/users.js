// routes/users.js
const User = require('../models/user');
const Task = require('../models/task');

module.exports = function(app, passport) {

app.get('/', function(req, res) {
    res.render('index.html', { locals: {
        msgExists: ''
    }});
});

app.get('/register', function(req, res) {
    res.render('register.html', { locals: {
        msgExists:  req.flash('signupMessage')
    }});
});

// CREATE
app.post('/register', passport.authenticate('local-register', {
    successRedirect : '/profile', // redirect to the secure profile section
    successFlash : true,
    failureRedirect : '/register', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

app.get('/login', function(req, res) {
    res.render('login.html', { locals: {
        msgExists: req.flash('loginMessage')
    }});
});

app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile',
    failureRedirect : '/login',
    failureFlash : true
}));

app.get('/profile', isLoggedIn, async function(req, res) {
    try {
        let tasks = await Task.find({ owner: req.user._id });
    
        res.render('profile.html', { locals: {
            tasks: tasks,
            msgExists: '',
            name: req.user.name,
            email: req.user.email
        }});
    } catch (e) {
        res.status(500).send(e);
    }
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

// UPDATE USER
app.get('/users/edit', isLoggedIn, function(req, res) {
    res.render('edit.html');
});

app.post('/users/edit', isLoggedIn, async function(req, res) {
    // console.log(req.user);
    let id = req.user._id;
    try {
        let user = await User.findById({ id });
        user.name = req.user.name;
        res.json(user);
    } catch (e) {
        res.status(500).send(e);
    }
});

// DELETE USER
app.post('/users/me', isLoggedIn, async function(req, res) {
    let id = req.user._id;
    try {
        // delete tasks for that account first
        await Task.deleteMany({ owner: id });
        // then delete the account
        await User.findByIdAndDelete(id);
        res.render('index', { locals: { msgExists: 'Account deleted.' }});
    } catch (e) {
        res.status(500).send(e);
    }
});

app.get('/logout', isLoggedIn, function(req, res) {
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