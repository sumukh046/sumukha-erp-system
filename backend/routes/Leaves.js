const express  = require('express');
const router   = express.Router();
const Leave    = require('../models/Leave');
const Employee = require('../models/Employee');

// GET all leaves
router.get('/', async (req, res) => {
    try {
        const leaves = await Leave.find().sort({ createdAt: -1 });
        res.json(leaves);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST record leave — also sets employee status to "On Leave"
router.post('/', async (req, res) => {
    try {
        const { employeeId, employeeName, type, startDate, days, reason } = req.body;

        const leave = new Leave({ employeeId, employeeName, type, startDate, days, reason });
        await leave.save();

        // Update employee status
        await Employee.findByIdAndUpdate(
            employeeId,
            { $set: { status: 'On Leave', workPlace: '' } }
        );

        res.status(201).json(leave);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE leave — restores employee status to Active
router.delete('/:id', async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id);
        if (!leave) return res.status(404).json({ error: 'Not found' });

        await Employee.findByIdAndUpdate(
            leave.employeeId,
            { $set: { status: 'Active' } }
        );

        await Leave.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;