const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    date:        { type: String, required: true },
    type:        { type: String, enum: ['credit', 'debit'], required: true },
    paidTo:      { type: String, default: '' },
    paidToId:    { type: String, default: '' },
    category:    { type: String, default: '' },
    paymentMode: { type: String, default: '' },
    amount:      { type: Number, required: true },
    notes:       { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);