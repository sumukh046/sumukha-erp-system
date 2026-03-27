// ===============================
// EMPLOYEES — SUPPLEMENTAL HELPERS
// (Core CRUD lives in app.js)
// ===============================

// ---- VIEW EMPLOYEE PROFILE PANEL ----
function viewEmployee(id) {
    const existing = document.getElementById('employeeDetailsPanel');
    if (existing && existing.dataset.id === String(id)) { existing.remove(); return; }
    if (existing) existing.remove();

    getById('employees', id).then(emp => {
        if (!emp) return;
        const panel = document.createElement('div');
        panel.id = 'employeeDetailsPanel';
        panel.dataset.id = id;
        panel.style.cssText = 'margin-top:20px;padding:20px;background:white;border:1px solid #ccc;border-radius:8px;position:relative;';
        panel.innerHTML = `
            <button onclick="closeProfile()"
                style="position:absolute;top:10px;right:10px;background:#dc3545;color:white;border:none;padding:4px 10px;border-radius:4px;cursor:pointer;">✕</button>
            <h3 style="margin-top:0;">Employee Profile</h3>
            <p><b>Name:</b> ${escapeHtml(`${emp.firstName} ${emp.middleName || ''} ${emp.lastName || ''}`.trim())}</p>
            <p><b>Age:</b> ${escapeHtml(emp.age || '-')}</p>
            <p><b>Gender:</b> ${escapeHtml(emp.gender || '-')}</p>
            <p><b>Mobile:</b> ${escapeHtml(emp.mobile || '-')}</p>
            <p><b>Guardian Phone:</b> ${escapeHtml(emp.guardianPhone || '-')}</p>
            <p><b>Address:</b> ${escapeHtml(emp.address || '-')}</p>
            <p><b>Native Place:</b> ${escapeHtml(emp.nativePlace || '-')}</p>
            <p><b>Languages:</b> ${escapeHtml(emp.languages || '-')}</p>
            <p><b>Role:</b> ${escapeHtml(emp.role || '-')}</p>
            <p><b>Aadhar:</b> ${escapeHtml(emp.aadhar || '-')}</p>
            <p><b>Aadhar Verified:</b> ${escapeHtml(emp.aadharVerified || 'No')}</p>
            <p><b>Status:</b> ${escapeHtml(emp.status || '-')}</p>
            <p><b>Working At:</b> ${escapeHtml(emp.workPlace || '-')}</p>
        `;
        const section = document.getElementById('allEmployees');
        if (section) section.appendChild(panel);
    });
}

function closeProfile() {
    const panel = document.getElementById('employeeDetailsPanel');
    if (panel) panel.remove();
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

// ---- DOWNLOAD SINGLE EMPLOYEE PDF ----
function downloadSingleEmployee(id) {
    getById('employees', id).then(emp => {
        if (!emp) { alert('Employee not found'); return; }
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Header
        doc.setFillColor(15, 32, 74);
        doc.rect(0, 0, 210, 35, 'F');
        doc.setFillColor(0, 168, 232);
        doc.rect(0, 0, 8, 297, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.setFont(undefined, 'bold');
        doc.text('SUMUKHA FACILITATORS PVT LTD', 105, 18, { align: 'center' });
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text('No. 477, 45th Cross Rd, 8th Block, Jayanagar,', 105, 26, { align: 'center' });
        doc.text('Bengaluru, Karnataka 560070', 105, 31, { align: 'center' });
        doc.setTextColor(0, 0, 0);

        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text('EMPLOYEE PROFILE REPORT', 105, 50, { align: 'center' });
        doc.setDrawColor(0, 168, 232);
        doc.setLineWidth(1);
        doc.line(60, 55, 150, 55);

        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        let y = 70;
        const leftX = 20, rightX = 90;

        const rows = [
            ['Full Name', `${emp.firstName} ${emp.middleName || ''} ${emp.lastName || ''}`.trim()],
            ['Age', emp.age || '-'],
            ['Gender', emp.gender || '-'],
            ['Mobile', emp.mobile || '-'],
            ['Guardian Phone', emp.guardianPhone || '-'],
            ['Role', emp.role || '-'],
            ['Languages', emp.languages || '-'],
            ['Native Place', emp.nativePlace || '-'],
            ['Aadhar Number', emp.aadhar || '-'],
            ['Status', emp.status || '-'],
        ];

        rows.forEach(([label, value]) => {
            doc.text(label + ':', leftX, y);
            doc.text(String(value), rightX, y);
            y += 10;
        });

        if (emp.address) {
            doc.text('Address:', leftX, y);
            const split = doc.splitTextToSize(emp.address, 100);
            doc.text(split, rightX, y);
            y += split.length * 7 + 10;
        }

        doc.line(25, 250, 85, 250);
        doc.text('Employee Signature', 25, 258);
        doc.line(125, 250, 185, 250);
        doc.text('Authorized Signatory', 125, 258);

        doc.setFontSize(9);
        doc.setTextColor(120);
        doc.text('This is a system generated document.', 105, 285, { align: 'center' });

        doc.save(`${emp.firstName}_Profile_Report.pdf`);
    }).catch(() => showNotification('❌ Failed to generate PDF', 'warning'));
}
