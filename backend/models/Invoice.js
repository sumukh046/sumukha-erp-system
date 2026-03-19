const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    desc:   { type: String, default: '' },
    hsn:    { type: String, default: '' },
    qty:    { type: Number, default: 0 },
    rate:   { type: Number, default: 0 },
    amount: { type: Number, default: 0 }
}, { _id: false });

const InvoiceSchema = new mongoose.Schema({
    invoiceNo:    { type: String, required: true, unique: true },
    invoiceDate:  { type: String, default: '' },
    dueDate:      { type: String, default: '' },
    customerName: { type: String, default: '' },
    customerPhone:{ type: String, default: '' },
    billAddress:  { type: String, default: '' },
    billState:    { type: String, default: '' },
    taxType:      { type: String, default: 'none' },   // none | gst | cgst_sgst
    items:        { type: [ItemSchema], default: [] },
    subtotal:     { type: Number, default: 0 },
    cgst:         { type: Number, default: 0 },
    sgst:         { type: Number, default: 0 },
    gst:          { type: Number, default: 0 },
    total:        { type: Number, default: 0 },
    status:       { type: String, default: 'Pending' }  // Draft|Pending|Sent|Paid|Cancelled|Overdue
}, { timestamps: true });

module.exports = mongoose.model('Invoice', InvoiceSchema);