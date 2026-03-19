const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    name:       { type: String, required: true },
    address:    { type: String, default: '' },
    stateCode:  { type: String, default: '' },
    gst:        { type: String, default: '' },
    phone:      { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Customer', CustomerSchema);