// ===============================
// DOCUMENT STORAGE MODULE
// Documents are stored as base64
// in erpDB.documents[]
// ===============================

const DOC_TYPES = [
    "Aadhar Card",
    "PAN Card",
    "Passport",
    "Driving Licence",
    "Offer Letter",
    "Experience Letter",
    "relieving Letter",
    "Bank Passbook",
    "Salary Slip",
    "Medical Certificate",
    "Police Verification",
    "Other"
];

const DOC_ICONS = {
    "Aadhar Card":          "🪪",
    "PAN Card":             "🗂",
    "Passport":             "📕",
    "Driving Licence":      "🚗",
    "Offer Letter":         "📄",
    "Experience Letter":    "📜",
    "Relieving Letter":     "📜",
    "Bank Passbook":        "🏦",
    "Salary Slip":          "💰",
    "Medical Certificate":  "🏥",
    "Police Verification":  "🛡",
    "Other":                "📎"
};

// ---- DB HELPERS ----
function getDocDB() {
    let db = JSON.parse(localStorage.getItem("erpDB")) || {};
    if (!db.documents)  db.documents  = [];
    if (!db.employees)  db.employees  = [];
    return db;
}

function saveDocDB(db) {
    localStorage.setItem("erpDB", JSON.stringify(db));
    window.db = db;
}

// ---- INIT ----
function initDocumentsSection() {
    loadDocEmployeeFilter();
    loadDocEmployeeUploadDropdown();
    renderDocumentCards();
    updateDocSummaryCards();
}

// ---- POPULATE DROPDOWNS ----
function loadDocEmployeeFilter() {
    const db  = getDocDB();
    const sel = document.getElementById("docEmpFilter");
    if (!sel) return;
    const prev = sel.value;
    sel.innerHTML = '<option value="">All Employees</option>';
    db.employees.forEach(emp => {
        sel.innerHTML += `<option value="${emp.id}">${emp.firstName} ${emp.lastName}</option>`;
    });
    sel.value = prev;
}

function loadDocEmployeeUploadDropdown() {
    const db  = getDocDB();
    const sel = document.getElementById("docUploadEmpSelect");
    if (!sel) return;
    sel.innerHTML = '<option value="">Select Employee</option>';
    db.employees.forEach(emp => {
        sel.innerHTML += `<option value="${emp.id}">${emp.firstName} ${emp.lastName} (${emp.role || "-"})</option>`;
    });
}

// ---- OPEN / CLOSE UPLOAD MODAL ----
function openDocUploadModal(empId) {
    loadDocEmployeeUploadDropdown();
    document.getElementById("docUploadEmpSelect").value = empId || "";
    document.getElementById("docTypeSelect").value      = DOC_TYPES[0];
    document.getElementById("docFileInput").value       = "";
    document.getElementById("docNotes").value           = "";
    document.getElementById("docUploadPreview").style.display = "none";
    document.getElementById("docUploadModal").classList.add("active");
}

function closeDocUploadModal() {
    document.getElementById("docUploadModal").classList.remove("active");
}

// ---- FILE PREVIEW ----
function previewDocFile() {
    const file    = document.getElementById("docFileInput").files[0];
    const preview = document.getElementById("docUploadPreview");
    if (!file) { preview.style.display = "none"; return; }

    const sizeMB = (file.size / 1024 / 1024).toFixed(2);
    preview.style.display = "block";
    preview.innerHTML = `
        <div class="doc-preview-info">
            <span class="doc-file-icon">${getFileIcon(file.type)}</span>
            <div>
                <strong>${file.name}</strong><br>
                <span style="font-size:12px;color:#666;">${formatFileType(file.type)} &nbsp;•&nbsp; ${sizeMB} MB</span>
            </div>
        </div>`;

    if (parseFloat(sizeMB) > 5) {
        preview.innerHTML += `<p style="color:#d32f2f;font-size:12px;margin:6px 0 0;">⚠ File is large (${sizeMB} MB). For best performance keep documents under 5 MB.</p>`;
    }
}

// ---- SAVE DOCUMENT ----
function saveDocument() {
    const empId   = document.getElementById("docUploadEmpSelect").value;
    const docType = document.getElementById("docTypeSelect").value;
    const notes   = document.getElementById("docNotes").value.trim();
    const fileEl  = document.getElementById("docFileInput");
    const file    = fileEl.files[0];

    if (!empId)  { alert("Please select an employee."); return; }
    if (!file)   { alert("Please choose a file to upload."); return; }

    const sizeMB = file.size / 1024 / 1024;
    if (sizeMB > 10) { alert("File too large. Maximum size is 10 MB."); return; }

    const reader = new FileReader();
    reader.onload = function(e) {
        const db  = getDocDB();
        const emp = db.employees.find(x => x.id == empId);
        if (!emp) return;

        db.documents.push({
            id:           "DOC-" + Date.now(),
            employeeId:   Number(empId),
            employeeName: emp.firstName + " " + emp.lastName,
            docType:      docType,
            fileName:     file.name,
            fileType:     file.type,
            fileSize:     file.size,
            base64:       e.target.result,
            notes:        notes,
            uploadedAt:   new Date().toISOString()
        });

        saveDocDB(db);
        showNotification("📎 Document uploaded successfully", "success");
        closeDocUploadModal();
        renderDocumentCards();
        updateDocSummaryCards();
    };
    reader.readAsDataURL(file);
}

// ---- RENDER DOCUMENT CARDS ----
function renderDocumentCards() {
    const db        = getDocDB();
    const empFilter = document.getElementById("docEmpFilter")?.value  || "";
    const typeFilter= document.getElementById("docTypeFilter")?.value || "";
    const container = document.getElementById("docCardsContainer");
    if (!container) return;

    let docs = [...db.documents];
    if (empFilter)  docs = docs.filter(d => d.employeeId == empFilter);
    if (typeFilter) docs = docs.filter(d => d.docType === typeFilter);

    // Sort newest first
    docs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

    container.innerHTML = "";

    if (docs.length === 0) {
        container.innerHTML = `
            <div class="doc-empty">
                <div style="font-size:40px;margin-bottom:10px;">📂</div>
                <p>No documents found. Upload the first one!</p>
            </div>`;
        return;
    }

    // Group by employee
    const grouped = {};
    docs.forEach(doc => {
        if (!grouped[doc.employeeId]) {
            grouped[doc.employeeId] = { name: doc.employeeName, docs: [] };
        }
        grouped[doc.employeeId].docs.push(doc);
    });

    Object.values(grouped).forEach(group => {
        const section = document.createElement("div");
        section.className = "doc-employee-group";

        const empId = group.docs[0].employeeId;
        section.innerHTML = `
            <div class="doc-group-header">
                <div class="doc-emp-avatar">${getInitials(group.name)}</div>
                <div>
                    <strong>${group.name}</strong>
                    <span class="doc-count-badge">${group.docs.length} document${group.docs.length !== 1 ? "s" : ""}</span>
                </div>
                <button class="doc-add-btn" onclick="openDocUploadModal(${empId})">+ Add</button>
            </div>
            <div class="doc-cards-row" id="docRow-${empId}"></div>
        `;
        container.appendChild(section);

        const row = document.getElementById("docRow-" + empId);
        group.docs.forEach(doc => {
            const card = document.createElement("div");
            card.className = "doc-card";
            card.innerHTML = `
                <div class="doc-card-icon">${DOC_ICONS[doc.docType] || "📎"}</div>
                <div class="doc-card-type">${doc.docType}</div>
                <div class="doc-card-filename" title="${doc.fileName}">${truncateFilename(doc.fileName)}</div>
                <div class="doc-card-size">${formatFileSize(doc.fileSize)}</div>
                <div class="doc-card-date">${formatDocDate(doc.uploadedAt)}</div>
                ${doc.notes ? `<div class="doc-card-notes" title="${doc.notes}">📝 ${doc.notes}</div>` : ""}
                <div class="doc-card-actions">
                    <button class="doc-btn-view"   onclick="viewDocument('${doc.id}')">View</button>
                    <button class="doc-btn-dl"      onclick="downloadDocument('${doc.id}')">Download</button>
                    <button class="doc-btn-delete"  onclick="deleteDocument('${doc.id}')">Delete</button>
                </div>
            `;
            row.appendChild(card);
        });
    });
}

// ---- VIEW DOCUMENT (opens in new tab) ----
function viewDocument(id) {
    const db  = getDocDB();
    const doc = db.documents.find(d => d.id === id);
    if (!doc) return;

    const win = window.open("", "_blank");
    if (!win) { alert("Pop-up blocked. Please allow pop-ups for this page."); return; }

    if (doc.fileType === "application/pdf" || doc.base64.startsWith("data:application/pdf")) {
        win.document.write(`
            <html><head><title>${doc.fileName}</title></head>
            <body style="margin:0;">
                <embed src="${doc.base64}" type="application/pdf" width="100%" height="100%" style="position:fixed;top:0;left:0;width:100%;height:100%;">
            </body></html>`);
    } else if (doc.fileType.startsWith("image/")) {
        win.document.write(`
            <html><head><title>${doc.fileName}</title></head>
            <body style="margin:0;background:#111;display:flex;justify-content:center;align-items:center;min-height:100vh;">
                <img src="${doc.base64}" style="max-width:100%;max-height:100vh;object-fit:contain;">
            </body></html>`);
    } else {
        // Fallback: trigger download for unsupported types
        win.close();
        downloadDocument(id);
    }
}

// ---- DOWNLOAD DOCUMENT ----
function downloadDocument(id) {
    const db  = getDocDB();
    const doc = db.documents.find(d => d.id === id);
    if (!doc) return;

    const a    = document.createElement("a");
    a.href     = doc.base64;
    a.download = doc.fileName;
    a.click();
    showNotification("📥 Downloading " + doc.fileName, "info");
}

// ---- DELETE DOCUMENT ----
function deleteDocument(id) {
    if (!confirm("Delete this document? This cannot be undone.")) return;
    const db = getDocDB();
    db.documents = db.documents.filter(d => d.id !== id);
    saveDocDB(db);
    showNotification("🗑 Document deleted", "warning");
    renderDocumentCards();
    updateDocSummaryCards();
}

// ---- SUMMARY CARDS ----
function updateDocSummaryCards() {
    const db   = getDocDB();
    const docs = db.documents;

    const totalDocs  = docs.length;
    const totalEmps  = new Set(docs.map(d => d.employeeId)).size;
    const totalSizeMB= (docs.reduce((s, d) => s + (d.fileSize || 0), 0) / 1024 / 1024).toFixed(1);

    // Most common doc type
    const typeCounts = {};
    docs.forEach(d => { typeCounts[d.docType] = (typeCounts[d.docType] || 0) + 1; });
    const topType = Object.keys(typeCounts).sort((a,b) => typeCounts[b]-typeCounts[a])[0] || "-";

    const el = id => document.getElementById(id);
    if (el("docCardTotal"))   el("docCardTotal").innerText   = totalDocs;
    if (el("docCardEmps"))    el("docCardEmps").innerText    = totalEmps;
    if (el("docCardSize"))    el("docCardSize").innerText    = totalSizeMB + " MB";
    if (el("docCardTopType")) el("docCardTopType").innerText = topType;
}

// ---- HELPERS ----
function getInitials(name) {
    return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

function truncateFilename(name, max = 20) {
    if (!name) return "-";
    if (name.length <= max) return name;
    const ext = name.lastIndexOf(".");
    if (ext > 0) return name.slice(0, max - 4) + "..." + name.slice(ext);
    return name.slice(0, max) + "...";
}

function formatFileSize(bytes) {
    if (!bytes) return "-";
    if (bytes < 1024)        return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1024 / 1024).toFixed(2) + " MB";
}

function formatDocDate(iso) {
    if (!iso) return "-";
    return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function getFileIcon(mimeType) {
    if (!mimeType) return "📎";
    if (mimeType === "application/pdf")   return "📕";
    if (mimeType.startsWith("image/"))   return "🖼";
    if (mimeType.includes("word"))       return "📝";
    if (mimeType.includes("sheet") || mimeType.includes("excel")) return "📊";
    return "📎";
}

function formatFileType(mimeType) {
    if (!mimeType) return "File";
    if (mimeType === "application/pdf")  return "PDF";
    if (mimeType.startsWith("image/"))  return mimeType.split("/")[1].toUpperCase();
    if (mimeType.includes("word"))      return "Word Document";
    if (mimeType.includes("sheet"))     return "Spreadsheet";
    return mimeType.split("/")[1]?.toUpperCase() || "File";
}
