const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/UserModel');


const JWT_SECRET = 'your_jwt_secret'; 

router.get('/register', (req, res) => res.render('register'));


router.post('/register', async (req, res) => {
    const { name, fatherName, dob, phoneNumber, address, collegeName, course, collegeId, casteCertificateNumber, aadhaarNumber, incomeCertificateNumber, email, password } = req.body;
  
    try {
      let user = await User.findOne({ email: email });
      if (user) {
        res.send('Email is already registered');
        res.redirect('/user/register');
      } else {
        const newUser = new User({ name, fatherName, dob, phoneNumber, address, collegeName, course, collegeId, casteCertificateNumber, aadhaarNumber, incomeCertificateNumber, email, password });
  
        
        bcrypt.genSalt(10, async (err, salt) => {
          if (err) throw err;
          const hash = await bcrypt.hash(newUser.password, salt);
          newUser.password = hash;
          await newUser.save();
  
          
          const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '1h' });
  
          
          res.cookie('token', token, { httpOnly: true });
          
          res.redirect('/user/dashboard'); 
        });
      }
    } catch (error) {
      res.status(500).send('Error registering user');
    }
  });
  


router.get('/login', (req, res) => res.render('login'));


router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) throw err;
    if (!user) {
      res.redirect('/user/login');
    } else {
      req.logIn(user, async (err) => {
        if (err) throw err;

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, { httpOnly: true });

        res.redirect('/user/dashboard'); 
      });
    }
  })(req, res, next);
});


router.get('/logout', (req, res) => {
  res.clearCookie('token'); 
  req.logout(() => {
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
  });
});


router.get('/dashboard', async (req, res) => {
    const token = req.cookies.token;
  
    if (!token) {
      return res.redirect('/user/login');
    }
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.id);
  
      if (!user) {
        return res.redirect('/user/login');
      }
  
     
      const maskedAadhaarNumber = user.aadhaarNumber.replace(/(\d{4})\d{4}(\d{4})/, 'xxxx78xxx');
  
      res.render('dashboard', { user: { ...user._doc, aadhaarNumber: maskedAadhaarNumber } });
    } catch (err) {
      res.redirect('/user/login');
    }
  });
  

module.exports = router;
