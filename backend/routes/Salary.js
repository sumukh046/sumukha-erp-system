const express      = require('express');
const router       = express.Router();
const SalaryRecord = require('../models/Salaryrecord');
const Employee     = require('../models/Employee');

// GET all records for an employee (or all)
router.get('/', async (req, res) => {
    try {
        const filter = {};
        if (req.query.employeeId) filter.employeeId = req.query.employeeId;
        if (req.query.month)      filter.month = req.query.month;
        const records = await SalaryRecord.find(filter);
        res.json(records);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET or create a salary record for employee+month
router.get('/:employeeId/:month', async (req, res) => {
    try {
        let record = await SalaryRecord.findOne({
            employeeId: req.params.employeeId,
            month: req.params.month
        });
        if (!record) {
            record = new SalaryRecord({
                employeeId: req.params.employeeId,
                month: req.params.month,
                duties: [],
                advances: []
            });
            await record.save();
        }
        res.json(record);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST add duty to a record
router.post('/:employeeId/:month/duty', async (req, res) => {
    try {
        let record = await SalaryRecord.findOne({
            employeeId: req.params.employeeId,
            month: req.params.month
        });
        if (!record) {
            record = new SalaryRecord({
                employeeId: req.params.employeeId,
                month: req.params.month,
                duties: [],
                advances: []
            });
        }
        record.duties.push(req.body);
        await record.save();

        // Mark employee as Pending if not already Working
        const emp = await Employee.findById(req.params.employeeId);
        if (emp && emp.status !== 'Working') {
            await Employee.findByIdAndUpdate(req.params.employeeId, { $set: { status: 'Pending' } });
        }

        res.json(record);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST add advance/payment to a record
router.post('/:employeeId/:month/advance', async (req, res) => {
    try {
        const record = await SalaryRecord.findOne({
            employeeId: req.params.employeeId,
            month: req.params.month
        });
        if (!record) return res.status(404).json({ error: 'Record not found' });

        record.advances.push(req.body);
        await record.save();
        res.json(record);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT update full record (clear duties, advances, etc.)
router.put('/:employeeId/:month', async (req, res) => {
    try {
        const record = await SalaryRecord.findOneAndUpdate(
            { employeeId: req.params.employeeId, month: req.params.month },
            { $set: req.body },
            { new: true }
        );
        res.json(record);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;