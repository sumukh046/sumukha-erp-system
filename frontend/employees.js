// ===============================
// EMPLOYEES — SUPPLEMENTAL HELPERS
// (Core CRUD lives in app.js)
// ===============================

// ---- VIEW EMPLOYEE PROFILE PANEL ----
// FIX 1: Panel is now injected inside the specific employee's card
// using a dedicated container per employee — not a shared section append.
function viewEmployee(id) {
    // Each card has a container: id="empPanel_<id>"
    const container = document.getElementById('empPanel_' + id);
    if (!container) return;

    // If already open for this employee — toggle closed
    if (container.children.length > 0) {
        container.innerHTML = '';
        return;
    }

    // Close any other open panels first
    document.querySelectorAll('[id^="empPanel_"]').forEach(el => {
        if (el.id !== 'empPanel_' + id) el.innerHTML = '';
    });

    getById('employees', id).then(emp => {
        if (!emp) return;

        const dark = document.body.classList.contains('dark-mode');
        const panelBg    = dark ? 'rgba(10,10,20,0.85)' : 'rgba(255,255,255,0.92)';
        const borderCol  = dark ? 'rgba(99,102,241,0.25)' : 'rgba(99,102,241,0.2)';
        const labelCol   = dark ? '#64748b' : '#94a3b8';
        const valueCol   = dark ? '#f1f5f9' : '#0f172a';
        const dividerCol = dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';

        const field = (label, value) => `
            <div style="padding:10px 0;border-bottom:1px solid ${dividerCol};">
                <div style="font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;
                    color:${labelCol};margin-bottom:4px;">${label}</div>
                <div style="font-size:13px;font-weight:500;color:${valueCol};">${escapeHtml(String(value || '—'))}</div>
            </div>`;

        const fullName = `${emp.firstName} ${emp.middleName || ''} ${emp.lastName || ''}`.trim();
        const initials = fullName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);

        container.innerHTML = `
            <div style="margin-top:14px;padding:20px 22px;
                background:${panelBg};
                border:1px solid ${borderCol};
                border-radius:14px;
                backdrop-filter:blur(12px);
                -webkit-backdrop-filter:blur(12px);
                animation:fadeup .25s ease both;">

                <!-- Header row -->
                <div style="display:flex;align-items:center;gap:14px;margin-bottom:18px;
                    padding-bottom:16px;border-bottom:1px solid ${dividerCol};">
                    <div style="width:48px;height:48px;border-radius:50%;
                        background:linear-gradient(135deg,#6366f1,#7c3aed);
                        display:flex;align-items:center;justify-content:center;
                        font-size:17px;font-weight:700;color:#fff;flex-shrink:0;">
                        ${initials}
                    </div>
                    <div>
                        <div style="font-size:15px;font-weight:700;color:${valueCol};margin-bottom:3px;">${escapeHtml(fullName)}</div>
                        <div style="font-size:12px;color:${labelCol};">${escapeHtml(emp.role || 'Employee')}</div>
                    </div>
                    <button onclick="viewEmployee('${id}')"
                        style="margin-left:auto;width:28px;height:28px;border-radius:8px;border:none;
                        background:rgba(220,38,38,0.1);color:#ef4444;font-size:14px;
                        cursor:pointer;display:flex;align-items:center;justify-content:center;">✕</button>
                </div>

                <!-- Fields grid -->
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:0 24px;">
                    ${field('Age', emp.age)}
                    ${field('Gender', emp.gender)}
                    ${field('Mobile', emp.mobile)}
                    ${field('Guardian Phone', emp.guardianPhone)}
                    ${field('Languages', emp.languages)}
                    ${field('Native Place', emp.nativePlace)}
                    ${field('Aadhar Number', emp.aadhar)}
                    ${field('Aadhar Verified', emp.aadharVerified || 'No')}
                    ${field('Status', emp.status)}
                    ${field('Working At', emp.workPlace)}
                </div>
                ${emp.address ? `
                <div style="padding:10px 0;margin-top:0;">
                    <div style="font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;
                        color:${labelCol};margin-bottom:4px;">Address</div>
                    <div style="font-size:13px;font-weight:500;color:${valueCol};line-height:1.6;">
                        ${escapeHtml(emp.address)}</div>
                </div>` : ''}
            </div>`;
    });
}

// ---- DELETE EMPLOYEE ----
async function deleteEmployee(id) {
    if (!confirm('Delete this employee? This cannot be undone.')) return;
    try {
        await deleteItem('employees', id);
        showNotification('🗑 Employee deleted', 'warning');
        loadEmployees();
        loadStatusTable();
        updateDashboard();
    } catch (err) { showNotification('❌ Failed to delete employee', 'warning'); }
}

// ---- DOWNLOAD SINGLE EMPLOYEE PDF — TEAL EXECUTIVE ----
function downloadSingleEmployee(id) {
    getById('employees', id).then(emp => {
        if (!emp) { showNotification('❌ Employee not found', 'warning'); return; }
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ unit: 'mm', format: 'a4' });
        const W = 210, H = 297;

        // ── Background ──────────────────────────────────────────
        doc.setFillColor(240, 253, 250);
        doc.rect(0, 0, W, H, 'F');

        // ── Top header ──────────────────────────────────────────
        doc.setFillColor(15, 76, 65);
        doc.rect(0, 0, W, 100, 'F');

        // Diagonal slice bottom of header
        doc.setFillColor(10, 56, 48);
        doc.triangle(0, 100, W, 72, W, 100, 'F');

        // Top accent bar
        doc.setFillColor(20, 184, 166);
        doc.rect(0, 0, W, 4, 'F');

        // ── Logo as watermark in center of page ─────────────────
        // Convert logo to base64 first via canvas trick
        const addLogoWatermark = (logoDataUrl) => {

            // Watermark — centered, low opacity via canvas manipulation
            // We draw it large and faded in the middle of the page
            try {
                doc.saveGraphicsState();
                // jsPDF doesn't support native opacity for images,
                // so we use a GState with transparency
                const gState = new doc.GState({ opacity: 0.07 });
                doc.setGState(gState);
                doc.addImage(logoDataUrl, 'PNG', 45, 100, 120, 50, '', 'NONE', 0);
                doc.restoreGraphicsState();
            } catch(e) {
                // fallback — skip watermark silently
            }

            buildPDF(logoDataUrl);
        };

        // Load logo from same directory
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width  = img.naturalWidth  || img.width;
            canvas.height = img.naturalHeight || img.height;
            const ctx2 = canvas.getContext('2d');
            ctx2.drawImage(img, 0, 0);
            const dataUrl = canvas.toDataURL('image/png');
            addLogoWatermark(dataUrl);
        };
        img.onerror = function() {
            // Logo failed to load — build PDF without watermark
            buildPDF(null);
        };
        img.src = 'logo.png';

        function buildPDF(logoDataUrl) {

            // ── Re-draw background & header (fresh page) ──────────
            doc.setFillColor(240, 253, 250);
            doc.rect(0, 0, W, H, 'F');

            // ── Watermark — drawn first so everything sits on top ──
            if (logoDataUrl) {
                try {
                    doc.saveGraphicsState();
                    const gState = new doc.GState({ opacity: 0.06 });
                    doc.setGState(gState);
                    // Large centered watermark
                    doc.addImage(logoDataUrl, 'PNG', 40, 108, 130, 55, '', 'NONE', 0);
                    doc.restoreGraphicsState();
                } catch(e) {}
            }

            // ── Header block ───────────────────────────────────────
            doc.setFillColor(15, 76, 65);
            doc.rect(0, 0, W, 100, 'F');
            doc.setFillColor(10, 56, 48);
            doc.triangle(0, 100, W, 72, W, 100, 'F');
            doc.setFillColor(20, 184, 166);
            doc.rect(0, 0, W, 4, 'F');

            // Company name
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(15);
            doc.setFont(undefined, 'bold');
            doc.text('SUMUKHA FACILITATORS PVT LTD', W / 2, 24, { align: 'center' });

            // Divider in header
            doc.setDrawColor(20, 184, 166);
            doc.setLineWidth(0.4);
            doc.line(25, 30, W - 25, 30);

            // Address
            doc.setFontSize(8);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(153, 246, 228);
            doc.text('No. 477, 45th Cross Rd, 8th Block, Jayanagar, Bengaluru, Karnataka 560070', W / 2, 38, { align: 'center' });
            doc.text('sumukha.gmn@gmail.com  |  +91 9880024265  |  www.homenursingservices.in', W / 2, 45, { align: 'center' });

            // Report badge
            doc.setFillColor(20, 184, 166);
            doc.roundedRect(W / 2 - 28, 50, 56, 12, 6, 6, 'F');
            doc.setTextColor(15, 76, 65);
            doc.setFontSize(7);
            doc.setFont(undefined, 'bold');
            doc.text('EMPLOYEE PROFILE', W / 2, 57.5, { align: 'center' });

            // ── Avatar ──────────────────────────────────────────────
            const fullName = `${emp.firstName} ${emp.middleName || ''} ${emp.lastName || ''}`.trim();
            const initials = fullName.split(' ').filter(Boolean).map(w => w[0]).join('').toUpperCase().slice(0, 2);

            doc.setFillColor(204, 251, 241);
            doc.circle(W / 2, 80, 16, 'F');
            doc.setDrawColor(20, 184, 166);
            doc.setLineWidth(1);
            doc.circle(W / 2, 80, 16, 'S');
            doc.setTextColor(15, 76, 65);
            doc.setFontSize(13);
            doc.setFont(undefined, 'bold');
            doc.text(initials, W / 2, 84, { align: 'center' });

            // ── Name & role ─────────────────────────────────────────
            doc.setTextColor(15, 23, 42);
            doc.setFontSize(16);
            doc.setFont(undefined, 'bold');
            doc.text(fullName, W / 2, 108, { align: 'center' });

            doc.setFontSize(8);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(15, 118, 110);
            doc.text((emp.role || 'Employee').toUpperCase(), W / 2, 115, { align: 'center' });

            // Teal divider under name
            doc.setDrawColor(153, 246, 228);
            doc.setLineWidth(0.8);
            doc.line(25, 120, W - 25, 120);

            // ── Section helper functions ────────────────────────────
            function sectionHeader(title, y) {
                doc.setFillColor(15, 76, 65);
                doc.roundedRect(14, y, W - 28, 11, 2, 2, 'F');
                doc.setTextColor(20, 184, 166);
                doc.setFontSize(7);
                doc.setFont(undefined, 'bold');
                doc.text(title, 20, y + 7.5);
                return y + 16;
            }

            function fieldBox(label, value, x, y, w) {
                doc.setFillColor(255, 255, 255);
                doc.roundedRect(x, y, w, 16, 2, 2, 'F');
                doc.setDrawColor(204, 251, 241);
                doc.setLineWidth(0.3);
                doc.roundedRect(x, y, w, 16, 2, 2, 'S');
                doc.setTextColor(94, 234, 212);
                doc.setFontSize(6);
                doc.setFont(undefined, 'bold');
                doc.text(String(label).toUpperCase(), x + 3, y + 5.5);
                doc.setTextColor(15, 23, 42);
                doc.setFontSize(8.5);
                doc.setFont(undefined, 'bold');
                const val = String(value || '—');
                doc.text(val.length > 30 ? val.slice(0, 28) + '…' : val, x + 3, y + 12.5);
            }

            const half = (W - 28 - 5) / 2;
            const lx = 14, rx = 14 + half + 5;
            let y = 126;

            // ── Personal Information ────────────────────────────────
            y = sectionHeader('PERSONAL INFORMATION', y);
            fieldBox('Full Name', fullName, lx, y, W - 28);
            y += 20;
            fieldBox('Age', emp.age, lx, y, half);
            fieldBox('Gender', emp.gender, rx, y, half);
            y += 20;
            fieldBox('Mobile', emp.mobile, lx, y, half);
            fieldBox('Guardian Phone', emp.guardianPhone, rx, y, half);
            y += 20;
            fieldBox('Languages', emp.languages, lx, y, half);
            fieldBox('Native Place', emp.nativePlace, rx, y, half);
            y += 24;

            // ── Work Details ────────────────────────────────────────
            y = sectionHeader('WORK DETAILS', y);
            fieldBox('Role / Designation', emp.role, lx, y, half);
            fieldBox('Currently Working At', emp.workPlace, rx, y, half);
            y += 24;

            // ── Identity ────────────────────────────────────────────
            y = sectionHeader('IDENTITY & VERIFICATION', y);
            fieldBox('Aadhar Number', emp.aadhar, lx, y, half);
            fieldBox('Aadhar Verified', emp.aadharVerified || 'No', rx, y, half);
            y += 24;

            // ── Address ─────────────────────────────────────────────
            if (emp.address) {
                y = sectionHeader('ADDRESS', y);
                doc.setFillColor(255, 255, 255);
                doc.roundedRect(lx, y, W - 28, 18, 2, 2, 'F');
                doc.setDrawColor(204, 251, 241);
                doc.setLineWidth(0.3);
                doc.roundedRect(lx, y, W - 28, 18, 2, 2, 'S');
                doc.setTextColor(94, 234, 212);
                doc.setFontSize(6);
                doc.setFont(undefined, 'bold');
                doc.text('RESIDENTIAL ADDRESS', lx + 3, y + 5.5);
                doc.setTextColor(15, 23, 42);
                doc.setFontSize(8.5);
                doc.setFont(undefined, 'bold');
                const addrLines = doc.splitTextToSize(emp.address, W - 34);
                doc.text(addrLines.slice(0, 2), lx + 3, y + 13);
                y += 24;
            }

            // ── Signature block ─────────────────────────────────────
            const sigY = H - 42;
            doc.setFillColor(255, 255, 255);
            doc.roundedRect(14, sigY, W - 28, 26, 3, 3, 'F');
            doc.setDrawColor(204, 251, 241);
            doc.setLineWidth(0.4);
            doc.roundedRect(14, sigY, W - 28, 26, 3, 3, 'S');

            doc.setDrawColor(20, 184, 166);
            doc.setLineWidth(0.5);
            doc.line(26, sigY + 19, 86, sigY + 19);
            doc.line(124, sigY + 19, 184, sigY + 19);

            doc.setTextColor(15, 23, 42);
            doc.setFontSize(7.5);
            doc.setFont(undefined, 'bold');
            doc.text(fullName, 56, sigY + 10, { align: 'center' });
            doc.text('Sumukha Facilitators Pvt Ltd', 154, sigY + 10, { align: 'center' });

            doc.setTextColor(148, 163, 184);
            doc.setFontSize(6.5);
            doc.setFont(undefined, 'normal');
            doc.text('Employee Signature', 56, sigY + 24, { align: 'center' });
            doc.text('Authorized Signatory', 154, sigY + 24, { align: 'center' });

            // Confidential watermark text
            doc.setTextColor(203, 213, 225);
            doc.setFontSize(7);
            doc.text('', W / 2, sigY - 6, { align: 'center' });

            // ── Footer ──────────────────────────────────────────────
            doc.setFillColor(15, 76, 65);
            doc.rect(0, H - 12, W, 12, 'F');
            doc.setFillColor(20, 184, 166);
            doc.rect(0, H - 12, W, 3, 'F');
            doc.setTextColor(153, 246, 228);
            doc.setFontSize(6.5);
            doc.setFont(undefined, 'normal');
            doc.text('Sumukha ERP v2.0  ·  Confidential  ·  System Generated Document', W / 2, H - 4, { align: 'center' });
            const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
            doc.text(dateStr, W - 14, H - 4, { align: 'right' });

            doc.save(`${emp.firstName}_${emp.lastName || ''}_Profile.pdf`);
        }

    }).catch(() => showNotification('❌ Failed to generate PDF', 'warning'));
}