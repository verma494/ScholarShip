// routes/admin.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');
const User = require('../models/UserModel');  
const router = express.Router();


router.get('/register', (req, res) => {
    res.render('admin/register');
});

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = new Admin({ username, password });
        await admin.save();
        res.redirect('/admin/login');
    } catch (err) {
        res.status(500).send('Error registering admin');
    }
});

// Admin Login
router.get('/login', (req, res) => {
    res.render('admin/login');
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(400).send('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).send('Invalid credentials');
        }

        const token = jwt.sign({ adminId: admin._id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.cookie('adminToken', token, { httpOnly: true });
        res.redirect('/admin/dashboard');
    } catch (err) {
        res.status(500).send('Error logging in admin');
    }
});

// Admin Dashboard
router.get('/dashboard', async (req, res) => {
    try {
        // Fetch all users
        const users = await User.find();
        res.render('admin/dashboard', { users });
    } catch (err) {
        res.status(500).send('Error fetching users');
    }
});

// Update User Status
router.post('/update-status/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const userId = req.params.id;
        await User.findByIdAndUpdate(userId, { status });
        res.redirect('/admin/dashboard');
    } catch (err) {
        res.status(500).send('Error updating user status');
    }
});

module.exports = router;
