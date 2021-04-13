const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/User');
const requirementForm = require('../models/requirementForm');
const { forwardAuthenticated } = require('../config/auth');
const multer = require('multer');
var nodemailer = require('nodemailer');



var storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    cb(null, "uploads/images");
  },
  filename: function (req, file, cb) {
    const extension = file.originalname.split('.');
    let filename = `${new Date().getTime()}.${extension[extension.length - 1]}`
    cb(null, filename)
  }
})

var upload = multer({
  storage: storage
})

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Register
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});



//submit Inquiry form

router.post('/submitInquiryForm',upload.any(),(req, res) => {
  const { name, email, profile } = req.body;
  console.log("body",req.body)
  console.log("file ",req.file)
  console.log("files ",req.files)
  debugger;
  requirementForm.create({
      name:req.body.name,
      number:req.body.number,
      profile:req.files.filename,
    })
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      port:587,
      secure:false,
      auth: {
        user: 'dev011.rejoice@gmail.com',
        pass: 'jatin123?'
      }
    });
    var mailOptions = {
      from: 'dev011.rejoice@gmail.com',
      to: 'dev020.rejoice@gmail.com',
      subject: 'Sending Email using Node.js',
      text: 'That was easy!'
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    })
    
});

module.exports = router;
