const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
require('dotenv').config();

const app = express();

// ── MIDDLEWARE ──────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '20mb' }));       // 20 MB for base64 documents
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// ── ROUTES ──────────────────────────────────────────────────
app.use('/api/employees',   require('./routes/employees'));
app.use('/api/customers',   require('./routes/customers'));
app.use('/api/invoices',    require('./routes/invoices'));
app.use('/api/finance',     require('./routes/finance'));
app.use('/api/leaves',      require('./routes/leaves'));
app.use('/api/attendance',  require('./routes/attendance'));
app.use('/api/salary',      require('./routes/salary'));
app.use('/api/documents',   require('./routes/documents'));
app.use('/api/settings',    require('./routes/settings'));

// ── HEALTH CHECK ────────────────────────────────────────────
app.get('/', (req, res) => res.send('Sumukha ERP Backend Running 🚀'));

// ── CONNECT DB THEN START ───────────────────────────────────
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB Connected');
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch(err => {
        console.error('❌ MongoDB Error:', err.message);
        process.exit(1);
    });