// ===============================
// CORPORATE INVOICE CORE
// ===============================

const InvoiceCore = (function () {

    const STORAGE_KEY = "erp_invoices";
    const COUNTER_KEY = "erp_invoice_counter";

    function getCounter() {
        return parseInt(localStorage.getItem(COUNTER_KEY)) || 1;
    }

    function incrementCounter() {
        const next = getCounter() + 1;
        localStorage.setItem(COUNTER_KEY, next);
    }

    function generateInvoiceNumber() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");

        const number = `SUM-${year}-${month}-${getCounter()}`;
        incrementCounter();
        return number;
    }

    function calculateTotals(items, taxType) {

        let subtotal = 0;

        items.forEach(item => {
            item.amount = item.qty * item.rate;
            subtotal += item.amount;
        });

        let cgst = 0, sgst = 0, gst = 0;

        if (taxType === "cgst_sgst") {
            cgst = subtotal * 0.09;
            sgst = subtotal * 0.09;
        }

        if (taxType === "gst") {
            gst = subtotal * 0.18;
        }

        return {
            subtotal,
            cgst,
            sgst,
            gst,
            total: subtotal + cgst + sgst + gst
        };
    }

    function save(invoice) {
        const invoices = getAll();
        invoices.push(invoice);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
    }

    function updateStatus(id, status) {
        const invoices = getAll();
        const inv = invoices.find(i => i.id === id);
        if (inv) {
            inv.status = status;
            if (status === "Paid") {
                inv.paidAt = new Date();
            }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
        }
    }

    function getAll() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    }

    function getRevenue() {
        const invoices = getAll();
        return invoices
            .filter(i => i.status === "Paid")
            .reduce((sum, i) => sum + i.total, 0);
    }

    function getPendingAmount() {
        const invoices = getAll();
        return invoices
            .filter(i => i.status !== "Paid")
            .reduce((sum, i) => sum + i.total, 0);
    }

    return {
        generateInvoiceNumber,
        calculateTotals,
        save,
        updateStatus,
        getAll,
        getRevenue,
        getPendingAmount
    };

})();