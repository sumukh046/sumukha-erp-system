// ===============================
// LEAVE MANAGEMENT SYSTEM
// ===============================

// Helper function to safely get the database including the leaves array
function getLeaveDB() {
    let db = JSON.parse(localStorage.getItem("erpDB")) || { employees: [], leaves: [] };
    if (!db.leaves) {
        db.leaves = []; // Initialize leaves array if it doesn't exist yet
        localStorage.setItem("erpDB", JSON.stringify(db));
    }
    return db;
}

// Opens the Leave Modal and populates the Employee Dropdown
function openLeaveModal() {
    const db = getLeaveDB();
    const select = document.getElementById("leaveEmployeeSelect");
    
    // Populate dropdown with current employees
    select.innerHTML = '<option value="">Select Employee</option>';
    db.employees.forEach(emp => {
        select.innerHTML += `<option value="${emp.id}">${emp.firstName} ${emp.lastName} (${emp.status})</option>`;
    });

    // Set default date to today
    document.getElementById("leaveStartDate").value = new Date().toISOString().slice(0, 10);
    
    document.getElementById("leaveModal").classList.add("active");
}

// Closes the modal and resets the form
function closeLeaveModal() {
    document.getElementById("leaveModal").classList.remove("active");
    document.getElementById("leaveEmployeeSelect").value = "";
    document.getElementById("leaveReason").value = "";
    document.getElementById("leaveDays").value = "1";
}

// Saves the leave record and updates Employee Status
function saveLeave() {
    const empId = document.getElementById("leaveEmployeeSelect").value;
    const type = document.getElementById("leaveType").value;
    const startDate = document.getElementById("leaveStartDate").value;
    const days = document.getElementById("leaveDays").value;
    const reason = document.getElementById("leaveReason").value;

    if (!empId || !startDate || !days) {
        alert("Please select an employee, start date, and duration.");
        return;
    }

    let db = getLeaveDB();
    let employee = db.employees.find(e => e.id == empId);
    
    if (!employee) return;

    // Create the leave record
    const newLeave = {
        id: "LV-" + Date.now(),
        employeeId: employee.id,
        employeeName: employee.firstName + " " + employee.lastName,
        type: type,
        startDate: startDate,
        days: days,
        reason: reason || "-",
        recordedAt: new Date().toISOString()
    };

    db.leaves.push(newLeave);

    // 🔥 Automatically update employee status to "On Leave"
    employee.status = "On Leave";
    employee.workPlace = ""; // Clear work location since they are on leave

    // Save to LocalStorage
    localStorage.setItem("erpDB", JSON.stringify(db));
    window.db = db; // Update global reference

    // Close modal and refresh UI
    closeLeaveModal();
    loadLeaveTable();
    
    // Refresh other tables so the "On Leave" status shows up everywhere
    if(typeof loadStatusTable === "function") loadStatusTable();
    if(typeof loadEmployees === "function") loadEmployees();
    if(typeof updateDashboard === "function") updateDashboard();
}

// Loads the leave history into the table
function loadLeaveTable() {
    const db = getLeaveDB();
    const tbody = document.getElementById("leaveTableBody");
    if (!tbody) return;

    tbody.innerHTML = "";

    // Sort so the newest leaves are at the top
    const sortedLeaves = [...(db.leaves || [])].sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt));

    sortedLeaves.forEach(leave => {
        tbody.innerHTML += `
            <tr>
                <td>${leave.startDate}</td>
                <td><strong>${leave.employeeName}</strong></td>
                <td>${leave.type}</td>
                <td>${leave.days}</td>
                <td>${leave.reason}</td>
                <td style="text-align:center;">
                    <button onclick="deleteLeave('${leave.id}')" style="background:#dc3545; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Delete</button>
                </td>
            </tr>
        `;
    });
}

// Deletes a leave record
// ===============================
// LEAVE MANAGEMENT SYSTEM
// ===============================

// Helper function to safely get the database including the leaves array
function getLeaveDB() {
    let db = JSON.parse(localStorage.getItem("erpDB")) || { employees: [], leaves: [] };
    if (!db.leaves) {
        db.leaves = []; // Initialize leaves array if it doesn't exist yet
        localStorage.setItem("erpDB", JSON.stringify(db));
    }
    return db;
}

// Opens the Leave Modal and populates the Employee Dropdown
function openLeaveModal() {
    const db = getLeaveDB();
    const select = document.getElementById("leaveEmployeeSelect");
    
    // Populate dropdown with current employees
    select.innerHTML = '<option value="">Select Employee</option>';
    db.employees.forEach(emp => {
        select.innerHTML += `<option value="${emp.id}">${emp.firstName} ${emp.lastName} (${emp.status})</option>`;
    });

    // Set default date to today
    document.getElementById("leaveStartDate").value = new Date().toISOString().slice(0, 10);
    
    document.getElementById("leaveModal").classList.add("active");
}

// Closes the modal and resets the form
function closeLeaveModal() {
    document.getElementById("leaveModal").classList.remove("active");
    document.getElementById("leaveEmployeeSelect").value = "";
    document.getElementById("leaveReason").value = "";
    document.getElementById("leaveDays").value = "1";
}

// Saves the leave record and updates Employee Status
function saveLeave() {
    const empId = document.getElementById("leaveEmployeeSelect").value;
    const type = document.getElementById("leaveType").value;
    const startDate = document.getElementById("leaveStartDate").value;
    const days = document.getElementById("leaveDays").value;
    const reason = document.getElementById("leaveReason").value;

    if (!empId || !startDate || !days) {
        alert("Please select an employee, start date, and duration.");
        return;
    }

    let db = getLeaveDB();
    let employee = db.employees.find(e => e.id == empId);
    
    if (!employee) return;

    // Create the leave record
    const newLeave = {
        id: "LV-" + Date.now(),
        employeeId: employee.id,
        employeeName: employee.firstName + " " + employee.lastName,
        type: type,
        startDate: startDate,
        days: days,
        reason: reason || "-",
        recordedAt: new Date().toISOString()
    };

    db.leaves.push(newLeave);

    // 🔥 Automatically update employee status to "On Leave"
    employee.status = "On Leave";
    employee.workPlace = ""; // Clear work location since they are on leave

    // Save to LocalStorage
    localStorage.setItem("erpDB", JSON.stringify(db));
    window.db = db; // Update global reference

    // Close modal and refresh UI
    closeLeaveModal();
    loadLeaveTable();
    
    // Refresh other tables so the "On Leave" status shows up everywhere
    if(typeof loadStatusTable === "function") loadStatusTable();
    if(typeof loadEmployees === "function") loadEmployees();
    if(typeof updateDashboard === "function") updateDashboard();
}

// Loads the leave history into the table
function loadLeaveTable() {
    const db = getLeaveDB();
    const tbody = document.getElementById("leaveTableBody");
    if (!tbody) return;

    tbody.innerHTML = "";

    // Sort so the newest leaves are at the top
    const sortedLeaves = [...(db.leaves || [])].sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt));

    sortedLeaves.forEach(leave => {
        tbody.innerHTML += `
            <tr>
                <td>${leave.startDate}</td>
                <td><strong>${leave.employeeName}</strong></td>
                <td>${leave.type}</td>
                <td>${leave.days}</td>
                <td>${leave.reason}</td>
                <td style="text-align:center;">
                    <button onclick="deleteLeave('${leave.id}')" style="background:#dc3545; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Delete</button>
                </td>
            </tr>
        `;
    });
}

// Deletes a leave record
function deleteLeave(id) {

    let db = getLeaveDB();

    const leave = db.leaves.find(l => l.id === id);
    if (!leave) return;

    const employee = db.employees.find(e => e.id == leave.employeeId);

    if (employee) {
        employee.status = "Active"; // restore employee status
    }

    db.leaves = db.leaves.filter(l => l.id !== id);

    localStorage.setItem("erpDB", JSON.stringify(db));
    window.db = db;

    loadLeaveTable();

    if (typeof loadStatusTable === "function") loadStatusTable();
    if (typeof loadEmployees === "function") loadEmployees();
    if (typeof updateDashboard === "function") updateDashboard();
}