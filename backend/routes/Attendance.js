const express    = require('express');
const router     = express.Router();
const Attendance = require('../models/Attendance');

// GET all (optionally filter by employeeId, month, status via query params)
router.get('/', async (req, res) => {
    try {
        const filter = {};
        if (req.query.employeeId) filter.employeeId = req.query.employeeId;
        if (req.query.month)      filter.date = new RegExp('^' + req.query.month);
        if (req.query.status)     filter.status = req.query.status;
        const records = await Attendance.find(filter).sort({ date: -1 });
        res.json(records);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST mark attendance — upserts (overwrite if same employee + date)
router.post('/', async (req, res) => {
    try {
        const { employeeId, date, status, notes, employeeName } = req.body;

        const record = await Attendance.findOneAndUpdate(
            { employeeId, date },
            { $set: { status, notes, employeeName } },
            { new: true, upsert: true }
        );
        res.status(201).json(record);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        await Attendance.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;