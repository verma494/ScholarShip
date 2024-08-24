const mongoose = require('mongoose');

// MongoDB URI for local connection
const dbURI = 'mongodb://127.0.0.1:27017/UserData';

// Connect to MongoDB
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.log('MongoDB connection error:', err));

// Define the user schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
  // Add more fields as necessary
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
