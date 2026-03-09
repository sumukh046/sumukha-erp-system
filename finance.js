// ===============================
// FINANCE CORE
// ===============================

let FinanceCore = (function () {

    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    let financeBalance = JSON.parse(localStorage.getItem("financeBalance")) || {
        bankBalance: 0,
        cashBalance: 0
    };

    function saveData() {
        localStorage.setItem("transactions", JSON.stringify(transactions));
        localStorage.setItem("financeBalance", JSON.stringify(financeBalance));
    }

    function generateId() {
        return "TXN-" + Date.now();
    }

   function addTransaction(data) {

    let paidToName = data.paidTo;
    let paidToValue = data.paidTo;

    // 🔥 If coming from manual Finance form (dropdown exists)
    const select = document.getElementById("paidTo");

    if (select && select.value === data.paidTo) {
        paidToName = select.options[select.selectedIndex].text;
        paidToValue = select.value;
    }

    if (!paidToName) {
        alert("Select a person");
        return;
    }

    const transaction = {
        id: generateId(),
        date: data.date,
        paidTo: paidToName,   // 🔥 Always store correct name
        paidToId: paidToValue,
        category: data.category,
        paymentMode: data.paymentMode,
        amount: Math.round(parseFloat(data.amount) * 100) / 100,
        notes: data.notes || "",
        type: data.type,
        createdAt: new Date().toISOString()
    };

    if (transaction.type === "credit") {

        if (transaction.paymentMode === "cash") {
            financeBalance.cashBalance += transaction.amount;
        } else {
            financeBalance.bankBalance += transaction.amount;
        }

    } else {

        if (transaction.paymentMode === "cash") {
            financeBalance.cashBalance -= transaction.amount;
        } else {
            financeBalance.bankBalance -= transaction.amount;
        }

    }

    transactions.push(transaction);
    saveData();

    return transaction;
}

    function setOpeningBalance(bank, cash) {
        financeBalance.bankBalance = parseFloat(bank) || 0;
        financeBalance.cashBalance = parseFloat(cash) || 0;
        saveData();
    }

    function getTransactions() {
        return transactions;
    }

    function getBalance() {
        return financeBalance;
    }

    function deleteTransaction(id) {

        const index = transactions.findIndex(t => t.id === id);

        if (index !== -1) {
            const transaction = transactions[index];

            if (transaction.paymentMode === "cash") {
                financeBalance.cashBalance += transaction.amount;
            } else {
                financeBalance.bankBalance += transaction.amount;
            }

            transactions.splice(index, 1);
            saveData();
        }
    }

    return {
        addTransaction,
        getTransactions,
        getBalance,
        setOpeningBalance,
        deleteTransaction
    };

})();
function loadFinancePeopleDropdown() {

    const db = JSON.parse(localStorage.getItem("erpDB")) || {};
    const employees = db.employees || [];
    const customers = db.customers || [];

    const select = document.getElementById("paidTo");
    if (!select) return;

    select.innerHTML = '<option value="">Select Person</option>';

    employees.forEach(emp => {
        select.innerHTML += `
            <option value="emp-${emp.id}">
                ${emp.firstName} ${emp.lastName} (Employee)
            </option>
        `;
    });

    customers.forEach(cust => {
        select.innerHTML += `
            <option value="cust-${cust.id}">
                ${cust.name} (Customer)
            </option>
        `;
    });
}

document.addEventListener("DOMContentLoaded", function () {
    loadFinancePeopleDropdown();
});