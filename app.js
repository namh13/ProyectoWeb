var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session      = require('express-session');


mongoose.connect('mongodb://localhost:27017/OK',function (err) {
    if(err){
        return console.log(err);
    }
        return console.log('Conexion Establecida');
});


require('./config/passport')(passport);

app.use(logger('dev'));
app.use(bodyParser.json()); //recolecta informacion html
app.use(cookieParser()); //para la autenticacion

// view engine setup
app.set('view engine', 'ejs');

app.use(session({ secret: 'aassdw' })); // session secret
app.use(passport.initialize()); //inciamos la sesion
app.use(passport.session()); // permanecer logeado
app.use(flash()); // mostrar mensajes

// routes 
require('./app/routes.js')(app, passport);

app.listen(port);
console.log('Localhost: ' + port);