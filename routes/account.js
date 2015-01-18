//account routes
var express = require('express');
var User = require('../model/useraccount.js');
var bcrypt = require('bcrypt');
//Import passport
var passport = require('passport');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  if(req.user){res.render('userHome', { title: 'User account view', user: req.user});}
  else {res.redirect('/');}
});

//login page
router.get('/login', function(req, res) {
  res.render('login', { title: 'Log in view' });
});

router.post('/login', passport.authenticate('local', { successRedirect: '/',
failureRedirect: '/notauthorised',
failureFlash: true
}));

//logout page
router.get('/logout', function(req, res) {
  req.logout();
  console.log('you are logged out');
  res.redirect('/');
});


//register page
router.get('/register', function(req, res) {
  res.render('register', { title: 'register view' });
});
router.post('/register', function(req, res) {


      User.findOne({username: req.body.username}, function (err, user) {
        if (user){
          res.redirect('/account/register');
        }
        if(err){console.log('error occured'); res.redirect('/account/error');}
       if(!user) {
         bcrypt.genSalt(10,function(err,salt){
           bcrypt.hash(req.body.password,salt, function(err,hash){
         User.create({ username: req.body.username, password: hash }, function (err, user) {
           if (err) return console.log('Could not add to db');
           console.log('added to DB');
           // saved!
           res.redirect('/account/login');
         });
       });

     });
       }

  });



});



module.exports = router;
