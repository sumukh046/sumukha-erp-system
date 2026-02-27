function loadFinance() {
  document.getElementById("financeRevenue").innerText = db.finance.revenue;
  document.getElementById("financeExpense").innerText = db.finance.expense;
}
<h3>Total Revenue (Paid Invoices): 
    <span id="totalRevenue">₹0</span>
</h3>