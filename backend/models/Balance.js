const mongoose = require('mongoose');

// Single document — we always upsert the same record with id "main"
const BalanceSchema = new mongoose.Schema({
    _id:         { type: String, default: 'main' },
    bankBalance: { type: Number, default: 0 },
    cashBalance: { type: Number, default: 0 }
});

module.exports = mongoose.model('Balance', BalanceSchema);