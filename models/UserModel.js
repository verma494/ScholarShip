const mongoose = require('mongoose');





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
    },
    status: { type: String, default: 'pending' }
});

// Method to mask Aadhaar number
userSchema.methods.maskAadhaar = function() {
    return this.aadhaarNumber.replace(/\d{4}$/, 'xxxx');
};

const User = mongoose.model('User', userSchema);

module.exports = User;

