// ===============================
// SECTION ROUTING
// ===============================
if(localStorage.getItem("erpUser") !== "loggedIn"){

    window.location.href = "login.html";

}

function showSection(id) {
    document.querySelectorAll(".sub-section").forEach(sec => {
        sec.classList.remove("active");
    });

    const section = document.getElementById(id);
    if (section) {
        section.classList.add("active");
    }

    if (id === "dashboard") {
        if (typeof updateDashboard === "function") updateDashboard();
    }
    else if (id === "allEmployees") {
        if (typeof loadEmployees === "function") loadEmployees();
    }
    else if (id === "employeeStatus") {
        if (typeof loadStatusTable === "function") loadStatusTable();
    }
    else if (id === "financeSection") {
        if (typeof loadFinancePeopleDropdown === "function") loadFinancePeopleDropdown();
        if (typeof refreshFinanceUI === "function") refreshFinanceUI();
    }
    else if (id === "salarySection") {
        if (typeof loadSalaryEmployees === "function") loadSalaryEmployees();
        
        const empSelect = document.getElementById("salaryEmployeeSelect");
        if (empSelect) empSelect.value = ""; 
        
        const summaryCard = document.getElementById("salarySummaryCard");
        if (summaryCard) summaryCard.style.display = "none";
        
        const ledgerContainer = document.getElementById("salaryLedgerContainer");
        if (ledgerContainer) ledgerContainer.style.display = "none";
    }
    else if (id === "allInvoices") {
        if (typeof loadInvoiceHistory === "function") loadInvoiceHistory();
        if (typeof filterInvoices === "function") filterInvoices(); 
    }
    else if (id === "customerSection") {
        if (typeof loadCustomers === "function") loadCustomers(); 
        if (typeof renderCustomerTable === "function") renderCustomerTable();
    }
    else if (id === "leaveSection") {
        if (typeof loadLeaveTable === "function") loadLeaveTable();
    }
}

// ===============================
// DASHBOARD
// ===============================

function updateDashboard() {
    window.db = JSON.parse(localStorage.getItem("erpDB")) || { employees: [] };
    if (!window.db.employees) return;

    if(document.getElementById("dashEmp")) document.getElementById("dashEmp").innerText = db.employees.length;
    if(document.getElementById("dashWorking")) document.getElementById("dashWorking").innerText = db.employees.filter(e => e.status === "Working").length;
    if(document.getElementById("dashLeave")) document.getElementById("dashLeave").innerText = db.employees.filter(e => e.status === "On Leave").length;
    if(document.getElementById("dashLeft")) document.getElementById("dashLeft").innerText = db.employees.filter(e => e.status === "Left Company").length;
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

// ===============================
// FINANCE UI
// ===============================

function refreshFinanceUI() {
    if (typeof FinanceCore === "undefined") return;

    const transactions = FinanceCore.getTransactions();
    const balance = FinanceCore.getBalance();
    const tbody = document.getElementById("financeTableBody");
    if (!tbody) return;

    tbody.innerHTML = "";
    let monthlyExpense = 0;
    let monthlyIncome = 0;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    const currentTotal = Number(balance.bankBalance) + Number(balance.cashBalance);

    let totalCredits = 0;
    let totalDebits = 0;

    sorted.forEach(txn => {
        const amount = Number(txn.amount);
        if (txn.type === "credit") totalCredits += amount;
        else totalDebits += amount;
    });

    let runningBalance = currentTotal - totalCredits + totalDebits;
    runningBalance = Math.round(runningBalance * 100) / 100;

    sorted.forEach(txn => {
        const amount = Number(txn.amount);
        const txnDate = new Date(txn.date);

        // Track Current Month's Income & Expense
        if (txnDate.getMonth() === currentMonth && txnDate.getFullYear() === currentYear) {
            if (txn.type === "credit") monthlyIncome += amount;
            else monthlyExpense += amount;
        }

        if (txn.type === "credit") runningBalance += amount;
        else runningBalance -= amount;

        runningBalance = Math.round(runningBalance * 100) / 100;
        const amountClass = txn.type === "credit" ? "income" : "expense";

        const row = `
            <tr>
                <td>${txn.date}</td>
                <td>${txn.category === "Salary Advance" ? "Salary Advance" : (txn.type === "credit" ? "Income" : "Expense")}</td>
                <td>${txn.paidTo}</td>
                <td>${txn.category}</td>
                <td style="text-transform: capitalize;">${txn.paymentMode}</td>
                <td class="${amountClass}">₹${amount.toFixed(2)}</td>
                <td>₹${runningBalance.toFixed(2)}</td>
                <td>${txn.notes ? `<span class="note-icon" onclick="openNoteModal(\`${txn.notes.replace(/`/g, "\\`")}\`)">📝 View</span>` : "-"}</td>
                <td><button onclick="deleteFinanceTxn('${txn.id}')">Delete</button></td>
            </tr>
        `;
        tbody.innerHTML += row;
    });

    const bank = Number(balance.bankBalance);
    const cash = Number(balance.cashBalance);
    const total = Math.round((bank + cash) * 100) / 100;
    
    // 🔥 NEW: Calculate Monthly Profit
    const monthlyProfit = monthlyIncome - monthlyExpense;

    // Update the Dashboard Cards
    if(document.getElementById("bankBalance")) document.getElementById("bankBalance").innerText = "₹" + bank.toFixed(2);
    if(document.getElementById("cashBalance")) document.getElementById("cashBalance").innerText = "₹" + cash.toFixed(2);
    if(document.getElementById("totalBalance")) document.getElementById("totalBalance").innerText = "₹" + total.toFixed(2);
    if(document.getElementById("monthlyExpense")) document.getElementById("monthlyExpense").innerText = "₹" + monthlyExpense.toFixed(2);
    
    // 🔥 NEW: Update Profit Card and change color dynamically
    const profitEl = document.getElementById("monthlyProfit");
    if(profitEl) {
        profitEl.innerText = "₹" + monthlyProfit.toFixed(2);
        // Turns Green for Profit, Red for Loss
        profitEl.style.color = monthlyProfit >= 0 ? "#2e7d32" : "#d32f2f"; 
    }
}

function addFinanceTransaction() {
    const data = {
        type: document.getElementById("transactionType").value,
        date: document.getElementById("txnDate").value,
        paidTo: document.getElementById("paidTo").value,
        category: document.getElementById("category").value,
        paymentMode: document.getElementById("paymentMode").value,
        amount: document.getElementById("amount").value,
        notes: document.getElementById("notes").value
    };

    if (!data.paidTo) { alert("Select a person"); return; }
    if (!data.amount || data.amount <= 0) { alert("Enter valid amount"); return; }

    FinanceCore.addTransaction(data);
    refreshFinanceUI();

    document.getElementById("amount").value = "";
    document.getElementById("notes").value = "";
    showNotification("💰 Transaction added successfully","success");
}

function setFinanceOpeningBalance() {
    const bank = document.getElementById("openingBank").value;
    const cash = document.getElementById("openingCash").value;
    if (bank === "" && cash === "") { alert("Enter at least one balance"); return; }
    FinanceCore.setOpeningBalance(bank || 0, cash || 0);
    document.getElementById("openingBank").value = "";
    document.getElementById("openingCash").value = "";
    refreshFinanceUI();
}

function deleteFinanceTxn(id) {
    if (!confirm("Are you sure you want to delete this transaction?")) return;
    FinanceCore.deleteTransaction(id);
    refreshFinanceUI();
}

function resetFinanceBalance() {
    if (!confirm("This will reset Bank & Cash balance to 0. Continue?")) return;
    FinanceCore.setOpeningBalance(0, 0);
    refreshFinanceUI();
}

function resetMonthlyExpense() {
    if (!confirm("This will delete ALL expenses of the current month. Continue?")) return;
    let transactions = FinanceCore.getTransactions();
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const filtered = transactions.filter(txn => {
        const txnDate = new Date(txn.date);
        if (txnDate.getMonth() === currentMonth && txnDate.getFullYear() === currentYear && txn.type === "debit") return false;
        return true;
    });

    localStorage.setItem("transactions", JSON.stringify(filtered));
    location.reload();
}

function openNoteModal(note) {
    document.getElementById("noteModalText").innerText = note;
    document.getElementById("noteModal").classList.add("active");
}

function closeNoteModal() {
    document.getElementById("noteModal").classList.remove("active");
}

function loadSalaryMonths() {
    const select = document.getElementById("salaryMonthSelect");
    if (!select) return;
    select.innerHTML = "";
    const now = new Date();
    for (let i = -2; i <= 3; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        const value = year + "-" + String(date.getMonth() + 1).padStart(2, "0");
        const option = document.createElement("option");
        option.value = value;
        option.textContent = month + " " + year;
        if (i === 0) option.selected = true;
        select.appendChild(option);
    }
}

function loadSalaryEmployees() {
    const select = document.getElementById("salaryEmployeeSelect");
    if (!select) return;

    const db = JSON.parse(localStorage.getItem("erpDB")) || {};
    const employees = db.employees || [];
    select.innerHTML = '<option value="">Select Employee</option>';

    employees.filter(e => e.status === "Active" || e.status === "Working").forEach(emp => {
        const option = document.createElement("option");
        option.value = emp.id;
        option.textContent = emp.firstName + " " + emp.lastName;
        select.appendChild(option);
    });
}

function getSalaryDB() {
    const db = JSON.parse(localStorage.getItem("erpDB")) || {};
    if (!db.salaryRecords) {
        db.salaryRecords = [];
        localStorage.setItem("erpDB", JSON.stringify(db));
    }
    return db;
}

// ===============================
// SALARY ENGINE CORE
// ===============================

function loadSalarySummary() {
    const employeeId = document.getElementById("salaryEmployeeSelect").value;
    const month = document.getElementById("salaryMonthSelect").value;

    if (!employeeId || !month) {
        if(document.getElementById("salarySummaryCard")) document.getElementById("salarySummaryCard").style.display = "none";
        if(document.getElementById("salaryLedgerContainer")) document.getElementById("salaryLedgerContainer").style.display = "none";
        return;
    }

    const db = getSalaryDB();
    let record = db.salaryRecords.find(r => r.employeeId == employeeId && r.month === month);

    if (!record) {
        record = { employeeId: Number(employeeId), month: month, duties: [], advances: [] };
        db.salaryRecords.push(record);
        localStorage.setItem("erpDB", JSON.stringify(db));
    }

    let activeSalary = 0;
    let activePaid = 0;

    record.duties.filter(d => !d.cleared).forEach(d => activeSalary += Number(d.quantity) * Number(d.rate));
    record.advances.filter(a => !a.cleared).forEach(a => activePaid += Number(a.amount));

    let remaining = activeSalary - activePaid;

    if(document.getElementById("salarySummaryCard")) document.getElementById("salarySummaryCard").style.display = "block";
    if(document.getElementById("salaryTotal")) document.getElementById("salaryTotal").innerText = "₹" + activeSalary.toFixed(2);
    if(document.getElementById("salaryPaid")) document.getElementById("salaryPaid").innerText = "₹" + activePaid.toFixed(2);
    if(document.getElementById("salaryRemaining")) document.getElementById("salaryRemaining").innerText = "₹" + remaining.toFixed(2);

    const payInFullWrapper = document.getElementById("payInFullWrapper");
    if (payInFullWrapper) {
        if (remaining > 0) {
            payInFullWrapper.style.display = "flex"; // Show it if money is owed
        } else {
            payInFullWrapper.style.display = "none"; // Hide it if fully paid or no duties
        }
    }

    let statusText = "";
    let statusColor = "";
    
    if (activeSalary === 0) {
        statusText = "No Active Duties";
        statusColor = "grey";
    } else if (remaining <= 0) {
        statusText = "Paid in Full";
        statusColor = "green";
    } else {
        statusText = "Pending Payment";
        statusColor = "red";
    }

    const statusEl = document.getElementById("salaryStatus");
    if(statusEl) {
        statusEl.innerText = statusText;
        statusEl.style.color = statusColor;
    }

    let emp = db.employees.find(e => e.id == employeeId);
    const empStatusDisplay = document.getElementById("salaryEmpStatusDisplay");
    
    if (emp && empStatusDisplay) {
        empStatusDisplay.innerText = emp.status;
        if(emp.status === "Pending") empStatusDisplay.style.color = "#e65100"; 
        else if(emp.status === "Working") empStatusDisplay.style.color = "green";
        else empStatusDisplay.style.color = "black";
    }

    loadSalaryLedger();
}

function loadSalaryLedger() {
    const employeeId = document.getElementById("salaryEmployeeSelect").value;
    const month = document.getElementById("salaryMonthSelect").value;
    if (!employeeId || !month) return;

    const db = getSalaryDB();
    const record = db.salaryRecords.find(r => r.employeeId == employeeId && r.month === month);
    if (!record) return;

    const ledgerBody = document.getElementById("salaryLedgerBody");
    const container = document.getElementById("salaryLedgerContainer");
    ledgerBody.innerHTML = "";
    let entries = [];

    record.duties.forEach(d => {
        let detailsText = "";
        if (d.type === "day") detailsText = d.quantity + " Days @ ₹" + d.rate;
        else if (d.type === "shift") detailsText = d.quantity + " Shifts @ ₹" + d.rate;
        else detailsText = "Fixed Monthly Salary"; 

        entries.push({
            date: d.date || (month + "-01"), 
            timestamp: d.timestamp || 0,
            type: "Duty Added",
            details: detailsText,
            mode: "-",
            amount: Number(d.quantity) * Number(d.rate)
        });
    });

    record.advances.forEach(a => {
        entries.push({
            date: a.date,
            timestamp: a.timestamp || 0, 
            type: a.isFullPayment ? "Clearance Payment" : "Salary Advance",
            details: "-",
            mode: a.paymentMode,
            amount: -Number(a.amount)
        });
    });

    entries.sort((a, b) => {
        const timeA = a.timestamp || new Date(a.date).getTime();
        const timeB = b.timestamp || new Date(b.date).getTime();
        return timeA - timeB;
    });

    let running = 0;
    entries.forEach(e => {
        running += e.amount;
        e.runningBalance = running;
    });

    entries.forEach(e => {
        const rowStyle = e.type === "Clearance Payment" ? "background-color: #e8f5e9; font-weight:bold; color: #2e7d32;" : "";
        const row = `
            <tr style="${rowStyle}">
                <td>${e.date}</td>
                <td>${e.type}</td>
                <td>${e.details}</td>
                <td style="text-transform: capitalize;">${e.mode}</td>
                <td style="color:${e.amount >= 0 ? "green" : "red"}">
                    ₹${Math.abs(e.amount).toFixed(2)}
                </td>
                <td>₹${e.runningBalance.toFixed(2)}</td>
            </tr>
        `;
        ledgerBody.innerHTML += row;
    });

    container.style.display = "block";
}

// ===============================
// MANUAL PAYMENT & CYCLE CLEARANCE
// ===============================

function confirmManualPayment() {
    const employeeId = document.getElementById("salaryEmployeeSelect").value;
    const month = document.getElementById("salaryMonthSelect").value;
    if (!employeeId || !month) return;

    const paymentModeSelect = document.getElementById("fullPaymentMode");
    const paymentMode = paymentModeSelect ? paymentModeSelect.value : "";
    
    if (!paymentMode) {
        alert("Please select a Payment Mode (Cash, UPI, etc.) before confirming.");
        return;
    }

    const db = getSalaryDB();
    const record = db.salaryRecords.find(r => r.employeeId == employeeId && r.month === month);

    if (record) {
        let activeSal = 0; let activeAdv = 0;
        record.duties.filter(d => !d.cleared).forEach(d => activeSal += Number(d.quantity) * Number(d.rate));
        record.advances.filter(a => !a.cleared).forEach(a => activeAdv += Number(a.amount));
        let owed = activeSal - activeAdv;

        if (owed > 0) {
            record.advances.push({
                amount: owed,
                paymentMode: paymentMode, 
                date: new Date().toISOString().slice(0,10),
                timestamp: Date.now(),
                cleared: true,
                isFullPayment: true 
            });

            if (typeof FinanceCore !== "undefined") {
                const emp = db.employees.find(e => e.id == employeeId);
                FinanceCore.addTransaction({
                    type: "debit",
                    date: new Date().toISOString().slice(0,10),
                    paidTo: emp.firstName + " " + emp.lastName + " (Employee)",
                    category: "salary", 
                    paymentMode: paymentMode, 
                    amount: owed,
                    notes: "Full Salary Settlement - " + month
                });
                if (typeof refreshFinanceUI === "function") refreshFinanceUI();
            }
        }

        record.duties.forEach(d => d.cleared = true);
        record.advances.forEach(a => a.cleared = true);

        const endDutyCheckbox = document.getElementById("endDutyCheckbox");
        if (endDutyCheckbox && endDutyCheckbox.checked) {
            const emp = db.employees.find(e => e.id == employeeId);
            if (emp) {
                emp.status = "Active"; 
                emp.workPlace = "";    
                if (typeof loadStatusTable === "function") loadStatusTable();
                if (typeof loadEmployees === "function") loadEmployees();
                if (typeof updateDashboard === "function") updateDashboard();
            }
        }

        localStorage.setItem("erpDB", JSON.stringify(db));
        window.db = db;
    }

    // Call the close function so the popup goes away
    closeManualPaymentModal();
    
    loadSalarySummary();
}

// 🔥 THIS IS THE MISSING FUNCTION THAT FIXES YOUR CANCEL BUTTON ERROR 🔥
function closeManualPaymentModal() {
    const modal = document.getElementById("manualPaymentModal");
    if (modal) modal.classList.remove("active");
    
    const endDutyCheckbox = document.getElementById("endDutyCheckbox");
    if (endDutyCheckbox) endDutyCheckbox.checked = false;
    
    const paymentModeSelect = document.getElementById("fullPaymentMode");
    if (paymentModeSelect) paymentModeSelect.value = ""; 
}

function resetWorkLogs() {
    const employeeId = document.getElementById("salaryEmployeeSelect").value;
    const month = document.getElementById("salaryMonthSelect").value;
    if (!employeeId || !month) return;

    if (!confirm(`⚠️ RESET ACTIVE WORK LOGS? \n\nAre you sure you want to clear the UNPAID Duties for this cycle? (Already paid histories remain safe).`)) return;

    const db = getSalaryDB();
    const record = db.salaryRecords.find(r => r.employeeId == employeeId && r.month === month);

    if (record) {
        record.duties = record.duties.filter(d => d.cleared === true);
        localStorage.setItem("erpDB", JSON.stringify(db));
        window.db = db; 
        alert("Active work logs reset!");
        loadSalarySummary();
    }
}

function resetFullSalaryLedger() {
    const employeeId = document.getElementById("salaryEmployeeSelect").value;
    const month = document.getElementById("salaryMonthSelect").value;
    if (!employeeId || !month) return;

    if (!confirm(`🛑 DANGER: RESET FULL LEDGER? \n\nThis will delete EVERYTHING for this employee for this month:\n\n❌ All Work Logs (Days/Shifts)\n❌ All Salary Advances (Money Paid)\n\nAre you sure you want to completely wipe this month's records?`)) return;

    const db = getSalaryDB();
    const record = db.salaryRecords.find(r => r.employeeId == employeeId && r.month === month);

    if (record) {
        record.duties = [];   
        record.advances = []; 
        localStorage.setItem("erpDB", JSON.stringify(db));
        window.db = db; 
        alert("Full ledger for this month has been wiped.");
        loadSalarySummary();
    }
}

function openAddDutyModal() {
    const employeeId = document.getElementById("salaryEmployeeSelect").value;
    const month = document.getElementById("salaryMonthSelect").value;
    if (!employeeId || !month) { alert("Select employee and month first"); return; }
    document.getElementById("dutyModal").classList.add("active");
    document.getElementById("dayCount").value = "";
    document.getElementById("shiftCount").value = "";
    document.getElementById("dutyRate").value = "";
    toggleDutyFields();
}

function closeDutyModal() {
    document.getElementById("dutyModal").classList.remove("active");
}

function toggleDutyFields() {
    const type = document.getElementById("dutyTypeSelect").value;
    document.getElementById("dayField").style.display = type === "day" ? "block" : "none";
    document.getElementById("shiftField").style.display = type === "shift" ? "block" : "none";
}

function saveDuty() {
    const employeeId = document.getElementById("salaryEmployeeSelect").value;
    const month = document.getElementById("salaryMonthSelect").value;
    const type = document.getElementById("dutyTypeSelect").value;
    const rate = document.getElementById("dutyRate").value;

    let quantity = 1; 
    if (type === "day") quantity = document.getElementById("dayCount").value;
    else if (type === "shift") quantity = document.getElementById("shiftCount").value;

    if (!rate || rate <= 0 || (type !== "month" && (!quantity || quantity <= 0))) {
        alert("Enter valid details");
        return;
    }

    const db = getSalaryDB();
    let record = db.salaryRecords.find(r => r.employeeId == employeeId && r.month === month);

    if (!record) {
        record = { employeeId: Number(employeeId), month: month, duties: [], advances: [] };
        db.salaryRecords.push(record);
    }

    record.duties.push({
        type: type,
        quantity: Number(quantity),
        rate: Number(rate),
        date: new Date().toISOString().slice(0,10),
        timestamp: Date.now(), 
        cleared: false 
    });

    let empToUpdate = db.employees.find(e => e.id == employeeId);
    if (empToUpdate && empToUpdate.status !== "Working") {
        empToUpdate.status = "Pending";
    }

    localStorage.setItem("erpDB", JSON.stringify(db));
    window.db = db;

    closeDutyModal();
    loadSalarySummary();
    
    if (typeof loadStatusTable === "function") loadStatusTable(); 
    if (typeof updateDashboard === "function") updateDashboard(); 
}

function openAdvanceModal() {
    const employeeId = document.getElementById("salaryEmployeeSelect").value;
    const month = document.getElementById("salaryMonthSelect").value;
    if (!employeeId || !month) { alert("Select employee and month first"); return; }
    document.getElementById("advanceAmount").value = "";
    document.getElementById("advanceModal").classList.add("active");
}

function closeAdvanceModal() {
    document.getElementById("advanceModal").classList.remove("active");
}

function saveAdvance() {
    const employeeId = document.getElementById("salaryEmployeeSelect").value;
    const month = document.getElementById("salaryMonthSelect").value;
    const amount = Number(document.getElementById("advanceAmount").value);
    const paymentMode = document.getElementById("advancePaymentMode").value;

    if (!amount || amount <= 0) { alert("Enter valid amount"); return; }

    const db = getSalaryDB();
    const record = db.salaryRecords.find(r => r.employeeId == employeeId && r.month === month);
    if (!record) return;

    record.advances.push({
        amount: amount,
        paymentMode: paymentMode,
        date: new Date().toISOString().slice(0,10),
        timestamp: Date.now(),
        cleared: false 
    });

    localStorage.setItem("erpDB", JSON.stringify(db));

    if (typeof FinanceCore !== "undefined") {
        const employee = db.employees.find(e => e.id == employeeId);
        FinanceCore.addTransaction({
            type: "debit",
            date: new Date().toISOString().slice(0,10),
            paidTo: employee.firstName + " " + employee.lastName + " (Employee)",
            category: "Salary Advance",
            paymentMode: paymentMode,
            amount: amount,
            notes: "Salary Advance - " + month
        });
        if (typeof refreshFinanceUI === "function") refreshFinanceUI();
    }

    closeAdvanceModal();
    loadSalarySummary();
}
function resetMonthlyProfit() {

    if (!confirm("This will delete ALL transactions of the current month. Continue?")) return;

    let transactions = FinanceCore.getTransactions();

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const filtered = transactions.filter(txn => {
        const txnDate = new Date(txn.date);

        if (txnDate.getMonth() === currentMonth && txnDate.getFullYear() === currentYear) {
            return false; // remove this month's transaction
        }

        return true;
    });

    localStorage.setItem("transactions", JSON.stringify(filtered));

    location.reload();
}
// ===============================
// SETTINGS MODULE
// ===============================

function saveSettings() {

    const settings = {

        companyName: document.getElementById("companyName").value,
        companyAddress: document.getElementById("companyAddress").value,
        companyPhone: document.getElementById("companyPhone").value,
        companyEmail: document.getElementById("companyEmail").value,
        companyGST: document.getElementById("companyGST").value

    };

    localStorage.setItem("erpSettings", JSON.stringify(settings));

    alert("Settings saved successfully");
}

function loadSettings() {

    const settings = JSON.parse(localStorage.getItem("erpSettings")) || {};

    document.getElementById("companyName").value = settings.companyName || "";
    document.getElementById("companyAddress").value = settings.companyAddress || "";
    document.getElementById("companyPhone").value = settings.companyPhone || "";
    document.getElementById("companyEmail").value = settings.companyEmail || "";
    document.getElementById("companyGST").value = settings.companyGST || "";

}

window.addEventListener("load", function () {
    window.db = JSON.parse(localStorage.getItem("erpDB")) || { employees: [] };
    if (typeof loadEmployees === "function") loadEmployees();
    if (typeof loadStatusTable === "function") loadStatusTable();
    document.getElementById("salaryEmployeeSelect")?.addEventListener("change", loadSalarySummary);
    document.getElementById("salaryMonthSelect")?.addEventListener("change", loadSalarySummary);
    updateDashboard();
    if (typeof refreshFinanceUI === "function") refreshFinanceUI();
    loadSalaryEmployees();
    loadSalaryMonths();
    
});