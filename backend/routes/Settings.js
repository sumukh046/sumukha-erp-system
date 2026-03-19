const express  = require('express');
const router   = express.Router();
const mongoose = require('mongoose');

// Single-document settings schema inline
const SettingsSchema = new mongoose.Schema({
    _id:            { type: String, default: 'main' },
    companyName:    { type: String, default: '' },
    companyAddress: { type: String, default: '' },
    companyPhone:   { type: String, default: '' },
    companyEmail:   { type: String, default: '' },
    companyGST:     { type: String, default: '' },
    invoiceCounter: { type: Number, default: 1 },
    erpPassword:    { type: String, default: 'admin123' }
});
const Settings = mongoose.model('Settings', SettingsSchema);

// GET settings
router.get('/', async (req, res) => {
    try {
        let s = await Settings.findById('main');
        if (!s) s = await Settings.create({ _id: 'main' });
        res.json(s);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT update settings
router.put('/', async (req, res) => {
    try {
        const s = await Settings.findByIdAndUpdate(
            'main',
            { $set: req.body },
            { new: true, upsert: true }
        );
        res.json(s);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
