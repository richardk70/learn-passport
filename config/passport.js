// const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/user');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

// local login
passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
},
function(req, email, password, done) {
    console.log('local-login');
    // asynchronous
    process.nextTick(function() {
        User.findOne({ email :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err)
            return done(err);
            
            // if no user is found, return the message
            if (!user)
            return done(null, false, req.flash('loginMessage', 'No user found.'));
            
            if (!user.validPassword(password))
            return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
            
            // all is well, return user
            else
            return done(null, user);
        });
    });
}));

// LOCAL register ============================================================
passport.use('local-register', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
},
function(req, email, password, done) {
    console.log('local-register');
    // asynchronous
        process.nextTick(function() {
            // if the user is not already logged in:
            if (!req.user) {
                User.findOne({ email :  email }, function(err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);
                    // check to see if theres already a user with that email
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {
                        // create the user
                        var newUser = new User();
                        newUser.name = req.body.name;
                        newUser.email    = email;
                        newUser.password = newUser.setPassword(password);

                        newUser.save(function(err) {
                            if (err)
                                return done(err);

                            return done(null, newUser);
                        });
                    }
                });
            // if the user is logged in but has no local account...
            } else {
                // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
                return done(null, req.user);
            }
        });
    }));
};