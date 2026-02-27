// ===============================
// CORPORATE INVOICE UI LAYER
// ===============================

const InvoiceUI = (function () {

    function collectItemsFromTable() {

        const rows = document.querySelectorAll("#invoiceItemsBody tr");
        const items = [];

        rows.forEach(row => {

            const desc = row.querySelector(".desc")?.value || "";
            const hsn = row.querySelector(".hsn")?.value || "";
            const qty = parseFloat(row.querySelector(".qty")?.value) || 0;
            const rate = parseFloat(row.querySelector(".rate")?.value) || 0;

            if (desc.trim() !== "" && qty > 0) {
                items.push({ desc, hsn, qty, rate });
            }

        });

        return items;
    }

    function createInvoice() {

        const clientName = document.getElementById("clientName")?.value || "Walk-in Client";
        const taxType = document.querySelector("input[name='taxType']:checked")?.value || "cgst_sgst";

        const items = collectItemsFromTable();

        if (items.length === 0) {
            alert("Add at least one item.");
            return;
        }

        const totals = InvoiceCore.calculateTotals(items, taxType);

        const invoice = {
            id: InvoiceCore.generateInvoiceNumber(),
            client: { name: clientName },
            items,
            ...totals,
            status: "Unpaid",
            createdAt: new Date(),
            paidAt: null
        };

        InvoiceCore.save(invoice);

        alert("Invoice Saved Successfully.");

        renderInvoiceHistory();
        clearInvoiceForm();
    }

    function renderInvoiceHistory() {

        const container = document.getElementById("invoiceHistory");
        if (!container) return;

        const invoices = InvoiceCore.getAll();

        container.innerHTML = "";

        invoices.forEach(inv => {

            const row = document.createElement("div");
            row.className = "invoice-history-row";

            row.innerHTML = `
                <strong>${inv.id}</strong> |
                ${inv.client.name} |
                ₹${inv.total.toFixed(2)} |
                Status: ${inv.status}
                <button onclick="InvoiceUI.markPaid('${inv.id}')">Mark Paid</button>
            `;

            container.appendChild(row);
        });
    }

    function markPaid(id) {
        InvoiceCore.updateStatus(id, "Paid");
        renderInvoiceHistory();
    }

    function clearInvoiceForm() {
        document.getElementById("invoiceItemsBody").innerHTML = "";
        document.getElementById("clientName").value = "";
    }

    return {
        createInvoice,
        renderInvoiceHistory,
        markPaid
    };

})();