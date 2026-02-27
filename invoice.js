// ===============================
// INVOICE CORE (NO DOM)
// ===============================

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
});

document.addEventListener("change", function (e) {
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
    const invoiceDate = document.getElementById("invoiceDate").value;

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

    if (invoices.some(inv => inv.invoiceNo === invoiceNo)) {
        alert("Invoice number already exists");
        return;
    }

    invoices.push({
        invoiceNo,
        invoiceDate,
        items,
        subtotal,
        cgst,
        sgst,
        gst,
        total,
        status: "Draft"
    });

    localStorage.setItem("savedInvoices", JSON.stringify(invoices));

    loadInvoiceHistory();
    clearInvoiceForm();
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
            <td>${inv.total.toFixed(2)}</td>
            <td>${inv.status}</td>
            <td>
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

// ===============================
// INIT
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    document.getElementById("invoiceNumber").value =
        InvoiceCore.generateInvoiceNumber();

    document.getElementById("invoiceDate").value =
        new Date().toISOString().slice(0, 10);

    loadInvoiceHistory();
});