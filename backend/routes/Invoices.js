const express = require('express');
const router  = express.Router();
const Invoice = require('../models/Invoice');

// GET all
router.get('/', async (req, res) => {
    try {
        const invoices = await Invoice.find().sort({ createdAt: -1 });
        res.json(invoices);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST create
router.post('/', async (req, res) => {
    try {
        const exists = await Invoice.findOne({ invoiceNo: req.body.invoiceNo });
        if (exists) return res.status(409).json({ error: 'Invoice number already exists' });
        const inv = new Invoice(req.body);
        await inv.save();
        res.status(201).json(inv);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT update (status, edit)
router.put('/:id', async (req, res) => {
    try {
        const updated = await Invoice.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.json(updated);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        await Invoice.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;