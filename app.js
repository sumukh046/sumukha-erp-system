function showSection(id) {

    document.querySelectorAll(".sub-section").forEach(sec => {
        sec.classList.remove("active");
    });

    document.getElementById(id).classList.add("active");

    // Always refresh dashboard when opened
    if (id === "dashboard") {
        setTimeout(() => {
            updateDashboardAnalytics();
        }, 50);
    }

    // Reset invoice fields (you renamed section)
    if (id === "createInvoice") {
        resetInvoiceCustomerFields();
    }

    // 🔥 Reload invoice history when opened
    if (id === "invoiceHistory") {
        loadInvoiceHistory();
    }
}

function toggleEmployeeMenu() {
  let menu = document.getElementById("employeeMenu");
  menu.style.display = menu.style.display === "none" ? "block" : "none";
}

function updateDashboard() {
  document.getElementById("dashEmp").innerText = db.employees.length;
  document.getElementById("dashWorking").innerText =
    db.employees.filter(e => e.status === "Working").length;
  document.getElementById("dashLeave").innerText =
    db.employees.filter(e => e.status === "On Leave").length;
  document.getElementById("dashLeft").innerText =
    db.employees.filter(e => e.status === "Left Company").length;
}
function toggleInvoiceMenu() {
    const menu = document.getElementById("invoiceMenu");
    menu.style.display =
        menu.style.display === "none" ? "block" : "none";
}

window.onload = function() {
  loadEmployees();
  loadStatusTable();
  updateDashboard();
};