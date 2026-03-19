const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    firstName:      { type: String, required: true },
    middleName:     { type: String, default: '' },
    lastName:       { type: String, default: '' },
    age:            { type: String, default: '' },
    gender:         { type: String, default: '' },
    mobile:         { type: String, default: '' },
    guardianPhone:  { type: String, default: '' },
    guardianName:   { type: String, default: '' },
    nativePlace:    { type: String, default: '' },
    languages:      { type: String, default: '' },
    role:           { type: String, default: '' },
    address:        { type: String, default: '' },
    aadhar:         { type: String, default: '' },
    aadharVerified: { type: String, default: 'No' },
    aadharFile:     { type: String, default: '' },   // base64 or filename
    status:         { type: String, default: 'Active' },
    workPlace:      { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Employee', EmployeeSchema);