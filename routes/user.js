const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/UserModel');

// JWT Secret
const JWT_SECRET = 'your_jwt_secret'; // Replace with a secure secret

// Registration Page
router.get('/register', (req, res) => res.render('register'));

// Register User
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email: email });
    if (user) {
      res.send('Email is already registered');
    } else {
      const newUser = new User({ name, email, password });

      // Hash Password
      bcrypt.genSalt(10, async (err, salt) => {
        if (err) throw err;
        const hash = await bcrypt.hash(newUser.password, salt);
        newUser.password = hash;
        await newUser.save();

        // Create JWT Token
        const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '1h' });

        // Set JWT Token as Cookie
        res.cookie('token', token, { httpOnly: true });
        
        res.redirect('/user/dashboard'); // Redirect to dashboard
      });
    }
  } catch (error) {
    res.status(500).send('Error registering user');
  }
});

// Login Page
router.get('/login', (req, res) => res.render('login'));

// Login Handle
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) throw err;
    if (!user) {
      res.redirect('/user/login');
    } else {
      req.logIn(user, async (err) => {
        if (err) throw err;

        // Create JWT Token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

        // Set JWT Token as Cookie
        res.cookie('token', token, { httpOnly: true });

        res.redirect('/user/dashboard'); // Redirect to dashboard
      });
    }
  })(req, res, next);
});

// Logout Handle
router.get('/logout', (req, res) => {
  res.clearCookie('token'); // Clear the JWT token cookie
  req.logout(() => {
    req.flash('success_msg', 'You are logged out');
    res.redirect('/user/login');
  });
});

// Dashboard Page (Protected)
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
    
    res.render('dashboard', { user });
  } catch (err) {
    res.redirect('/user/login');
  }
});

module.exports = router;
