const express     = require('express');
const router      = express.Router();
const Transaction = require('../models/Transaction');
const Balance     = require('../models/Balance');

// ── BALANCE ──────────────────────────────────────

// GET balance
router.get('/balance', async (req, res) => {
    try {
        let bal = await Balance.findById('main');
        if (!bal) bal = await Balance.create({ _id: 'main', bankBalance: 0, cashBalance: 0 });
        res.json(bal);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST set opening balance (replaces current)
router.post('/balance', async (req, res) => {
    try {
        const { bankBalance, cashBalance } = req.body;
        const bal = await Balance.findByIdAndUpdate(
            'main',
            { bankBalance: parseFloat(bankBalance) || 0, cashBalance: parseFloat(cashBalance) || 0 },
            { new: true, upsert: true }
        );
        res.json(bal);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── TRANSACTIONS ─────────────────────────────────

// GET all transactions
router.get('/transactions', async (req, res) => {
    try {
        const txns = await Transaction.find().sort({ date: 1, createdAt: 1 });
        res.json(txns);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST add transaction  — also updates balance
router.post('/transactions', async (req, res) => {
    try {
        const { type, paymentMode, amount } = req.body;
        const amt = Math.round(parseFloat(amount) * 100) / 100;

        // Update balance atomically
        let balUpdate = {};
        if (type === 'credit') {
            balUpdate = paymentMode === 'cash'
                ? { $inc: { cashBalance: amt } }
                : { $inc: { bankBalance: amt } };
        } else {
            balUpdate = paymentMode === 'cash'
                ? { $inc: { cashBalance: -amt } }
                : { $inc: { bankBalance: -amt } };
        }
        await Balance.findByIdAndUpdate('main', balUpdate, { upsert: true });

        const txn = new Transaction({ ...req.body, amount: amt });
        await txn.save();
        res.status(201).json(txn);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE transaction — reverses balance effect
router.delete('/transactions/:id', async (req, res) => {
    try {
        const txn = await Transaction.findById(req.params.id);
        if (!txn) return res.status(404).json({ error: 'Not found' });

        // Reverse the balance change
        let balUpdate = {};
        if (txn.type === 'credit') {
            balUpdate = txn.paymentMode === 'cash'
                ? { $inc: { cashBalance: -txn.amount } }
                : { $inc: { bankBalance: -txn.amount } };
        } else {
            balUpdate = txn.paymentMode === 'cash'
                ? { $inc: { cashBalance: txn.amount } }
                : { $inc: { bankBalance: txn.amount } };
        }
        await Balance.findByIdAndUpdate('main', balUpdate, { upsert: true });

        await Transaction.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;