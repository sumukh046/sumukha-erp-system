const mongoose = require('mongoose');

const LeaveSchema = new mongoose.Schema({
    employeeId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    employeeName: { type: String, default: '' },
    type:         { type: String, default: 'Casual Leave' },
    startDate:    { type: String, default: '' },
    days:         { type: Number, default: 1 },
    reason:       { type: String, default: '-' }
}, { timestamps: true });

module.exports = mongoose.model('Leave', LeaveSchema);