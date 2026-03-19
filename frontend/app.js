// ===============================
// FIREBASE SETUP
// ===============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
    getFirestore, collection, doc,
    addDoc, getDoc, getDocs, updateDoc, deleteDoc,
    query, where, orderBy, setDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBnohPOjGT5Cq1xTW0Rruxok89JwsvEyjU",
    authDomain: "sumukha-erp.firebaseapp.com",
    projectId: "sumukha-erp",
    storageBucket: "sumukha-erp.firebasestorage.app",
    messagingSenderId: "927625460940",
    appId: "1:927625460940:web:bc09a6fe6b39cc2b55d669"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// ── Firestore helpers ──────────────────────────────────────
const col  = name => collection(db, name);
const docRef = (name, id) => doc(db, name, id);

async function getAll(colName) {
    const snap = await getDocs(col(colName));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function getById(colName, id) {
    const snap = await getDoc(docRef(colName, id));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

async function addItem(colName, data) {
    data.createdAt = serverTimestamp();
    const ref = await addDoc(col(colName), data);
    return { id: ref.id, ...data };
}

async function updateItem(colName, id, data) {
    data.updatedAt = serverTimestamp();
    await updateDoc(docRef(colName, id), data);
    return { id, ...data };
}

async function deleteItem(colName, id) {
    await deleteDoc(docRef(colName, id));
}

async function queryItems(colName, field, op, value) {
    const q    = query(col(colName), where(field, op, value));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ===============================
// AUTH GUARD
// ===============================
if (localStorage.getItem('erpUser') !== 'loggedIn') {
    window.location.href = 'login.html';
}

// ===============================
// SECTION ROUTING
// ===============================
function showSection(id) {
    document.querySelectorAll('.sub-section').forEach(sec => sec.classList.remove('active'));
    if (!['addEmployee','allEmployees','employeeStatus','documentsSection'].includes(id)) {
        const empMenu = document.getElementById('employeeMenu');
        if (empMenu) empMenu.style.display = 'none';
    }
    if (!['createInvoice','allInvoices','customerSection'].includes(id)) {
        const invMenu = document.getElementById('invoiceMenu');
        if (invMenu) invMenu.style.display = 'none';
    }
    const section = document.getElementById(id);
    if (section) section.classList.add('active');

    const titles = {
        dashboard:        '🏠 Dashboard',
        addEmployee:      '➕ Add Employee',
        allEmployees:     '📋 All Employees',
        employeeStatus:   '🔄 Employee Status',
        documentsSection: '📁 Documents',
        salarySection:    '💵 Salary',
        financeSection:   '💰 Finance',
        createInvoice:    '✏️ Create Invoice',
        allInvoices:      '📄 All Invoices',
        customerSection:  '🏢 Customers',
        leaveSection:     '🗓️ Leave Management',
        attendanceSection:'📅 Attendance',
        settingsSection:  '⚙️ Settings'
    };
    const titleEl = document.getElementById('topbarTitle');
    if (titleEl && titles[id]) titleEl.textContent = titles[id];

    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('nav-active'));
    document.querySelectorAll('.nav-item').forEach(btn => {
        const oc = btn.getAttribute('onclick') || '';
        if (oc.includes("'" + id + "'") || oc.includes('"' + id + '"')) {
            btn.classList.add('nav-active');
        }
    });

    if (id === 'dashboard')         updateDashboard();
    if (id === 'allEmployees')      loadEmployees();
    if (id === 'employeeStatus')    loadStatusTable();
    if (id === 'financeSection')  { loadFinancePeopleDropdown(); refreshFinanceUI(); }
    if (id === 'salarySection') {
        loadSalaryEmployees();
        loadSalaryMonths();
        const empSel = document.getElementById('salaryEmployeeSelect');
        if (empSel) empSel.value = '';
        const sCard = document.getElementById('salarySummaryCard');
        if (sCard) sCard.style.display = 'none';
        const sLedger = document.getElementById('salaryLedgerContainer');
        if (sLedger) sLedger.style.display = 'none';
    }
    if (id === 'allInvoices')     { loadInvoiceHistory(); filterInvoices(); }
    if (id === 'customerSection') { loadCustomers(); }
    if (id === 'leaveSection')      loadLeaveTable();
    if (id === 'attendanceSection') initAttendanceSection();
    if (id === 'documentsSection')  initDocumentsSection();
    if (id === 'settingsSection') {
        loadSettings();
        const isDark = document.body.classList.contains('dark-mode');
        setTimeout(() => { document.querySelectorAll('#darkModeToggle').forEach(t => { t.checked = isDark; }); }, 50);
    }
}

// ===============================
// SIDEBAR ACCORDION
// ===============================
function toggleEmployeeMenu() {
    const empMenu = document.getElementById('employeeMenu');
    const invMenu = document.getElementById('invoiceMenu');
    if (!empMenu) return;
    if (empMenu.style.display === 'none' || empMenu.style.display === '') {
        if (invMenu) invMenu.style.display = 'none';
        empMenu.style.display = 'block';
    } else {
        empMenu.style.display = 'none';
    }
}

function toggleInvoiceMenu() {
    const empMenu = document.getElementById('employeeMenu');
    const invMenu = document.getElementById('invoiceMenu');
    if (!invMenu) return;
    if (invMenu.style.display === 'none' || invMenu.style.display === '') {
        if (empMenu) empMenu.style.display = 'none';
        invMenu.style.display = 'block';
    } else {
        invMenu.style.display = 'none';
    }
}

// ===============================
// HELPERS
// ===============================
function allowOnlyNumbers(el) {
    el.value = el.value.replace(/[^0-9]/g, '');
}

function toggleAadharUpload() {
    const fileInput = document.getElementById('aadharFile');
    const toggle    = document.getElementById('aadharToggle');
    if (!fileInput || !toggle) return;
    if (toggle.checked) {
        fileInput.style.display = 'block';
        fileInput.click();
    } else {
        fileInput.style.display = 'none';
        fileInput.value = '';
    }
}

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload  = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// ===============================
// DASHBOARD
// ===============================
async function updateDashboard() {
    try {
        const [employees, invoices, customers] = await Promise.all([
            getAll('employees'),
            getAll('invoices'),
            getAll('customers')
        ]);

        document.getElementById('dashEmp').innerText     = employees.length;
        document.getElementById('dashWorking').innerText = employees.filter(e => e.status === 'Working').length;
        document.getElementById('dashLeave').innerText   = employees.filter(e => e.status === 'On Leave').length;
        document.getElementById('dashLeft').innerText    = employees.filter(e => e.status === 'Left Company').length;

        let totalRevenue = 0, pendingAmount = 0, draftCount = 0;
        let paid = 0, pending = 0, overdue = 0, draft = 0;
        invoices.forEach(inv => {
            if (inv.status === 'Paid')    { totalRevenue += inv.total; paid += inv.total; }
            if (inv.status === 'Pending') { pendingAmount += inv.total; pending += inv.total; }
            if (inv.status === 'Overdue') { pendingAmount += inv.total; overdue += inv.total; }
            if (inv.status === 'Draft')   { draftCount++; draft += inv.total; }
        });
        document.getElementById('totalRevenue').innerText  = '₹ ' + totalRevenue.toFixed(2);
        document.getElementById('pendingAmount').innerText = '₹ ' + pendingAmount.toFixed(2);
        document.getElementById('draftCount').innerText    = draftCount;
        document.getElementById('totalInvoices').innerText = invoices.length;

        const withGST = customers.filter(c => c.gst && c.gst.trim()).length;
        document.getElementById('totalCustomers').innerText    = customers.length;
        document.getElementById('customersWithGST').innerText  = withGST;
        document.getElementById('customersWithoutGST').innerText = customers.length - withGST;

        const revByCustomer = {};
        invoices.forEach(inv => {
            if (inv.status === 'Paid' && inv.customerName) {
                revByCustomer[inv.customerName] = (revByCustomer[inv.customerName] || 0) + inv.total;
            }
        });
        let topCustomer = '-', topRevenue2 = 0;
        for (let name in revByCustomer) {
            if (revByCustomer[name] > topRevenue2) { topRevenue2 = revByCustomer[name]; topCustomer = name; }
        }
        document.getElementById('topCustomer').innerText        = topCustomer;
        document.getElementById('topCustomerRevenue').innerText = '₹ ' + topRevenue2.toFixed(2);

        const ctx = document.getElementById('revenueChart');
        if (ctx) {
            if (window.revenueChartInstance) window.revenueChartInstance.destroy();
            const isDark = document.body.classList.contains('dark-mode');
            window.revenueChartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Paid', 'Pending', 'Overdue', 'Draft'],
                    datasets: [{ label: 'Amount ₹', data: [paid, pending, overdue, draft],
                        backgroundColor: ['#4CAF50', '#FFB300', '#E53935', '#757575'] }]
                },
                options: {
                    plugins: { legend: { labels: { color: isDark ? '#fff' : '#000' } } },
                    scales: {
                        x: { ticks: { color: isDark ? '#fff' : '#000' }, grid: { color: isDark ? '#444' : '#ddd' } },
                        y: { ticks: { color: isDark ? '#fff' : '#000' }, grid: { color: isDark ? '#444' : '#ddd' } }
                    }
                }
            });
        }
    } catch (err) { console.error('Dashboard error:', err); }
}

// ===============================
// EMPLOYEES — ADD
// ===============================
async function addEmployee() {
    const firstName = document.getElementById('firstName').value.trim();
    if (!firstName) { alert('First Name is required'); return; }

    const fileInput = document.getElementById('aadharFile');
    let aadharFile  = '';
    if (fileInput && fileInput.files[0]) {
        aadharFile = await toBase64(fileInput.files[0]);
    }

    const payload = {
        firstName,
        middleName:     document.getElementById('middleName').value.trim(),
        lastName:       document.getElementById('lastName').value.trim(),
        age:            document.getElementById('age').value.trim(),
        gender:         document.getElementById('gender').value,
        mobile:         document.getElementById('mobile').value.trim(),
        guardianPhone:  document.getElementById('guardianPhone').value.trim(),
        guardianName:   document.getElementById('guardianName').value.trim(),
        nativePlace:    document.getElementById('nativePlace').value.trim(),
        languages:      document.getElementById('languages').value.trim(),
        role:           document.getElementById('role').value,
        address:        document.getElementById('address').value.trim(),
        aadhar:         document.getElementById('aadhar').value.trim(),
        aadharVerified: document.getElementById('aadharVerified').value,
        aadharFile,
        status: 'Active',
        workPlace: ''
    };

    try {
        const newEmp = await addItem('employees', payload);

        // Also save aadhar file to documents collection
        if (aadharFile && fileInput && fileInput.files[0]) {
            const file = fileInput.files[0];
            await addItem('documents', {
                employeeId:   newEmp.id,
                employeeName: `${newEmp.firstName} ${newEmp.lastName || ''}`.trim(),
                docType:      'Aadhar Card',
                fileName:     file.name,
                fileType:     file.type,
                fileSize:     file.size,
                base64:       aadharFile,
                notes:        'Uploaded during employee registration'
            });
        }

        showNotification('✅ Employee added successfully', 'success');
        ['firstName','middleName','lastName','age','mobile','guardianPhone',
         'guardianName','nativePlace','languages','address','aadhar'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        document.getElementById('gender').value = '';
        document.getElementById('role').value   = '';
        document.getElementById('aadharVerified').value = 'No';
        if (fileInput) fileInput.value = '';
    } catch (err) {
        console.error(err);
        showNotification('❌ Failed to add employee', 'warning');
    }
}

// ===============================
// EMPLOYEES — LIST
// ===============================
async function loadEmployees() {
    const tbody = document.getElementById('employeeTableBody');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#888;padding:20px;">Loading...</td></tr>';
    try {
        const employees = await getAll('employees');
        tbody.innerHTML = '';
        if (employees.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#888;padding:20px;">No employees found.</td></tr>';
            return;
        }
        employees.forEach(emp => {
            tbody.innerHTML += `
                <tr>
                    <td>${emp.firstName}</td>
                    <td>${emp.lastName || '-'}</td>
                    <td>${emp.role || '-'}</td>
                    <td>${emp.mobile || '-'}</td>
                    <td><span class="status-badge status-${(emp.status || 'active').toLowerCase().replace(/ /g, '-')}">${emp.status || 'Active'}</span></td>
                </tr>
            `;
        });
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#c00;padding:20px;">⚠ Could not load employees.</td></tr>';
    }
}

// ===============================
// EMPLOYEES — CSV / PDF
// ===============================
async function downloadCSV() {
    try {
        const employees = await getAll('employees');
        let csv = 'First Name,Last Name,Role,Mobile,Status,Aadhar,Native Place,Languages\n';
        employees.forEach(e => {
            csv += `"${e.firstName}","${e.lastName || ''}","${e.role || ''}","${e.mobile || ''}","${e.status || ''}","${e.aadhar || ''}","${e.nativePlace || ''}","${e.languages || ''}"\n`;
        });
        const blob = new Blob([csv], { type: 'text/csv' });
        const a    = document.createElement('a');
        a.href     = URL.createObjectURL(blob);
        a.download = 'employees.csv';
        a.click();
        showNotification('📥 CSV downloaded', 'success');
    } catch (err) { showNotification('❌ Failed to download CSV', 'warning'); }
}

async function downloadPDF() {
    try {
        const employees = await getAll('employees');
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text('Sumukha ERP — Employee List', 105, 15, { align: 'center' });
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        let y = 28;
        const headers = ['Name', 'Role', 'Mobile', 'Status'];
        const colX    = [15, 75, 120, 160];
        doc.setFont('helvetica', 'bold');
        headers.forEach((h, i) => doc.text(h, colX[i], y));
        y += 2;
        doc.setLineWidth(0.3);
        doc.line(15, y, 195, y);
        y += 5;
        doc.setFont('helvetica', 'normal');
        employees.forEach(emp => {
            if (y > 275) { doc.addPage(); y = 20; }
            doc.text(`${emp.firstName} ${emp.lastName || ''}`, colX[0], y);
            doc.text(emp.role   || '-', colX[1], y);
            doc.text(emp.mobile || '-', colX[2], y);
            doc.text(emp.status || '-', colX[3], y);
            y += 7;
        });
        doc.save('employees.pdf');
        showNotification('📥 PDF downloaded', 'success');
    } catch (err) { showNotification('❌ Failed to download PDF', 'warning'); }
}

// ===============================
// EMPLOYEE STATUS TABLE
// ===============================
async function loadStatusTable() {
    const table = document.getElementById('statusTable');
    if (!table) return;
    table.innerHTML = `
        <thead><tr><th>NAME</th><th>STATUS</th><th>CHANGE</th><th>WORKING DETAILS</th></tr></thead>
        <tbody id="statusTableBody"></tbody>
    `;
    const tbody = document.getElementById('statusTableBody');
    try {
        const employees = await getAll('employees');
        if (employees.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:#888;padding:20px;">No employees found.</td></tr>`;
            return;
        }
        employees.forEach(emp => {
            const statusOptions = ['Active', 'Working', 'On Leave', 'Left Company', 'Pending'];
            const optionsHTML   = statusOptions.map(s =>
                `<option value="${s}" ${emp.status === s ? 'selected' : ''}>${s}</option>`
            ).join('');
            const workingDetail = (emp.status === 'Working' && emp.workPlace && emp.workPlace.trim())
                ? `<span class="work-location-badge">📍 ${emp.workPlace}</span>`
                : `<span style="color:#bbb;">—</span>`;
            tbody.innerHTML += `
                <tr>
                    <td><strong>${emp.firstName} ${emp.lastName || ''}</strong></td>
                    <td><span class="status-badge status-${(emp.status || '').toLowerCase().replace(/ /g, '-')}">${emp.status || 'Active'}</span></td>
                    <td>
                        <select onchange="handleStatusChange(event, '${emp.id}', this)"
                            style="padding:6px 10px;border-radius:6px;border:1px solid #ccc;font-size:13px;cursor:pointer;">
                            ${optionsHTML}
                        </select>
                    </td>
                    <td id="workDetail-${emp.id}">${workingDetail}</td>
                </tr>
            `;
            setTimeout(() => {
                const sel = document.querySelector(`select[onchange*="${emp.id}"]`);
                if (sel) sel.dataset.lastGood = emp.status || 'Active';
            }, 0);
        });
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:#c00;padding:20px;">⚠ Could not load employees.</td></tr>`;
    }
}

function handleStatusChange(event, empId, selectEl) {
    const newStatus = selectEl.value;
    if (newStatus === 'Working') {
        showWorkplaceModal(empId, selectEl);
    } else {
        commitStatusUpdate(empId, newStatus, '', selectEl);
    }
}

function showWorkplaceModal(empId, selectEl) {
    const existing = document.getElementById('workplaceModalOverlay');
    if (existing) existing.remove();
    const overlay = document.createElement('div');
    overlay.id = 'workplaceModalOverlay';
    overlay.innerHTML = `
        <div class="wpm-overlay">
            <div class="wpm-card" id="wpmCard">
                <div class="wpm-icon">📍</div>
                <h3 class="wpm-title">Assign Work Location</h3>
                <p class="wpm-subtitle">Where will this employee be working?</p>
                <input type="text" id="wpmInput" class="wpm-input"
                    placeholder="e.g. Koramangala Client, Site A..." autocomplete="off"/>
                <div class="wpm-actions">
                    <button class="wpm-btn wpm-cancel" onclick="cancelWorkplaceModal()">Cancel</button>
                    <button class="wpm-btn wpm-confirm" onclick="confirmWorkplaceModal('${empId}')">✔ Confirm</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    window._wpmSelectEl = selectEl;
    requestAnimationFrame(() => document.getElementById('wpmCard').classList.add('wpm-card-in'));
    setTimeout(() => document.getElementById('wpmInput')?.focus(), 300);
    document.getElementById('wpmInput').addEventListener('keydown', function (e) {
        if (e.key === 'Enter')  confirmWorkplaceModal(empId);
        if (e.key === 'Escape') cancelWorkplaceModal();
    });
}

function confirmWorkplaceModal(empId) {
    const workPlace = document.getElementById('wpmInput')?.value?.trim() || '';
    if (!workPlace) {
        const inp = document.getElementById('wpmInput');
        inp.style.borderColor = '#e53935';
        inp.placeholder = 'Please enter a location!';
        inp.focus();
        return;
    }
    closeWorkplaceModal();
    commitStatusUpdate(empId, 'Working', workPlace, window._wpmSelectEl);
}

function cancelWorkplaceModal() {
    closeWorkplaceModal();
    const sel = window._wpmSelectEl;
    if (sel) sel.value = sel.dataset.lastGood || 'Active';
}

function closeWorkplaceModal() {
    const card = document.getElementById('wpmCard');
    if (card) {
        card.classList.add('wpm-card-out');
        setTimeout(() => document.getElementById('workplaceModalOverlay')?.remove(), 300);
    }
}

async function commitStatusUpdate(empId, newStatus, workPlace, selectEl) {
    try {
        const body = { status: newStatus, workPlace: newStatus === 'Working' ? workPlace : '' };
        await updateItem('employees', empId, body);
        if (selectEl) selectEl.dataset.lastGood = newStatus;

        const detailCell = document.getElementById(`workDetail-${empId}`);
        if (detailCell) {
            detailCell.innerHTML = (newStatus === 'Working' && workPlace)
                ? `<span class="work-location-badge">📍 ${workPlace}</span>`
                : `<span style="color:#bbb;">—</span>`;
        }
        if (selectEl) {
            const badge = selectEl.closest('tr')?.querySelector('.status-badge');
            if (badge) {
                badge.textContent = newStatus;
                badge.className   = `status-badge status-${newStatus.toLowerCase().replace(/ /g, '-')}`;
            }
        }
        showNotification(`✅ Status updated → ${newStatus}${workPlace ? ' @ ' + workPlace : ''}`, 'success');
        updateDashboard();
    } catch (err) {
        showNotification('❌ Failed to update status', 'warning');
        if (selectEl) selectEl.value = selectEl.dataset.lastGood || 'Active';
    }
}

// ===============================
// CUSTOMERS
// ===============================
async function loadCustomers() {
    try {
        const customers = await getAll('customers');
        window._appCustomers = customers;
        renderCustomerTable(customers);
        loadCustomerDropdown(customers);
        updateDashboard();
    } catch (err) { console.error('Load customers error:', err); }
}

function renderCustomerTable(customers) {
    customers = customers || window._appCustomers || [];
    const tbody = document.querySelector('#customerTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    const countEl = document.getElementById('customerCount');
    if (countEl) countEl.innerText = customers.length;
    customers.forEach(cust => {
        tbody.innerHTML += `
            <tr style="border-bottom:1px solid #f0f0f0;">
                <td style="padding:12px;font-weight:600;">${cust.name}</td>
                <td style="padding:12px;color:#666;font-size:13px;">${cust.stateCode || '-'}</td>
                <td style="padding:12px;font-size:13px;">${cust.gst ? '<span style="background:#dcfce7;color:#16a34a;padding:2px 8px;border-radius:6px;font-size:11px;font-weight:600;">✓ GST</span>' : '<span style="color:#bbb;font-size:12px;">No GST</span>'}</td>
                <td style="padding:12px;font-size:13px;">${cust.phone || '-'}</td>
                <td style="padding:12px;text-align:center;">
                    <button onclick="editCustomer('${cust.id}')" style="background:#eff6ff;color:#2563eb;border:none;padding:5px 12px;border-radius:6px;cursor:pointer;font-weight:600;font-size:12px;margin-right:4px;">✏ Edit</button>
                    <button onclick="deleteCustomer('${cust.id}')" style="background:#fee2e2;color:#dc2626;border:none;padding:5px 12px;border-radius:6px;cursor:pointer;font-weight:600;font-size:12px;">🗑 Delete</button>
                </td>
            </tr>
        `;
    });
}

async function saveCustomer() {
    const name = document.getElementById('customerName').value.trim();
    if (!name) { showNotification('⚠ Customer name required', 'error'); return; }
    const payload = {
        name,
        address:   document.getElementById('customerAddress').value.trim(),
        stateCode: document.getElementById('customerState').value,
        gst:       document.getElementById('customerGST').value.trim(),
        phone:     document.getElementById('customerPhone').value.trim()
    };
    try {
        if (window._editingCustomerId) {
            await updateItem('customers', window._editingCustomerId, payload);
            window._editingCustomerId = null;
        } else {
            // Check duplicate
            const existing = (window._appCustomers || []).find(c => c.name.toLowerCase() === name.toLowerCase());
            if (existing) { showNotification('⚠ Customer already exists', 'warning'); return; }
            await addItem('customers', payload);
        }
        showNotification('👤 Customer saved', 'success');
        clearCustomerForm();
        loadCustomers();
    } catch (err) { showNotification('❌ Failed to save customer', 'warning'); }
}

async function deleteCustomer(id) {
    if (!confirm('Delete this customer?')) return;
    try {
        await deleteItem('customers', id);
        showNotification('🗑 Customer deleted', 'warning');
        loadCustomers();
    } catch (err) { showNotification('❌ Failed to delete', 'warning'); }
}

function editCustomer(id) {
    const cust = (window._appCustomers || []).find(c => c.id === id);
    if (!cust) return;
    window._editingCustomerId = id;
    document.getElementById('customerName').value    = cust.name;
    document.getElementById('customerAddress').value = cust.address || '';
    document.getElementById('customerState').value   = cust.stateCode || '';
    document.getElementById('customerGST').value     = cust.gst || '';
    document.getElementById('customerPhone').value   = cust.phone || '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function clearCustomerForm() {
    ['customerName','customerAddress','customerGST','customerPhone'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    const state = document.getElementById('customerState');
    if (state) state.value = '';
    window._editingCustomerId = null;
}

function searchCustomers() {
    const q   = document.getElementById('customerSearch').value.toLowerCase();
    const all = window._appCustomers || [];
    renderCustomerTable(all.filter(c => c.name.toLowerCase().includes(q)));
}

function loadCustomerDropdown(customers) {
    customers = customers || window._appCustomers || [];
    const select = document.getElementById('customerSelect');
    if (!select) return;
    select.innerHTML = '<option value="">— Select Saved Customer —</option>';
    customers.forEach(cust => {
        select.innerHTML += `<option value="${cust.id}">${cust.name}</option>`;
    });
    if (window.customerChoicesInstance) window.customerChoicesInstance.destroy();
    if (typeof Choices !== 'undefined') {
        window.customerChoicesInstance = new Choices(select, {
            searchEnabled: true, itemSelectText: '', shouldSort: false
        });
    }
}

function attachCustomerSelectListener() {
    document.getElementById('customerSelect')?.addEventListener('change', function () {
        const cust = (window._appCustomers || []).find(c => c.id === this.value);
        if (cust) {
            const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
            set('billName', cust.name);
            set('billAddress', cust.address || '');
            set('billState', cust.stateCode || '');
            set('invoiceCustomerPhone', cust.phone || '');
            toggleCustomerLock(true);
        } else {
            ['billName','billAddress','billState','invoiceCustomerPhone'].forEach(id => {
                const el = document.getElementById(id); if (el) el.value = '';
            });
            toggleCustomerLock(true);
        }
    });
}

// ===============================
// INVOICES
// ===============================
async function loadInvoiceHistory() {
    try {
        const invoices = await getAll('invoices');
        // Sort newest first
        invoices.sort((a, b) => (b.invoiceDate || '').localeCompare(a.invoiceDate || ''));
        window._appInvoices = invoices;
        filterInvoices();
    } catch (err) { console.error('Load invoices error:', err); }
}

function filterInvoices() {
    const invoices    = window._appInvoices || [];
    const searchQuery = (document.getElementById('invoiceSearchInput')?.value || '').toLowerCase();
    const taxFilter   = document.getElementById('invoiceTaxFilter')?.value   || 'All';
    const statFilter  = document.getElementById('invoiceStatusFilter')?.value || 'All';

    const tbody = document.querySelector('#invoiceHistoryTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    invoices.forEach((inv, index) => {
        const matchSearch = !searchQuery ||
            (inv.invoiceNo || '').toLowerCase().includes(searchQuery) ||
            (inv.customerName || '').toLowerCase().includes(searchQuery);
        const matchStatus = statFilter === 'All' || inv.status === statFilter;
        const matchTax    = taxFilter  === 'All' || inv.taxType === taxFilter || (taxFilter === 'none' && !inv.taxType);
        if (!matchSearch || !matchStatus || !matchTax) return;

        const locked = inv.status === 'Paid';
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${inv.invoiceNo}</td>
            <td><strong>${inv.customerName || '-'}</strong></td>
            <td>${inv.invoiceDate || '-'}</td>
            <td>₹ ${Number(inv.total).toFixed(2)}</td>
            <td>${getTaxLabel(inv.taxType)}</td>
            <td>
                <select class="status-${inv.status}" data-prev="${inv.status}" onchange="handleInvoiceStatusChange('${inv.id}', this)" ${locked ? 'disabled' : ''}>
                    ${['Draft','Pending','Sent','Paid','Cancelled','Overdue'].map(s =>
                        `<option value="${s}" ${inv.status === s ? 'selected' : ''}>${s}</option>`
                    ).join('')}
                </select>
            </td>
            <td>
                ${locked
                    ? `<span class="locked-badge">🔒 Locked</span>
                       <button onclick="generateInvoicePDF(window._appInvoices[${index}],'view')">View</button>
                       <button onclick="generateInvoicePDF(window._appInvoices[${index}],'download')">Download</button>`
                    : `<button onclick="editInvoice('${inv.id}')">Edit</button>
                       <button onclick="generateInvoicePDF(window._appInvoices[${index}],'view')">View</button>
                       <button onclick="generateInvoicePDF(window._appInvoices[${index}],'download')">Download</button>
                       <button onclick="deleteInvoice('${inv.id}')" style="background:#dc3545;color:white;border:none;border-radius:3px;padding:3px 8px;">Delete</button>`
                }
            </td>
        `;
        tbody.appendChild(row);
    });
}

// ── Payment modal with cancel support ──
let _pendingPaymentInvId  = null;
let _pendingPaymentSelect = null;
let _pendingPaymentPrevStatus = null;

function handleInvoiceStatusChange(id, selectEl) {
    const newStatus = selectEl.value;
    if (newStatus === 'Paid') {
        _pendingPaymentPrevStatus = selectEl.getAttribute('data-prev') || 'Pending';
        _pendingPaymentInvId  = id;
        _pendingPaymentSelect = selectEl;
        document.getElementById('paymentModal').classList.add('active');
    } else {
        updateInvoiceStatus(id, newStatus, selectEl);
    }
    selectEl.setAttribute('data-prev', newStatus);
}

function openPaymentModal(id) {
    _pendingPaymentInvId = id;
    document.getElementById('paymentModal').classList.add('active');
}

function closePaymentModal() {
    document.getElementById('paymentModal').classList.remove('active');
    if (_pendingPaymentSelect && _pendingPaymentPrevStatus) {
        _pendingPaymentSelect.value = _pendingPaymentPrevStatus;
        _pendingPaymentSelect.className = 'status-' + _pendingPaymentPrevStatus;
    }
    _pendingPaymentInvId     = null;
    _pendingPaymentSelect    = null;
    _pendingPaymentPrevStatus = null;
}

async function confirmInvoicePayment() {
    if (!_pendingPaymentInvId) return;
    const selectEl = _pendingPaymentSelect;
    _pendingPaymentSelect = null;
    _pendingPaymentPrevStatus = null;
    await updateInvoiceStatus(_pendingPaymentInvId, 'Paid', selectEl);
    document.getElementById('paymentModal').classList.remove('active');
    _pendingPaymentInvId = null;
}

async function updateInvoiceStatus(id, newStatus, selectEl) {
    try {
        await updateItem('invoices', id, { status: newStatus });

        if (newStatus === 'Paid') {
            const inv = (window._appInvoices || []).find(i => i.id === id);
            if (inv) {
                await addFinanceTxnDirect({
                    type: 'credit',
                    date: inv.invoiceDate || new Date().toISOString().slice(0,10),
                    paidTo: inv.customerName || 'Customer',
                    category: 'Invoice Payment',
                    paymentMode: 'bank',
                    amount: inv.total,
                    notes: 'Invoice ' + inv.invoiceNo
                });
            }
            showNotification('💰 Invoice marked as Paid', 'success');
        } else if (selectEl) {
            selectEl.className = 'status-' + newStatus;
        }

        await loadInvoiceHistory();
        updateDashboard();
    } catch (err) { showNotification('❌ Failed to update invoice status', 'warning'); }
}

async function saveInvoiceRecord() {
    const invoiceNo   = document.getElementById('invoiceNumber').value;
    const invoiceDate = document.getElementById('invoiceDate').value;
    if (!invoiceNo || !invoiceDate) { showNotification('⚠ Invoice number and date required', 'error'); return; }

    const rows = document.querySelectorAll('#invoiceItemsBody tr');
    if (rows.length === 0) { showNotification('⚠ Add at least one item', 'warning'); return; }

    let items = [], subtotal = 0;
    rows.forEach(row => {
        const desc   = row.querySelector('.desc')?.value || '';
        const hsn    = row.querySelector('.hsn')?.value  || '';
        const qty    = parseFloat(row.querySelector('.qty')?.value)  || 0;
        const rate   = parseFloat(row.querySelector('.rate')?.value) || 0;
        const amount = qty * rate;
        subtotal += amount;
        items.push({ desc, hsn, qty, rate, amount });
    });

    const taxType = document.querySelector('input[name="taxType"]:checked')?.value || 'none';
    let cgst = 0, sgst = 0, gst = 0;
    if (taxType === 'cgst_sgst') { cgst = subtotal * 0.09; sgst = subtotal * 0.09; }
    if (taxType === 'gst')        { gst  = subtotal * 0.18; }
    const total = subtotal + cgst + sgst + gst;

    const payload = {
        invoiceNo,
        invoiceDate,
        dueDate:       document.getElementById('dueDate').value,
        customerName:  document.getElementById('billName').value,
        customerPhone: document.getElementById('invoiceCustomerPhone')?.value || '',
        billAddress:   document.getElementById('billAddress').value,
        billState:     document.getElementById('billState').value,
        taxType, items, subtotal, cgst, sgst, gst, total, status: 'Pending'
    };

    try {
        let message;
        if (window._editingInvoiceId) {
            const existing = (window._appInvoices || []).find(i => i.id === window._editingInvoiceId);
            if (existing) payload.status = existing.status;
            await updateItem('invoices', window._editingInvoiceId, payload);
            message = 'Invoice updated successfully.';
            window._editingInvoiceId = null;
        } else {
            const dup = (window._appInvoices || []).find(i => i.invoiceNo === invoiceNo);
            if (dup) { showNotification('⚠ Invoice number already exists', 'error'); return; }
            await addItem('invoices', payload);
            message = 'Invoice created successfully.';
        }
        showNotification('🧾 ' + message, 'success');
        resetInvoiceForm();
        await loadInvoiceHistory();
        updateDashboard();
    } catch (err) { showNotification('❌ Failed to save invoice', 'warning'); }
}

async function deleteInvoice(id) {
    if (!confirm('Delete this invoice?')) return;
    try {
        await deleteItem('invoices', id);
        showNotification('🗑 Invoice deleted', 'warning');
        await loadInvoiceHistory();
        updateDashboard();
    } catch (err) { showNotification('❌ Failed to delete invoice', 'warning'); }
}

function editInvoice(id) {
    const inv = (window._appInvoices || []).find(i => i.id === id);
    if (!inv) return;
    window._editingInvoiceId = id;
    showSection('createInvoice');
    document.getElementById('invoiceNumber').value = inv.invoiceNo;
    document.getElementById('invoiceDate').value   = inv.invoiceDate;
    document.getElementById('dueDate').value        = inv.dueDate || '';
    document.getElementById('billName').value       = inv.customerName || '';
    document.getElementById('billAddress').value    = inv.billAddress || '';
    document.getElementById('billState').value      = inv.billState || '';
    const pf = document.getElementById('invoiceCustomerPhone');
    if (pf) pf.value = inv.customerPhone || '';
    toggleCustomerLock(true);
    const tbody = document.getElementById('invoiceItemsBody');
    tbody.innerHTML = '';
    inv.items.forEach(item => {
        addInvoiceRow();
        const last = tbody.lastElementChild;
        last.querySelector('.desc').value = item.desc;
        last.querySelector('.hsn').value  = item.hsn;
        last.querySelector('.qty').value  = item.qty;
        last.querySelector('.rate').value = item.rate;
    });
    if (inv.taxType) {
        const radio = document.querySelector(`input[name="taxType"][value="${inv.taxType}"]`);
        if (radio) radio.checked = true;
    }
    document.querySelectorAll('input[name="taxType"]').forEach(r => r.disabled = true);
    calculateInvoiceLive();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===============================
// FINANCE
// ===============================

// Helper to add a transaction and update balance in Firestore
async function addFinanceTxnDirect(data) {
    const amt = Math.round(parseFloat(data.amount) * 100) / 100;
    await addItem('transactions', { ...data, amount: amt });

    // Update balance doc
    const balSnap = await getDoc(docRef('settings', 'balance'));
    let bal = balSnap.exists() ? balSnap.data() : { bankBalance: 0, cashBalance: 0 };
    if (data.type === 'credit') {
        if (data.paymentMode === 'cash') bal.cashBalance = (bal.cashBalance || 0) + amt;
        else                              bal.bankBalance  = (bal.bankBalance  || 0) + amt;
    } else {
        if (data.paymentMode === 'cash') bal.cashBalance = (bal.cashBalance || 0) - amt;
        else                              bal.bankBalance  = (bal.bankBalance  || 0) - amt;
    }
    await setDoc(docRef('settings', 'balance'), bal);
}

async function refreshFinanceUI() {
    try {
        const [transactions, balSnap] = await Promise.all([
            getAll('transactions'),
            getDoc(docRef('settings', 'balance'))
        ]);
        const balance = balSnap.exists() ? balSnap.data() : { bankBalance: 0, cashBalance: 0 };

        window._financeTransactions = transactions;
        window._financeBalance      = balance;

        const tbody = document.getElementById('financeTableBody');
        if (!tbody) return;
        tbody.innerHTML = '';

        let monthlyExpense = 0, monthlyIncome = 0;
        const now = new Date();
        const currentMonth = now.getMonth(), currentYear = now.getFullYear();

        const sorted = [...transactions].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
        const bank   = Number(balance.bankBalance || 0);
        const cash   = Number(balance.cashBalance || 0);

        let totalCredits = 0, totalDebits = 0;
        sorted.forEach(t => {
            if (t.type === 'credit') totalCredits += Number(t.amount);
            else                      totalDebits  += Number(t.amount);
        });
        let running = Math.round(((bank + cash) - totalCredits + totalDebits) * 100) / 100;

        sorted.forEach(txn => {
            const amt     = Number(txn.amount);
            const txnDate = new Date(txn.date);
            if (txnDate.getMonth() === currentMonth && txnDate.getFullYear() === currentYear) {
                if (txn.type === 'credit') monthlyIncome  += amt;
                else                       monthlyExpense  += amt;
            }
            if (txn.type === 'credit') running += amt;
            else                       running -= amt;
            running = Math.round(running * 100) / 100;

            const amtClass = txn.type === 'credit' ? 'income' : 'expense';
            tbody.innerHTML += `
                <tr>
                    <td>${txn.date}</td>
                    <td>${txn.type === 'credit' ? 'Income' : 'Expense'}</td>
                    <td>${txn.paidTo || '-'}</td>
                    <td>${txn.category || '-'}</td>
                    <td style="text-transform:capitalize;">${txn.paymentMode || '-'}</td>
                    <td class="${amtClass}">₹${amt.toFixed(2)}</td>
                    <td>₹${running.toFixed(2)}</td>
                    <td>${txn.notes ? `<span class="note-icon" onclick="openNoteModal(\`${txn.notes.replace(/`/g,'\\`')}\`)">📝 View</span>` : '-'}</td>
                    <td><button onclick="deleteFinanceTxn('${txn.id}')">Delete</button></td>
                </tr>
            `;
        });

        const total  = Math.round((bank + cash) * 100) / 100;
        const profit = monthlyIncome - monthlyExpense;
        const set = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
        set('bankBalance',    '₹' + bank.toFixed(2));
        set('cashBalance',    '₹' + cash.toFixed(2));
        set('totalBalance',   '₹' + total.toFixed(2));
        set('monthlyExpense', '₹' + monthlyExpense.toFixed(2));
        const profitEl = document.getElementById('monthlyProfit');
        if (profitEl) {
            profitEl.innerText   = '₹' + profit.toFixed(2);
            profitEl.style.color = profit >= 0 ? '#2e7d32' : '#d32f2f';
        }
    } catch (err) { console.error('refreshFinanceUI error:', err); }
}

async function addFinanceTransaction() {
    const select = document.getElementById('paidTo');
    const paidTo = select && select.selectedIndex >= 0
        ? select.options[select.selectedIndex].text
        : document.getElementById('paidTo').value;

    if (!paidTo || paidTo === 'Select Person') { alert('Select a person'); return; }

    const data = {
        type:        document.getElementById('transactionType').value,
        date:        document.getElementById('txnDate').value,
        paidTo,
        category:    document.getElementById('category').value,
        paymentMode: document.getElementById('paymentMode').value,
        amount:      document.getElementById('amount').value,
        notes:       document.getElementById('notes').value
    };

    if (!data.amount || data.amount <= 0) { alert('Enter valid amount'); return; }
    if (!data.date) { alert('Select a date'); return; }

    try {
        await addFinanceTxnDirect(data);
        document.getElementById('amount').value = '';
        document.getElementById('notes').value  = '';
        showNotification('💰 Transaction added', 'success');
        refreshFinanceUI();
    } catch (err) { showNotification('❌ Failed to add transaction', 'warning'); }
}

async function setFinanceOpeningBalance() {
    const bank = parseFloat(document.getElementById('openingBank').value) || 0;
    const cash = parseFloat(document.getElementById('openingCash').value) || 0;
    if (bank === 0 && cash === 0) { alert('Enter at least one balance'); return; }
    try {
        await setDoc(docRef('settings', 'balance'), { bankBalance: bank, cashBalance: cash });
        document.getElementById('openingBank').value = '';
        document.getElementById('openingCash').value = '';
        showNotification('💰 Opening balance set', 'success');
        refreshFinanceUI();
    } catch (err) { showNotification('❌ Failed to set balance', 'warning'); }
}

async function deleteFinanceTxn(id) {
    if (!confirm('Delete this transaction?')) return;
    try {
        const txn = (window._financeTransactions || []).find(t => t.id === id);
        if (txn) {
            // Reverse the balance effect
            const balSnap = await getDoc(docRef('settings', 'balance'));
            let bal = balSnap.exists() ? balSnap.data() : { bankBalance: 0, cashBalance: 0 };
            const amt = Number(txn.amount);
            if (txn.type === 'credit') {
                if (txn.paymentMode === 'cash') bal.cashBalance -= amt;
                else                             bal.bankBalance  -= amt;
            } else {
                if (txn.paymentMode === 'cash') bal.cashBalance += amt;
                else                             bal.bankBalance  += amt;
            }
            await setDoc(docRef('settings', 'balance'), bal);
        }
        await deleteItem('transactions', id);
        showNotification('🗑 Transaction deleted', 'warning');
        refreshFinanceUI();
    } catch (err) { showNotification('❌ Failed to delete', 'warning'); }
}

async function resetFinanceBalance() {
    if (!confirm('Reset Bank & Cash balance to 0?')) return;
    await setDoc(docRef('settings', 'balance'), { bankBalance: 0, cashBalance: 0 });
    refreshFinanceUI();
}

async function resetMonthlyExpense() {
    if (!confirm('Delete all expenses of current month?')) return;
    try {
        const txns = await getAll('transactions');
        const now  = new Date();
        const toDelete = txns.filter(t => {
            const d = new Date(t.date);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && t.type === 'debit';
        });
        await Promise.all(toDelete.map(t => deleteFinanceTxn(t.id)));
        showNotification('🔄 Monthly expenses cleared', 'success');
    } catch (err) { showNotification('❌ Failed to reset', 'warning'); }
}

async function resetMonthlyProfit() {
    if (!confirm('Delete ALL transactions of current month?')) return;
    try {
        const txns = await getAll('transactions');
        const now  = new Date();
        const toDelete = txns.filter(t => {
            const d = new Date(t.date);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        });
        await Promise.all(toDelete.map(t => deleteFinanceTxn(t.id)));
        showNotification('🔄 Monthly transactions cleared', 'success');
    } catch (err) { showNotification('❌ Failed to reset', 'warning'); }
}

async function loadFinancePeopleDropdown() {
    const select = document.getElementById('paidTo');
    if (!select) return;
    try {
        const [employees, customers] = await Promise.all([
            getAll('employees'),
            getAll('customers')
        ]);
        select.innerHTML = '<option value="">Select Person</option>';
        employees.forEach(emp => {
            select.innerHTML += `<option value="emp-${emp.id}">${emp.firstName} ${emp.lastName || ''} (Employee)</option>`;
        });
        customers.forEach(cust => {
            select.innerHTML += `<option value="cust-${cust.id}">${cust.name} (Customer)</option>`;
        });
    } catch (err) { console.error('Finance people dropdown error:', err); }
}

function openNoteModal(note) {
    document.getElementById('noteModalText').innerText = note;
    document.getElementById('noteModal').classList.add('active');
}
function closeNoteModal() {
    document.getElementById('noteModal').classList.remove('active');
}

document.addEventListener('keydown', function(e) {
    if (e.key !== 'Escape') return;
    const noteModal = document.getElementById('noteModal');
    if (noteModal && noteModal.classList.contains('active')) { closeNoteModal(); return; }
    const paymentModal = document.getElementById('paymentModal');
    if (paymentModal && paymentModal.classList.contains('active')) { closePaymentModal(); return; }
});

// ===============================
// SALARY
// ===============================
async function loadSalaryEmployees() {
    const select = document.getElementById('salaryEmployeeSelect');
    if (!select) return;
    try {
        const emps = await getAll('employees');
        select.innerHTML = '<option value="">Select Employee</option>';
        emps.filter(e => e.status === 'Active' || e.status === 'Working' || e.status === 'Pending').forEach(emp => {
            select.innerHTML += `<option value="${emp.id}">${emp.firstName} ${emp.lastName || ''}</option>`;
        });
    } catch (err) { console.error('Salary employees error:', err); }
}

function loadSalaryMonths() {
    const select = document.getElementById('salaryMonthSelect');
    if (!select) return;
    select.innerHTML = '';
    const now = new Date();
    for (let i = -2; i <= 3; i++) {
        const d     = new Date(now.getFullYear(), now.getMonth() + i, 1);
        const value = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
        const label = d.toLocaleString('default', { month: 'long' }) + ' ' + d.getFullYear();
        const opt   = document.createElement('option');
        opt.value   = value;
        opt.textContent = label;
        if (i === 0) opt.selected = true;
        select.appendChild(opt);
    }
}

async function loadSalarySummary() {
    const employeeId = document.getElementById('salaryEmployeeSelect').value;
    const month      = document.getElementById('salaryMonthSelect').value;

    if (!employeeId || !month) {
        document.getElementById('salarySummaryCard').style.display   = 'none';
        document.getElementById('salaryLedgerContainer').style.display = 'none';
        return;
    }

    try {
        // salary records stored as 'salary_{employeeId}_{month}'
        const salaryDocId = `${employeeId}_${month}`;
        const snap = await getDoc(docRef('salary', salaryDocId));
        let record = snap.exists() ? { id: snap.id, ...snap.data() } : { duties: [], advances: [] };
        window._salaryRecord = record;

        let activeSalary = 0, activePaid = 0;
        (record.duties   || []).filter(d => !d.cleared).forEach(d => activeSalary += Number(d.quantity) * Number(d.rate));
        (record.advances || []).filter(a => !a.cleared).forEach(a => activePaid   += Number(a.amount));
        const remaining = activeSalary - activePaid;

        document.getElementById('salarySummaryCard').style.display = 'block';

        const set = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
        set('salaryTotal',     '₹' + activeSalary.toFixed(2));
        set('salaryPaid',      '₹' + activePaid.toFixed(2));
        set('salaryRemaining', '₹' + remaining.toFixed(2));

        let statusText = 'No Active Duties', statusColor = 'grey';
        if (activeSalary > 0 && remaining <= 0) { statusText = 'Paid in Full'; statusColor = 'green'; }
        else if (activeSalary > 0)              { statusText = 'Pending Payment'; statusColor = 'red'; }

        const statusEl = document.getElementById('salaryStatus');
        if (statusEl) { statusEl.innerText = statusText; statusEl.style.color = statusColor; }

        const pifw = document.getElementById('payInFullWrapper');
        if (pifw) pifw.style.display = remaining > 0 ? 'flex' : 'none';

        const emp = await getById('employees', employeeId);
        const empStatusEl = document.getElementById('salaryEmpStatusDisplay');
        if (empStatusEl && emp) {
            empStatusEl.innerText   = emp.status;
            empStatusEl.style.color = emp.status === 'Pending' ? '#e65100' : emp.status === 'Working' ? 'green' : 'black';
        }

        loadSalaryLedger();
    } catch (err) { console.error('Salary summary error:', err); }
}

function loadSalaryLedger() {
    const record = window._salaryRecord;
    if (!record) return;
    const ledgerBody = document.getElementById('salaryLedgerBody');
    const container  = document.getElementById('salaryLedgerContainer');
    if (!ledgerBody) return;
    ledgerBody.innerHTML = '';
    let entries = [];
    (record.duties || []).forEach(d => {
        let details = d.type === 'day'   ? `${d.quantity} Days @ ₹${d.rate}`
                    : d.type === 'shift' ? `${d.quantity} Shifts @ ₹${d.rate}`
                    : 'Fixed Monthly Salary';
        entries.push({ date: d.date || '', timestamp: d.timestamp || 0,
            type: 'Duty Added', details, mode: '-', amount: Number(d.quantity) * Number(d.rate) });
    });
    (record.advances || []).forEach(a => {
        entries.push({ date: a.date, timestamp: a.timestamp || 0,
            type: a.isFullPayment ? 'Clearance Payment' : 'Salary Advance',
            details: '-', mode: a.paymentMode, amount: -Number(a.amount) });
    });
    entries.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
    let running = 0;
    entries.forEach(e => { running += e.amount; e.runningBalance = running; });
    entries.forEach(e => {
        const rowClass = e.type === 'Clearance Payment' ? 'sal-row-clearance' : e.type === 'Salary Advance' ? 'sal-row-advance' : '';
        const amtClass = e.amount >= 0 ? 'sal-amt-positive' : 'sal-amt-negative';
        ledgerBody.innerHTML += `
            <tr class="${rowClass}">
                <td>${e.date}</td><td>${e.type}</td><td>${e.details}</td>
                <td style="text-transform:capitalize;">${e.mode}</td>
                <td class="${amtClass}">₹${Math.abs(e.amount).toFixed(2)}</td>
                <td>₹${e.runningBalance.toFixed(2)}</td>
            </tr>
        `;
    });
    if (container) container.style.display = 'block';
}

function openAddDutyModal() {
    const employeeId = document.getElementById('salaryEmployeeSelect').value;
    const month      = document.getElementById('salaryMonthSelect').value;
    if (!employeeId || !month) { alert('Select employee and month first'); return; }
    document.getElementById('dutyModal').classList.add('active');
    document.getElementById('dayCount').value   = '';
    document.getElementById('shiftCount').value = '';
    document.getElementById('dutyRate').value   = '';
    toggleDutyFields();
}
function closeDutyModal()   { document.getElementById('dutyModal').classList.remove('active'); }
function toggleDutyFields() {
    const type = document.getElementById('dutyTypeSelect').value;
    document.getElementById('dayField').style.display   = type === 'day'   ? 'block' : 'none';
    document.getElementById('shiftField').style.display = type === 'shift' ? 'block' : 'none';
}

async function saveDuty() {
    const employeeId = document.getElementById('salaryEmployeeSelect').value;
    const month      = document.getElementById('salaryMonthSelect').value;
    const type       = document.getElementById('dutyTypeSelect').value;
    const rate       = Number(document.getElementById('dutyRate').value);
    let quantity = 1;
    if (type === 'day')   quantity = Number(document.getElementById('dayCount').value);
    if (type === 'shift') quantity = Number(document.getElementById('shiftCount').value);
    if (!rate || rate <= 0 || (type !== 'month' && (!quantity || quantity <= 0))) { alert('Enter valid details'); return; }

    const duty = { type, quantity, rate, date: new Date().toISOString().slice(0,10), timestamp: Date.now(), cleared: false };

    try {
        const salaryDocId = `${employeeId}_${month}`;
        const snap = await getDoc(docRef('salary', salaryDocId));
        let record = snap.exists() ? snap.data() : { duties: [], advances: [] };
        record.duties = [...(record.duties || []), duty];
        await setDoc(docRef('salary', salaryDocId), record);

        // Mark employee as Pending
        const emp = await getById('employees', employeeId);
        if (emp && emp.status !== 'Working') {
            await updateItem('employees', employeeId, { status: 'Pending' });
        }

        closeDutyModal();
        loadSalarySummary();
        loadStatusTable();
        updateDashboard();
        showNotification('✅ Duty added', 'success');
    } catch (err) { showNotification('❌ Failed to add duty', 'warning'); }
}

function openAdvanceModal() {
    const employeeId = document.getElementById('salaryEmployeeSelect').value;
    const month      = document.getElementById('salaryMonthSelect').value;
    if (!employeeId || !month) { alert('Select employee and month first'); return; }
    document.getElementById('advanceAmount').value = '';
    document.getElementById('advanceModal').classList.add('active');
}
function closeAdvanceModal() { document.getElementById('advanceModal').classList.remove('active'); }

async function saveAdvance() {
    const employeeId  = document.getElementById('salaryEmployeeSelect').value;
    const month       = document.getElementById('salaryMonthSelect').value;
    const amount      = Number(document.getElementById('advanceAmount').value);
    const paymentMode = document.getElementById('advancePaymentMode').value;
    if (!amount || amount <= 0) { alert('Enter valid amount'); return; }

    const advance = { amount, paymentMode, date: new Date().toISOString().slice(0,10), timestamp: Date.now(), cleared: false };

    try {
        const salaryDocId = `${employeeId}_${month}`;
        const snap = await getDoc(docRef('salary', salaryDocId));
        let record = snap.exists() ? snap.data() : { duties: [], advances: [] };
        record.advances = [...(record.advances || []), advance];
        await setDoc(docRef('salary', salaryDocId), record);

        const emp = await getById('employees', employeeId);
        await addFinanceTxnDirect({
            type: 'debit', date: advance.date,
            paidTo: `${emp.firstName} ${emp.lastName || ''} (Employee)`,
            category: 'Salary Advance', paymentMode, amount,
            notes: 'Salary Advance - ' + month
        });

        closeAdvanceModal();
        loadSalarySummary();
        refreshFinanceUI();
        showNotification('💸 Advance recorded', 'success');
    } catch (err) { showNotification('❌ Failed to save advance', 'warning'); }
}

async function confirmManualPayment() {
    const employeeId  = document.getElementById('salaryEmployeeSelect').value;
    const month       = document.getElementById('salaryMonthSelect').value;
    const paymentMode = document.getElementById('fullPaymentMode').value;
    if (!paymentMode) { alert('Select a payment mode first'); return; }

    const record = window._salaryRecord;
    if (!record) return;

    let activeSal = 0, activeAdv = 0;
    (record.duties   || []).filter(d => !d.cleared).forEach(d => activeSal += Number(d.quantity) * Number(d.rate));
    (record.advances || []).filter(a => !a.cleared).forEach(a => activeAdv += Number(a.amount));
    const owed = activeSal - activeAdv;

    if (owed > 0) {
        const advance = { amount: owed, paymentMode, date: new Date().toISOString().slice(0,10),
            timestamp: Date.now(), cleared: true, isFullPayment: true };
        const salaryDocId = `${employeeId}_${month}`;
        const snap = await getDoc(docRef('salary', salaryDocId));
        let rec = snap.exists() ? snap.data() : { duties: [], advances: [] };
        rec.advances = [...(rec.advances || []), advance];
        await setDoc(docRef('salary', salaryDocId), rec);

        const emp = await getById('employees', employeeId);
        await addFinanceTxnDirect({
            type: 'debit', date: advance.date,
            paidTo: `${emp.firstName} ${emp.lastName || ''} (Employee)`,
            category: 'salary', paymentMode, amount: owed,
            notes: 'Full Salary Settlement - ' + month
        });
        refreshFinanceUI();
    }

    // Clear all duties + advances
    const salaryDocId = `${employeeId}_${month}`;
    const snap2 = await getDoc(docRef('salary', salaryDocId));
    let rec2 = snap2.exists() ? snap2.data() : { duties: [], advances: [] };
    rec2.duties   = (rec2.duties   || []).map(d => ({ ...d, cleared: true }));
    rec2.advances = (rec2.advances || []).map(a => ({ ...a, cleared: true }));
    await setDoc(docRef('salary', salaryDocId), rec2);

    const endDuty = document.getElementById('endDutyCheckbox');
    if (endDuty && endDuty.checked) {
        await updateItem('employees', employeeId, { status: 'Active', workPlace: '' });
        loadStatusTable();
        updateDashboard();
    }

    closeManualPaymentModal();
    loadSalarySummary();
    showNotification('✅ Salary paid in full', 'success');
}

function closeManualPaymentModal() {
    const modal = document.getElementById('manualPaymentModal');
    if (modal) modal.classList.remove('active');
    const cb = document.getElementById('endDutyCheckbox');
    if (cb) cb.checked = false;
    const pm = document.getElementById('fullPaymentMode');
    if (pm) pm.value = '';
}

async function resetWorkLogs() {
    const employeeId = document.getElementById('salaryEmployeeSelect').value;
    const month      = document.getElementById('salaryMonthSelect').value;
    if (!employeeId || !month) return;
    if (!confirm('Reset active (unpaid) work logs for this employee?')) return;
    const salaryDocId = `${employeeId}_${month}`;
    const snap = await getDoc(docRef('salary', salaryDocId));
    let record = snap.exists() ? snap.data() : { duties: [], advances: [] };
    record.duties = (record.duties || []).filter(d => d.cleared === true);
    await setDoc(docRef('salary', salaryDocId), record);
    showNotification('🔄 Work logs reset', 'info');
    loadSalarySummary();
}

async function resetFullSalaryLedger() {
    const employeeId = document.getElementById('salaryEmployeeSelect').value;
    const month      = document.getElementById('salaryMonthSelect').value;
    if (!employeeId || !month) return;
    if (!confirm('🛑 DANGER: Wipe all duties AND advances for this month?')) return;
    await setDoc(docRef('salary', `${employeeId}_${month}`), { duties: [], advances: [] });
    showNotification('❌ Ledger wiped', 'warning');
    loadSalarySummary();
}

// ===============================
// LEAVE MANAGEMENT
// ===============================
async function openLeaveModal() {
    try {
        const emps = await getAll('employees');
        const sel  = document.getElementById('leaveEmployeeSelect');
        sel.innerHTML = '<option value="">Select Employee</option>';
        emps.forEach(emp => {
            sel.innerHTML += `<option value="${emp.id}">${emp.firstName} ${emp.lastName || ''} (${emp.status})</option>`;
        });
    } catch (err) { console.error('Leave modal error:', err); }
    document.getElementById('leaveStartDate').value = new Date().toISOString().slice(0, 10);
    document.getElementById('leaveModal').classList.add('active');
}

function closeLeaveModal() {
    document.getElementById('leaveModal').classList.remove('active');
    document.getElementById('leaveEmployeeSelect').value = '';
    document.getElementById('leaveReason').value = '';
    document.getElementById('leaveDays').value   = '1';
}

async function saveLeave() {
    const empId     = document.getElementById('leaveEmployeeSelect').value;
    const type      = document.getElementById('leaveType').value;
    const startDate = document.getElementById('leaveStartDate').value;
    const days      = document.getElementById('leaveDays').value;
    const reason    = document.getElementById('leaveReason').value;
    if (!empId || !startDate || !days) { alert('Please fill all required fields.'); return; }
    try {
        const emp = await getById('employees', empId);
        await addItem('leaves', {
            employeeId: empId,
            employeeName: `${emp.firstName} ${emp.lastName || ''}`,
            type, startDate, days, reason: reason || '-'
        });
        await updateItem('employees', empId, { status: 'On Leave', workPlace: '' });
        showNotification('📅 Leave recorded', 'info');
        closeLeaveModal();
        loadLeaveTable();
        loadStatusTable();
        updateDashboard();
    } catch (err) { showNotification('❌ Failed to record leave', 'warning'); }
}

async function loadLeaveTable() {
    const tbody = document.getElementById('leaveTableBody');
    if (!tbody) return;
    try {
        const leaves = await getAll('leaves');
        leaves.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        tbody.innerHTML = '';
        const setE = (id, v) => { const el = document.getElementById(id); if (el) el.innerText = v; };
        setE('leaveTotalCount',  leaves.length);
        setE('leaveCasualCount', leaves.filter(l => l.type === 'Casual Leave').length);
        setE('leaveSickCount',   leaves.filter(l => l.type === 'Sick Leave').length);
        setE('leavePaidCount',   leaves.filter(l => l.type === 'Paid Leave').length);
        if (leaves.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#8b949e;padding:30px;">No leave records found.</td></tr>`;
            return;
        }
        const typeTag = t => {
            const c = {'Casual Leave':'#f59e0b','Sick Leave':'#ef4444','Paid Leave':'#22c55e','Unpaid Leave':'#6366f1'}[t] || '#888';
            return `<span style="background:${c}22;color:${c};padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600;">${t}</span>`;
        };
        leaves.forEach(leave => {
            tbody.innerHTML += `
                <tr style="border-bottom:1px solid #f0f0f0;">
                    <td style="padding:14px 18px;">${leave.startDate}</td>
                    <td style="padding:14px 18px;"><strong>${leave.employeeName}</strong></td>
                    <td style="padding:14px 18px;">${typeTag(leave.type)}</td>
                    <td style="padding:14px 18px;font-weight:600;">${leave.days} day${leave.days != 1 ? 's' : ''}</td>
                    <td style="padding:14px 18px;color:#666;">${leave.reason || '-'}</td>
                    <td style="padding:14px 18px;text-align:center;">
                        <button onclick="deleteLeave('${leave.id}')"
                            style="background:#fee2e2;color:#dc2626;border:none;padding:6px 14px;border-radius:8px;cursor:pointer;font-weight:600;font-size:12px;">
                            🗑 Delete
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#c00;padding:20px;">⚠ Failed to load leaves.</td></tr>`;
    }
}

async function deleteLeave(id) {
    if (!confirm('Delete this leave record?')) return;
    try {
        const leave = (await getAll('leaves')).find(l => l.id === id);
        if (leave) await updateItem('employees', leave.employeeId, { status: 'Active' });
        await deleteItem('leaves', id);
        showNotification('🗑 Leave deleted', 'warning');
        loadLeaveTable();
        loadStatusTable();
        updateDashboard();
    } catch (err) { showNotification('❌ Failed to delete leave', 'warning'); }
}

// ===============================
// ATTENDANCE
// ===============================
async function initAttendanceSection() {
    loadAttendanceMonths();
    await loadAttendanceEmployeeDropdown();
    loadAttendanceSummaryCards();
    loadAttendanceTable();
    loadAttendanceMonthlySummary();
}

function loadAttendanceMonths() {
    const select = document.getElementById('attendanceMonthSelect');
    if (!select) return;
    select.innerHTML = '';
    const now = new Date();
    for (let i = -3; i <= 1; i++) {
        const d     = new Date(now.getFullYear(), now.getMonth() + i, 1);
        const value = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
        const label = d.toLocaleString('default', { month: 'long' }) + ' ' + d.getFullYear();
        const opt   = document.createElement('option');
        opt.value   = value;
        opt.textContent = label;
        if (i === 0) opt.selected = true;
        select.appendChild(opt);
    }
}

async function loadAttendanceEmployeeDropdown() {
    const select = document.getElementById('attendanceEmployeeSelect');
    if (!select) return;
    try {
        const emps = await getAll('employees');
        const prev = select.value;
        select.innerHTML = '<option value="">-- All Employees --</option>';
        emps.forEach(emp => {
            select.innerHTML += `<option value="${emp.id}">${emp.firstName} ${emp.lastName || ''} (${emp.role || '-'})</option>`;
        });
        select.value = prev;
    } catch (err) { console.error('Attendance dropdown error:', err); }
}

function openMarkAttendanceModal() {
    getAll('employees').then(emps => {
        const select = document.getElementById('markAttEmpSelect');
        if (!select) return;
        select.innerHTML = '<option value="">Select Employee</option>';
        emps.filter(e => e.status === 'Active' || e.status === 'Working' || e.status === 'Pending')
            .forEach(emp => {
                select.innerHTML += `<option value="${emp.id}" data-name="${emp.firstName} ${emp.lastName || ''}">${emp.firstName} ${emp.lastName || ''}</option>`;
            });
    });
    const todayStr  = new Date().toISOString().slice(0, 10);
    const attDateEl = document.getElementById('markAttDate');
    if (attDateEl) { attDateEl.value = todayStr; attDateEl.max = todayStr; }
    document.getElementById('markAttStatus').value = 'Present';
    document.getElementById('markAttNotes').value  = '';
    document.getElementById('markAttendanceModal').classList.add('active');
}

function closeMarkAttendanceModal() {
    document.getElementById('markAttendanceModal').classList.remove('active');
}

async function saveAttendanceRecord() {
    const select  = document.getElementById('markAttEmpSelect');
    const empId   = select.value;
    const empName = select.options[select.selectedIndex]?.dataset.name || '';
    const date    = document.getElementById('markAttDate').value;
    const status  = document.getElementById('markAttStatus').value;
    const notes   = document.getElementById('markAttNotes').value.trim();
    if (!empId || !date || !status) { alert('Please fill all required fields.'); return; }

    try {
        // Upsert: use empId+date as document ID to prevent duplicates
        const attId = `${empId}_${date}`;
        await setDoc(docRef('attendance', attId), {
            employeeId: empId, employeeName: empName, date, status, notes,
            updatedAt: serverTimestamp()
        });
        showNotification('✅ Attendance saved', 'success');
        closeMarkAttendanceModal();
        loadAttendanceTable();
        loadAttendanceSummaryCards();
        loadAttendanceMonthlySummary();
    } catch (err) { showNotification('❌ Failed to save attendance', 'warning'); }
}

async function deleteAttendanceRecord(id) {
    if (!confirm('Delete this attendance record?')) return;
    try {
        await deleteItem('attendance', id);
        showNotification('🗑 Record deleted', 'warning');
        loadAttendanceTable();
        loadAttendanceSummaryCards();
        loadAttendanceMonthlySummary();
    } catch (err) { showNotification('❌ Failed to delete', 'warning'); }
}

async function loadAttendanceTable() {
    const tbody = document.getElementById('attendanceTableBody');
    if (!tbody) return;
    const empFilter   = document.getElementById('attendanceEmployeeSelect')?.value || '';
    const monthFilter = document.getElementById('attendanceMonthSelect')?.value    || '';
    const statFilter  = document.getElementById('attendanceStatusFilter')?.value   || '';
    try {
        let records = await getAll('attendance');
        if (empFilter)   records = records.filter(a => a.employeeId === empFilter);
        if (monthFilter) records = records.filter(a => a.date && a.date.startsWith(monthFilter));
        if (statFilter)  records = records.filter(a => a.status === statFilter);
        records.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
        tbody.innerHTML = '';
        if (records.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:#888;padding:20px;">No attendance records found.</td></tr>`;
            return;
        }
        records.forEach(rec => {
            const statusClass = getAttStatusClass(rec.status);
            tbody.innerHTML += `
                <tr>
                    <td>${formatAttDate(rec.date)}</td>
                    <td><strong>${rec.employeeName}</strong></td>
                    <td><span class="${statusClass}">${rec.status}</span></td>
                    <td>${rec.notes || '-'}</td>
                    <td style="text-align:center;">
                        <button onclick="deleteAttendanceRecord('${rec.id}')"
                            style="background:#dc3545;color:white;border:none;padding:4px 10px;border-radius:4px;cursor:pointer;font-size:12px;">
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:#c00;padding:20px;">⚠ Failed to load records.</td></tr>`;
    }
}

async function loadAttendanceSummaryCards() {
    const monthFilter = document.getElementById('attendanceMonthSelect')?.value || '';
    try {
        let records = await getAll('attendance');
        if (monthFilter) records = records.filter(a => a.date && a.date.startsWith(monthFilter));
        const set = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
        set('attCardTotal',   records.length);
        set('attCardPresent', records.filter(a => a.status === 'Present').length);
        set('attCardAbsent',  records.filter(a => a.status === 'Absent').length);
        set('attCardHalfDay', records.filter(a => a.status === 'Half Day').length);
    } catch (err) { console.error('Attendance summary error:', err); }
}

async function loadAttendanceMonthlySummary() {
    const monthFilter = document.getElementById('attendanceMonthSelect')?.value || '';
    const tbody = document.getElementById('attSummaryBody');
    if (!tbody) return;
    try {
        let records = await getAll('attendance');
        if (monthFilter) records = records.filter(a => a.date && a.date.startsWith(monthFilter));
        const empMap = {};
        records.forEach(rec => {
            if (!empMap[rec.employeeId]) empMap[rec.employeeId] = { name: rec.employeeName, Present: 0, Absent: 0, 'Half Day': 0, total: 0 };
            empMap[rec.employeeId][rec.status] = (empMap[rec.employeeId][rec.status] || 0) + 1;
            empMap[rec.employeeId].total++;
        });
        tbody.innerHTML = '';
        const empIds = Object.keys(empMap);
        if (empIds.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#888;padding:20px;">No data for selected month.</td></tr>`;
            return;
        }
        empIds.forEach(id => {
            const e = empMap[id];
            const pct = e.total > 0 ? Math.round((e.Present / e.total) * 100) : 0;
            const barColor = pct >= 80 ? '#4caf50' : pct >= 60 ? '#ff9800' : '#dc3545';
            tbody.innerHTML += `
                <tr>
                    <td><strong>${e.name}</strong></td>
                    <td style="color:#2e7d32;font-weight:bold;">${e.Present}</td>
                    <td style="color:#dc3545;font-weight:bold;">${e.Absent}</td>
                    <td style="color:#f57c00;font-weight:bold;">${e['Half Day']}</td>
                    <td>${e.total}</td>
                    <td>
                        <div style="background:#eee;border-radius:4px;height:14px;width:100%;overflow:hidden;">
                            <div style="background:${barColor};width:${pct}%;height:100%;border-radius:4px;"></div>
                        </div>
                        <span style="font-size:11px;color:#555;">${pct}%</span>
                    </td>
                </tr>
            `;
        });
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#c00;padding:20px;">⚠ Failed to load summary.</td></tr>`;
    }
}

async function bulkMarkAttendance(defaultStatus) {
    try {
        const emps   = await getAll('employees');
        const active = emps.filter(e => e.status === 'Active' || e.status === 'Working' || e.status === 'Pending');
        if (active.length === 0) { alert('No active employees to mark.'); return; }
        const today = new Date().toISOString().slice(0, 10);
        let added = 0;
        await Promise.all(active.map(async emp => {
            try {
                await setDoc(docRef('attendance', `${emp.id}_${today}`), {
                    employeeId: emp.id,
                    employeeName: `${emp.firstName} ${emp.lastName || ''}`,
                    date: today, status: defaultStatus, notes: 'Bulk marked',
                    updatedAt: serverTimestamp()
                });
                added++;
            } catch (_) {}
        }));
        showNotification(`✅ Marked ${added} employees as ${defaultStatus}`, 'success');
        loadAttendanceTable();
        loadAttendanceSummaryCards();
        loadAttendanceMonthlySummary();
    } catch (err) { showNotification('❌ Bulk mark failed', 'warning'); }
}

async function exportAttendanceCSV() {
    const monthFilter = document.getElementById('attendanceMonthSelect')?.value || '';
    try {
        let records = await getAll('attendance');
        if (monthFilter) records = records.filter(a => a.date && a.date.startsWith(monthFilter));
        if (records.length === 0) { alert('No records to export.'); return; }
        let csv = 'Date,Employee,Status,Notes\n';
        records.forEach(rec => { csv += `"${rec.date}","${rec.employeeName}","${rec.status}","${rec.notes || ''}"\n`; });
        const blob = new Blob([csv], { type: 'text/csv' });
        const a    = document.createElement('a');
        a.href     = URL.createObjectURL(blob);
        a.download = 'attendance' + (monthFilter ? '-' + monthFilter : '') + '.csv';
        a.click();
        showNotification('📥 Attendance exported', 'success');
    } catch (err) { showNotification('❌ Export failed', 'warning'); }
}

// ===============================
// DOCUMENTS
// ===============================
async function initDocumentsSection() {
    await loadDocEmployeeFilter();
    await loadDocEmployeeUploadDropdown();
    renderDocumentCards();
    updateDocSummaryCards();
}

async function loadDocEmployeeFilter() {
    const sel = document.getElementById('docEmpFilter');
    if (!sel) return;
    const prev = sel.value;
    try {
        const emps = await getAll('employees');
        sel.innerHTML = '<option value="">All Employees</option>';
        emps.forEach(emp => { sel.innerHTML += `<option value="${emp.id}">${emp.firstName} ${emp.lastName || ''}</option>`; });
        sel.value = prev;
    } catch (err) { console.error('Doc employee filter error:', err); }
}

async function loadDocEmployeeUploadDropdown() {
    const sel = document.getElementById('docUploadEmpSelect');
    if (!sel) return;
    try {
        const emps = await getAll('employees');
        sel.innerHTML = '<option value="">Select Employee</option>';
        emps.forEach(emp => { sel.innerHTML += `<option value="${emp.id}">${emp.firstName} ${emp.lastName || ''} (${emp.role || '-'})</option>`; });
    } catch (err) { console.error('Doc upload dropdown error:', err); }
}

function openDocUploadModal(empId) {
    loadDocEmployeeUploadDropdown().then(() => {
        const sel = document.getElementById('docUploadEmpSelect');
        if (sel && empId) sel.value = empId;
    });
    document.getElementById('docTypeSelect').value  = 'Aadhar Card';
    document.getElementById('docFileInput').value   = '';
    document.getElementById('docNotes').value       = '';
    document.getElementById('docUploadPreview').style.display = 'none';
    document.getElementById('docUploadModal').classList.add('active');
}

function closeDocUploadModal() {
    document.getElementById('docUploadModal').classList.remove('active');
}

function previewDocFile() {
    const file    = document.getElementById('docFileInput').files[0];
    const preview = document.getElementById('docUploadPreview');
    if (!file) { preview.style.display = 'none'; return; }
    const sizeMB = (file.size / 1024 / 1024).toFixed(2);
    preview.style.display = 'block';
    preview.innerHTML = `
        <div class="doc-preview-info">
            <span class="doc-file-icon">${getFileIcon(file.type)}</span>
            <div><strong>${file.name}</strong><br>
            <span style="font-size:12px;color:#666;">${formatFileType(file.type)} • ${sizeMB} MB</span></div>
        </div>`;
    if (parseFloat(sizeMB) > 5) {
        preview.innerHTML += `<p style="color:#d32f2f;font-size:12px;margin:6px 0 0;">⚠ Large file (${sizeMB} MB). Keep docs under 5 MB.</p>`;
    }
}

async function saveDocument() {
    const empId   = document.getElementById('docUploadEmpSelect').value;
    const docType = document.getElementById('docTypeSelect').value;
    const notes   = document.getElementById('docNotes').value.trim();
    const file    = document.getElementById('docFileInput').files[0];
    if (!empId)  { alert('Please select an employee.'); return; }
    if (!file)   { alert('Please choose a file.'); return; }
    if (file.size / 1024 / 1024 > 10) { alert('File too large. Max 10 MB.'); return; }
    const base64 = await toBase64(file);
    try {
        const emp = await getById('employees', empId);
        await addItem('documents', {
            employeeId:   empId,
            employeeName: `${emp.firstName} ${emp.lastName || ''}`,
            docType, fileName: file.name, fileType: file.type,
            fileSize: file.size, base64, notes
        });
        showNotification('📎 Document uploaded', 'success');
        closeDocUploadModal();
        await renderDocumentCards();
        updateDocSummaryCards();
    } catch (err) { showNotification('❌ Failed to upload document', 'warning'); }
}

async function renderDocumentCards() {
    const container  = document.getElementById('docCardsContainer');
    if (!container) return;
    const empFilter  = document.getElementById('docEmpFilter')?.value  || '';
    const typeFilter = document.getElementById('docTypeFilter')?.value || '';
    const DOC_ICONS = {
        'Aadhar Card':'🪪','PAN Card':'🗂','Passport':'📕','Driving Licence':'🚗',
        'Offer Letter':'📄','Experience Letter':'📜','Relieving Letter':'📜',
        'Bank Passbook':'🏦','Salary Slip':'💰','Medical Certificate':'🏥',
        'Police Verification':'🛡','Other':'📎'
    };
    try {
        let docs = await getAll('documents');
        if (empFilter)  docs = docs.filter(d => d.employeeId === empFilter);
        if (typeFilter) docs = docs.filter(d => d.docType === typeFilter);
        docs.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        window._docCache = docs;
        container.innerHTML = '';
        if (docs.length === 0) {
            container.innerHTML = `<div class="doc-empty"><div style="font-size:40px;margin-bottom:10px;">📂</div><p>No documents found. Upload the first one!</p></div>`;
            return;
        }
        const grouped = {};
        docs.forEach(doc => {
            if (!grouped[doc.employeeId]) grouped[doc.employeeId] = { name: doc.employeeName, docs: [] };
            grouped[doc.employeeId].docs.push(doc);
        });
        Object.values(grouped).forEach(group => {
            const section = document.createElement('div');
            section.className = 'doc-employee-group';
            const empId = group.docs[0].employeeId;
            section.innerHTML = `
                <div class="doc-group-header">
                    <div class="doc-emp-avatar">${getInitials(group.name)}</div>
                    <div><strong>${group.name}</strong>
                    <span class="doc-count-badge">${group.docs.length} document${group.docs.length !== 1 ? 's' : ''}</span></div>
                    <button class="doc-add-btn" onclick="openDocUploadModal('${empId}')">+ Add</button>
                </div>
                <div class="doc-cards-row" id="docRow-${empId}"></div>
            `;
            container.appendChild(section);
            const row = document.getElementById('docRow-' + empId);
            group.docs.forEach(doc => {
                const card = document.createElement('div');
                card.className = 'doc-card';
                const uploadedDate = doc.createdAt?.seconds
                    ? new Date(doc.createdAt.seconds * 1000).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })
                    : '-';
                card.innerHTML = `
                    <div class="doc-card-icon">${DOC_ICONS[doc.docType] || '📎'}</div>
                    <div class="doc-card-type">${doc.docType}</div>
                    <div class="doc-card-filename" title="${doc.fileName}">${truncateFilename(doc.fileName)}</div>
                    <div class="doc-card-size">${formatFileSize(doc.fileSize)}</div>
                    <div class="doc-card-date">${uploadedDate}</div>
                    ${doc.notes ? `<div class="doc-card-notes" title="${doc.notes}">📝 ${doc.notes}</div>` : ''}
                    <div class="doc-card-actions">
                        <button class="doc-btn-view"   onclick="viewDocument('${doc.id}')">View</button>
                        <button class="doc-btn-dl"     onclick="downloadDocument('${doc.id}')">Download</button>
                        <button class="doc-btn-delete" onclick="deleteDocument('${doc.id}')">Delete</button>
                    </div>
                `;
                row.appendChild(card);
            });
        });
    } catch (err) {
        container.innerHTML = `<div class="doc-empty"><p style="color:#c00;">⚠ Failed to load documents.</p></div>`;
    }
}

async function viewDocument(id) {
    try {
        const cached = (window._docCache || []).find(d => d.id === id);
        let doc = cached || await getById('documents', id);
        if (!doc) return;
        const win = window.open('', '_blank');
        if (!win) { alert('Pop-up blocked. Please allow pop-ups.'); return; }
        if (doc.fileType === 'application/pdf') {
            win.document.write(`<html><head><title>${doc.fileName}</title></head>
                <body style="margin:0;"><embed src="${doc.base64}" type="application/pdf" width="100%" height="100%"
                style="position:fixed;top:0;left:0;width:100%;height:100%;"></body></html>`);
        } else if (doc.fileType.startsWith('image/')) {
            win.document.write(`<html><head><title>${doc.fileName}</title></head>
                <body style="margin:0;background:#111;display:flex;justify-content:center;align-items:center;min-height:100vh;">
                <img src="${doc.base64}" style="max-width:100%;max-height:100vh;object-fit:contain;"></body></html>`);
        } else {
            win.close();
            downloadDocument(id);
        }
    } catch (err) { showNotification('❌ Failed to view document', 'warning'); }
}

async function downloadDocument(id) {
    try {
        const cached = (window._docCache || []).find(d => d.id === id);
        let doc = cached || await getById('documents', id);
        if (!doc) return;
        const a    = document.createElement('a');
        a.href     = doc.base64;
        a.download = doc.fileName;
        a.click();
        showNotification('📥 Downloading ' + doc.fileName, 'info');
    } catch (err) { showNotification('❌ Failed to download', 'warning'); }
}

async function deleteDocument(id) {
    if (!confirm('Delete this document? This cannot be undone.')) return;
    try {
        await deleteItem('documents', id);
        showNotification('🗑 Document deleted', 'warning');
        renderDocumentCards();
        updateDocSummaryCards();
    } catch (err) { showNotification('❌ Failed to delete document', 'warning'); }
}

async function updateDocSummaryCards() {
    try {
        const docs = await getAll('documents');
        const typeCounts = {};
        docs.forEach(d => { typeCounts[d.docType] = (typeCounts[d.docType] || 0) + 1; });
        const topType = Object.keys(typeCounts).sort((a, b) => typeCounts[b] - typeCounts[a])[0] || '-';
        const set = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
        set('docCardTotal',   docs.length);
        set('docCardEmps',    new Set(docs.map(d => d.employeeId)).size);
        set('docCardSize',    (docs.reduce((s, d) => s + (d.fileSize || 0), 0) / 1024 / 1024).toFixed(1) + ' MB');
        set('docCardTopType', topType);
    } catch (err) { console.error('Doc summary error:', err); }
}

// ===============================
// SETTINGS
// ===============================
async function loadSettings() {
    try {
        const snap = await getDoc(docRef('settings', 'company'));
        if (!snap.exists()) return;
        const s = snap.data();
        const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
        set('companyName',    s.companyName);
        set('companyAddress', s.companyAddress);
        set('companyPhone',   s.companyPhone);
        set('companyEmail',   s.companyEmail);
        set('companyGST',     s.companyGST);
    } catch (err) { console.error('Load settings error:', err); }
}

async function saveSettings() {
    const payload = {
        companyName:    document.getElementById('companyName').value,
        companyAddress: document.getElementById('companyAddress').value,
        companyPhone:   document.getElementById('companyPhone').value,
        companyEmail:   document.getElementById('companyEmail').value,
        companyGST:     document.getElementById('companyGST').value
    };
    try {
        await setDoc(docRef('settings', 'company'), payload);
        showNotification('✅ Settings saved', 'success');
    } catch (err) { showNotification('❌ Failed to save settings', 'warning'); }
}

async function changePassword() {
    const newPass = prompt('Enter new password');
    if (!newPass) return;
    try {
        await setDoc(docRef('settings', 'auth'), { erpPassword: newPass }, { merge: true });
        localStorage.setItem('erpPassword', newPass);
        showNotification('🔑 Password changed', 'success');
    } catch (err) { alert('Failed to change password'); }
}

function logoutUser() {
    localStorage.removeItem('erpUser');
    window.location.href = 'login.html';
}

function backupERP() {
    const data = JSON.stringify(localStorage);
    const blob = new Blob([data], { type: 'application/json' });
    const a    = document.createElement('a');
    a.href     = URL.createObjectURL(blob);
    a.download = 'erp-backup.json';
    a.click();
    showNotification('💾 ERP backup created', 'success');
}

function restoreERP() {
    const input = document.createElement('input');
    input.type  = 'file';
    input.onchange = function (e) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const data = JSON.parse(event.target.result);
            Object.keys(data).forEach(key => localStorage.setItem(key, data[key]));
            showNotification('♻ ERP restored', 'info');
            location.reload();
        };
        reader.readAsText(e.target.files[0]);
    };
    input.click();
}

async function resetInvoiceCounter() {
    if (!confirm('Reset invoice counter to 1?')) return;
    await setDoc(docRef('settings', 'company'), { invoiceCounter: 1 }, { merge: true });
    showNotification('🔄 Invoice counter reset', 'success');
}

async function resetEmployeeStatus() {
    if (!confirm('Reset all "On Leave" employees back to Active?')) return;
    try {
        const emps = await getAll('employees');
        await Promise.all(emps.filter(e => e.status === 'On Leave').map(e => updateItem('employees', e.id, { status: 'Active' })));
        showNotification('✅ Employee statuses reset', 'success');
    } catch (err) { showNotification('❌ Failed', 'warning'); }
}

function clearERP() {
    if (!confirm('This will clear local data only. Firestore data is unaffected. Continue?')) return;
    localStorage.clear();
    showNotification('⚠ Local data cleared', 'warning');
    location.reload();
}

// ===============================
// STAFF SALARY MODAL
// ===============================
async function openStaffSalaryModal() {
    try {
        const emps = await getAll('employees');
        const staffOnly = emps.filter(e => e.role === 'Staff' &&
            (e.status === 'Active' || e.status === 'Working' || e.status === 'Pending'));
        const existing = document.getElementById('staffSalaryModal');
        if (existing) existing.remove();
        const modal = document.createElement('div');
        modal.id = 'staffSalaryModal';
        modal.className = 'custom-modal active';
        modal.innerHTML = `
            <div class="custom-modal-content" style="max-width:420px;">
                <h3 style="margin-top:0;">💼 Staff Salary Payment</h3>
                <label style="font-size:13px;font-weight:600;">Staff Member</label>
                <select id="staffSalaryEmpSelect" style="width:100%;margin:8px 0 14px;padding:9px;border-radius:8px;border:1px solid #ddd;">
                    <option value="">Select Staff</option>
                    ${staffOnly.map(e => `<option value="${e.id}">${e.firstName} ${e.lastName || ''}</option>`).join('')}
                </select>
                <label style="font-size:13px;font-weight:600;">Amount (₹)</label>
                <input type="number" id="staffSalaryAmount" placeholder="Enter salary amount"
                    style="width:100%;margin:8px 0 14px;padding:9px;border-radius:8px;border:1px solid #ddd;box-sizing:border-box;">
                <label style="font-size:13px;font-weight:600;">Payment Mode</label>
                <select id="staffSalaryMode" style="width:100%;margin:8px 0 14px;padding:9px;border-radius:8px;border:1px solid #ddd;">
                    <option value="">Select Mode</option>
                    <option value="cash">Cash</option>
                    <option value="upi">UPI</option>
                    <option value="netbanking">Net Banking</option>
                </select>
                <label style="font-size:13px;font-weight:600;">Notes (optional)</label>
                <input type="text" id="staffSalaryNotes" placeholder="e.g. March salary"
                    style="width:100%;margin:8px 0 20px;padding:9px;border-radius:8px;border:1px solid #ddd;box-sizing:border-box;">
                <div style="display:flex;justify-content:flex-end;gap:10px;">
                    <button onclick="document.getElementById('staffSalaryModal').remove()"
                        style="background:#e0e0e0;border:none;padding:9px 18px;border-radius:8px;cursor:pointer;">Cancel</button>
                    <button onclick="saveStaffSalary()"
                        style="background:#6366f1;color:white;border:none;padding:9px 18px;border-radius:8px;font-weight:600;cursor:pointer;">Pay Salary</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    } catch (err) { showNotification('❌ Failed to load staff list', 'warning'); }
}

async function saveStaffSalary() {
    const empId  = document.getElementById('staffSalaryEmpSelect').value;
    const amount = Number(document.getElementById('staffSalaryAmount').value);
    const mode   = document.getElementById('staffSalaryMode').value;
    const notes  = document.getElementById('staffSalaryNotes').value.trim();
    if (!empId)  { showNotification('⚠ Select a staff member', 'warning'); return; }
    if (!amount || amount <= 0) { showNotification('⚠ Enter valid amount', 'warning'); return; }
    if (!mode)   { showNotification('⚠ Select payment mode', 'warning'); return; }
    try {
        const emp = await getById('employees', empId);
        await addFinanceTxnDirect({
            type: 'debit',
            date: new Date().toISOString().slice(0,10),
            paidTo: `${emp.firstName} ${emp.lastName || ''} (Staff)`,
            category: 'salary',
            paymentMode: mode,
            amount,
            notes: notes || 'Staff Salary Payment'
        });
        document.getElementById('staffSalaryModal').remove();
        showNotification(`✅ Salary of ₹${amount} paid to ${emp.firstName}`, 'success');
        refreshFinanceUI();
    } catch (err) { showNotification('❌ Failed to save salary', 'warning'); }
}

// ===============================
// DARK MODE
// ===============================
function toggleDarkMode() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('erpDarkMode', isDark ? 'enabled' : 'disabled');
    document.querySelectorAll('#darkModeToggle').forEach(t => { t.checked = isDark; });
    if (typeof updateDashboard === 'function') updateDashboard();
}

function loadDarkMode() {
    const enabled = localStorage.getItem('erpDarkMode') === 'enabled';
    if (enabled) document.body.classList.add('dark-mode');
    else          document.body.classList.remove('dark-mode');
    setTimeout(() => {
        document.querySelectorAll('#darkModeToggle').forEach(t => { t.checked = enabled; });
    }, 80);
}

// ===============================
// AUTO LOGOUT
// ===============================
let inactivityTimer, warningTimer;
function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    clearTimeout(warningTimer);
    warningTimer    = setTimeout(() => alert('You will be logged out in 1 minute due to inactivity.'), 4 * 60 * 1000);
    inactivityTimer = setTimeout(() => {
        alert('Logged out due to inactivity.');
        localStorage.removeItem('erpUser');
        window.location.href = 'login.html';
    }, 5 * 60 * 1000);
}
['mousemove','keydown','click','scroll'].forEach(event => {
    document.addEventListener(event, resetInactivityTimer);
});

// ===============================
// NOTIFICATIONS
// ===============================
function showNotification(message, type = 'success') {
    const container = document.getElementById('notificationContainer');
    if (!container) return;
    const note = document.createElement('div');
    note.className = `erp-notification erp-${type}`;
    note.innerHTML = message;
    container.appendChild(note);
    setTimeout(() => {
        note.style.opacity   = '0';
        note.style.transform = 'translateX(40px)';
        setTimeout(() => note.remove(), 300);
    }, 3000);
}

// ===============================
// SHARED HELPERS
// ===============================
function getAttStatusClass(status) {
    if (status === 'Present')  return 'att-present';
    if (status === 'Absent')   return 'att-absent';
    if (status === 'Half Day') return 'att-halfday';
    if (status === 'Holiday')  return 'att-holiday';
    return '';
}
function formatAttDate(dateStr) {
    if (!dateStr) return '-';
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
function getInitials(name) {
    return (name || '').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}
function truncateFilename(name, max = 20) {
    if (!name) return '-';
    if (name.length <= max) return name;
    const ext = name.lastIndexOf('.');
    if (ext > 0) return name.slice(0, max - 4) + '...' + name.slice(ext);
    return name.slice(0, max) + '...';
}
function formatFileSize(bytes) {
    if (!bytes) return '-';
    if (bytes < 1024)        return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}
function formatDocDate(iso) {
    if (!iso) return '-';
    return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
function getFileIcon(mimeType) {
    if (!mimeType) return '📎';
    if (mimeType === 'application/pdf')               return '📕';
    if (mimeType.startsWith('image/'))               return '🖼';
    if (mimeType.includes('word'))                   return '📝';
    if (mimeType.includes('sheet') || mimeType.includes('excel')) return '📊';
    return '📎';
}
function formatFileType(mimeType) {
    if (!mimeType) return 'File';
    if (mimeType === 'application/pdf')  return 'PDF';
    if (mimeType.startsWith('image/'))  return mimeType.split('/')[1].toUpperCase();
    if (mimeType.includes('word'))      return 'Word Document';
    if (mimeType.includes('sheet'))     return 'Spreadsheet';
    return mimeType.split('/')[1]?.toUpperCase() || 'File';
}
function getTaxLabel(taxType) {
    if (taxType === 'gst')       return 'IGST (18%)';
    if (taxType === 'cgst_sgst') return 'CGST + SGST';
    return 'Non-GST';
}

// ===============================
// INVOICE HELPERS
// ===============================
const indianStates = [
    "Karnataka","Maharashtra","Tamil Nadu","Kerala","Telangana","Andhra Pradesh",
    "Delhi","Uttar Pradesh","Gujarat","Rajasthan","West Bengal","Bihar",
    "Madhya Pradesh","Punjab","Haryana","Odisha","Assam","Jharkhand",
    "Chhattisgarh","Himachal Pradesh","Uttarakhand","Goa","Tripura","Manipur",
    "Meghalaya","Nagaland","Mizoram","Sikkim","Arunachal Pradesh",
    "Andaman and Nicobar Islands","Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu","Lakshadweep",
    "Puducherry","Ladakh","Jammu and Kashmir"
];

function loadStates() {
    const select = document.getElementById('customerState');
    if (!select) return;
    select.innerHTML = '<option value="">Select State</option>';
    indianStates.forEach(state => {
        const option = document.createElement('option');
        option.value = state;
        option.textContent = state;
        select.appendChild(option);
    });
}

function openCreateInvoice(taxMode) {
    showSection('createInvoice');
    if (window.customerChoicesInstance) {
        try { window.customerChoicesInstance.destroy(); } catch(e) {}
        window.customerChoicesInstance = null;
    }
    const select = document.getElementById('customerSelect');
    if (select) {
        select.innerHTML = '<option value="">\u2014 Select Saved Customer \u2014</option>';
        (window._appCustomers || []).forEach(cust => {
            select.innerHTML += `<option value="${cust.id}">${cust.name}</option>`;
        });
        if (typeof Choices !== 'undefined') {
            window.customerChoicesInstance = new Choices(select, {
                searchEnabled: true, itemSelectText: '', shouldSort: false
            });
        }
    }
    resetInvoiceForm();
    ['billName','billAddress','billState','invoiceCustomerPhone'].forEach(id => {
        const el = document.getElementById(id); if (el) el.value = '';
    });
    const taxRadio = document.querySelector(`input[name="taxType"][value="${taxMode === 'gst' ? 'gst' : 'none'}"]`);
    if (taxRadio) taxRadio.checked = true;
    calculateInvoiceLive();
}

// ===============================
// INIT ON LOAD
// ===============================
window.addEventListener('load', async function () {
    loadDarkMode();
    resetInactivityTimer();
    loadStates();

    try {
        const customers = await getAll('customers');
        window._appCustomers = customers;
        loadCustomerDropdown(customers);
        attachCustomerSelectListener();
    } catch (_) {}

    try {
        window._appInvoices = await getAll('invoices');
    } catch (_) {}

    document.getElementById('salaryEmployeeSelect')?.addEventListener('change', loadSalarySummary);
    document.getElementById('salaryMonthSelect')?.addEventListener('change', loadSalarySummary);

    updateDashboard();
    loadSalaryMonths();
    loadSalaryEmployees();
});