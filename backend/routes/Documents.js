const express  = require('express');
const router   = express.Router();
const Document = require('../models/document');

// GET all (optionally filter by employeeId or docType)
router.get('/', async (req, res) => {
    try {
        const filter = {};
        if (req.query.employeeId) filter.employeeId = req.query.employeeId;
        if (req.query.docType)    filter.docType = req.query.docType;
        const docs = await Document.find(filter).sort({ createdAt: -1 });
        res.json(docs);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST upload document (base64 stored in DB)
router.post('/', async (req, res) => {
    try {
        const doc = new Document(req.body);
        await doc.save();
        res.status(201).json(doc);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        await Document.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;