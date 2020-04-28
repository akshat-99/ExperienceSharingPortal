var express = require('express');
var router = express.Router();
let User = require('../models/users');
const bcrypt = require('bcryptjs');
const passport = require('passport')


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// User register form
router.get('/register',(req,res)=>{
  res.render('user_register');
})

// Create new user
router.post('/register',(req,res)=>{
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const year = req.body.year;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody('name','Name is required').notEmpty();
  req.checkBody('email','Email is required').notEmpty();
  req.checkBody('year','Year is required').notEmpty();
  req.checkBody('email','Email is not valid').isEmail();
  req.checkBody('username','Username is required').notEmpty();
  req.checkBody('password','Password is required').notEmpty();
  req.checkBody('password2','Password do not match').equals(req.body.password);

  let errors = req.validationErrors();

  if(errors){
    res.render('user_register',{
      errors:errors
    });
  } else {
    let newUser = new User({
      name:name,
      email: email,
      username:username,
      password:password,
      year:year,
    });
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(newUser.password, salt, function(err, hash) {
        // Store hash in your password DB.
        if(err){
          console.log(err)
        }
        newUser.password = hash;
        newUser.save((err)=>{})
        if(err){

          console.log(err);
        } else {
          req.flash('success','You are now registered and can log in')
          res.redirect('/users/login')
        }

      });
    });
  }

})
// Get request for login
router.get('/login',(req,res)=>{
  res.render('user_login');
})
//Submit user login form
router.post('/login',(req,res,next)=>{
  passport.authenticate(
      'local',
      {
        successRedirect:'/',
        failureRedirect:'/users/login',
        failureFlash: true
      })(req,res,next);
});

//Logout
router.get('/logout',function (req,res) {
  req.logout();
  req.flash('success','You are logout')
  res.redirect('/')
})



module.exports = router;
