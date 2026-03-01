// ===============================
// SECTION ROUTING
// ===============================

function showSection(id) {

    // Hide all sections
    document.querySelectorAll(".sub-section").forEach(sec => {
        sec.classList.remove("active");
    });

    const targetSection = document.getElementById(id);

    if (!targetSection) {
        console.warn("Section not found:", id);
        return;
    }

    targetSection.classList.add("active");

    // Refresh dashboard
    if (id === "dashboard") {
        setTimeout(() => {
            if (typeof updateDashboardAnalytics === "function") {
                updateDashboardAnalytics();
            }
        }, 50);
    }

    // Refresh invoice history safely
    if (id === "allInvoices") {
        if (typeof loadInvoiceHistory === "function") {
            loadInvoiceHistory();
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

// ===============================
// INIT
// ===============================

window.addEventListener("load", function () {
    if (typeof loadEmployees === "function") loadEmployees();
    if (typeof loadStatusTable === "function") loadStatusTable();
    updateDashboard();
});