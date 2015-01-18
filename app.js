var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//Added:
var session = require('express-session')
var passport = require('passport');
var LocalStrategy = require('passport-local');
var User = require('./model/useraccount.js');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/toys');

passport.use(new LocalStrategy(
  function (username,password,done){
    User.findOne({username: username}, function (err,user) {
      if (err) {return done(err);}
      if (!user){
        return done(null,false);
      }
      if (!user.validPassword(password)){
        return done(null,false);
      }
      return done(null,user);
    });
  }
)

);
var routes = require('./routes/index');
var users = require('./routes/users');
var account = require('./routes/account');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//passport initialize and passport.session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/users', users);
app.use('/account', account);

//Using the sessions
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id,done){
  User.findById(id, function(err,user){
    done(err,user);
  });
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
