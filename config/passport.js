// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var User = require('../app/models/user');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    
    //SignUp
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        //chequear que no exista ya el correo
        User.findOne({ 'local.email' :  email }, function(err, user) {
            if (err)
                return done(err);

            if (user) {
                return done(null, false, req.flash('signupMessage', 'Ese correo ya esta registrado'));
            } else {
                var newUser = new User();
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password);

                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });    

        });

    }));

    
      //Login
    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { 
        User.findOne({ 'local.email' :  email }, function(err, user) {
            if (err)
                return done(err);
                
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No existe el Usuario.')); 

            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Contraseña Incorrcta.')); 

            return done(null, user); //todo esta bien
        });

    }));

};
  