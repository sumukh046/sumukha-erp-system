// ===============================
// SECTION ROUTING
// ===============================

function showSection(id) {

    document.querySelectorAll(".sub-section").forEach(sec => {
        sec.classList.remove("active");
    });

    const section = document.getElementById(id);
    if (section) {
        section.classList.add("active");
    }

    // 🔥 Refresh Finance dropdown when opening Finance tab
    if (id === "financeSection") {
        if (typeof loadFinancePeopleDropdown === "function") {
            loadFinancePeopleDropdown();
        }
    }
}

// ===============================
// DASHBOARD
// ===============================

function updateDashboard() {
    if (!window.db) return;

    document.getElementById("dashEmp").innerText = db.employees.length;
    document.getElementById("dashWorking").innerText =
        db.employees.filter(e => e.status === "Working").length;
    document.getElementById("dashLeave").innerText =
        db.employees.filter(e => e.status === "On Leave").length;
    document.getElementById("dashLeft").innerText =
        db.employees.filter(e => e.status === "Left Company").length;
}

// ===============================
// SIDEBAR ACCORDION
// ===============================

function toggleEmployeeMenu() {
    const empMenu = document.getElementById("employeeMenu");
    const invMenu = document.getElementById("invoiceMenu");

    if (!empMenu) return;

    if (empMenu.style.display === "none" || empMenu.style.display === "") {
        if (invMenu) invMenu.style.display = "none";
        empMenu.style.display = "block";
    } else {
        empMenu.style.display = "none";
    }
}

function toggleInvoiceMenu() {
    const empMenu = document.getElementById("employeeMenu");
    const invMenu = document.getElementById("invoiceMenu");

    if (!invMenu) return;

    if (invMenu.style.display === "none" || invMenu.style.display === "") {
        if (empMenu) empMenu.style.display = "none";
        invMenu.style.display = "block";
    } else {
        invMenu.style.display = "none";
    }
}
function refreshFinanceUI() {
    loadFinancePeopleDropdown();
    const transactions = FinanceCore.getTransactions();
    const balance = FinanceCore.getBalance();

    document.getElementById("bankBalance").innerText = "₹" + balance.bankBalance;
    document.getElementById("cashBalance").innerText = "₹" + balance.cashBalance;

    const tbody = document.getElementById("financeTableBody");
    tbody.innerHTML = "";

    transactions.forEach(txn => {
        const row = `
            <tr>
                <td>${txn.date}</td>
                <td>${txn.paidTo}</td>
                <td>${txn.category}</td>
                <td>${txn.paymentMode}</td>
                <td>₹${txn.amount}</td>
                <td>
                    <button onclick="deleteFinanceTxn('${txn.id}')">Delete</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}
function addFinanceTransaction() {

    const data = {
        date: document.getElementById("txnDate").value,
        paidTo: document.getElementById("paidTo").value,
        category: document.getElementById("category").value,
        paymentMode: document.getElementById("paymentMode").value,
        amount: document.getElementById("amount").value,
        notes: document.getElementById("notes").value
    };

    FinanceCore.addTransaction(data);
    refreshFinanceUI();
}
function setOpeningBalance() {
    const bank = document.getElementById("openingBank").value;
    const cash = document.getElementById("openingCash").value;

    if (!bank && !cash) {
        alert("Enter opening balances");
        return;
    }

    FinanceCore.setOpeningBalance(bank || 0, cash || 0);
    refreshFinanceUI();
}




   
// ===============================
// INIT
// ===============================

window.addEventListener("load", function () {
    if (typeof loadEmployees === "function") loadEmployees();
    if (typeof loadStatusTable === "function") loadStatusTable();
    updateDashboard();
});

