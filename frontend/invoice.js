// ===============================
// INVOICE CORE (NO DOM)
// ===============================

let revenueChartInstance = null;
let editingInvoiceIndex = null;
let editingCustomerIndex = null;
let customerChoicesInstance = null;
let appInvoices = [];
let appCustomers = [];
const InvoiceCore = (function () {

    let invoiceCounter = parseInt(localStorage.getItem("invoiceCounter")) || 1;

    function generateInvoiceNumber() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");

        const invoiceNo = `Sumukha-${year}-${month}-${invoiceCounter}`;
        invoiceCounter++;

        localStorage.setItem("invoiceCounter", invoiceCounter);
        return invoiceNo;
    }

    return { generateInvoiceNumber };

})();

// ===============================
// CUSTOMER LOCKING HELPER
// ===============================
function toggleCustomerLock(isLocked) {
    const fields = ["billName","billAddress","billState","invoiceDate","invoiceCustomerPhone"];

    fields.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;

        el.readOnly = isLocked;
        el.style.pointerEvents = isLocked ? "none" : "auto";
        el.style.backgroundColor = isLocked ? "#f4f4f4" : "";
    });
}

// ===============================
// ADD ITEM ROW
// ===============================

function addInvoiceRow() {
    const tbody = document.getElementById("invoiceItemsBody");
    if (!tbody) return;

    const row = document.createElement("tr");
    const rowCount = tbody.children.length + 1;

    row.innerHTML = `
        <td style="text-align:center;">${rowCount}</td>
        <td><textarea class="desc" placeholder="Enter service description..." oninput="calculateInvoiceLive()" style="width:100%; resize:vertical;"></textarea></td>
        <td><input type="text" class="hsn" placeholder="HSN/SAC" style="width:100%;"></td>
        <td><input type="number" class="qty" placeholder="Qty" oninput="calculateInvoiceLive()" style="width:100%;"></td>
        <td><input type="number" class="rate" placeholder="Rate" oninput="calculateInvoiceLive()" style="width:100%;"></td>
        <td style="text-align:right;">0.00</td>
        <td style="text-align:center;"><button onclick="this.parentElement.parentElement.remove(); calculateInvoiceLive();">X</button></td>
    `;
    
    tbody.appendChild(row);
}

function updateSerialNumbers() {
    const rows = document.querySelectorAll("#invoiceItemsBody tr");
    rows.forEach((row, index) => {
        row.cells[0].innerText = index + 1;
    });
}

// ===============================
// LIVE CALCULATION
// ===============================

document.addEventListener("input", function (e) {
    if (e.target.classList.contains("qty") ||
        e.target.classList.contains("rate")) {
        calculateInvoiceLive();
    }
     if (e.target.name === "taxType") {
        calculateInvoiceLive();
    }
});

function calculateInvoiceLive() {
    const rows = document.querySelectorAll("#invoiceItemsBody tr");
    let subtotal = 0;

    rows.forEach(row => {
        const qtyInput = row.cells[3]?.children[0];
        const rateInput = row.cells[4]?.children[0];
        
        const qty = parseFloat(qtyInput?.value) || 0;
        const rate = parseFloat(rateInput?.value) || 0;
        const amount = qty * rate;

        subtotal += amount;

        if (row.cells[5]) {
            row.cells[5].innerText = amount.toFixed(2);
        }
    });

    let taxType = document.querySelector('input[name="taxType"]:checked')?.value;
    let cgst = 0, sgst = 0, gst = 0;

    if (taxType === "cgst_sgst") {
        cgst = subtotal * 0.09;
        sgst = subtotal * 0.09;
    } else if (taxType === "gst") {
        gst = subtotal * 0.18;
    }

    const tax = cgst + sgst + gst;
    const total = subtotal + tax;

    document.getElementById("subtotalDisplay").innerText = subtotal.toFixed(2);
    document.getElementById("taxDisplay").innerText = tax.toFixed(2);
    document.getElementById("totalDisplay").innerText = total.toFixed(2);

    document.getElementById("amountWords").innerText = total > 0 ? numberToWords(total) : "";

    // Update company bar
    populateCompanyBar(taxType);
}


// ===============================
// POPULATE COMPANY BAR
// ===============================
function populateCompanyBar(taxType) {
    if (!taxType) {
        taxType = document.querySelector('input[name="taxType"]:checked')?.value || 'none';
    }
    const setEl = (id, val) => { const e = document.getElementById(id); if (e) e.innerText = val; };

    if (taxType === 'none') {
        setEl('invCompanyName',    'SUMUKHA HOME NURSING SERVICES');
        setEl('invCompanyAddress', 'No 477, 45th CRS, Jayanagar 8th Block, Bangalore - 560070');
        setEl('invCompanyGST',     '');
        setEl('invCompanyCIN',     '');
        setEl('invCompanyEmail',   'Email: homenursingservicesbangalore@gmail.com | Ph: 9880024265, 99004 98222 | Landline: 080-2244 1963');
    } else {
        setEl('invCompanyName',    'SUMUKHA FACILITATORS PRIVATE LIMITED');
        setEl('invCompanyAddress', 'No 477, 45th CRS, Jayanagar 8th Block, Bangalore - 560070');
        setEl('invCompanyGST',     'GSTIN/UIN: 29AAUCS4592E1ZN | State: Karnataka (29)');
        setEl('invCompanyCIN',     'CIN: U74900KA2014PTC073975');
        setEl('invCompanyEmail',   'Email: homenursingservicesbangalore@gmail.com | Ph: 9880024265, 99004 98222 | Landline: 080-2244 1963');
    }
}



function numberToWords(num) {
    const ones = ["", "One", "Two", "Three", "Four", "Five", "Six",
        "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve",
        "Thirteen", "Fourteen", "Fifteen", "Sixteen",
        "Seventeen", "Eighteen", "Nineteen"];

    const tens = ["", "", "Twenty", "Thirty", "Forty",
        "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    function convert(n) {
        if (n < 20) return ones[n];
        if (n < 100) return tens[Math.floor(n / 10)] + " " + ones[n % 10];
        if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred " + convert(n % 100);
        if (n < 100000) return convert(Math.floor(n / 1000)) + " Thousand " + convert(n % 1000);
        if (n < 10000000) return convert(Math.floor(n / 100000)) + " Lakh " + convert(n % 100000);
        return convert(Math.floor(n / 10000000)) + " Crore " + convert(n % 10000000);
    }

    return convert(Math.floor(num)) + " Only";
}

// ===============================
// EXACT REPLICA PDF GENERATOR (WITH VIEW)
// ===============================

function generateInvoicePDF(invoiceData = null, action = 'download') {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // 🚨 PASTE YOUR HUGE BASE64 IMAGE STRINGS BETWEEN THESE QUOTES 🚨
    const logoBase64 = "";
    const stampBase64_GST = ""
     const stampBase64_NonGST =""
    
    let invoiceNo = "", invoiceDate = "", customerName = "", billAddress = "", items = [], subtotal = 0, cgst = 0, sgst = 0, gst = 0, grandTotal = 0;

    if (invoiceData) {
        invoiceNo = invoiceData.invoiceNo; 
        invoiceDate = invoiceData.invoiceDate; 
        customerName = invoiceData.customerName; 
        billAddress = invoiceData.billAddress || ""; 
        items = invoiceData.items; 
        subtotal = invoiceData.subtotal; 
        cgst = invoiceData.cgst; 
        sgst = invoiceData.sgst; 
        gst = invoiceData.gst; 
        grandTotal = invoiceData.total;
    } else {
        invoiceNo = document.getElementById("invoiceNumber").value;
        invoiceDate = document.getElementById("invoiceDate")?.value || new Date().toISOString().slice(0,10);
        billAddress = document.getElementById("billAddress")?.value || "";
        
        const selectedIndex = document.getElementById("customerSelect").value;
        const manualName = document.getElementById("billName").value;
        customerName = (selectedIndex !== "" && appCustomers[selectedIndex]) ? appCustomers[selectedIndex].name : (manualName || "Walk-in");

        document.querySelectorAll("#invoiceItemsBody tr").forEach(row => {
            const desc = row.querySelector(".desc")?.value || "";
            const hsn = row.querySelector(".hsn")?.value || "-";
            const qty = parseFloat(row.querySelector(".qty")?.value) || 0;
            const rate = parseFloat(row.querySelector(".rate")?.value) || 0;
            const amount = qty * rate;
            if (desc || amount > 0) { subtotal += amount; items.push({ desc, hsn, qty, rate, amount }); }
        });

        let taxType = document.querySelector('input[name="taxType"]:checked')?.value;
        if (taxType === "cgst_sgst") { cgst = subtotal * 0.09; sgst = subtotal * 0.09; }
        if (taxType === "gst") { gst = subtotal * 0.18; }
        grandTotal = subtotal + cgst + sgst + gst;
    }

    const isGSTBill = (cgst > 0 || sgst > 0 || gst > 0);
    const companyTitle = isGSTBill ? "SUMUKHA FACILITATORS PRIVATE LIMITED" : "SUMUKHA HOME NURSING SERVICES";
    const currentStamp = isGSTBill ? stampBase64_GST : stampBase64_NonGST;

    // --- MATHEMATICAL VERTICAL CENTERING ---
    let addressLinesCount = 0;
    let splitAddress = [];
    if (billAddress && billAddress.trim() !== "") {
        let cleanAddress = billAddress.replace(/\n/g, ", ");
        splitAddress = doc.splitTextToSize(cleanAddress, 85);
        addressLinesCount = splitAddress.length;
    }

    let estimatedContentHeight = 120 + (items.length * 8) + (addressLinesCount * 5); 
    let currentY = (297 - estimatedContentHeight) / 2; 
    if (currentY < 20) currentY = 20; 

    // --- HEADER ---
    if (logoBase64) {
        doc.addImage(logoBase64, 'PNG', 15, currentY - 10, 35, 12);
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(30, 40, 70);
    doc.text(companyTitle, 105, currentY, { align: "center" });

    currentY += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text("No 477, 45th CRS, Jayanagar 8th Block, Bangalore - 560070", 105, currentY, { align: "center" });

    currentY += 5;
    doc.text("Email: homenursingservicesbangalore@gmail.com", 105, currentY, { align: "center" });
    
    currentY += 5;
    doc.text("Ph: 9880024265, 99004 98222 | Landline: 080-2244 1963", 105, currentY, { align: "center" });

    if (isGSTBill) {
        currentY += 5;
        doc.text("GSTIN/UIN: 29AAUCS4592E1ZN | State: Karnataka (29)", 105, currentY, { align: "center" });
    }

    currentY += 6;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.line(15, currentY, 195, currentY);

    currentY += 7;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("TAX INVOICE", 105, currentY, { align: "center" });

    currentY += 4;
    doc.line(15, currentY, 195, currentY);

    // --- BILL TO & ADDRESS ---
    currentY += 8;
    let leftY = currentY;

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Bill To (Buyer):", 15, leftY);
    
    doc.setFont("helvetica", "normal");
    doc.text(String(customerName || ""), 15, leftY + 6);
    
    let nextLeftY = leftY + 14;

    if (addressLinesCount > 0) {
        doc.setFont("helvetica", "bold");
        doc.text("Address:", 15, nextLeftY); // This label will absolutely show now!
        
        doc.setFont("helvetica", "normal");
        doc.text(splitAddress, 15, nextLeftY + 6);
        nextLeftY += 6 + (addressLinesCount * 5); 
    }

    doc.setFont("helvetica", "bold");
    doc.text("Invoice No:", 135, leftY);
    doc.setFont("helvetica", "normal");
    doc.text(String(invoiceNo || ""), 160, leftY);

    doc.setFont("helvetica", "bold");
    doc.text("Invoice Date:", 135, leftY + 6);
    doc.setFont("helvetica", "normal");
    doc.text(String(invoiceDate || ""), 160, leftY + 6);

    currentY = Math.max(nextLeftY, leftY + 14) + 6;
    
    // --- TABLE HEADERS ---
    doc.setFillColor(235, 242, 245); 
    doc.rect(15, currentY, 180, 8, 'F');
    
    doc.setDrawColor(200, 200, 200);
    doc.line(15, currentY, 195, currentY);
    doc.line(15, currentY + 8, 195, currentY + 8);

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("SI", 18, currentY + 5.5);
    doc.text("Description of Services/Items", 30, currentY + 5.5);
    doc.text("HSN/SAC", 120, currentY + 5.5);
    doc.text("Qty", 145, currentY + 5.5);
    doc.text("Rate", 160, currentY + 5.5);
    doc.text("Amount", 180, currentY + 5.5);

    // --- TABLE ROWS ---
    currentY += 13;
    doc.setFont("helvetica", "normal");
    
    items.forEach((item, index) => {
        let descLines = doc.splitTextToSize(item.desc || "-", 80);
        let rowHeight = descLines.length * 5;

        if (currentY + rowHeight > 240) {
            doc.addPage();
            currentY = 20;
            doc.setDrawColor(200, 200, 200);
            doc.line(15, currentY, 195, currentY);
            currentY += 5;
        }

        doc.text(String(index + 1), 18, currentY);
        doc.text(descLines, 30, currentY);
        doc.text(item.hsn || "-", 120, currentY);
        doc.text(String(item.qty), 145, currentY);
        doc.text(Number(item.rate).toFixed(2), 160, currentY);
        doc.text(Number(item.amount).toFixed(2), 180, currentY);

        currentY += rowHeight + 2;
        doc.setDrawColor(220, 220, 220);
        doc.line(15, currentY, 195, currentY); 
        currentY += 5;
    });

    if (currentY > 230) { doc.addPage(); currentY = 20; }

    currentY += 5;
    doc.setDrawColor(200, 200, 200);
    doc.rect(15, currentY, 110, 25);
    doc.setFont("helvetica", "bold");
    doc.text("Amount in Words:", 18, currentY + 6);
    doc.setFont("helvetica", "normal");
    let splitWords = doc.splitTextToSize(numberToWords(grandTotal), 100);
    doc.text(splitWords, 18, currentY + 12);

    let taxLines = 1;
    if (cgst > 0) taxLines += 2;
    else if (gst > 0) taxLines += 1;
    const totalsBoxHeight = (taxLines * 6) + 12;
    doc.rect(130, currentY, 65, totalsBoxHeight);
    
    let tY = currentY + 6;
    doc.setFont("helvetica", "bold");
    doc.text("Subtotal:", 135, tY);
   doc.text("Rs. " + Number(subtotal).toFixed(2), 190, tY, { align: "right" });
    tY += 6;

    doc.setFont("helvetica", "normal");
    if (cgst > 0) {
        doc.text("CGST (9%):", 135, tY); doc.text("Rs. " + cgst.toFixed(2), 190, tY, { align: "right" }); tY += 6;
        doc.text("SGST (9%):", 135, tY); doc.text("Rs. " + sgst.toFixed(2), 190, tY, { align: "right" }); tY += 6;
    } else if (gst > 0) {
        doc.text("IGST (18%):", 135, tY); doc.text("Rs. " + gst.toFixed(2), 190, tY, { align: "right" }); tY += 6;
    }

    doc.line(130, tY - 3, 195, tY - 3); 
    doc.setFont("helvetica", "bold");
    doc.text("Grand Total:", 135, tY + 2);
    doc.text("Rs. " + grandTotal.toFixed(2), 190, tY + 2, { align: "right" });

    currentY = Math.max(currentY + 25, tY + 15);
    if (currentY > 260) { doc.addPage(); currentY = 30; }

    // Renders the signature stamp if base64 string is provided
    if (currentStamp && currentStamp.trim() !== "") {
        doc.addImage(currentStamp, 'PNG', 150, currentY - 10, 40, 25);
    }
    
    doc.text("Authorised Signatory", 190, currentY + 20, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("This is a computer generated invoice and does not require a physical signature.", 105, 285, { align: "center" });

    if (action === 'view') {
        const pdfBlob = doc.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        window.open(url, '_blank');
    } else {
        doc.save(invoiceNo + ".pdf");
    }
}
// ===============================
// SAVE INVOICE
// ===============================

function saveInvoiceRecord() {
    const invoiceNo = document.getElementById("invoiceNumber").value;
    const customerName = document.getElementById("billName").value;
    const customerPhone = document.getElementById("invoiceCustomerPhone")?.value || "";
    const invoiceDate = document.getElementById("invoiceDate").value;
    const dueDate = document.getElementById("dueDate").value;
    const billAddress = document.getElementById("billAddress").value;
    const billState = document.getElementById("billState").value;

    if (!invoiceNo || !invoiceDate) {
        showNotification("⚠ Invoice number and date required","error");
        return;
    }

    const rows = document.querySelectorAll("#invoiceItemsBody tr");
    if (rows.length === 0) {
       showNotification("⚠ Add at least one item","warning");
        return;
    }

    let items = [];
    let subtotal = 0;

    rows.forEach(row => {
        const desc = row.querySelector(".desc")?.value || "";
        const hsn = row.querySelector(".hsn")?.value || "";
        const qty = parseFloat(row.querySelector(".qty")?.value) || 0;
        const rate = parseFloat(row.querySelector(".rate")?.value) || 0;

        const amount = qty * rate;
        subtotal += amount;

        items.push({ desc, hsn, qty, rate, amount });
    });

    let taxType = document.querySelector('input[name="taxType"]:checked')?.value;
    let cgst = 0, sgst = 0, gst = 0;

    if (taxType === "cgst_sgst") {
        cgst = subtotal * 0.09;
        sgst = subtotal * 0.09;
    } else if (taxType === "gst") {
        gst = subtotal * 0.18;
    }

    const total = subtotal + cgst + sgst + gst;

    const invoiceData = {
        invoiceNo, invoiceDate, dueDate, customerName,
        items, subtotal, cgst, sgst, gst, total,  billAddress,     
        billState,customerPhone,
        status: "Pending", taxType 
        
    };

    let message = "";

    if (editingInvoiceIndex !== null) {
        invoiceData.status = appInvoices[editingInvoiceIndex].status; // Preserve status
        appInvoices[editingInvoiceIndex] = invoiceData;
        editingInvoiceIndex = null;
        message = "Invoice has been edited successfully.";
    } else {
        if (appInvoices.some(inv => inv.invoiceNo === invoiceNo)) {
           showNotification("⚠ Invoice number already exists","error");
            return;
        }
        appInvoices.push(invoiceData);
        message = "Invoice created successfully.";
    }

    // Save to disk ONCE
    localStorage.setItem("savedInvoices", JSON.stringify(appInvoices));

    if (document.getElementById("invoiceSearchInput")) {
        filterInvoices();
    } else {
        loadInvoiceHistory();
    }
    
    resetInvoiceForm();
    updateDashboardAnalytics();
    showNotification("🧾 " + message,"success");
}

// ===============================
// HISTORY (WITH VIEW & INSTANT COLOR)
// ===============================

function loadInvoiceHistory() {
    const tableBody = document.querySelector("#invoiceHistoryTable tbody");
    if (!tableBody) return;
    tableBody.innerHTML = "";

    appInvoices.forEach((inv, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${inv.invoiceNo}</td>
            <td><strong>${inv.customerName || "-"}</strong></td> <td>${inv.invoiceDate}</td>
           <td>₹ ${inv.total.toFixed(2)}</td>
<td>${getTaxLabel(inv.taxType)}</td>
<td>
    <select 
    class="status-${inv.status}" 
    onchange="updateInvoiceStatus(${index}, this.value, this)"
    ${inv.status === "Paid" ? "disabled" : ""}
>
                    <option value="Draft" ${inv.status === "Draft" ? "selected" : ""}>Draft</option>
                    <option value="Pending" ${inv.status === "Pending" ? "selected" : ""}>Pending</option>
                    <option value="Sent" ${inv.status === "Sent" ? "selected" : ""}>Sent</option>
                    <option value="Paid" ${inv.status === "Paid" ? "selected" : ""}>Paid</option>
                    <option value="Cancelled" ${inv.status === "Cancelled" ? "selected" : ""}>Cancelled</option>
                    <option value="Overdue" ${inv.status === "Overdue" ? "selected" : ""}>Overdue</option>
                </select>
            </td>
           <td>
    ${inv.status === "Paid" 
        ? `
            <span class="locked-badge">🔒 Locked</span>
            <button onclick="generateInvoicePDF(appInvoices[${index}], 'view')">View</button>
            <button onclick="generateInvoicePDF(appInvoices[${index}], 'download')">Download</button>
          `
        : `
            <button onclick="editInvoice(${index})">Edit</button>
            <button onclick="generateInvoicePDF(appInvoices[${index}], 'view')">View</button>
            <button onclick="generateInvoicePDF(appInvoices[${index}], 'download')">Download</button>
            <button onclick="deleteInvoice(${index})"
                style="background-color:#dc3545; color:white; border:none; border-radius:3px; padding:3px 8px;">
                Delete
            </button>
          `
    }
</td>
        `;
        tableBody.appendChild(row);
    });
}

function regenerateInvoice(index) {
    generateInvoicePDF(appInvoices[index], 'download');
}

function deleteInvoice(index) {
    appInvoices.splice(index, 1);
    localStorage.setItem("savedInvoices", JSON.stringify(appInvoices));
    showNotification("🗑 Invoice deleted","warning");
    if (document.getElementById("invoiceSearchInput")) {
        filterInvoices();
    } else {
        loadInvoiceHistory();
    }
    updateDashboardAnalytics(); 
}

function editInvoice(index) {
    const inv = appInvoices[index];
    if (!inv) return;

    editingInvoiceIndex = index;

    showSection('createInvoice');

    document.getElementById("invoiceNumber").value = inv.invoiceNo;
    document.getElementById("invoiceDate").value = inv.invoiceDate;
    document.getElementById("dueDate").value = inv.dueDate || "";
    document.getElementById("billName").value = inv.customerName || "";
    const phoneField = document.getElementById("invoiceCustomerPhone");
    if (phoneField) phoneField.value = inv.customerPhone || "";
    document.getElementById("billAddress").value = inv.billAddress || "";
    document.getElementById("billState").value = inv.billState || "";

    toggleCustomerLock(true);

    const tableBody = document.getElementById("invoiceItemsBody");
    tableBody.innerHTML = "";

    inv.items.forEach(item => {
        addInvoiceRow();
        const lastRow = tableBody.lastElementChild;

        lastRow.querySelector(".desc").value = item.desc;
        lastRow.querySelector(".hsn").value = item.hsn;
        lastRow.querySelector(".qty").value = item.qty;
        lastRow.querySelector(".rate").value = item.rate;
    });

    if (inv.taxType) {
        const radio = document.querySelector(`input[name="taxType"][value="${inv.taxType}"]`);
        if (radio) radio.checked = true;
    }
    document.querySelectorAll('input[name="taxType"]').forEach(radio => {
    radio.disabled = true;
});

    calculateInvoiceLive();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateInvoiceStatus(index, newStatus, selectElement) {
    if (!appInvoices[index]) return;

    appInvoices[index].status = newStatus;
    localStorage.setItem("savedInvoices", JSON.stringify(appInvoices));

    if (newStatus === "Paid") {
        

    const invoice = appInvoices[index];

    // 🔥 ADD TO FINANCE LEDGER
    FinanceCore.addTransaction({
        type: "credit",
        date: invoice.invoiceDate || new Date().toISOString().slice(0,10),
        paidTo: invoice.customerName || "Customer",
        category: "Invoice Payment",
        paymentMode: "bank",
        amount: Number(invoice.total),
        notes: "Invoice " + invoice.invoiceNo
    });
    showNotification("💰 Invoice marked as Paid","success");

    loadInvoiceHistory();
    updateDashboardAnalytics();
    return;
}

    if (selectElement) {
        selectElement.className = "status-" + newStatus;
    }

    updateDashboardAnalytics();
}

// ===============================
// CLEAR INVOICE FORM (FIXED)
// ===============================

function resetInvoiceForm() {
    const inputs = document.querySelectorAll('#createInvoice input[type="text"], #createInvoice input[type="date"], #createInvoice input[type="number"], #createInvoice textarea');
    inputs.forEach(input => {
        input.value = '';
    });

    const customerSelect = document.getElementById('customerSelect');
    if (customerSelect) customerSelect.value = '';
    
    // 🔴 FIXED: Fully destroys and reconstructs the Choices.js dropdown so the ghost name is cleared completely
    loadCustomerDropdown();

    toggleCustomerLock(true);

    const tbody = document.getElementById("invoiceItemsBody");
    if (tbody) tbody.innerHTML = ''; 

    const subtotalEl = document.getElementById("subtotalDisplay");
    const taxEl = document.getElementById("taxDisplay");
    const totalEl = document.getElementById("totalDisplay");
    const wordsEl = document.getElementById("amountWords");

    if (subtotalEl) subtotalEl.innerText = "0.00";
    if (taxEl) taxEl.innerText = "0.00";
    if (totalEl) totalEl.innerText = "0.00";
    if (wordsEl) wordsEl.innerText = "";

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); 
    const dd = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${yyyy}-${mm}-${dd}`; 
    
    const invoiceDateInput = document.getElementById('invoiceDate');
    if (invoiceDateInput) invoiceDateInput.value = formattedDate;

    const invoiceNumberInput = document.getElementById('invoiceNumber');
    if (invoiceNumberInput) invoiceNumberInput.value = InvoiceCore.generateInvoiceNumber();
    
    document.querySelectorAll('input[name="taxType"]').forEach(radio => {
        radio.disabled = false;
    });
}

function checkOverdueInvoices() {
    const today = new Date().toISOString().slice(0,10);
    let needsSaving = false;

    appInvoices.forEach(inv => {
        if (inv.status === "Pending" && inv.dueDate && inv.dueDate < today) {
            inv.status = "Overdue";
            needsSaving = true;
        }
    });

    if (needsSaving) {
        localStorage.setItem("savedInvoices", JSON.stringify(appInvoices));
        showNotification("⚠ Some invoices became overdue","warning");
    }
}

// Customer management, dashboard analytics and init are handled by app.js