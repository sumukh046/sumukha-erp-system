

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
// ADD ITEM ROW
// ===============================

// ===============================
// ADD ITEM ROW (BLANK VALUES)
// ===============================

function addInvoiceRow() {
    const tbody = document.getElementById("invoiceItemsBody");
    if (!tbody) return;

    const row = document.createElement("tr");
    const rowCount = tbody.children.length + 1;

    // Notice there is no value="0" in the inputs below, only a placeholder!
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



// ===============================
// LIVE CALCULATION
// ===============================

function calculateInvoiceLive() {
    const rows = document.querySelectorAll("#invoiceItemsBody tr");
    let subtotal = 0;

    rows.forEach(row => {
        // Accessing by cell index is much faster than querySelector
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

    // --- LIVE COMPANY HEADER UPDATE ---
    const companyHeaderElement = document.querySelector(".invoice-company");
    if (companyHeaderElement) {
        if (taxType === "none") {
            companyHeaderElement.innerHTML = `
                <h3>SUMUKHA HOME NURSING SERVICES</h3>
                <p>No 477, 45th CRS, Jayanagar 8th Block, Bangalore</p>
                <p>Email: homenursingservicesbangalore@gmail.com</p>
            `;
        } else {
            companyHeaderElement.innerHTML = `
                <h3>SUMUKHA FACILITATORS PRIVATE LIMITED</h3>
                <p>No 477, 45th CRS, Jayanagar 8th Block, Bangalore</p>
                <p>GSTIN/UIN: 29AAUCS4592E1ZN | State: Karnataka (29)</p>
                <p>CIN: U74900KA2014PTC073975</p>
                <p>Email: homenursingservicesbangalore@gmail.com</p>
            `;
        }
    }
}

// ===============================
// NUMBER TO WORDS
// ===============================

function numberToWords(num) {

    const ones = ["", "One", "Two", "Three", "Four", "Five", "Six",
        "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve",
        "Thirteen", "Fourteen", "Fifteen", "Sixteen",
        "Seventeen", "Eighteen", "Nineteen"];

    const tens = ["", "", "Twenty", "Thirty", "Forty",
        "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    function convert(n) {
        if (n < 20) return ones[n];
        if (n < 100)
            return tens[Math.floor(n / 10)] + " " + ones[n % 10];
        if (n < 1000)
            return ones[Math.floor(n / 100)] + " Hundred " + convert(n % 100);
        if (n < 100000)
            return convert(Math.floor(n / 1000)) + " Thousand " + convert(n % 1000);
        if (n < 10000000)
            return convert(Math.floor(n / 100000)) + " Lakh " + convert(n % 100000);
        return convert(Math.floor(n / 10000000)) + " Crore " + convert(n % 10000000);
    }

    return convert(Math.floor(num)) + " Only";
}



// ===============================

// ===============================
// GENERATE PDF (ERP LEVEL) - V4 (CENTERED + WATERMARK)
// ===============================

function generateInvoicePDF(invoiceData = null) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // --- 1. PASTE YOUR CLEAN BASE64 IMAGES HERE ---
    const logoBase64 = ""; // Paste your logo code here
    
    const stampBase64_GST = ""; // Paste your Facilitators Stamp here
    const stampBase64_NonGST = ""; // Paste your Nursing Services Stamp here (or use the same one)

    // 2. GATHER DATA
    let invoiceNo = "", invoiceDate = "", dueDate = "", customerName = "", items = [];
    let subtotal = 0, cgst = 0, sgst = 0, gst = 0, grandTotal = 0;
    let billAddress = "", billState = "";

    if (invoiceData) {
        invoiceNo = invoiceData.invoiceNo || "";
        invoiceDate = invoiceData.invoiceDate || "";
        dueDate = invoiceData.dueDate || "";
        customerName = invoiceData.customerName || "";
        items = invoiceData.items || [];
        subtotal = invoiceData.subtotal || 0;
        cgst = invoiceData.cgst || 0;
        sgst = invoiceData.sgst || 0;
        gst = invoiceData.gst || 0;
        grandTotal = invoiceData.total || 0;
    } else {
        invoiceNo = document.getElementById("invoiceNumber").value;
        invoiceDate = document.getElementById("invoiceDate").value;
        dueDate = document.getElementById("dueDate").value;
        customerName = document.getElementById("billName").value;
        billAddress = document.getElementById("billAddress").value;
        billState = document.getElementById("billState").value;

        const rows = document.querySelectorAll("#invoiceItemsBody tr");
        rows.forEach(row => {
            const desc = row.querySelector(".desc")?.value || "";
            const hsn = row.querySelector(".hsn")?.value || "";
            const qty = parseFloat(row.querySelector(".qty")?.value) || 0;
            const rate = parseFloat(row.querySelector(".rate")?.value) || 0;
            const amount = qty * rate;
            
            if (desc || amount > 0) {
                subtotal += amount;
                items.push({ desc, hsn, qty, rate, amount });
            }
        });

        let taxType = document.querySelector('input[name="taxType"]:checked')?.value;
        if (taxType === "cgst_sgst") { cgst = subtotal * 0.09; sgst = subtotal * 0.09; }
        if (taxType === "gst") { gst = subtotal * 0.18; }
        grandTotal = subtotal + cgst + sgst + gst;
    }

    // --- 3. DYNAMIC COMPANY LOGIC ---
    // Check if any tax is applied
    const isGSTBill = (cgst > 0 || sgst > 0 || gst > 0);
    
    const companyTitle = isGSTBill ? "SUMUKHA FACILITATORS PRIVATE LIMITED" : "SUMUKHA HOME NURSING SERVICES";
    const currentStamp = isGSTBill ? stampBase64_GST : stampBase64_NonGST;

    // --- GLOBAL OFFSET ---
    const yOffset = 30; 

    // --- HEADER ---
    if (logoBase64) {
        doc.addImage(logoBase64, 'PNG', 15, yOffset - 15, 48, 16); 
    }

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 32, 74);
    doc.text(companyTitle, 105, yOffset + 8, { align: "center" });

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text("No 477, 45th CRS, Jayanagar 8th Block, Bangalore - 560070", 105, yOffset + 14, { align: "center" });
    
    let emailY = yOffset + 19;
    
    // Only print GSTIN if it is a GST bill
    if (isGSTBill) {
        doc.text("GSTIN/UIN: 29AAUCS4592E1ZN | State: Karnataka (29)", 105, emailY, { align: "center" });
        emailY += 5;
    }
    
    doc.text("Email: homenursingservicesbangalore@gmail.com", 105, emailY, { align: "center" });

    // --- TITLE ---
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(15, emailY + 6, 195, emailY + 6);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("TAX INVOICE", 105, emailY + 13, { align: "center" });
    doc.line(15, emailY + 17, 195, emailY + 17);

    // --- BILL TO ---
    let startYDetails = emailY + 26;
    doc.setFontSize(10);
    doc.text("Bill To (Buyer):", 15, startYDetails);
    doc.setFont("helvetica", "normal");
    doc.text(customerName || "Cash", 15, startYDetails + 6);
    if (billAddress) {
        const splitAddress = doc.splitTextToSize(billAddress, 80);
        doc.text(splitAddress, 15, startYDetails + 12);
    }

    doc.setFont("helvetica", "bold");
    doc.text("Invoice No:", 120, startYDetails);
    doc.setFont("helvetica", "normal");
    doc.text(invoiceNo, 145, startYDetails);

    doc.setFont("helvetica", "bold");
    doc.text("Invoice Date:", 120, startYDetails + 6);
    doc.setFont("helvetica", "normal");
    doc.text(invoiceDate, 145, startYDetails + 6);

    // --- TABLE HEADER ---
    let startY = startYDetails + 26;
    doc.setFillColor(240, 240, 240);
    doc.rect(15, startY, 180, 10, 'F');
    doc.setDrawColor(200);
    doc.rect(15, startY, 180, 10, 'S'); 

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Sl", 18, startY + 7);
    doc.text("Description of Services/Items", 30, startY + 7);
    doc.text("HSN/SAC", 110, startY + 7);
    doc.text("Qty", 135, startY + 7);
    doc.text("Rate", 155, startY + 7);
    doc.text("Amount", 175, startY + 7);

    // --- TABLE ROWS ---
    doc.setFont("helvetica", "normal");
    let y = startY + 16;
    
    items.forEach((item, index) => {
        const splitDesc = doc.splitTextToSize(item.desc, 75);
        const rowHeight = splitDesc.length * 5;

        if (y + rowHeight > 230) { doc.addPage(); y = 20; }

        doc.text(String(index + 1), 18, y);
        doc.text(splitDesc, 30, y);
        doc.text(item.hsn || "-", 110, y);
        doc.text(String(item.qty), 135, y);
        doc.text(item.rate.toFixed(2), 155, y);
        doc.text(item.amount.toFixed(2), 175, y);

        y += rowHeight + 4;
        doc.setDrawColor(220);
        doc.line(15, y - 2, 195, y - 2); 
    });

    // --- PROFESSIONAL TOTALS BOX ---
    y += 5;
    if (y > 220) { doc.addPage(); y = 20; }

    doc.setDrawColor(200);
    doc.rect(15, y, 110, 25, 'S');
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Amount in Words:", 18, y + 6);
    doc.setFont("helvetica", "normal");
    doc.text(numberToWords(grandTotal), 18, y + 14);

    let taxLines = 1;
    if (cgst > 0) taxLines += 2;
    else if (gst > 0) taxLines += 1;
    const totalsBoxHeight = (taxLines * 7) + 15;
    
    doc.rect(130, y, 65, totalsBoxHeight, 'S');
    
    let totalY = y + 7;
    doc.setFontSize(10);
    
    doc.setFont("helvetica", "bold");
    doc.text("Subtotal:", 135, totalY);
    doc.text("Rs. " + subtotal.toFixed(2), 165, totalY);
    totalY += 7;

    doc.setFont("helvetica", "normal");
    if (cgst > 0) {
        doc.text("CGST (9%):", 135, totalY); doc.text("Rs. " + cgst.toFixed(2), 165, totalY); totalY += 7;
        doc.text("SGST (9%):", 135, totalY); doc.text("Rs. " + sgst.toFixed(2), 165, totalY); totalY += 7;
    }
    if (gst > 0) {
        doc.text("IGST (18%):", 135, totalY); doc.text("Rs. " + gst.toFixed(2), 165, totalY); totalY += 7;
    }

    doc.setDrawColor(200);
    doc.line(130, totalY - 4, 195, totalY - 4); 

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 32, 74); 
    doc.text("Grand Total:", 135, totalY + 2);
    doc.text("Rs. " + grandTotal.toFixed(2), 165, totalY + 2);

    // --- AUTHORISED SIGNATORY STAMP ---
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    
    let stampY = y + totalsBoxHeight + 10;
    if (stampY > 260) { doc.addPage(); stampY = 30; }

    doc.text("Authorised Signatory", 190, stampY + 20, { align: "right" });

    // Use the dynamic stamp based on GST vs Non-GST
    if (currentStamp) {
        doc.addImage(currentStamp, 'PNG', 150, stampY - 10, 40, 25); 
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150); 
    doc.text("This is a computer generated invoice and does not require a physical signature.", 105, 290, { align: "center" });

    doc.save(invoiceNo + ".pdf");
}

// ===============================
// SAVE INVOICE
// ===============================

function saveInvoiceRecord() {
    const invoiceNo = document.getElementById("invoiceNumber").value;
    const customerName = document.getElementById("billName").value;
    const invoiceDate = document.getElementById("invoiceDate").value;
    const dueDate = document.getElementById("dueDate").value;

    if (!invoiceNo || !invoiceDate) {
        alert("Invoice number and date required");
        return;
    }

    const rows = document.querySelectorAll("#invoiceItemsBody tr");
    if (rows.length === 0) {
        alert("Add at least one item");
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
        items, subtotal, cgst, sgst, gst, total,
        status: "Pending"
    };

    let message = "";

    if (editingInvoiceIndex !== null) {
        invoiceData.status = appInvoices[editingInvoiceIndex].status;
        appInvoices[editingInvoiceIndex] = invoiceData;
        editingInvoiceIndex = null;
        message = "Invoice has been edited successfully.";
    } else {
        if (appInvoices.some(inv => inv.invoiceNo === invoiceNo)) {
            alert("Invoice number already exists");
            return;
        }
        appInvoices.push(invoiceData);
        message = "Invoice created successfully.";
    }

    // Save to disk ONCE
    localStorage.setItem("savedInvoices", JSON.stringify(appInvoices));

    loadInvoiceHistory();
    clearInvoiceForm();
    updateDashboardAnalytics();
    alert(message);
}

// ===============================
// HISTORY
// ===============================

function loadInvoiceHistory() {
    const tableBody = document.querySelector("#invoiceHistoryTable tbody");
    if (!tableBody) return;
    tableBody.innerHTML = "";

    // Read directly from memory (appInvoices)
    appInvoices.forEach((inv, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${inv.invoiceNo}</td>
            <td><strong>${inv.customerName || "-"}</strong></td> <td>${inv.invoiceDate}</td>
            <td>₹ ${inv.total.toFixed(2)}</td>
            <td>
                <select class="status-${inv.status}" onchange="updateInvoiceStatus(${index}, this.value)">
                    <option value="Draft" ${inv.status === "Draft" ? "selected" : ""}>Draft</option>
                    <option value="Pending" ${inv.status === "Pending" ? "selected" : ""}>Pending</option>
                    <option value="Sent" ${inv.status === "Sent" ? "selected" : ""}>Sent</option>
                    <option value="Paid" ${inv.status === "Paid" ? "selected" : ""}>Paid</option>
                    <option value="Cancelled" ${inv.status === "Cancelled" ? "selected" : ""}>Cancelled</option>
                    <option value="Overdue" ${inv.status === "Overdue" ? "selected" : ""}>Overdue</option>
                </select>
            </td>
            <td>
                <button onclick="editInvoice(${index})">Edit</button>
                <button onclick="regenerateInvoice(${index})">Download</button>
                <button onclick="deleteInvoice(${index})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function regenerateInvoice(index) {
    generateInvoicePDF(appInvoices[index]);
}

function deleteInvoice(index) {
    appInvoices.splice(index, 1);
    localStorage.setItem("savedInvoices", JSON.stringify(appInvoices));
    loadInvoiceHistory();
    updateDashboardAnalytics(); 
}
function editInvoice(index) {
    // Read from the global state instead of parsing local storage
    const inv = appInvoices[index];
    if (!inv) return;

    editingInvoiceIndex = index;

    // Fill basic fields
    document.getElementById("invoiceNumber").value = inv.invoiceNo;
    document.getElementById("invoiceDate").value = inv.invoiceDate;
    document.getElementById("dueDate").value = inv.dueDate || "";

    // Clear current rows
    const tableBody = document.getElementById("invoiceItemsBody");
    tableBody.innerHTML = "";

    // Load items
    inv.items.forEach(item => {
        addInvoiceRow();
        const lastRow = tableBody.lastElementChild;

        lastRow.querySelector(".desc").value = item.desc;
        lastRow.querySelector(".hsn").value = item.hsn;
        lastRow.querySelector(".qty").value = item.qty;
        lastRow.querySelector(".rate").value = item.rate;
    });

    calculateInvoiceLive();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
function updateInvoiceStatus(index, newStatus) {
    if (!appInvoices[index]) return;
    appInvoices[index].status = newStatus;
    localStorage.setItem("savedInvoices", JSON.stringify(appInvoices));
    
    loadInvoiceHistory();
    updateDashboardAnalytics();
}


// ===============================
// CLEAR INVOICE FORM
// ===============================

function clearInvoiceForm() {

    const invoiceInput = document.getElementById("invoiceNumber");
    const dateInput = document.getElementById("invoiceDate");

    // Generate new invoice number
    if (invoiceInput) {
        invoiceInput.value = InvoiceCore.generateInvoiceNumber();
    }

    // Reset date to today
    if (dateInput) {
        dateInput.value = new Date().toISOString().slice(0, 10);
    }

    // Reset totals
    const subtotalEl = document.getElementById("subtotalDisplay");
    const taxEl = document.getElementById("taxDisplay");
    const totalEl = document.getElementById("totalDisplay");
    const wordsEl = document.getElementById("amountWords");

    if (subtotalEl) subtotalEl.innerText = "0.00";
    if (taxEl) taxEl.innerText = "0.00";
    if (totalEl) totalEl.innerText = "0.00";
    if (wordsEl) wordsEl.innerText = "";

    // Clear invoice items table
    const tableBody = document.getElementById("invoiceItemsBody");
    if (tableBody) tableBody.innerHTML = "";
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

    // Only write to disk if something actually changed to Overdue
    if (needsSaving) {
        localStorage.setItem("savedInvoices", JSON.stringify(appInvoices));
    }
}
function updateDashboardAnalytics() {
    let totalRevenue = 0;
    let pendingAmount = 0;
    let draftCount = 0;
    let paid = 0, pending = 0, overdue = 0, draft = 0;

    // Use global appInvoices instead of parsing localStorage
    appInvoices.forEach(inv => {
        if (inv.status === "Paid") {
            totalRevenue += inv.total;
            paid += inv.total;
        }
        if (inv.status === "Pending") pending += inv.total;
        if (inv.status === "Pending" || inv.status === "Overdue") {
            pendingAmount += inv.total;
        }
        if (inv.status === "Overdue") overdue += inv.total;
        if (inv.status === "Draft") {
            draftCount++;
            draft += inv.total;
        }
    });

    document.getElementById("totalRevenue").innerText = "₹ " + totalRevenue.toFixed(2);
    document.getElementById("pendingAmount").innerText = "₹ " + pendingAmount.toFixed(2);
    document.getElementById("draftCount").innerText = draftCount;
    document.getElementById("totalInvoices").innerText = appInvoices.length;

    const ctx = document.getElementById("revenueChart");
    if (ctx) {
        if (revenueChartInstance) revenueChartInstance.destroy();
        revenueChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Paid', 'Pending', 'Overdue', 'Draft'],
                datasets: [{
                    label: 'Amount ₹',
                    data: [paid, pending, overdue, draft],
                    backgroundColor: ['#28a745', '#ffc107', '#dc3545', '#6c757d']
                }]
            }
        });
    }

    // Customer intelligence using global appCustomers
    let withGST = 0, withoutGST = 0;
    appCustomers.forEach(c => {
        if (c.gst && c.gst.trim() !== "") withGST++;
        else withoutGST++;
    });

    const totalCustEl = document.getElementById("totalCustomers");
    const withGstEl = document.getElementById("customersWithGST");
    const withoutGstEl = document.getElementById("customersWithoutGST");

    if (totalCustEl) totalCustEl.innerText = appCustomers.length;
    if (withGstEl) withGstEl.innerText = withGST;
    if (withoutGstEl) withoutGstEl.innerText = withoutGST;

    const revenueByCustomer = {};
    appInvoices.forEach(inv => {
        if (!inv.customerName) return;
        if (!revenueByCustomer[inv.customerName]) revenueByCustomer[inv.customerName] = 0;
        if (inv.status === "Paid") revenueByCustomer[inv.customerName] += inv.total;
    });

    let topCustomer = "-", topRevenue = 0;
    for (let name in revenueByCustomer) {
        if (revenueByCustomer[name] > topRevenue) {
            topRevenue = revenueByCustomer[name];
            topCustomer = name;
        }
    }

    const topCustEl = document.getElementById("topCustomer");
    const topRevenueEl = document.getElementById("topCustomerRevenue");
    if (topCustEl) topCustEl.innerText = topCustomer;
    if (topRevenueEl) topRevenueEl.innerText = "₹ " + topRevenue.toFixed(2);
}




// ===============================
// CUSTOMER MANAGEMENT (OPTIMIZED)
// ===============================

function saveCustomer() {
    const name = document.getElementById("customerName").value;
    const address = document.getElementById("customerAddress").value;
    const stateCode = document.getElementById("customerState").value;
    const gst = document.getElementById("customerGST").value;

    if (!name) {
        alert("Customer name required");
        return;
    }

    if (editingCustomerIndex === null) {
        const exists = appCustomers.some(c => c.name.trim().toLowerCase() === name.trim().toLowerCase());
        if (exists) {
            alert("Customer already exists.");
            return;
        }
        appCustomers.push({ name, address, stateCode, gst });
    } else {
        // Handle editing logic if you add it later
        appCustomers[editingCustomerIndex] = { name, address, stateCode, gst };
        editingCustomerIndex = null;
    }

    localStorage.setItem("savedCustomers", JSON.stringify(appCustomers));

    loadCustomerDropdown();
    loadCustomersTable();
    clearCustomerForm();
    updateDashboardAnalytics();
    alert("Customer saved successfully.");
}



function deleteCustomer(index) {
    appCustomers.splice(index, 1);
    localStorage.setItem("savedCustomers", JSON.stringify(appCustomers));

    loadCustomersTable();
    updateDashboardAnalytics();
    loadCustomerDropdown();
}

function loadCustomerDropdown() {
    const select = document.getElementById("customerSelect");
    if (!select) return;

    select.innerHTML = '<option value="">Select Saved Customer</option>';

    appCustomers.forEach((cust, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = cust.name;
        select.appendChild(option);
    });

    if (customerChoicesInstance) customerChoicesInstance.destroy();
    if (typeof Choices !== 'undefined') {
        customerChoicesInstance = new Choices(select, {
            searchEnabled: true, itemSelectText: '', shouldSort: false
        });
    }
}

function attachCustomerSelectListener() {
    const select = document.getElementById("customerSelect");
    if (!select) return;

    select.addEventListener("change", function () {
        const index = this.value;
        
        const nameInput = document.getElementById("billName");
        const addressInput = document.getElementById("billAddress");
        const stateInput = document.getElementById("billState");

        // If they deselect the customer, clear the fields and UNLOCK them
        if (index === "") {
            if (nameInput) { nameInput.value = ""; nameInput.readOnly = false; }
            if (addressInput) { addressInput.value = ""; addressInput.readOnly = false; }
            if (stateInput) { stateInput.value = ""; stateInput.readOnly = false; }
            return;
        }

        const cust = appCustomers[index];
        if (!cust) return;

        // Auto-fill the details perfectly (Including the State!)
        if (nameInput) nameInput.value = cust.name || "";
        if (addressInput) addressInput.value = cust.address || "";
        if (stateInput) stateInput.value = cust.stateCode || cust.state || "";

        // 🔥 LOCK THE FIELDS: Prevent accidental editing of saved customers
        if (nameInput) nameInput.readOnly = true;
        if (addressInput) addressInput.readOnly = true;
        if (stateInput) stateInput.readOnly = true;
    });
}

function searchCustomers() {
    const searchValue = document.getElementById("customerSearch").value.toLowerCase();
    const tableBody = document.querySelector("#customerTable tbody");
    if (!tableBody) return;

    tableBody.innerHTML = "";

    // Loop through the original array so the ID (index) stays perfectly accurate!
    appCustomers.forEach((cust, index) => {
        if (cust.name.toLowerCase().includes(searchValue)) {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${cust.name}</td>
                <td>${cust.stateCode || cust.state || "-"}</td>
                <td>${cust.pincode || "-"}</td>
                <td>${cust.gst || "-"}</td>
                <td>
                    <button onclick="editCustomer(${index})">Edit</button>
                    <button onclick="deleteCustomer(${index})">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        }
    });
}

function loadCustomersTable() {

    const tableBody = document.querySelector("#customerTable tbody");
    if (!tableBody) return;

    tableBody.innerHTML = "";

    const customers = JSON.parse(localStorage.getItem("savedCustomers")) || [];

    customers.forEach((cust, index) => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${cust.name}</td>
            <td>${cust.address}</td>
            <td>${cust.stateCode}</td>
            <td>${cust.gst || "-"}</td>
            <td>
            <button onclick="editCustomer(${index})">Edit</button>
                <button onclick="deleteCustomer(${index})">Delete</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

function deleteCustomer(index) {

    let customers = JSON.parse(localStorage.getItem("savedCustomers")) || [];

    customers.splice(index, 1);

    localStorage.setItem("savedCustomers", JSON.stringify(customers));

    loadCustomersTable();
    updateDashboardAnalytics();
    loadCustomerDropdown();
}

function clearCustomerForm() {

    document.getElementById("customerName").value = "";
    document.getElementById("customerAddress").value = "";
    document.getElementById("customerState").value = "";
    document.getElementById("customerGST").value = "";
}

function editCustomer(index) {

    const customers = JSON.parse(localStorage.getItem("savedCustomers")) || [];
    const cust = customers[index];

    if (!cust) return;

    editingCustomerIndex = index;

    document.getElementById("customerName").value = cust.name;
    document.getElementById("customerAddress").value = cust.address;
    document.getElementById("customerState").value = cust.state || "";
    document.getElementById("customerPincode").value = cust.pincode || "";
    document.getElementById("customerGST").value = cust.gst || "";

    window.scrollTo({ top: 0, behavior: "smooth" });
}
const indianStates = [
"Karnataka",
"Maharashtra",
"Tamil Nadu",
"Kerala",
"Telangana",
"Andhra Pradesh",
"Delhi",
"Uttar Pradesh",
"Gujarat",
"Rajasthan",
"West Bengal",
"Bihar",
"Madhya Pradesh",
"Punjab",
"Haryana",
"Odisha",
"Assam",
"Jharkhand",
"Chhattisgarh",
"Himachal Pradesh",
"Uttarakhand",
"Goa",
"Tripura",
"Manipur",
"Meghalaya",
"Nagaland",
"Mizoram",
"Sikkim",
"Arunachal Pradesh",
"Andaman and Nicobar Islands",
"Chandigarh",
"Dadra and Nagar Haveli and Daman and Diu",
"Lakshadweep",
"Puducherry",
"Ladakh",
"Jammu and Kashmir"
];
function loadStates() {

    const select = document.getElementById("customerState");
    if (!select) return;

    select.innerHTML = '<option value="">Select State</option>';

    indianStates.forEach(state => {
        const option = document.createElement("option");
        option.value = state;
        option.textContent = state;
        select.appendChild(option);
    });
}

function resetInvoiceCustomerFields() {

    const select = document.getElementById("customerSelect");
    if (select) select.value = "";

    document.getElementById("billName").value = "";
    document.getElementById("billAddress").value = "";
    document.getElementById("billState").value = "";

    const gstField = document.getElementById("billGST");
    if (gstField) gstField.value = "";
}
function searchCustomers() {

    const searchValue = document.getElementById("customerSearch").value.toLowerCase();

    const customers = JSON.parse(localStorage.getItem("savedCustomers")) || [];
    const tableBody = document.querySelector("#customerTable tbody");

    if (!tableBody) return;

    tableBody.innerHTML = "";

    customers
        .filter(c => c.name.toLowerCase().includes(searchValue))
        .forEach((cust, index) => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${cust.name}</td>
                <td>${cust.state}</td>
                <td>${cust.pincode}</td>
                <td>${cust.gst || "-"}</td>
                <td>
                    <button onclick="editCustomer(${index})">Edit</button>
                    <button onclick="deleteCustomer(${index})">Delete</button>
                </td>
            `;

            tableBody.appendChild(row);
        });
}
// ===============================
// FILTER INVOICES (ADDITIVE FEATURE)
// ===============================

// ===============================
// FILTER INVOICES (ADDITIVE FEATURE)
// ===============================

function filterInvoices() {
    const searchQuery = document.getElementById("invoiceSearchInput").value.toLowerCase();
    const statusFilter = document.getElementById("invoiceStatusFilter").value;
    
    const tableBody = document.querySelector("#invoiceHistoryTable tbody");
    if (!tableBody) return;

    // Clear the table
    tableBody.innerHTML = "";

    // Loop through the global appInvoices array
    appInvoices.forEach((inv, index) => {
        
        // 1. Check if it matches the search query (Invoice Number OR Customer Name)
        const custName = inv.customerName ? inv.customerName.toLowerCase() : "";
        const invNo = inv.invoiceNo ? inv.invoiceNo.toLowerCase() : "";
        const matchesSearch = invNo.includes(searchQuery) || custName.includes(searchQuery);

        // 2. Check if it matches the dropdown status
        const matchesStatus = statusFilter === "All" || inv.status === statusFilter;

        // If it passes both filters, draw the row!
        if (matchesSearch && matchesStatus) {
            const row = document.createElement("tr");
            
            row.innerHTML = `
                <td>${inv.invoiceNo}</td>
                <td><strong>${inv.customerName || "-"}</strong></td> <td>${inv.invoiceDate}</td>
                <td>₹ ${inv.total.toFixed(2)}</td>
                <td>
                    <select class="status-${inv.status}" onchange="updateInvoiceStatus(${index}, this.value)">
                        <option value="Draft" ${inv.status === "Draft" ? "selected" : ""}>Draft</option>
                        <option value="Pending" ${inv.status === "Pending" ? "selected" : ""}>Pending</option>
                        <option value="Sent" ${inv.status === "Sent" ? "selected" : ""}>Sent</option>
                        <option value="Paid" ${inv.status === "Paid" ? "selected" : ""}>Paid</option>
                        <option value="Cancelled" ${inv.status === "Cancelled" ? "selected" : ""}>Cancelled</option>
                        <option value="Overdue" ${inv.status === "Overdue" ? "selected" : ""}>Overdue</option>
                    </select>
                </td>
                <td>
                    <button onclick="editInvoice(${index})">Edit</button>
                    <button onclick="regenerateInvoice(${index})">Download</button>
                    <button onclick="deleteInvoice(${index})">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        }
    });
}
// ===============================
// SIDEBAR INVOICE ROUTING
// ===============================

// ===============================
// SIDEBAR INVOICE ROUTING
// ===============================

function openCreateInvoice(taxMode) {
    // 1. Open the form page
    showSection('createInvoice');
    
    // 2. WIPE THE FORM CLEAN! (No more ghost data)
    resetInvoiceForm();
    
    // 3. Automatically select the correct radio button
    if (taxMode === 'gst') {
        document.querySelector('input[name="taxType"][value="gst"]').checked = true;
    } else {
        document.querySelector('input[name="taxType"][value="none"]').checked = true;
    }
    
    // 4. Trigger the live calculation to instantly swap the company name header
    calculateInvoiceLive();
}
// ===============================
// RESET INVOICE FORM
// ===============================
// ===============================
// RESET INVOICE FORM
// ===============================
// ===============================
// RESET INVOICE FORM
// ===============================
function resetInvoiceForm() {
    // 1. Clear all text boxes, textareas, and date fields
    const inputs = document.querySelectorAll('#createInvoice input[type="text"], #createInvoice input[type="date"], #createInvoice input[type="number"], #createInvoice textarea');
    inputs.forEach(input => input.value = '');

    // 2. Reset the saved customer dropdown
    const customerSelect = document.getElementById('customerSelect');
    if (customerSelect) customerSelect.value = '';

    // 3. Delete ALL items from the table (Leaves 0 rows)
    const tbody = document.getElementById("invoiceItemsBody");
    if (tbody) {
        tbody.innerHTML = ''; 
    }

    // 4. Reset the total displays back to 0.00
    document.getElementById("subtotalDisplay").innerText = "0.00";
    document.getElementById("taxDisplay").innerText = "0.00";
    document.getElementById("totalDisplay").innerText = "0.00";
    document.getElementById("amountWords").innerText = "";

    // 5. AUTO-FILL TODAY'S DATE
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months start at 0
    const dd = String(today.getDate()).padStart(2, '0');
    
    const formattedDate = `${yyyy}-${mm}-${dd}`; // Formats as YYYY-MM-DD
    
    const invoiceDateInput = document.getElementById('invoiceDate');
    if (invoiceDateInput) {
        invoiceDateInput.value = formattedDate;
    }
}
// ===============================
// CUSTOMER AUTO-FILL & LOCKING
// ===============================

function handleCustomerSelect() {
    const select = document.getElementById("customerSelect");
    const nameInput = document.getElementById("billName");
    const addressInput = document.getElementById("billAddress");
    const stateInput = document.getElementById("billState");

    if (select.value) {
        // Fetch saved customers from localStorage
        const customers = JSON.parse(localStorage.getItem("appCustomers")) || [];
        
        // Find the selected customer (assuming the dropdown value is their name)
        const selectedCustomer = customers.find(c => c.name === select.value);

        if (selectedCustomer) {
            // Auto-fill the fields, including the state
            nameInput.value = selectedCustomer.name || "";
            addressInput.value = selectedCustomer.address || "";
            stateInput.value = selectedCustomer.state || "";

            // Lock the fields so they cannot be manually edited
            nameInput.readOnly = true;
            addressInput.readOnly = true;
            stateInput.readOnly = true;

            // Make them look greyed out so the user knows they are locked
            nameInput.style.backgroundColor = "#e9ecef";
            addressInput.style.backgroundColor = "#e9ecef";
            stateInput.style.backgroundColor = "#e9ecef";
        }
    } else {
        // If "-- Custom / Walk-in Customer --" is selected, clear everything
        nameInput.value = "";
        addressInput.value = "";
        stateInput.value = "";

        // Unlock the fields so you can type manually
        nameInput.readOnly = false;
        addressInput.readOnly = false;
        stateInput.readOnly = false;

        // Reset background colors to white
        nameInput.style.backgroundColor = "#fff";
        addressInput.style.backgroundColor = "#fff";
        stateInput.style.backgroundColor = "#fff";
    }
}
document.addEventListener("DOMContentLoaded", function () {

    const invoiceInput = document.getElementById("invoiceNumber");
    const dateInput = document.getElementById("invoiceDate");

    if (invoiceInput && !invoiceInput.value) {
        invoiceInput.value = InvoiceCore.generateInvoiceNumber();
    }

    if (dateInput && !dateInput.value) {
        dateInput.value = new Date().toISOString().slice(0, 10);
    }

    // 1. Load data into memory ONCE
    appInvoices = JSON.parse(localStorage.getItem("savedInvoices")) || [];
    appCustomers = JSON.parse(localStorage.getItem("savedCustomers")) || [];

    // 2. Run the overdue check once on startup
    checkOverdueInvoices();

    // 3. Initialize UI
    loadInvoiceHistory();
    updateDashboardAnalytics();
    loadCustomerDropdown();
    attachCustomerSelectListener();
    loadCustomersTable();
    loadStates();
});
