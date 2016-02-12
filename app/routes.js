module.exports = function(app, passport) {

    //Pagina de Inicio
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    //Login
    app.get('/login', function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });
    
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile',
        failureRedirect : '/login', 
        failureFlash : true 
    }));

    //Registrarse
    app.get('/signup', function(req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });
   
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', 
        failureRedirect : '/signup', 
        failureFlash : true // nos permite mandar mensajes
    }));
    
    //Perfil
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user 
        });
    });

    //Logout
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};


// middleware para la conexion
function isLoggedIn(req, res, next) {
    // mantener la sesion
    if (req.isAuthenticated())
        return next();

    // no estan logeados
    res.redirect('/');
}