const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    employeeId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    employeeName: { type: String, default: '' },
    docType:      { type: String, default: 'Other' },
    fileName:     { type: String, default: '' },
    fileType:     { type: String, default: '' },
    fileSize:     { type: Number, default: 0 },
    base64:       { type: String, default: '' },
    notes:        { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Document', DocumentSchema);