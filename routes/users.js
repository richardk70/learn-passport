// routes/users.js
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const { sendInviteEmail, sendCancelEmail } = require('../emails/account');

const User = require('../models/user');
const Task = require('../models/task');
const Message = require('../models/message');

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

// PROFILE
app.get('/profile', isLoggedIn, async function(req, res) {
    try {
        let tasks = await Task.find({ owner: req.user._id });
        
        // go through all the tasks and assign a generic task image
        for (task of tasks) {
            if (!task.photo) {
                let buffer = fs.readFileSync('./public/images/generic_task.jpg');
                task.photo = buffer;
                await task.save();
            }
        }

        if (!req.user.photo) {
            console.log('no profile photo for this user. using default...');
            // set it to the generic image
            let buffer = fs.readFileSync('./public/images/generic_profile.jpg');
            req.user.photo = buffer;
            await req.user.save();
        }

        res.render('profile.html', { locals: {
            tasks: tasks,
            msgExists: '',
            name: req.user.name,
            email: req.user.email,
            photo: req.user.photo.toString('base64')
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

app.get('/friends', async function(req, res) {
    res.render('friends.html');
});

app.post('/friends', async function(req, res) {
    //console.log(req.user); // this is the logged in user info
    let friendsToInvite = req.body;
    for (friend of friendsToInvite) {
        sendInviteEmail(friend.email, friend.name, req.user.name, req.user.email);        
    }
});

// UPDATE USER
app.patch('/users', isLoggedIn, async function(req, res) {
    let id = req.user._id;
    let password = req.body.password;
    try {
        let user = await User.findById({ _id: id });
        if (!user)
            res.status(404).send();

        user.name = req.body.name;
        if (password)
            user.password = user.setPassword(password);
        await user.save();
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

// PROFILE PHOTO FUNCTIONS
// upload profile photo
const upload = multer({
    limits: {
        fileSize: 2000000,
    },
    fileFilter(req, file, callback) {
        let temp = file.originalname.toLowerCase();
        if (!temp.match(/\.(jpg|png|jpeg)$/)) {
            // if it is not of above types
            return callback(new Error('File must be an image file.'));
        }
        if (file.fileSize > 2000000)
            return callback(new Error('File must be under 2 MB in size.'));
        // if it passes
        callback(undefined, true);
    }
});

app.post('/users/photo', isLoggedIn, upload.single('photo'), async function(req, res) {
    let buffer = await sharp(req.file.buffer).resize( { width: 200, height: 240 }).png().toBuffer();
    req.user.photo = buffer;
    await req.user.save();
    res.redirect('/profile');
}, (error, req, res, next) => {
    res.status(400).send({error:error.message});
});

app.delete('/users/photo', isLoggedIn, async function(req, res) {
    try {
        req.user.photo = undefined;
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send(e);
    }
});

app.get('/users/:id/photo', async function(req, res) {
    try {
        let user = await User.findById(req.params.id);
        if (!user || !user.photo)
            throw new Error();

        res.set('Content-Type', 'image/png');
        res.send(user.photo);
    } catch (e) {
        res.status(404).send(e);
    }
})

};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    // otherwise return to home page
    res.render('index', { locals: {
        msgExists: 'Must be logged in'
    }});
}