

// ===============================
// INVOICE CORE (NO DOM)
// ===============================

let revenueChartInstance = null;
let editingInvoiceIndex = null;
let editingCustomerIndex = null;
let customerChoicesInstance = null;
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

function addInvoiceRow() {

    const tbody = document.getElementById("invoiceItemsBody");
    if (!tbody) return;

    const row = document.createElement("tr");

    row.innerHTML = `
        <td></td>
        <td><input class="desc" type="text"></td>
        <td><input class="hsn" type="text"></td>
        <td><input class="qty" type="number" value="1"></td>
        <td><input class="rate" type="number" value="0"></td>
        <td></td>
        <td><button type="button">X</button></td>
    `;

    row.querySelector("button").onclick = function () {
        row.remove();
        updateSerialNumbers();
        calculateInvoiceLive();
    };

    tbody.appendChild(row);
    updateSerialNumbers();
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

        const qty = parseFloat(row.querySelector(".qty")?.value) || 0;
        const rate = parseFloat(row.querySelector(".rate")?.value) || 0;
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
    }

    if (taxType === "gst") {
        gst = subtotal * 0.18;
    }

    const tax = cgst + sgst + gst;
    const total = subtotal + tax;

    document.getElementById("subtotalDisplay").innerText = subtotal.toFixed(2);
    document.getElementById("taxDisplay").innerText = tax.toFixed(2);
    document.getElementById("totalDisplay").innerText = total.toFixed(2);

    if (total > 0) {
        document.getElementById("amountWords").innerText = numberToWords(total);
    } else {
        document.getElementById("amountWords").innerText = "";
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
// GENERATE PDF (ERP LEVEL)
// ===============================

function generateInvoicePDF(invoiceData = null) {

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let invoiceNo, invoiceDate, items = [];
    let subtotal = 0, cgst = 0, sgst = 0, gst = 0, grandTotal = 0;

    if (invoiceData) {

        invoiceNo = invoiceData.invoiceNo;
        invoiceDate = invoiceData.invoiceDate;
        items = invoiceData.items;
        subtotal = invoiceData.subtotal;
        cgst = invoiceData.cgst;
        sgst = invoiceData.sgst;
        gst = invoiceData.gst;
        grandTotal = invoiceData.total;

    } else {

        invoiceNo = document.getElementById("invoiceNumber").value;
        invoiceDate = document.getElementById("invoiceDate").value;

        const rows = document.querySelectorAll("#invoiceItemsBody tr");

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

        if (taxType === "cgst_sgst") {
            cgst = subtotal * 0.09;
            sgst = subtotal * 0.09;
        }

        if (taxType === "gst") {
            gst = subtotal * 0.18;
        }

        grandTotal = subtotal + cgst + sgst + gst;
    }

    let y = 10;
    doc.setFontSize(16);
    doc.text("Tax Invoice", 105, y, null, null, "center");
    y += 15;

    doc.text("Invoice No: " + invoiceNo, 10, y);
    y += 7;
    doc.text("Date: " + invoiceDate, 10, y);
    y += 10;

    items.forEach((item, index) => {
        doc.text(`${index + 1}. ${item.desc} - ₹${item.amount.toFixed(2)}`, 10, y);
        y += 7;
    });

    y += 5;
    doc.text("Subtotal: ₹" + subtotal.toFixed(2), 10, y); y += 7;
    if (cgst > 0) { doc.text("CGST: ₹" + cgst.toFixed(2), 10, y); y += 7; }
    if (sgst > 0) { doc.text("SGST: ₹" + sgst.toFixed(2), 10, y); y += 7; }
    if (gst > 0) { doc.text("GST: ₹" + gst.toFixed(2), 10, y); y += 7; }

    doc.text("Total: ₹" + grandTotal.toFixed(2), 10, y);
    y += 10;
    doc.text(numberToWords(grandTotal), 10, y);

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
    }

    if (taxType === "gst") {
        gst = subtotal * 0.18;
    }

    const total = subtotal + cgst + sgst + gst;

    let invoices = JSON.parse(localStorage.getItem("savedInvoices")) || [];

  const invoiceData = {
    invoiceNo,
    invoiceDate,
    dueDate,
    customerName,
    items,
    subtotal,
    cgst,
    sgst,
    gst,
    total,
    status: "Pending"
};

let message = "";

if (editingInvoiceIndex !== null) {

    invoiceData.status = invoices[editingInvoiceIndex].status;
    invoices[editingInvoiceIndex] = invoiceData;
    editingInvoiceIndex = null;

    message = "Invoice has been edited successfully.";

} else {

    if (invoices.some(inv => inv.invoiceNo === invoiceNo)) {
        alert("Invoice number already exists");
        return;
    }

    invoices.push(invoiceData);

    message = "Invoice created successfully.";
}

    localStorage.setItem("savedInvoices", JSON.stringify(invoices));

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

    const invoices = JSON.parse(localStorage.getItem("savedInvoices")) || [];

    invoices.forEach((inv, index) => {

        const row = document.createElement("tr");

        row.innerHTML = `
    <td>${inv.invoiceNo}</td>
    <td>${inv.invoiceDate}</td>
    <td>₹ ${inv.total.toFixed(2)}</td>
    <td>
        <select class="status-${inv.status}"
            onchange="updateInvoiceStatus(${index}, this.value)">
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
    const invoices = JSON.parse(localStorage.getItem("savedInvoices")) || [];
    generateInvoicePDF(invoices[index]);
}

function deleteInvoice(index) {
    let invoices = JSON.parse(localStorage.getItem("savedInvoices")) || [];
    invoices.splice(index, 1);
    localStorage.setItem("savedInvoices", JSON.stringify(invoices));
    loadInvoiceHistory();
}
function editInvoice(index) {

    const invoices = JSON.parse(localStorage.getItem("savedInvoices")) || [];
    const inv = invoices[index];

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

        const rows = document.querySelectorAll("#invoiceItemsBody tr");
        const lastRow = rows[rows.length - 1];

        lastRow.querySelector(".desc").value = item.desc;
        lastRow.querySelector(".hsn").value = item.hsn;
        lastRow.querySelector(".qty").value = item.qty;
        lastRow.querySelector(".rate").value = item.rate;
    });

    calculateInvoiceLive();

    window.scrollTo({ top: 0, behavior: 'smooth' });
}
function updateInvoiceStatus(index, newStatus) {

    let invoices = JSON.parse(localStorage.getItem("savedInvoices")) || [];

    if (!invoices[index]) return;

    invoices[index].status = newStatus;

    localStorage.setItem("savedInvoices", JSON.stringify(invoices));
    

    loadInvoiceHistory();
    updateDashboardAnalytics();
    
}
function editInvoice(index) {

    const invoices = JSON.parse(localStorage.getItem("savedInvoices")) || [];
    const inv = invoices[index];

    if (!inv) return;

    editingInvoiceIndex = index;

    document.getElementById("invoiceNumber").value = inv.invoiceNo;
    document.getElementById("invoiceDate").value = inv.invoiceDate;
    document.getElementById("dueDate").value = inv.dueDate || "";

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

    calculateInvoiceLive();
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
function updateDashboardAnalytics() {

    const today = new Date().toISOString().slice(0,10);
    const invoices = JSON.parse(localStorage.getItem("savedInvoices")) || [];

    let totalRevenue = 0;
    let pendingAmount = 0;
    let draftCount = 0;

    invoices.forEach(inv => {
        
        // 🔥 Auto Overdue Detection
if (inv.status === "Pending" && inv.dueDate && inv.dueDate < today) {
    inv.status = "Overdue";
}


        if (inv.status === "Paid") {
            totalRevenue += inv.total;
        }

       if (inv.status === "Pending" || inv.status === "Overdue") {
    pendingAmount += inv.total;
}

        if (inv.status === "Draft") {
            draftCount++;
        }
    });
    localStorage.setItem("savedInvoices", JSON.stringify(invoices));

    document.getElementById("totalRevenue").innerText = "₹ " + totalRevenue.toFixed(2);
    document.getElementById("pendingAmount").innerText = "₹ " + pendingAmount.toFixed(2);
    document.getElementById("draftCount").innerText = draftCount;
    document.getElementById("totalInvoices").innerText = invoices.length;
    let paid = 0;
    let pending = 0;
    let overdue = 0;
    let draft = 0;

invoices.forEach(inv => {
    if (inv.status === "Paid") paid += inv.total;
    if (inv.status === "Pending") pending += inv.total;
    if (inv.status === "Overdue") overdue += inv.total;
    if (inv.status === "Draft") draft += inv.total;
});

  const ctx = document.getElementById("revenueChart");
  
    if (!ctx) return;

    // 🔥 Destroy old chart before creating new one
    if (revenueChartInstance) {
        revenueChartInstance.destroy();
    }

    revenueChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Paid', 'Pending', 'Overdue', 'Draft'],
            datasets: [{
                label: 'Amount ₹',
                data: [paid, pending, overdue, draft],
                backgroundColor: [
                    '#28a745',  // Paid
                    '#ffc107',  // Pending
                    '#dc3545',  // Overdue
                    '#6c757d'   // Draft
                ]
            }]
        }
    });
    const customers = JSON.parse(localStorage.getItem("savedCustomers")) || [];

   let withGST = 0;
   let withoutGST = 0;

   customers.forEach(c => {
       if (c.gst && c.gst.trim() !== "") {
           withGST++;
       } else {
           withoutGST++;
       }
   });

   const totalCustEl = document.getElementById("totalCustomers");
   const withGstEl = document.getElementById("customersWithGST");
   const withoutGstEl = document.getElementById("customersWithoutGST");

   if (totalCustEl) totalCustEl.innerText = customers.length;
   if (withGstEl) withGstEl.innerText = withGST;
   if (withoutGstEl) withoutGstEl.innerText = withoutGST;
   // ===============================
// CUSTOMER REVENUE INTELLIGENCE
// ===============================

const revenueByCustomer = {};

invoices.forEach(inv => {
    if (!inv.customerName) return;

    if (!revenueByCustomer[inv.customerName]) {
        revenueByCustomer[inv.customerName] = 0;
    }

    if (inv.status === "Paid") {
        revenueByCustomer[inv.customerName] += inv.total;
    }
});

let topCustomer = "-";
let topRevenue = 0;

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




function saveCustomer() {

    const name = document.getElementById("customerName").value;
    const address = document.getElementById("customerAddress").value;
    const stateCode = document.getElementById("customerState").value;
    const gst = document.getElementById("customerGST").value;

    if (!name) {
        alert("Customer name required");
        return;
    }

    let customers = JSON.parse(localStorage.getItem("savedCustomers")) || [];
    // Prevent duplicate names (case insensitive)
if (editingCustomerIndex === null) {
    const exists = customers.some(c => 
        c.name.trim().toLowerCase() === name.trim().toLowerCase()
    );

    if (exists) {
        alert("Customer already exists.");
        return;
    }
}

    customers.push({
        name,
        address,
        stateCode,
        gst
    });

    localStorage.setItem("savedCustomers", JSON.stringify(customers));

    loadCustomerDropdown();
    loadCustomersTable();
    clearCustomerForm();
    updateDashboardAnalytics();

    alert("Customer saved successfully.");
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
function loadCustomerDropdown() {

    const select = document.getElementById("customerSelect");
    if (!select) return;

    select.innerHTML = '<option value="">Select Saved Customer</option>';

    const customers = JSON.parse(localStorage.getItem("savedCustomers")) || [];

    customers.forEach((cust, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = cust.name;
        select.appendChild(option);
    });

    // Destroy old instance if exists
    if (customerChoicesInstance) {
        customerChoicesInstance.destroy();
    }

    customerChoicesInstance = new Choices(select, {
        searchEnabled: true,
        itemSelectText: '',
        shouldSort: false
    });
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
function attachCustomerSelectListener() {

    const select = document.getElementById("customerSelect");
    if (!select) return;

    select.addEventListener("change", function () {

        const index = this.value;

        if (index === "") return;

        const customers = JSON.parse(localStorage.getItem("savedCustomers")) || [];
        const cust = customers[index];

        if (!cust) return;

        document.getElementById("billName").value = cust.name || "";
        document.getElementById("billAddress").value = cust.address || "";
        document.getElementById("billState").value = cust.state || "";

        const gstField = document.getElementById("billGST");
        if (gstField) gstField.value = cust.gst || "";
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

document.addEventListener("DOMContentLoaded", function () {

    const invoiceInput = document.getElementById("invoiceNumber");
    const dateInput = document.getElementById("invoiceDate");

    if (invoiceInput && !invoiceInput.value) {
        invoiceInput.value = InvoiceCore.generateInvoiceNumber();
    }

    if (dateInput && !dateInput.value) {
        dateInput.value = new Date().toISOString().slice(0, 10);
    }

    loadInvoiceHistory();
    updateDashboardAnalytics();
    loadCustomerDropdown();
    attachCustomerSelectListener();
    loadCustomersTable();
    loadStates();
});
