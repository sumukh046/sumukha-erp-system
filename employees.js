function allowOnlyNumbers(input) {
  input.value = input.value.replace(/[^0-9]/g, "");
}

function addEmployee() {
  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const middleName = document.getElementById("middleName");
  const role = document.getElementById("role");
  const age = document.getElementById("age");
  const gender = document.getElementById("gender");
  const mobile = document.getElementById("mobile");
  const guardianPhone = document.getElementById("guardianPhone");
  const address = document.getElementById("address");
  const nativePlace = document.getElementById("nativePlace");
  const languages = document.getElementById("languages");
  const aadhar = document.getElementById("aadhar");
  const aadharVerified = document.getElementById("aadharVerified");

  if (!firstName.value || !lastName.value || !role.value) {
    alert("Fill required fields");
    return;
  }

  db.employees.push({
    
    id: Date.now(),
    firstName: firstName.value,
    middleName: middleName.value,
    lastName: lastName.value,
    age: age.value,
    gender: gender.value,
    mobile: mobile.value,
    guardianPhone: guardianPhone.value,
    address: address.value,
    nativePlace: nativePlace.value,
    languages: languages.value,
    role: role.value,
    aadhar: aadhar.value,
    aadharVerified: aadharVerified.value,
    status: "Active",
    workPlace: "",
    createdAt: new Date().toLocaleString(),
    salaryConfig: {
    defaultDayRate: 0,
    defaultShiftRate: 0
}
  });
  showNotification("👤 Employee added successfully","success");

  saveDB();
  loadEmployees();
  loadStatusTable();
  updateDashboard();

  document.querySelectorAll("input, textarea").forEach(el => el.value = "");
}

function deleteEmployee(id) {
  db.employees = db.employees.filter(e => e.id !== id);
  saveDB();
  loadEmployees();
  loadStatusTable();
  updateDashboard();
  showNotification("🗑 Employee deleted","warning");
}

function loadStatusTable() {
  let table = document.getElementById("statusTable");
  if (!table) return;

  table.innerHTML = `
    <tr>
      <th>Name</th>
      <th>Status</th>
      <th>Change</th>
      <th>Working Details</th>
    </tr>
  `;

  db.employees.forEach(emp => {
    let statusClass = "";

    // Connect the CSS colors
    if (emp.status === "Working") statusClass = "status-working";
    else if (emp.status === "Active") statusClass = "status-active";
    else if (emp.status === "On Leave") statusClass = "status-leave";
    else if (emp.status === "Left Company") statusClass = "status-left";
    else if (emp.status === "Pending") statusClass = "status-pending"; 

    // 🔥 STRICT DROPDOWN LOGIC
    let dropdownOptions = "";
    
    if (emp.status === "Pending") {
        // Locked Dropdown: Only allows approving to working or canceling back to active
        dropdownOptions = `
          <select onchange="changeStatus(${emp.id}, this.value, this)" style="border: 2px solid #ff9800; background-color: #fff3e0; font-weight: bold; outline: none;">
            <option value="Pending" selected>⏳ Pending (Awaiting Approval)</option>
            <option value="Working">✅ Approve -> Working</option>
            <option value="Active">❌ Cancel Assignment (Back to Active)</option>
          </select>
        `;
    } else if (emp.status === "On Leave") {
        // 🔥 NEW: Locked Dropdown for Leave Management
        dropdownOptions = `
          <select disabled style="border: 2px solid #9e9e9e; background-color: #f5f5f5; color: #757575; font-weight: bold; outline: none; cursor: not-allowed;">
            <option value="On Leave" selected>🔒 Locked (Manage in Leave Tab)</option>
          </select>
        `;
    } else {
        // Normal Dropdown: Cannot manually switch TO Pending or On Leave from here
        dropdownOptions = `
          <select onchange="changeStatus(${emp.id}, this.value, this)">
            <option value="Active" ${emp.status==="Active"?"selected":""}>Active</option>
            <option value="Working" ${emp.status==="Working"?"selected":""}>Working</option>
            <option value="Left Company" ${emp.status==="Left Company"?"selected":""}>Left Company</option>
          </select>
        `;
    }

    table.innerHTML += `
      <tr>
        <td>${emp.firstName} ${emp.middleName} ${emp.lastName}</td>

        <td>
          <span class="${statusClass}">
            ${emp.status}
          </span>
        </td>

        <td>
          ${dropdownOptions}
        </td>

        <td>
          ${emp.status === "Working"
            ? `<input type="text" value="${emp.workPlace || ""}" 
               onchange="updateWorkPlace(${emp.id}, this.value)">`
            : "-"
          }
        </td>
      </tr>
    `;
  });
}

function changeStatus(id, newStatus, selectElement) {
  let emp = db.employees.find(e => e.id === id);
  let oldStatus = emp.status;

  // 1. If changing TO Working (Show Work Location Modal)
  if (newStatus === "Working") {
    pendingApprovalId = id;
    pendingApprovalSelect = selectElement;
    pendingOldStatus = oldStatus;

    document.getElementById("workLocationInput").value = "";
    document.getElementById("workLocationModal").classList.add("active");
    return; 
  }

  // 2. 🔥 NEW: If changing FROM Working TO Active (Show Confirmation Modal)
  if (oldStatus === "Working" && newStatus === "Active") {
    pendingApprovalId = id;
    pendingApprovalSelect = selectElement;
    pendingOldStatus = oldStatus;

    document.getElementById("cancelWorkingModal").classList.add("active");
    return;
  }

  // Normal flow for switching to On Leave, Left Company, etc.
  executeStatusChange(id, newStatus);
}

// Helper function to actually apply the changes to the database
// Helper function to actually apply the changes to the database
function executeStatusChange(id, newStatus) {
  let emp = db.employees.find(e => e.id === id);
  if(!emp) return;

  emp.status = newStatus;
  
  // Clear the address if they stop working
  if (newStatus !== "Working") {
    emp.workPlace = ""; 
  }

  saveDB();
  loadStatusTable();
  if(typeof loadEmployees === "function") loadEmployees(); // 🔥 NEW: Refresh All Employees table
  if(typeof updateDashboard === "function") updateDashboard();
}

// --- WORK LOCATION MODAL LOGIC ---
function confirmWorkLocation() {
    let place = document.getElementById("workLocationInput").value.trim();
    
    if (place === "") {
        alert("Work location is required to approve the Working status.");
        return;
    }

    let emp = db.employees.find(e => e.id === pendingApprovalId);
    if (emp) {
        emp.status = "Working";
        emp.workPlace = place;
        
        saveDB();
        loadStatusTable(); 
        if(typeof loadEmployees === "function") loadEmployees(); // 🔥 NEW: Refresh All Employees table
        if(typeof updateDashboard === "function") updateDashboard();
    }

    closeWorkLocationModal();
}

function cancelWorkLocation() {
    if (pendingApprovalSelect) {
        pendingApprovalSelect.value = pendingOldStatus;
    }
    closeWorkLocationModal();
}

function closeWorkLocationModal() {
    document.getElementById("workLocationModal").classList.remove("active");
    pendingApprovalId = null;
    pendingApprovalSelect = null;
    pendingOldStatus = null;
}

// --- 🔥 NEW: CANCEL WORKING MODAL LOGIC ---
function confirmCancelWorking() {
    // User clicked "Yes", execute the change to "Active"
    executeStatusChange(pendingApprovalId, "Active");
    closeCancelWorkingModal();
}

function abortCancelWorking() {
    // User clicked "No", revert the dropdown back to "Working"
    if (pendingApprovalSelect) {
        pendingApprovalSelect.value = pendingOldStatus;
    }
    closeCancelWorkingModal();
}

function closeCancelWorkingModal() {
    document.getElementById("cancelWorkingModal").classList.remove("active");
    pendingApprovalId = null;
    pendingApprovalSelect = null;
    pendingOldStatus = null;
}
function viewEmployee(id) {

  let emp = db.employees.find(e => e.id === id);

  let existing = document.getElementById("employeeDetailsPanel");
  if (existing && existing.dataset.id == id) {
    existing.remove();
    return;
  }
  if (existing) existing.remove();

  let panel = document.createElement("div");
  panel.id = "employeeDetailsPanel";
  panel.dataset.id = id;
  panel.style.marginTop = "20px";
  panel.style.padding = "20px";
  panel.style.background = "white";
  panel.style.border = "1px solid #ccc";
  panel.style.position = "relative";

  panel.innerHTML = `
    <button onclick="closeProfile()" 
      style="position:absolute; top:10px; right:10px; background:red; color:white; border:none;">X</button>
    <h3>Employee Profile</h3>
    <p><b>Name:</b> ${emp.firstName} ${emp.middleName} ${emp.lastName}</p>
    <p><b>Age:</b> ${emp.age}</p>
    <p><b>Gender:</b> ${emp.gender}</p>
    <p><b>Mobile:</b> ${emp.mobile}</p>
    <p><b>Guardian Phone:</b> ${emp.guardianPhone}</p>
    <p><b>Address:</b> ${emp.address}</p>
    <p><b>Native Place:</b> ${emp.nativePlace}</p>
    <p><b>Languages:</b> ${emp.languages}</p>
    <p><b>Role:</b> ${emp.role}</p>
    <p><b>Aadhar:</b> ${emp.aadhar}</p>
    <p><b>Aadhar Verified:</b> ${emp.aadharVerified}</p>
    <p><b>Status:</b> ${emp.status}</p>
    <p><b>Working At:</b> ${emp.workPlace || "-"}</p>
    <p><b>Registered On:</b> ${emp.createdAt}</p>
  `;

  document.getElementById("allEmployees").appendChild(panel);
}

function closeProfile() {
  let panel = document.getElementById("employeeDetailsPanel");
  if (panel) panel.remove();
}

/* DOWNLOAD SINGLE EMPLOYEE */
function downloadSingleEmployee(id) {

    const employees = (window.db && window.db.employees) 
        ? window.db.employees 
        : (JSON.parse(localStorage.getItem("erpDB")) || { employees: [] }).employees;

    const emp = employees.find(e => e.id === id);

    if (!emp) {
        alert("Employee not found");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // =========================
    // 🎨 HEADER BACKGROUND
    // =========================
    doc.setFillColor(15, 32, 74); // Deep navy
    doc.rect(0, 0, 210, 35, "F");

    // Accent Side Bar
    doc.setFillColor(0, 168, 232); // Cyan accent
    doc.rect(0, 0, 8, 297, "F");

    // =========================
    // 🏢 COMPANY NAME
    // =========================
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont(undefined, "bold");
    doc.text("SUMUKHA FACILITATORS PVT LTD", 105, 18, { align: "center" });

    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text("No. 477, 45th Cross Rd, 8th Block, Jayanagar,", 105, 26, { align: "center" });
    doc.text("Bengaluru, Karnataka 560070", 105, 31, { align: "center" });

    doc.setTextColor(0, 0, 0);

    // =========================
    // 🧾 REPORT TITLE
    // =========================
    doc.setFontSize(16);
    doc.setFont(undefined, "bold");
    doc.text("EMPLOYEE PROFILE REPORT", 105, 50, { align: "center" });

    // Underline Title
    doc.setDrawColor(0, 168, 232);
    doc.setLineWidth(1);
    doc.line(60, 55, 150, 55);

    // =========================
    // 📷 PHOTO BOX
    // =========================
    doc.setDrawColor(150);
    doc.rect(150, 65, 40, 45);
    doc.setFontSize(9);
    doc.text("Employee Photo", 170, 90, { align: "center" });

    // =========================
    // 📋 DETAILS SECTION
    // =========================
    doc.setFontSize(12);
    doc.setFont(undefined, "normal");

    let y = 70;

    const leftX = 20;
    const rightX = 90;

    doc.text("Full Name:", leftX, y);
    doc.text(emp.firstName + " " + emp.middleName + " " + emp.lastName, rightX, y);
    y += 10;

    doc.text("Age:", leftX, y);
    doc.text(emp.age || "-", rightX, y);
    y += 10;

    doc.text("Gender:", leftX, y);
    doc.text(emp.gender || "-", rightX, y);
    y += 10;

    doc.text("Mobile:", leftX, y);
    doc.text(emp.mobile || "-", rightX, y);
    y += 10;

    doc.text("Guardian Phone:", leftX, y);
    doc.text(emp.guardianPhone || "-", rightX, y);
    y += 10;

    doc.text("Role:", leftX, y);
    doc.text(emp.role || "-", rightX, y);
    y += 10;

    doc.text("Languages:", leftX, y);
    doc.text(emp.languages || "-", rightX, y);
    y += 10;

    doc.text("Native Place:", leftX, y);
    doc.text(emp.nativePlace || "-", rightX, y);
    y += 10;

    doc.text("Aadhar Number:", leftX, y);
    doc.text(emp.aadhar || "-", rightX, y);
    y += 10;

    doc.text("Status:", leftX, y);
    doc.text(emp.status || "-", rightX, y);
    y += 15;

    // Address block (multi-line wrap)
    doc.text("Address:", leftX, y);
    const splitAddress = doc.splitTextToSize(emp.address || "-", 100);
    doc.text(splitAddress, rightX, y);
    y += splitAddress.length * 7 + 10;

    // =========================
    // ✍ SIGNATURE SECTION
    // =========================
    doc.setDrawColor(0);
    doc.line(25, 250, 85, 250);
    doc.text("Employee Signature", 25, 258);

    doc.line(125, 250, 185, 250);
    doc.text("Authorized Signatory", 125, 258);

    // =========================
    // 📌 FOOTER
    // =========================
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text("This is a system generated document.", 105, 285, { align: "center" });

    // Save file
    doc.save(emp.firstName + "_Profile_Report.pdf");
}
/* DOWNLOAD ALL CSV */
function downloadCSV() {

  if (db.employees.length === 0) {
    alert("No employees to download");
    return;
  }

  let csv = "Name,Role,Mobile,Status\n";

  db.employees.forEach(emp => {
    csv += `"${emp.firstName} ${emp.middleName} ${emp.lastName}",${emp.role},${emp.mobile},${emp.status}\n`;
  });

  let blob = new Blob([csv], { type: "text/csv" });
  let url = URL.createObjectURL(blob);
  let a = document.createElement("a");
  a.href = url;
  a.download = "employees.csv";
  a.click();
}

/* DOWNLOAD ALL PDF */
function downloadPDF() {

  if (db.employees.length === 0) {
    alert("No employees to download");
    return;
  }

  let content = "<h2>All Employees Report</h2>";

  db.employees.forEach(emp => {
    content += `
      <hr>
      <p><b>Name:</b> ${emp.firstName} ${emp.middleName} ${emp.lastName}</p>
      <p><b>Role:</b> ${emp.role}</p>
      <p><b>Mobile:</b> ${emp.mobile}</p>
      <p><b>Status:</b> ${emp.status}</p>
    `;
  });

  let win = window.open("", "", "width=900,height=700");
  win.document.write(content);
  win.document.close();
  win.print();
}