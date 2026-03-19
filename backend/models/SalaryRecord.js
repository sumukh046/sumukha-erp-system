const mongoose = require('mongoose');

const DutySchema = new mongoose.Schema({
    type:      { type: String },   // day | shift | month
    quantity:  { type: Number, default: 1 },
    rate:      { type: Number, default: 0 },
    date:      { type: String },
    timestamp: { type: Number },
    cleared:   { type: Boolean, default: false }
}, { _id: false });

const AdvanceSchema = new mongoose.Schema({
    amount:        { type: Number, default: 0 },
    paymentMode:   { type: String, default: '' },
    date:          { type: String },
    timestamp:     { type: Number },
    cleared:       { type: Boolean, default: false },
    isFullPayment: { type: Boolean, default: false }
}, { _id: false });

const SalaryRecordSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    month:      { type: String, required: true },   // e.g. "2026-03"
    duties:     { type: [DutySchema], default: [] },
    advances:   { type: [AdvanceSchema], default: [] }
}, { timestamps: true });

SalaryRecordSchema.index({ employeeId: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('SalaryRecord', SalaryRecordSchema);