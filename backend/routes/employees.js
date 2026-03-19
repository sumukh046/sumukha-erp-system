const express = require('express');
const router  = express.Router();
const Employee = require('../models/Employee');

// GET all employees
router.get('/', async (req, res) => {
    try {
        const employees = await Employee.find().sort({ createdAt: -1 });
        res.json(employees);
    } catch (err) {
        console.error('GET /employees error:', err);
        res.status(500).json({ error: err.message });
    }
});

// GET single employee
router.get('/:id', async (req, res) => {
    try {
        const emp = await Employee.findById(req.params.id);
        if (!emp) return res.status(404).json({ error: 'Not found' });
        res.json(emp);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create employee
router.post('/', async (req, res) => {
    try {
        const emp = new Employee(req.body);
        await emp.save();
        res.status(201).json(emp);
    } catch (err) {
        console.error('POST /employees error:', err);
        res.status(500).json({ error: err.message });
    }
});

// PUT update employee — uses $set so only provided fields are changed
router.put('/:id', async (req, res) => {
    try {
        const update = {};
        const allowed = [
            'firstName','middleName','lastName','age','gender','mobile',
            'guardianPhone','guardianName','nativePlace','languages','role',
            'address','aadhar','aadharVerified','aadharFile','status','workPlace'
        ];
        allowed.forEach(field => {
            if (req.body[field] !== undefined) update[field] = req.body[field];
        });

        const updated = await Employee.findByIdAndUpdate(
            req.params.id,
            { $set: update },
            { new: true }
        );
        if (!updated) return res.status(404).json({ error: 'Employee not found' });
        res.json(updated);
    } catch (err) {
        console.error('PUT /employees/:id error:', err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE employee
router.delete('/:id', async (req, res) => {
    try {
        await Employee.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;