const express  = require('express');
const router   = express.Router();
const Customer = require('../models/Customer');

router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find().sort({ createdAt: -1 });
        res.json(customers);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
    try {
        // Prevent duplicate by name (case-insensitive)
        const existing = await Customer.findOne({ name: new RegExp('^' + req.body.name + '$', 'i') });
        if (existing) return res.status(409).json({ error: 'Customer already exists' });

        const customer = new Customer(req.body);
        await customer.save();
        res.status(201).json(customer);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
    try {
        const updated = await Customer.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.json(updated);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
    try {
        await Customer.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;