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


const userSchema = new mongoose.Schema({
    name: String,
    fathersName: String,
    dob: String,
    phoneNumber: String,
    address: String,
    collegeName: String,
    course: String,
    collegeId: String,
    casteCertificateNumber: String,
    aadhaarNumber: String,
    incomeCertificateNumber: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// Method to mask Aadhaar number
userSchema.methods.maskAadhaar = function() {
    return this.aadhaarNumber.replace(/\d{4}$/, 'xxxx');
};

const User = mongoose.model('User', userSchema);

module.exports = User;

