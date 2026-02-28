function showSection(id) {

    // 1. Hide all currently open sections
    document.querySelectorAll(".sub-section").forEach(sec => {
        sec.classList.remove("active");
    });

    // 2. Try to find the section we want to open
    const targetSection = document.getElementById(id);

    // 3. SAFEGUARD: If the section doesn't exist yet, stop here!
    if (!targetSection) {
        console.warn("The page for '" + id + "' has not been built yet.");
        return; 
    }

    // 4. If it does exist, make it visible
    targetSection.classList.add("active");

    // Always refresh dashboard when opened
    if (id === "dashboard") {
        setTimeout(() => {
            if (typeof updateDashboardAnalytics === "function") updateDashboardAnalytics();
        }, 50);
    }

    // Reset invoice fields when opening the invoice tab
    if (id === "allInvoices") { // <--- Changed this from "invoiceHistory"
        loadInvoiceHistory();
    }
  }

// ===============================
// SIDEBAR MENU TOGGLES (ACCORDION)
// ===============================


function updateDashboard() {
  document.getElementById("dashEmp").innerText = db.employees.length;
  document.getElementById("dashWorking").innerText =
    db.employees.filter(e => e.status === "Working").length;
  document.getElementById("dashLeave").innerText =
    db.employees.filter(e => e.status === "On Leave").length;
  document.getElementById("dashLeft").innerText =
    db.employees.filter(e => e.status === "Left Company").length;
}
// ===============================
// SMART SIDEBAR ACCORDION
// ===============================

function toggleEmployeeMenu() {
    const empMenu = document.getElementById("employeeMenu");
    const invMenu = document.getElementById("invoiceMenu");
    
    // If Employee menu is currently closed, close Invoice and open Employee
    if (empMenu.style.display === "none" || empMenu.style.display === "") {
        if (invMenu) invMenu.style.display = "none"; // Close Invoice
        empMenu.style.display = "block"; // Open Employee
    } else {
        // If it's already open, just close it
        empMenu.style.display = "none";
    }
}

function toggleInvoiceMenu() {
    const empMenu = document.getElementById("employeeMenu");
    const invMenu = document.getElementById("invoiceMenu");
    
    // If Invoice menu is currently closed, close Employee and open Invoice
    if (invMenu.style.display === "none" || invMenu.style.display === "") {
        if (empMenu) empMenu.style.display = "none"; // Close Employee
        invMenu.style.display = "block"; // Open Invoice
    } else {
        // If it's already open, just close it
        invMenu.style.display = "none";
    }
}

window.onload = function() {
  loadEmployees();
  loadStatusTable();
  updateDashboard();
};