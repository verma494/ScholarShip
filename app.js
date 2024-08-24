const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const mongoose = require('mongoose');
const adminRoutes = require('./routes/adminRoutes');
const cookieParser = require('cookie-parser');
const User = require('./models/UserModel');
const jwt = require('jsonwebtoken');

const app = express();

// Passport Config
require('./config/passport')(passport);


app.set('view engine', 'ejs');

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));


app.use(express.urlencoded({ extended: false }));

// Express Session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// Cookie Parser Middleware
app.use(cookieParser()); 


app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});
const dbURI = 'mongodb://127.0.0.1:27017/UserData';


mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.log('MongoDB connection error:', err));



app.get('/', (req, res) => {
  res.render('index');
});


app.use('/user', require('./routes/user'));
app.use('/admin', require('./routes/adminRoutes'));


const PORT = 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
