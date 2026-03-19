// Called when the "Upload Card" toggle is flipped
let pendingApprovalId = null;
function toggleAadharUpload() {
  const toggle  = document.getElementById("aadharToggle");
  const fileEl  = document.getElementById("aadharFile");
  const preview = document.getElementById("aadharPreview");

  if (toggle.checked) {
    fileEl.style.display = "block";
    fileEl.click();

    fileEl.onchange = function() {
      const file = fileEl.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        if (!preview) return;
        const isImage = file.type.startsWith("image/");
        preview.style.display = "block";
        preview.innerHTML = isImage
          ? `<img src="${e.target.result}" style="max-width:180px;max-height:120px;border-radius:6px;border:1px solid #ccc;margin-top:6px;">`
          : `<div style="padding:8px;background:#f0f4ff;border-radius:6px;border:1px solid #c5d0e8;font-size:13px;margin-top:6px;">
               <strong>${file.name}</strong> ready to upload
             </div>`;
      };
      reader.readAsDataURL(file);
    };
  } else {
    fileEl.style.display = "none";
    fileEl.value = "";
    if (preview) { preview.style.display = "none"; preview.innerHTML = ""; }
  }
}

// Saves aadhar file to erpDB.documents and immediately refreshes Documents section
function saveAadharDocument(empId, empName, file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const db = JSON.parse(localStorage.getItem("erpDB")) || {};
    if (!db.documents) db.documents = [];

    // Remove previous Aadhar upload for this employee (no duplicates)
    db.documents = db.documents.filter(
      d => !(d.employeeId === empId && d.docType === "Aadhar Card")
    );

    db.documents.push({
      id:           "DOC-" + Date.now(),
      employeeId:   empId,
      employeeName: empName,
      docType:      "Aadhar Card",
      fileName:     file.name,
      fileType:     file.type,
      fileSize:     file.size,
      base64:       e.target.result,
      notes:        "Uploaded from Add Employee form",
      uploadedAt:   new Date().toISOString()
    });

    localStorage.setItem("erpDB", JSON.stringify(db));
    window.db = db;

    // Live-refresh Documents section without a page reload
    if (typeof renderDocumentCards   === "function") renderDocumentCards();
    if (typeof updateDocSummaryCards === "function") updateDocSummaryCards();

    showNotification("Aadhar card saved to Documents", "success");
  };
  reader.readAsDataURL(file);
}

function allowOnlyNumbers(input) {
  input.value = input.value.replace(/[^0-9]/g, "");
}

async function addEmployee() {

  const fileEl = document.getElementById("aadharFile"); // ✅ FIX

  const employee = {
    firstName: document.getElementById("firstName").value,
    middleName: document.getElementById("middleName").value,
    lastName: document.getElementById("lastName").value,
    age: document.getElementById("age").value,
    gender: document.getElementById("gender").value,
    mobile: document.getElementById("mobile").value,
    guardianPhone: document.getElementById("guardianPhone").value,
    address: document.getElementById("address").value,
    nativePlace: document.getElementById("nativePlace").value,
    languages: document.getElementById("languages").value,
    role: document.getElementById("role").value,
    aadhar: document.getElementById("aadhar").value,
    aadharVerified: document.getElementById("aadharVerified").value,
    status: "Active"
  };

  try {
    const res = await fetch("http://localhost:5000/api/employees", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(employee)
    });

    const msg = await res.text();
    console.log(msg);

    showNotification("👤 Employee saved to database", "success");

    // 🔥 AADHAR SAVE (optional)
    const toggle = document.getElementById("aadharToggle");
    if (toggle && toggle.checked && fileEl && fileEl.files[0]) {
      saveAadharDocument(Date.now(), employee.firstName, fileEl.files[0]);
    }

    loadEmployees();

  } catch (err) {
    console.error(err);
    alert("Error saving employee");
  }
}
  

  // If an Aadhar file was selected, save it to Documents now
  


  // Reset the form
  document.querySelectorAll("#addEmployee input, #addEmployee textarea, #addEmployee select").forEach(el => {
    if (el.type === "checkbox") { el.checked = false; }
    else if (el.type === "file") { el.value = ""; }
    else { el.value = ""; }
  });
  // Hide file input and preview after reset
  
  const preview = document.getElementById("aadharPreview");
  if (preview) { preview.style.display = "none"; preview.innerHTML = ""; }


function deleteEmployee(id) {
  db.employees = db.employees.filter(e => e.id !== id);
  saveDB();
  loadEmployees();
  loadStatusTable();
  updateDashboard();
  showNotification("🗑 Employee deleted","warning");
}

async function loadStatusTable() {

  const table = document.getElementById("statusTable");
  if (!table) return;

  table.innerHTML = `
    <tr>
      <th>Name</th>
      <th>Status</th>
      <th>Change</th>
      <th>Working Details</th>
    </tr>
  `;

  try {
    const res = await fetch("http://localhost:5000/api/employees");
    const employees = await res.json();

    employees.forEach(emp => {

  // ✅ DEFINE FIRST (VERY IMPORTANT)
  let statusClass = "";

  if (emp.status === "Working") statusClass = "status-working";
  else if (emp.status === "Active") statusClass = "status-active";
  else if (emp.status === "On Leave") statusClass = "status-leave";
  else if (emp.status === "Left Company") statusClass = "status-left";

  // dropdown
  let dropdown = `
    <select onchange="changeStatus('${emp._id}', this.value)">
      <option value="Active" ${emp.status==="Active"?"selected":""}>Active</option>
      <option value="Working" ${emp.status==="Working"?"selected":""}>Working</option>
      <option value="Left Company" ${emp.status==="Left Company"?"selected":""}>Left Company</option>
    </select>
  `;

  // ✅ USE AFTER DECLARING
  table.innerHTML += `
    <tr>
      <td>${emp.firstName} ${emp.lastName}</td>

      <td>
        <span class="${statusClass}">
          ${emp.status || "-"}
        </span>
      </td>

      <td>${dropdown}</td>
      <td>${emp.workPlace || "-"}</td>
    </tr>
  `;
});

  } catch (err) {
    console.error(err);
    table.innerHTML += `<tr><td colspan="4">Error loading data</td></tr>`;
  }
}

function changeStatus(id, newStatus) {

  // 🔥 IF WORKING → SHOW POPUP
  if (newStatus === "Working") {
    pendingApprovalId = id;
    document.getElementById("workLocationModal").classList.add("active");
    return;
  }

  // NORMAL STATUS UPDATE
  executeStatusChange(id, newStatus);
}
  


// Helper function to actually apply the changes to the database
// Helper function to actually apply the changes to the database
async function executeStatusChange(id, newStatus, workPlace = "") {

  try {
    await fetch(`http://localhost:5000/api/employees/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status: newStatus,
        workPlace: workPlace
      })
    });

    showNotification("✅ Status updated", "success");

     await loadEmployees();
    await loadStatusTable();
    if (typeof updateDashboard === "function") updateDashboard();

  } catch (err) {
    console.error(err);
    alert("Error updating status");
  }
}

// --- WORK LOCATION MODAL LOGIC ---
function confirmWorkLocation() {

  const place = document.getElementById("workLocationInput").value;
 console.log("PLACE:", place);
  if (!place) {
    alert("Please enter work location");
    return;
  }

  // 🔥 SAVE TO MONGODB
  executeStatusChange(pendingApprovalId, "Working", place);

  // CLOSE MODAL
  document.getElementById("workLocationModal").classList.remove("active");

  // CLEAR INPUT
  document.getElementById("workLocationInput").value = "";
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

    const db = JSON.parse(localStorage.getItem("erpDB")) || { employees: [] };
    const employees = db.employees;

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
// ===============================
// LOAD ALL EMPLOYEES TABLE
// ===============================
async function loadEmployees() {

  const tbody = document.getElementById("employeeTableBody");
  if (!tbody) return;

  tbody.innerHTML = "<tr><td colspan='5'>Loading...</td></tr>";

  try {
    const res = await fetch("http://localhost:5000/api/employees");
    const employees = await res.json();

    tbody.innerHTML = "";

    employees.forEach(emp => {
      tbody.innerHTML += `
        <tr>
          <td>${emp.firstName || "-"}</td>
          <td>${emp.lastName || "-"}</td>
          <td>${emp.role || "-"}</td>
          <td>${emp.mobile || "-"}</td>
          <td>${emp.status || "-"}</td>
        </tr>
      `;
    });

  } catch (err) {
    console.error(err);
    tbody.innerHTML = "<tr><td colspan='5'>Error loading employees</td></tr>";
  }
}
window.onload = function () {
  loadEmployees();
};