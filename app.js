function showSection(id) {
  document.querySelectorAll(".sub-section").forEach(sec => {
    sec.classList.remove("active");
  });

  let section = document.getElementById(id);
  if (section) section.classList.add("active");

  if (id === "allEmployees") loadEmployees();
  if (id === "employeeStatus") loadStatusTable();
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

window.onload = function() {
  loadEmployees();
  loadStatusTable();
  updateDashboard();
};