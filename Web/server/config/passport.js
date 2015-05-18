// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;

// load up the user model
var User       = require('../models/users');

// load the auth variables
var configAuth = require('./auth'); // use this one for testing

module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
        usernameField : 'user',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, user, password, done) {
        if (user)
            user = user.toLowerCase();

        process.nextTick(function() {
            User.findOne({ 'user' :  user }, function(err, user) {
                if (err)
                    return done(err);

                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.'));

                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

                else
                    return done(null, user);
            });
        });

    }));

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with user
        usernameField : 'user',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, user, password, done) {
        if (user)
            user = user.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

        // asynchronous
        process.nextTick(function() {
        console.log(user);
            // if the user is not already logged in:
	 var newUser            = new User();

                        newUser.user     = user;
                        newUser.password = newUser.generateHash(password);
       
                User.findOne({ 'user' :  user }, function(err, user) {
		    console.log(user);
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // check to see if theres already a user with that user
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That user is already taken.'));
                    } else {

                        // create the user
                       

                        newUser.save(function(err) {
                            if (err)
                                return done(err);

                            return done(null, newUser);
                        });
                    }

                });
            // if the user is logged in but has no local account...
            

        });

    }));
};
