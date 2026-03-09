window.db = JSON.parse(localStorage.getItem("erpDB")) || {
   employees: [],
   invoices: [],
   leaves: [],
   finance: []
};

function saveDB() {
  localStorage.setItem("erpDB", JSON.stringify(window.db));
}
// Initialize invoices if not exists
if (!localStorage.getItem("invoices")) {
    localStorage.setItem("invoices", JSON.stringify([]));
}