const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    employeeId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    employeeName: { type: String, default: '' },
    date:         { type: String, required: true },
    status:       { type: String, default: 'Present' },  // Present|Absent|Half Day|Holiday
    notes:        { type: String, default: '' }
}, { timestamps: true });

// Prevent duplicate attendance for same employee + date
AttendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);