// ===============================
// ATTENDANCE MODULE
// ===============================

function getAttendanceDB() {
    let db = JSON.parse(localStorage.getItem("erpDB")) || {};
    if (!db.attendance) {
        db.attendance = [];
        localStorage.setItem("erpDB", JSON.stringify(db));
    }
    if (!db.employees) db.employees = [];
    return db;
}

function saveAttendanceDB(db) {
    localStorage.setItem("erpDB", JSON.stringify(db));
    window.db = db;
}

// ---- LOAD EMPLOYEE DROPDOWN ----
function loadAttendanceEmployeeDropdown() {
    const db = getAttendanceDB();
    const select = document.getElementById("attendanceEmployeeSelect");
    if (!select) return;

    const prev = select.value;
    select.innerHTML = '<option value="">-- All Employees --</option>';
    db.employees.forEach(emp => {
        select.innerHTML += `<option value="${emp.id}">${emp.firstName} ${emp.lastName} (${emp.role || "-"})</option>`;
    });
    select.value = prev;
}

// ---- LOAD MONTH DROPDOWN ----
function loadAttendanceMonths() {
    const select = document.getElementById("attendanceMonthSelect");
    if (!select) return;
    const prev = select.value;
    select.innerHTML = "";
    const now = new Date();
    for (let i = -3; i <= 1; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
        const value = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
        const label = d.toLocaleString("default", { month: "long" }) + " " + d.getFullYear();
        const opt = document.createElement("option");
        opt.value = value;
        opt.textContent = label;
        if (i === 0) opt.selected = true;
        select.appendChild(opt);
    }
    if (prev) select.value = prev;
}

// ---- OPEN MARK ATTENDANCE MODAL ----
function openMarkAttendanceModal() {
    const db = getAttendanceDB();
    const select = document.getElementById("markAttEmpSelect");
    if (!select) return;

    select.innerHTML = '<option value="">Select Employee</option>';
    db.employees
        .filter(e => e.status === "Active" || e.status === "Working" || e.status === "Pending")
        .forEach(emp => {
            select.innerHTML += `<option value="${emp.id}">${emp.firstName} ${emp.lastName}</option>`;
        });

    // Default date = today
    const today = new Date().toISOString().slice(0, 10);
    document.getElementById("markAttDate").value = today;
    document.getElementById("markAttStatus").value = "Present";
    document.getElementById("markAttNotes").value = "";

    document.getElementById("markAttendanceModal").classList.add("active");
}

function closeMarkAttendanceModal() {
    document.getElementById("markAttendanceModal").classList.remove("active");
}

// ---- SAVE ATTENDANCE RECORD ----
function saveAttendanceRecord() {
    const empId = document.getElementById("markAttEmpSelect").value;
    const date  = document.getElementById("markAttDate").value;
    const status = document.getElementById("markAttStatus").value;
    const notes = document.getElementById("markAttNotes").value.trim();

    if (!empId || !date || !status) {
        alert("Please fill all required fields.");
        return;
    }

    const db = getAttendanceDB();

    // Prevent duplicate entry for same employee + date
    const existing = db.attendance.find(a => a.employeeId == empId && a.date === date);
    if (existing) {
        if (!confirm("An attendance record already exists for this employee on this date. Overwrite it?")) return;
        existing.status = status;
        existing.notes = notes;
        existing.updatedAt = new Date().toISOString();
    } else {
        const emp = db.employees.find(e => e.id == empId);
        db.attendance.push({
            id: "ATT-" + Date.now(),
            employeeId: Number(empId),
            employeeName: emp.firstName + " " + emp.lastName,
            date: date,
            status: status,
            notes: notes,
            recordedAt: new Date().toISOString()
        });
    }

    saveAttendanceDB(db);
    showNotification("✅ Attendance saved", "success");
    closeMarkAttendanceModal();
    loadAttendanceTable();
    loadAttendanceSummaryCards();
    loadAttendanceMonthlySummary();
}

// ---- DELETE ATTENDANCE RECORD ----
function deleteAttendanceRecord(id) {
    if (!confirm("Delete this attendance record?")) return;
    const db = getAttendanceDB();
    db.attendance = db.attendance.filter(a => a.id !== id);
    saveAttendanceDB(db);
    showNotification("🗑 Record deleted", "warning");
    loadAttendanceTable();
    loadAttendanceSummaryCards();
    loadAttendanceMonthlySummary();
}

// ---- LOAD ATTENDANCE TABLE ----
function loadAttendanceTable() {
    const db = getAttendanceDB();
    const tbody = document.getElementById("attendanceTableBody");
    if (!tbody) return;

    const empFilter   = document.getElementById("attendanceEmployeeSelect")?.value || "";
    const monthFilter = document.getElementById("attendanceMonthSelect")?.value || "";
    const statFilter  = document.getElementById("attendanceStatusFilter")?.value || "";

    let records = [...db.attendance];

    if (empFilter)   records = records.filter(a => a.employeeId == empFilter);
    if (monthFilter) records = records.filter(a => a.date && a.date.startsWith(monthFilter));
    if (statFilter)  records = records.filter(a => a.status === statFilter);

    // Sort newest first
    records.sort((a, b) => new Date(b.date) - new Date(a.date));

    tbody.innerHTML = "";

    if (records.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#888; padding:20px;">No attendance records found.</td></tr>`;
        return;
    }

    records.forEach(rec => {
        const statusClass = getAttStatusClass(rec.status);
        tbody.innerHTML += `
            <tr>
                <td>${formatAttDate(rec.date)}</td>
                <td><strong>${rec.employeeName}</strong></td>
                <td><span class="${statusClass}">${rec.status}</span></td>
                <td>${rec.notes || "-"}</td>
                <td style="text-align:center;">
                    <button onclick="deleteAttendanceRecord('${rec.id}')"
                        style="background:#dc3545;color:white;border:none;padding:4px 10px;border-radius:4px;cursor:pointer;font-size:12px;">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });
}

// ---- SUMMARY CARDS ----
function loadAttendanceSummaryCards() {
    const db = getAttendanceDB();
    const monthFilter = document.getElementById("attendanceMonthSelect")?.value || "";

    let records = db.attendance;
    if (monthFilter) records = records.filter(a => a.date && a.date.startsWith(monthFilter));

    const total    = records.length;
    const present  = records.filter(a => a.status === "Present").length;
    const absent   = records.filter(a => a.status === "Absent").length;
    const halfDay  = records.filter(a => a.status === "Half Day").length;

    const el = id => document.getElementById(id);
    if (el("attCardTotal"))   el("attCardTotal").innerText   = total;
    if (el("attCardPresent")) el("attCardPresent").innerText = present;
    if (el("attCardAbsent"))  el("attCardAbsent").innerText  = absent;
    if (el("attCardHalfDay")) el("attCardHalfDay").innerText = halfDay;
}

// ---- MONTHLY SUMMARY TABLE ----
function loadAttendanceMonthlySummary() {
    const db = getAttendanceDB();
    const monthFilter = document.getElementById("attendanceMonthSelect")?.value || "";
    const tbody = document.getElementById("attSummaryBody");
    if (!tbody) return;

    let records = db.attendance;
    if (monthFilter) records = records.filter(a => a.date && a.date.startsWith(monthFilter));

    // Group by employee
    const empMap = {};
    records.forEach(rec => {
        if (!empMap[rec.employeeId]) {
            empMap[rec.employeeId] = {
                name: rec.employeeName,
                Present: 0, Absent: 0, "Half Day": 0, Holiday: 0, total: 0
            };
        }
        empMap[rec.employeeId][rec.status] = (empMap[rec.employeeId][rec.status] || 0) + 1;
        empMap[rec.employeeId].total++;
    });

    tbody.innerHTML = "";

    const empIds = Object.keys(empMap);
    if (empIds.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#888; padding:20px;">No data for selected month.</td></tr>`;
        return;
    }

    empIds.forEach(id => {
        const e = empMap[id];
        const attPct = e.total > 0 ? Math.round((e.Present / e.total) * 100) : 0;
        const barColor = attPct >= 80 ? "#4caf50" : attPct >= 60 ? "#ff9800" : "#dc3545";
        tbody.innerHTML += `
            <tr>
                <td><strong>${e.name}</strong></td>
                <td style="color:#2e7d32;font-weight:bold;">${e.Present}</td>
                <td style="color:#dc3545;font-weight:bold;">${e.Absent}</td>
                <td style="color:#f57c00;font-weight:bold;">${e["Half Day"]}</td>
                <td>${e.total}</td>
                <td>
                    <div style="background:#eee;border-radius:4px;height:14px;width:100%;overflow:hidden;">
                        <div style="background:${barColor};width:${attPct}%;height:100%;border-radius:4px;transition:width 0.3s;"></div>
                    </div>
                    <span style="font-size:11px;color:#555;">${attPct}%</span>
                </td>
            </tr>
        `;
    });
}

// ---- BULK MARK (mark all active employees for today) ----
function bulkMarkAttendance(defaultStatus) {
    const db = getAttendanceDB();
    const today = new Date().toISOString().slice(0, 10);
    const activeEmps = db.employees.filter(e => e.status === "Active" || e.status === "Working" || e.status === "Pending");

    if (activeEmps.length === 0) {
        alert("No active employees to mark.");
        return;
    }

    let added = 0;
    let skipped = 0;

    activeEmps.forEach(emp => {
        const exists = db.attendance.find(a => a.employeeId == emp.id && a.date === today);
        if (exists) { skipped++; return; }
        db.attendance.push({
            id: "ATT-" + Date.now() + "-" + emp.id,
            employeeId: emp.id,
            employeeName: emp.firstName + " " + emp.lastName,
            date: today,
            status: defaultStatus,
            notes: "Bulk marked",
            recordedAt: new Date().toISOString()
        });
        added++;
    });

    saveAttendanceDB(db);
    showNotification(`✅ Marked ${added} employees as ${defaultStatus}${skipped > 0 ? ` (${skipped} already had records)` : ""}`, "success");
    loadAttendanceTable();
    loadAttendanceSummaryCards();
    loadAttendanceMonthlySummary();
}

// ---- EXPORT ATTENDANCE CSV ----
function exportAttendanceCSV() {
    const db = getAttendanceDB();
    const monthFilter = document.getElementById("attendanceMonthSelect")?.value || "";

    let records = db.attendance;
    if (monthFilter) records = records.filter(a => a.date && a.date.startsWith(monthFilter));

    if (records.length === 0) {
        alert("No attendance records to export.");
        return;
    }

    records.sort((a, b) => new Date(a.date) - new Date(b.date));

    let csv = "Date,Employee,Status,Notes\n";
    records.forEach(rec => {
        csv += `"${rec.date}","${rec.employeeName}","${rec.status}","${rec.notes || ""}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url;
    a.download = "attendance" + (monthFilter ? "-" + monthFilter : "") + ".csv";
    a.click();
    showNotification("📥 Attendance exported", "success");
}

// ---- HELPERS ----
function getAttStatusClass(status) {
    if (status === "Present")  return "att-present";
    if (status === "Absent")   return "att-absent";
    if (status === "Half Day") return "att-halfday";
    if (status === "Holiday")  return "att-holiday";
    return "";
}

function formatAttDate(dateStr) {
    if (!dateStr) return "-";
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

// ---- INIT (called by showSection) ----
function initAttendanceSection() {
    loadAttendanceMonths();
    loadAttendanceEmployeeDropdown();
    loadAttendanceSummaryCards();
    loadAttendanceTable();
    loadAttendanceMonthlySummary();
}
