function loadLeaveTable() {

  let table = document.getElementById("leaveTable");

  table.innerHTML = `
    <tr>
      <th>Name</th>
      <th>Status</th>
    </tr>
  `;

  db.employees.forEach(emp => {
    table.innerHTML += `
      <tr>
        <td>${emp.name}</td>
        <td>${emp.status}</td>
      </tr>
    `;
  });
}