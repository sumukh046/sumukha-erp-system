<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sumukha ERP System</title>
  <link rel="stylesheet" href="style.css">
    <style>
    /* Font rendering — crisp text, no blur */
    html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; text-rendering: optimizeLegibility; }
    /* NO transform:translateZ(0) — it causes black border glitches on tables/cards */
    .switch { position: relative; display: inline-block; }
    hr { border: none; border-top: 1px solid var(--border, #e2e8f0); margin: 18px 0; }
  </style>
</head>
<body>

<div class="layout">

  <!-- Mobile sidebar overlay -->
  <div class="sidebar-overlay" id="sidebarOverlay" onclick="toggleMobileSidebar()"></div>

  <!-- ===== SIDEBAR ===== -->
  <aside class="sidebar" id="mainSidebar">
    <div class="sidebar-brand">
      <div class="sidebar-brand-icon"><img src="logo.png" alt="Sumukha" style="width:44px;height:44px;object-fit:contain;border-radius:8px;" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><span style="display:none;font-size:22px;">🏥</span></div>
      <div>
        <div class="sidebar-brand-name">Sumukha ERP</div>
        <div class="sidebar-brand-sub">Nursing Services</div>
      </div>
      <button class="sidebar-close-btn" onclick="toggleMobileSidebar()" aria-label="Close">✕</button>
    </div>

    <nav class="sidebar-nav">
      <button class="nav-item" onclick="showSection('dashboard')">
        <span class="nav-icon">🏠</span><span class="nav-label">Dashboard</span>
      </button>

      <button class="nav-item nav-parent" onclick="toggleEmployeeMenu()">
        <span class="nav-icon">👥</span><span class="nav-label">Employees</span><span class="nav-arrow">▾</span>
      </button>
      <div id="employeeMenu" class="nav-submenu" style="display:none;">
        <button class="nav-item nav-child" onclick="showSection('addEmployee')">
          <span class="nav-icon">➕</span><span class="nav-label">Add Employee</span>
        </button>
        <button class="nav-item nav-child" onclick="showSection('allEmployees')">
          <span class="nav-icon">📋</span><span class="nav-label">All Employees</span>
        </button>
        <button class="nav-item nav-child" onclick="showSection('employeeStatus')">
          <span class="nav-icon">🔄</span><span class="nav-label">Employee Status</span>
        </button>
        <button class="nav-item nav-child" onclick="showSection('documentsSection')">
          <span class="nav-icon">📁</span><span class="nav-label">Documents</span>
        </button>
      </div>

      <button class="nav-item" onclick="showSection('salarySection')">
        <span class="nav-icon">💵</span><span class="nav-label">Salary</span>
      </button>

      <button class="nav-item" onclick="showSection('financeSection')">
        <span class="nav-icon">💰</span><span class="nav-label">Finance</span>
      </button>

      <button class="nav-item nav-parent" onclick="toggleInvoiceMenu()">
        <span class="nav-icon">🧾</span><span class="nav-label">Invoice</span><span class="nav-arrow">▾</span>
      </button>
      <div id="invoiceMenu" class="nav-submenu" style="display:none;">
        <button class="nav-item nav-child" onclick="openCreateInvoice('gst')">
          <span class="nav-icon">✏️</span><span class="nav-label">Create GST Invoice</span>
        </button>
        <button class="nav-item nav-child" onclick="openCreateInvoice('nongst')">
          <span class="nav-icon">📝</span><span class="nav-label">Create Non-GST</span>
        </button>
        <button class="nav-item nav-child" onclick="showSection('allInvoices')">
          <span class="nav-icon">📄</span><span class="nav-label">All Invoices</span>
        </button>
        <button class="nav-item nav-child" onclick="showSection('customerSection')">
          <span class="nav-icon">🏢</span><span class="nav-label">Customers</span>
        </button>
      </div>

      <button class="nav-item" onclick="showSection('leaveSection')">
        <span class="nav-icon">🗓️</span><span class="nav-label">Leave Management</span>
      </button>

      <button class="nav-item" onclick="showSection('attendanceSection')">
        <span class="nav-icon">📅</span><span class="nav-label">Attendance</span>
      </button>

      <button class="nav-item" onclick="showSection('settingsSection')">
        <span class="nav-icon">⚙️</span><span class="nav-label">Settings</span>
      </button>
    </nav>

    <!-- Dark mode toggle in sidebar footer -->
    <div class="sidebar-footer">
      <label class="sidebar-dark-toggle">
        <span class="nav-icon">🌙</span>
        <span class="sidebar-toggle-label">Dark Mode</span>
        <div class="sidebar-toggle-track">
          <input type="checkbox" id="darkModeToggle" onchange="toggleDarkMode()">
          <span class="sidebar-toggle-thumb"></span>
        </div>
      </label>
    </div>
  </aside>

  <!-- ===== MAIN WRAPPER ===== -->
  <div class="main-wrapper">

    <!-- Top bar -->
    <header class="topbar">
      <button class="topbar-hamburger" onclick="toggleMobileSidebar()" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
      <div class="topbar-title" id="topbarTitle">🏠 Dashboard</div>
      <div class="topbar-right">
        <div class="topbar-avatar">A</div>
      </div>
    </header>

    <main class="content">
    <div class="darkmode-top-right" style="display:none;"></div>
    <section id="dashboard" class="sub-section active">
        
      

<h2>Dashboard</h2>



      <h3>Employee Overview</h3>
      <div class="dashboard-grid">
          <div class="card">
              <h3>Total Employees</h3>
              <p id="dashEmp">0</p>
          </div>
          <div class="card">
              <h3>Working</h3>
              <p id="dashWorking">0</p>
          </div>
          <div class="card">
              <h3>On Leave</h3>
              <p id="dashLeave">0</p>
          </div>
          <div class="card">
              <h3>Left Company</h3>
              <p id="dashLeft">0</p>
          </div>
      </div>

      <div id="invoiceOverviewBlock">
      <h3 style="margin-top:40px;">Invoice Overview</h3>
      <div class="dashboard-grid">
          <div class="card revenue-card">
              <h3>Total Revenue</h3>
              <p id="totalRevenue">₹ 0.00</p>
          </div>
          <div class="card pending-card">
              <h3>Pending Amount</h3>
              <p id="pendingAmount">₹ 0.00</p>
          </div>
          <div class="card draft-card">
              <h3>Draft Invoices</h3>
              <p id="draftCount">0</p>
          </div>
          <div class="card total-card">
              <h3>Total Invoices</h3>
              <p id="totalInvoices">0</p>
          </div>
      </div>
      </div>

      <div id="customerOverviewBlock">
      <h3 style="margin-top:40px;">Customer Overview</h3>
      <div class="dashboard-grid">
          <div class="card">
              <h3>Top Billing Customer</h3>
              <p id="topCustomer">-</p>
          </div>
          <div class="card">
              <h3>Top Customer Revenue</h3>
              <p id="topCustomerRevenue">₹ 0.00</p>
          </div>
      </div>
      <div class="dashboard-grid">
          <div class="card">
              <h3>Total Customers</h3>
              <p id="totalCustomers">0</p>
          </div>
          <div class="card">
              <h3>With GST</h3>
              <p id="customersWithGST">0</p>
          </div>
          <div class="card">
              <h3>Without GST</h3>
              <p id="customersWithoutGST">0</p>
          </div>
      </div>
      </div>

      <div id="revenueChartBlock" style="margin-top:40px;">
          <canvas id="revenueChart"></canvas>
      </div>
      
      
    </section>

    <section id="customerSection" class="sub-section">
      <h2>🏢 Customer Management</h2>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:20px;align-items:start;">

        <!-- Add Customer Form -->
        <div style="background:#fff;border-radius:16px;padding:24px;box-shadow:0 2px 16px rgba(0,0,0,0.08);border-top:4px solid #6366f1;">
          <h3 style="margin:0 0 18px;font-size:15px;color:#6366f1;" id="customerFormTitle">➕ Add Customer</h3>
          <label style="font-size:12px;font-weight:600;color:#888;display:block;margin-bottom:4px;">Customer Name *</label>
          <input type="text" id="customerName" placeholder="e.g. Rajesh Kumar" style="width:100%;padding:9px 12px;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:12px;box-sizing:border-box;font-size:14px;">
          <label style="font-size:12px;font-weight:600;color:#888;display:block;margin-bottom:4px;">Address</label>
          <textarea id="customerAddress" placeholder="Street, City, PIN" style="width:100%;padding:9px 12px;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:12px;box-sizing:border-box;font-size:14px;resize:vertical;height:72px;"></textarea>
          <label style="font-size:12px;font-weight:600;color:#888;display:block;margin-bottom:4px;">State</label>
          <select id="customerState" style="width:100%;padding:9px 12px;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:12px;box-sizing:border-box;font-size:14px;"></select>
          <label style="font-size:12px;font-weight:600;color:#888;display:block;margin-bottom:4px;">GST Number <span style="color:#bbb;font-weight:400;">(optional)</span></label>
          <input type="text" id="customerGST" placeholder="29AAUCS..." style="width:100%;padding:9px 12px;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:12px;box-sizing:border-box;font-size:14px;">
          <label style="font-size:12px;font-weight:600;color:#888;display:block;margin-bottom:4px;">Phone</label>
          <input type="text" id="customerPhone" placeholder="9876543210" maxlength="15" style="width:100%;padding:9px 12px;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:20px;box-sizing:border-box;font-size:14px;">
          <div style="display:flex;gap:10px;">
            <button onclick="saveCustomer()" style="flex:1;padding:11px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;border:none;border-radius:10px;font-weight:600;font-size:14px;cursor:pointer;">💾 Save Customer</button>
            <button onclick="clearCustomerForm()" style="padding:11px 16px;background:#f1f5f9;color:#64748b;border:none;border-radius:10px;font-weight:600;cursor:pointer;">✕ Clear</button>
          </div>
        </div>

        <!-- Customer List -->
        <div style="background:#fff;border-radius:16px;padding:24px;box-shadow:0 2px 16px rgba(0,0,0,0.08);border-top:4px solid #22c55e;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
            <h3 style="margin:0;font-size:15px;color:#16a34a;">👥 Saved Customers</h3>
            <span id="customerCount" style="background:#dcfce7;color:#16a34a;font-size:12px;font-weight:700;padding:3px 10px;border-radius:20px;">0</span>
          </div>
          <input type="text" id="customerSearch" placeholder="🔍 Search customers..." oninput="searchCustomers()"
            style="width:100%;padding:9px 12px;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:14px;box-sizing:border-box;font-size:14px;">
          <div style="overflow-x:auto;">
            <table id="customerTable" style="width:100%;border-collapse:collapse;">
              <thead>
                <tr style="background:#f8fafc;">
                  <th style="padding:10px 12px;text-align:left;font-size:12px;color:#888;font-weight:600;border-bottom:1px solid #e2e8f0;">NAME</th>
                  <th style="padding:10px 12px;text-align:left;font-size:12px;color:#888;font-weight:600;border-bottom:1px solid #e2e8f0;">STATE</th>
                  <th style="padding:10px 12px;text-align:left;font-size:12px;color:#888;font-weight:600;border-bottom:1px solid #e2e8f0;">GST</th>
                  <th style="padding:10px 12px;text-align:left;font-size:12px;color:#888;font-weight:600;border-bottom:1px solid #e2e8f0;">PHONE</th>
                  <th style="padding:10px 12px;text-align:center;font-size:12px;color:#888;font-weight:600;border-bottom:1px solid #e2e8f0;">ACTION</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <section id="salarySection" class="sub-section">
      <h2>💵 Salary Management</h2>

      <!-- Employee + Month selectors -->
      <div class="sal-selectors">
        <select id="salaryEmployeeSelect">
          <option value="">Select Employee</option>
        </select>
        <select id="salaryMonthSelect"></select>
      </div>

      <!-- Summary card -->
      <div id="salarySummaryCard" class="sal-summary-card" style="display:none;">

        <div class="sal-section-label">Monthly Summary</div>

        <!-- 4 stat boxes -->
        <div class="sal-stats-grid">
          <div class="sal-stat sal-stat-blue">
            <div class="sal-stat-label">Total Salary</div>
            <div class="sal-stat-value" id="salaryTotal">₹0.00</div>
          </div>
          <div class="sal-stat sal-stat-green">
            <div class="sal-stat-label">Paid So Far</div>
            <div class="sal-stat-value" id="salaryPaid">₹0.00</div>
          </div>
          <div class="sal-stat sal-stat-amber">
            <div class="sal-stat-label">Remaining</div>
            <div class="sal-stat-value" id="salaryRemaining">₹0.00</div>
          </div>
          <div class="sal-stat sal-stat-purple">
            <div class="sal-stat-label">Status</div>
            <div class="sal-stat-value sal-stat-status" id="salaryStatus">Pending</div>
          </div>
        </div>

        <!-- Employee status pill -->
        <div class="sal-emp-status-row" id="salaryEmpStatusDisplayWrapper">
          <span class="sal-emp-label">Employee Status</span>
          <span id="salaryEmpStatusDisplay" class="sal-emp-value">—</span>
        </div>

        <!-- Pay in full banner -->
        <div id="payInFullWrapper" class="sal-pay-banner" style="display:none;">
          <span class="sal-pay-text">✅ Clear Remaining Balance?</span>
          <button class="sal-pay-btn" onclick="document.getElementById('manualPaymentModal').classList.add('active')">Pay in Full</button>
        </div>

        <!-- Action buttons -->
        <div class="sal-actions">
          <button class="sal-btn-action" onclick="openAddDutyModal()">➕ Add Duty</button>
          <button class="sal-btn-action" onclick="openAdvanceModal()">💸 Give Advance</button>
          <button class="sal-btn-action" onclick="openStaffSalaryModal()" style="background:linear-gradient(135deg,#6366f1,#8b5cf6);">💼 Staff Salary</button>
        </div>

        <!-- Danger buttons -->
        <div class="sal-danger-row">
          <button class="sal-btn-warn" onclick="resetWorkLogs()">🔄 Reset Work Logs</button>
          <button class="sal-btn-danger" onclick="resetFullSalaryLedger()">❌ Reset Full Ledger</button>
        </div>

      </div>

      <!-- Ledger table -->
      <div id="salaryLedgerContainer" class="sal-ledger" style="display:none;">
        <div class="sal-section-label" style="margin-bottom:12px;">Transaction Ledger</div>
        <div class="sal-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th><th>Type</th><th>Details</th>
                <th>Mode</th><th>Amount</th><th>Remaining</th>
              </tr>
            </thead>
            <tbody id="salaryLedgerBody"></tbody>
          </table>
        </div>
      </div>

    </section>

    <div id="dutyModal" class="salary-modal">
        <div class="salary-modal-content">
            <h3>Add Duty</h3>
            <label>Duty Type</label>
            <select id="dutyTypeSelect" onchange="toggleDutyFields()">
                <option value="day">Working Day</option>
                <option value="shift">Shift</option>
                <option value="month">Fixed Monthly</option>
            </select>
            <div id="dayField">
                <label>Number of Working Days</label>
                <input type="number" id="dayCount" min="1">
            </div>
            <div id="shiftField" style="display:none;">
                <label>Number of Shifts</label>
                <input type="number" id="shiftCount" min="1">
            </div>
            <label>Rate</label>
            <input type="number" id="dutyRate" min="0">
            <div class="modal-buttons">
                <button onclick="saveDuty()">Add Duty</button>
                <button onclick="closeDutyModal()">Cancel</button>
            </div>
        </div>
    </div>

    <div id="manualPaymentModal" class="custom-modal">
    <div class="custom-modal-content" style="border-top: 5px solid #4caf50;">
        <h3 style="margin-top: 0; color: #2e7d32;">Confirm Payment?</h3>
        <p style="color: #666; font-size: 14px; line-height: 1.5;">
            Are you sure you want to mark this salary as <strong>PAID</strong>?
            <br>
            This will bring the remaining balance to <strong>₹0.00</strong>.
        </p>

        <div style="margin-top: 15px;">
            <label style="font-weight:bold; font-size:14px; color:#333;">Payment Mode:</label>
            <select id="fullPaymentMode" style="width:100%; margin-top:5px; padding:8px; border-radius:4px; border:1px solid #ccc;">
                <option value="">Select Payment Mode</option>
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="netbanking">Net Banking</option>
            </select>
        </div>

        <div style="background: #fff3e0; padding: 10px; border-radius: 5px; margin-top: 15px; border: 1px solid #ffcc80;">
            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; color: #e65100; font-weight: bold;">
                <input type="checkbox" id="endDutyCheckbox" style="transform: scale(1.2);">
                Also release employee? (Set Status to Active)
            </label>
            <p style="margin: 5px 0 0 25px; font-size: 11px; color: #d84315;">
                Check this if the work assignment is completely finished.
            </p>
        </div>
        
        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
            <button onclick="closeManualPaymentModal()" style="background: #e0e0e0; color: #333; padding: 8px 15px; border: none; border-radius: 5px; cursor: pointer;">Cancel</button>
            <button onclick="confirmManualPayment()" style="background: #4caf50; color: white; padding: 8px 15px; border: none; border-radius: 5px; cursor: pointer;">Confirm</button>
        </div>
    </div>
</div>

    <div id="advanceModal" class="salary-modal">
        <div class="salary-modal-content">
            <h3>Salary Advance</h3>
            <label>Advance Amount</label>
            <input type="number" id="advanceAmount" min="1">
            <label>Payment Mode</label>
            <select id="advancePaymentMode">
                <option value="">Select Payment Mode</option>
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="netbanking">Net Banking</option>
            </select>
            <div class="modal-buttons">
                <button onclick="saveAdvance()">Confirm</button>
                <button onclick="closeAdvanceModal()">Cancel</button>
            </div>
        </div>
    </div>

    <section id="addEmployee" class="sub-section">
      <h2>Add Employee</h2>
      <div class="form-grid">
        <input id="firstName" placeholder="First Name">
        <input type="text" id="middleName" placeholder="Middle Name (Optional)">
        <input id="lastName" placeholder="Last Name">
        <input id="age" placeholder="Age" oninput="allowOnlyNumbers(this)">
        <select id="gender">
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
        </select>
        <input id="mobile" placeholder="Mobile Number" oninput="allowOnlyNumbers(this)">
        <input id="guardianPhone" placeholder="Guardian Phone" oninput="allowOnlyNumbers(this)">
        <input type="text" id="guardianName" placeholder="Guardian Name">
        <input id="nativePlace" placeholder="Native Place">
        <input id="languages" placeholder="Languages">
        <select id="role">
            <option value="">Select Role</option>
            <option value="Nurse">Nurse</option>
            <option value="Caretaker">Caretaker</option>
            <option value="Babysitter">Babysitter</option>
            <option value="House Maid">House Maid</option>
            <option value="Cook">Cook</option>
            <option value="Staff">Staff</option>
        </select>
        <textarea id="address" placeholder="House Address"></textarea>
        <div class="aadhar-section">
          <input id="aadhar" placeholder="Aadhar Number" oninput="allowOnlyNumbers(this)">
          <div class="toggle-wrapper">
            <label class="toggle-switch">
              <input type="checkbox" id="aadharToggle" onchange="toggleAadharUpload()">
              <span class="slider"></span>
            </label>
            <span>Upload Card</span>
          </div>
        </div>
        <input type="file" id="aadharFile" accept="image/*" style="display:none;">
        <select id="aadharVerified">
          <option value="No">Not Verified</option>
          <option value="Yes">Verified</option>
        </select>
      </div>
      <br>
      <button onclick="addEmployee()" class="primary-btn">➕ Add Employee</button>
    </section>

    <section id="allEmployees" class="sub-section">
      <div class="section-header" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:20px;">
        <div>
          <h2 style="margin:0;font-size:22px;font-weight:700;">👥 All Employees</h2>
          <p style="margin:4px 0 0;color:var(--text-2);font-size:13px;" id="empCountLabel">Loading...</p>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;">
          <input id="empSearchInput" oninput="filterEmployeeCards()" placeholder="🔍 Search name, role..." 
            style="padding:9px 14px;border:1px solid var(--border);border-radius:10px;font-size:13px;background:var(--surface);color:var(--text-1);outline:none;width:200px;">
          <select id="empStatusFilter" onchange="filterEmployeeCards()"
            style="padding:9px 12px;border:1px solid var(--border);border-radius:10px;font-size:13px;background:var(--surface);color:var(--text-1);">
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Working">Working</option>
            <option value="On Leave">On Leave</option>
            <option value="Pending">Pending</option>
            <option value="Left Company">Left Company</option>
          </select>
          <button onclick="downloadCSV()" class="btn-outline">⬇ CSV</button>
          <button onclick="downloadPDF()" class="btn-outline">⬇ PDF</button>
        </div>
      </div>
      <div id="employeeCardsGrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:16px;"></div>
    </section>

    <section id="employeeStatus" class="sub-section">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:24px;">
        <div>
          <h2 style="margin:0;font-size:22px;font-weight:700;">🔄 Employee Status</h2>
          <p style="margin:4px 0 0;color:var(--text-2);font-size:13px;">Manage and update employee working statuses</p>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <span id="statusCount-Working"   style="padding:5px 14px;border-radius:20px;font-size:12px;font-weight:700;background:#dcfce7;color:#16a34a;border:1px solid #bbf7d0;">Working: 0</span>
          <span id="statusCount-Active"    style="padding:5px 14px;border-radius:20px;font-size:12px;font-weight:700;background:#dbeafe;color:#2563eb;border:1px solid #bfdbfe;">Active: 0</span>
          <span id="statusCount-On-Leave"  style="padding:5px 14px;border-radius:20px;font-size:12px;font-weight:700;background:#fff7ed;color:#ea580c;border:1px solid #fed7aa;">On Leave: 0</span>
          <span id="statusCount-Pending"   style="padding:5px 14px;border-radius:20px;font-size:12px;font-weight:700;background:#fefce8;color:#ca8a04;border:1px solid #fde68a;">Pending: 0</span>
          <span id="statusCount-Left"      style="padding:5px 14px;border-radius:20px;font-size:12px;font-weight:700;background:#fef2f2;color:#dc2626;border:1px solid #fecaca;">Left: 0</span>
        </div>
      </div>
      <div id="statusCardsContainer" style="display:flex;flex-direction:column;gap:12px;"></div>
    </section>

    <section id="financeSection" class="sub-section">
      <div class="fd-header">
        <div>
          <div class="fd-title">💰 Finance Dashboard</div>
          <div class="fd-subtitle">Track balances, income &amp; expenses</div>
        </div>
      </div>

      <!-- Balance stat cards -->
      <div class="fd-stat-grid">
        <div class="fd-stat fd-stat-bank">
          <div class="fd-stat-icon">🏦</div>
          <div class="fd-stat-label">Bank Balance</div>
          <div class="fd-stat-value" id="bankBalance">₹0</div>
        </div>
        <div class="fd-stat fd-stat-cash">
          <div class="fd-stat-icon">💵</div>
          <div class="fd-stat-label">Cash Balance</div>
          <div class="fd-stat-value" id="cashBalance">₹0</div>
        </div>
        <div class="fd-stat fd-stat-total">
          <div class="fd-stat-icon">📊</div>
          <div class="fd-stat-label">Total Balance</div>
          <div class="fd-stat-value" id="totalBalance">₹0</div>
        </div>
        <div class="fd-stat fd-stat-expense">
          <div class="fd-stat-icon">📉</div>
          <div class="fd-stat-label">This Month Expense</div>
          <div class="fd-stat-value" id="monthlyExpense">₹0</div>
        </div>
      </div>

      <!-- Profit banner -->
      <div class="fd-profit-banner">
        <div class="fd-profit-left">
          <div class="fd-profit-label">📈 This Month Profit</div>
          <div class="fd-profit-sub">Income − Expense (Current Month)</div>
        </div>
        <div class="fd-profit-amount" id="monthlyProfit">₹0.00</div>
      </div>

      <!-- Note modal -->
      <div id="noteModal" class="note-modal" onclick="if(event.target===this)closeNoteModal()">
        <div class="note-modal-content" style="position:relative;">
          <button onclick="closeNoteModal()" style="position:absolute;top:12px;right:14px;background:transparent !important;border:none !important;font-size:20px;color:#94a3b8;cursor:pointer;padding:0;line-height:1;box-shadow:none !important;transform:none !important;" title="Close">&#x2715;</button>
          <h3 style="margin-bottom:12px;">Transaction Note</h3>
          <p id="noteModalText" style="color:var(--text-2);font-size:14px;line-height:1.6;margin:0;"></p>
          <div style="margin-top:20px;text-align:right;">
            <button onclick="closeNoteModal()" class="primary-btn">Close</button>
          </div>
        </div>
      </div>

      <!-- Opening Balance -->
      <div class="fd-section-label">Set Opening Balance</div>
      <div class="fd-panel">
        <div class="fd-panel-body fd-balance-row">
          <input class="fd-input" type="number" id="openingBank" placeholder="Opening Bank Balance">
          <input class="fd-input" type="number" id="openingCash" placeholder="Opening Cash Balance">
          <button onclick="setFinanceOpeningBalance()" class="fd-btn-primary">Set Balance</button>
        </div>
        <div class="fd-reset-row">
          <button onclick="resetFinanceBalance()" class="fd-btn-danger">🗑 Reset Balance</button>
          <button onclick="resetMonthlyExpense()" class="fd-btn-warning">🔄 Reset Month Expense</button>
          <button onclick="resetMonthlyProfit()" class="fd-btn-purple">🔄 Reset Month Profit</button>
        </div>
      </div>

      <!-- Add Transaction -->
      <div class="fd-section-label">Add Transaction</div>
      <div class="fd-panel">
        <div class="fd-panel-body fd-txn-form">
          <select class="fd-input" id="transactionType">
            <option value="debit">Expense</option>
            <option value="credit">Income</option>
          </select>
          <input class="fd-input" type="date" id="txnDate">
          <select class="fd-input" id="paidTo"><option value="">Select Person</option></select>
          <select class="fd-input" id="category">
            <option value="salary">Salary</option>
            <option value="vendor">Vendor Payment</option>
            <option value="expense">Other Expense</option>
            <option value="income">Client Payment</option>
          </select>
          <select class="fd-input" id="paymentMode">
            <option value="upi">UPI</option>
            <option value="cash">Cash</option>
            <option value="netbanking">Netbanking</option>
          </select>
          <input class="fd-input" type="number" id="amount" placeholder="Amount">
          <input class="fd-input" type="text" id="notes" placeholder="Notes (optional)">
          <button onclick="addFinanceTransaction()" class="fd-btn-primary fd-add-btn">+ Add Transaction</button>
        </div>
      </div>

      <!-- Transactions table -->
      <div class="fd-section-label">Transactions</div>
      <div class="fd-panel fd-table-panel">
        <div class="finance-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Date</th><th>Type</th><th>Paid To</th><th>Category</th>
                <th>Mode</th><th>Amount</th><th>Running Balance</th><th>Notes</th><th>Action</th>
              </tr>
            </thead>
            <tbody id="financeTableBody"></tbody>
          </table>
        </div>
      </div>
    </section>

    <section id="leaveSection" class="sub-section">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:24px;">
        <h2 style="margin:0;">🗓️ Leave Management</h2>
        <button onclick="openLeaveModal()" style="background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;border:none;padding:10px 20px;border-radius:10px;font-weight:600;font-size:14px;cursor:pointer;box-shadow:0 4px 12px rgba(99,102,241,0.3);">+ Record Leave</button>
      </div>

      <!-- Summary cards -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:16px;margin-bottom:24px;">
        <div style="background:#fff;border-radius:14px;padding:18px;border-top:4px solid #6366f1;box-shadow:0 2px 10px rgba(0,0,0,0.07);text-align:center;">
          <div style="font-size:11px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Total Leaves</div>
          <div id="leaveTotalCount" style="font-size:28px;font-weight:800;color:#6366f1;margin-top:6px;">0</div>
        </div>
        <div style="background:#fff;border-radius:14px;padding:18px;border-top:4px solid #f59e0b;box-shadow:0 2px 10px rgba(0,0,0,0.07);text-align:center;">
          <div style="font-size:11px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Casual</div>
          <div id="leaveCasualCount" style="font-size:28px;font-weight:800;color:#f59e0b;margin-top:6px;">0</div>
        </div>
        <div style="background:#fff;border-radius:14px;padding:18px;border-top:4px solid #ef4444;box-shadow:0 2px 10px rgba(0,0,0,0.07);text-align:center;">
          <div style="font-size:11px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Sick</div>
          <div id="leaveSickCount" style="font-size:28px;font-weight:800;color:#ef4444;margin-top:6px;">0</div>
        </div>
        <div style="background:#fff;border-radius:14px;padding:18px;border-top:4px solid #22c55e;box-shadow:0 2px 10px rgba(0,0,0,0.07);text-align:center;">
          <div style="font-size:11px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Paid</div>
          <div id="leavePaidCount" style="font-size:28px;font-weight:800;color:#22c55e;margin-top:6px;">0</div>
        </div>
      </div>

      <!-- Leave table -->
      <div style="background:#fff;border-radius:16px;box-shadow:0 2px 16px rgba(0,0,0,0.08);overflow:hidden;">
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="background:#1e293b;color:#fff;">
              <th style="padding:14px 18px;text-align:left;font-size:12px;letter-spacing:1px;">DATE</th>
              <th style="padding:14px 18px;text-align:left;font-size:12px;letter-spacing:1px;">EMPLOYEE</th>
              <th style="padding:14px 18px;text-align:left;font-size:12px;letter-spacing:1px;">TYPE</th>
              <th style="padding:14px 18px;text-align:left;font-size:12px;letter-spacing:1px;">DAYS</th>
              <th style="padding:14px 18px;text-align:left;font-size:12px;letter-spacing:1px;">REASON</th>
              <th style="padding:14px 18px;text-align:center;font-size:12px;letter-spacing:1px;">ACTION</th>
            </tr>
          </thead>
          <tbody id="leaveTableBody"></tbody>
        </table>
      </div>
    </section>
    <section id="settingsSection" class="sub-section">
<h2>⚙️ System Settings</h2>

<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px;margin-top:20px;">

  <!-- Company Info Card -->
  <div style="background:#fff;border-radius:16px;padding:24px;box-shadow:0 2px 16px rgba(0,0,0,0.08);border-top:4px solid #6366f1;">
    <h3 style="margin:0 0 16px;font-size:16px;color:#6366f1;">🏢 Company Information</h3>
    <label style="font-size:12px;font-weight:600;color:#888;display:block;margin-bottom:4px;">Company Name</label>
    <input id="companyName" placeholder="Sumukha Facilitators Pvt Ltd" style="width:100%;padding:9px 12px;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:12px;box-sizing:border-box;font-size:14px;">
    <label style="font-size:12px;font-weight:600;color:#888;display:block;margin-bottom:4px;">Address</label>
    <textarea id="companyAddress" placeholder="No 477, 45th CRS, Jayanagar..." style="width:100%;padding:9px 12px;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:12px;box-sizing:border-box;font-size:14px;resize:vertical;height:72px;"></textarea>
    <label style="font-size:12px;font-weight:600;color:#888;display:block;margin-bottom:4px;">Phone</label>
    <input id="companyPhone" placeholder="9880024265" style="width:100%;padding:9px 12px;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:12px;box-sizing:border-box;font-size:14px;">
    <label style="font-size:12px;font-weight:600;color:#888;display:block;margin-bottom:4px;">Email</label>
    <input id="companyEmail" placeholder="email@sumukha.com" style="width:100%;padding:9px 12px;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:12px;box-sizing:border-box;font-size:14px;">
    <label style="font-size:12px;font-weight:600;color:#888;display:block;margin-bottom:4px;">GST Number</label>
    <input id="companyGST" placeholder="29AAUCS4592E1ZN" style="width:100%;padding:9px 12px;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:16px;box-sizing:border-box;font-size:14px;">
    <button onclick="saveSettings()" style="width:100%;padding:11px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;border:none;border-radius:10px;font-weight:600;font-size:14px;cursor:pointer;">💾 Save Settings</button>
  </div>

  <!-- Account Card -->
  <div style="background:#fff;border-radius:16px;padding:24px;box-shadow:0 2px 16px rgba(0,0,0,0.08);border-top:4px solid #22c55e;">
    <h3 style="margin:0 0 16px;font-size:16px;color:#16a34a;">🔐 Account</h3>
    <div style="display:flex;flex-direction:column;gap:10px;">
      <button onclick="changePassword()" style="padding:12px;background:#f0fdf4;color:#16a34a;border:1px solid #bbf7d0;border-radius:10px;font-weight:600;cursor:pointer;text-align:left;">🔑 Change Password</button>
      <button onclick="logoutUser()" style="padding:12px;background:#fef9c3;color:#a16207;border:1px solid #fde68a;border-radius:10px;font-weight:600;cursor:pointer;text-align:left;">🚪 Logout</button>
    </div>
    <h3 style="margin:20px 0 16px;font-size:16px;color:#3b82f6;">💾 Backup & Restore</h3>
    <div id="backupRestoreBlock" style="display:flex;flex-direction:column;gap:10px;">
      <button onclick="backupERP()" style="padding:12px;background:#eff6ff;color:#2563eb;border:1px solid #bfdbfe;border-radius:10px;font-weight:600;cursor:pointer;text-align:left;">📦 Backup ERP Data</button>
      <button onclick="restoreERP()" style="padding:12px;background:#f5f3ff;color:#7c3aed;border:1px solid #ddd6fe;border-radius:10px;font-weight:600;cursor:pointer;text-align:left;">♻️ Restore from Backup</button>
    </div>
  </div>

  <!-- System Controls Card -->
  <div id="systemControlsBlock" style="background:#fff;border-radius:16px;padding:24px;box-shadow:0 2px 16px rgba(0,0,0,0.08);border-top:4px solid #f59e0b;">
    <h3 style="margin:0 0 16px;font-size:16px;color:#d97706;">⚙️ System Controls</h3>
    <div style="display:flex;flex-direction:column;gap:10px;">
      <button onclick="resetInvoiceCounter()" style="padding:12px;background:#fffbeb;color:#d97706;border:1px solid #fde68a;border-radius:10px;font-weight:600;cursor:pointer;text-align:left;">🔢 Reset Invoice Counter</button>
      <button onclick="resetEmployeeStatus()" style="padding:12px;background:#fff7ed;color:#ea580c;border:1px solid #fed7aa;border-radius:10px;font-weight:600;cursor:pointer;text-align:left;">👥 Reset Employee Statuses</button>
    </div>
    <h3 style="margin:20px 0 16px;font-size:16px;color:#ef4444;">🛑 Danger Zone</h3>
    <button onclick="clearERP()" style="width:100%;padding:12px;background:#fee2e2;color:#dc2626;border:2px solid #fca5a5;border-radius:10px;font-weight:700;cursor:pointer;">⚠️ Reset Entire ERP</button>
    <p style="font-size:11px;color:#999;margin:8px 0 0;text-align:center;">This will wipe all local data. Use with caution.</p>
  </div>

  <!-- Dark Mode Card -->
  <div style="background:#ffffff;border-radius:16px;padding:24px;box-shadow:0 2px 16px rgba(0,0,0,0.06);border-top:4px solid #1e293b;border:1px solid #e8ecf4;">
    <h3 style="margin:0 0 16px;font-size:15px;color:#1e293b;text-transform:none;letter-spacing:0;">🌙 Appearance</h3>
    <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:#f8faff;border-radius:12px;border:1px solid #e8ecf4;">
      <span style="font-weight:600;font-size:14px;color:#374151;">Dark Mode</span>
      <div class="sidebar-toggle-track" id="settingsToggleTrack">
        <input type="checkbox" id="darkModeToggleSettings" onchange="toggleDarkMode()">
        <span class="sidebar-toggle-thumb"></span>
      </div>
    </div>
  </div>

</div>
</section>

    <section id="createInvoice" class="sub-section">
      <h2>Create Invoice</h2>

      <div class="inv-company-bar">
        <div class="inv-company-name" id="invCompanyName"></div>
        <div class="inv-company-meta" id="invCompanyAddress"></div>
        <div class="inv-company-meta" id="invCompanyGST"></div>
        <div class="inv-company-meta" id="invCompanyCIN"></div>
        <div class="inv-company-meta" id="invCompanyEmail"></div>
      </div>

      <div class="inv-top-grid">
        <div class="inv-panel">
          <div class="inv-panel-title">👤 Buyer (Bill To)</div>
          <div class="inv-field"><label class="inv-label">Saved Customer</label>
            <select id="customerSelect"><option value="">— Select Saved Customer —</option></select></div>
          <div class="inv-field"><label class="inv-label">Customer Name</label>
            <input id="billName" placeholder="Full name"></div>
          <div class="inv-field"><label class="inv-label">Customer Address</label>
            <textarea id="billAddress" placeholder="Street, City, PIN" style="height:72px;resize:vertical;"></textarea></div>
          <div class="inv-field"><label class="inv-label">State</label>
            <input id="billState" placeholder="e.g. Karnataka, New Delhi"></div>
        </div>
        <div class="inv-panel">
          <div class="inv-panel-title">🧾 Invoice Details</div>
          <div class="inv-field"><label class="inv-label">Invoice Number</label>
            <input id="invoiceNumber" placeholder="Auto-generated" readonly class="inv-readonly"></div>
          <div class="inv-field-row">
            <div class="inv-field"><label class="inv-label">Invoice Date</label>
              <input type="date" id="invoiceDate"></div>
            <div class="inv-field"><label class="inv-label">Due Date <span class="inv-optional">(Optional)</span></label>
              <input type="date" id="dueDate"></div>
          </div>
          <div class="inv-field"><label class="inv-label">Customer Contact No</label>
            <input type="text" id="invoiceCustomerPhone" placeholder="Enter or auto-fill contact number"></div>
        </div>
      </div>

      <div class="inv-section-title">📦 Items / Services</div>
      <div class="inv-table-wrap">
        <table id="invoiceItemsTable">
          <thead><tr>
            <th style="width:50px;">Sl</th>
            <th>Description of Services / Items</th>
            <th style="width:110px;">HSN/SAC</th>
            <th style="width:80px;">Qty</th>
            <th style="width:110px;">Rate (₹)</th>
            <th style="width:120px;">Amount (₹)</th>
            <th style="width:80px;">Action</th>
          </tr></thead>
          <tbody id="invoiceItemsBody"></tbody>
        </table>
      </div>
      <div style="margin-top:12px;">
        <button onclick="addInvoiceRow()" class="inv-add-btn">+ Add Item</button>
      </div>

      <div class="inv-bottom-grid">
        <div class="inv-panel inv-tax-panel">
          <div class="inv-panel-title">🏷️ Tax Type</div>
          <label class="inv-radio-label"><input type="radio" name="taxType" value="none" checked><span class="inv-radio-box">No Tax</span></label>
          <label class="inv-radio-label"><input type="radio" name="taxType" value="gst"><span class="inv-radio-box">GST 18%</span></label>
          <label class="inv-radio-label"><input type="radio" name="taxType" value="cgst_sgst"><span class="inv-radio-box">CGST 9% + SGST 9%</span></label>
        </div>
        <div class="inv-totals-panel">
          <div class="inv-total-row"><span class="inv-total-label">Subtotal</span><span class="inv-total-value">₹ <span id="subtotalDisplay">0.00</span></span></div>
          <div class="inv-total-row"><span class="inv-total-label">Tax</span><span class="inv-total-value">₹ <span id="taxDisplay">0.00</span></span></div>
          <div class="inv-total-row inv-total-grand"><span class="inv-total-label">Total</span><span class="inv-total-value">₹ <span id="totalDisplay">0.00</span></span></div>
          <div class="inv-words-row">
            <span class="inv-words-label">Amount in Words</span>
            <span id="amountWords" class="inv-words-value"></span>
          </div>
        </div>
      </div>

      <div style="margin-top:20px;padding-top:16px;border-top:1px solid var(--border);display:flex;gap:10px;">
        <button onclick="saveInvoiceRecord()" class="primary-btn">💾 Save Invoice</button>
      </div>
    </section>

    <section id="allInvoices" class="sub-section">
      <h2>📄 All Invoices</h2>
      <div class="inv-filter-bar">
        <input type="text" id="invoiceSearchInput" placeholder="🔍 Search by Invoice No or Customer..." oninput="filterInvoices()" style="flex:2;">
        <select id="invoiceTaxFilter" onchange="filterInvoices()">
          <option value="All">All Tax Types</option>
          <option value="gst">IGST (18%)</option>
          <option value="cgst_sgst">CGST + SGST</option>
          <option value="none">Non-GST</option>
        </select>
        <select id="invoiceStatusFilter" onchange="filterInvoices()">
          <option value="All">All Statuses</option>
          <option value="Draft">Draft</option>
          <option value="Pending">Pending</option>
          <option value="Sent">Sent</option>
          <option value="Paid">Paid</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Overdue">Overdue</option>
        </select>
      </div>
      <div class="finance-table-wrapper">
        <table id="invoiceHistoryTable">
          <thead>
            <tr>
              <th>Invoice No</th><th>Customer</th><th>Date</th>
              <th>Total (₹)</th><th>Tax Type</th><th>Status</th><th>Action</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </section>

    <!-- ==============================
         DOCUMENTS SECTION
         ============================== -->
    <section id="documentsSection" class="sub-section">
      <h2>Employee Documents</h2>

      <!-- Summary cards -->
      <div class="dashboard-grid" style="margin-bottom:25px;">
        <div class="card" style="border-top:4px solid #1f3c88;">
          <h3>Total Documents</h3>
          <p id="docCardTotal">0</p>
        </div>
        <div class="card" style="border-top:4px solid #4caf50;">
          <h3>Employees with Docs</h3>
          <p id="docCardEmps">0</p>
        </div>
        <div class="card" style="border-top:4px solid #ff9800;">
          <h3>Storage Used</h3>
          <p id="docCardSize">0 MB</p>
        </div>
        <div class="card" style="border-top:4px solid #9c27b0;">
          <h3>Most Common Type</h3>
          <p id="docCardTopType" style="font-size:16px;">-</p>
        </div>
      </div>

      <!-- Filter bar -->
      <div class="doc-filter-bar">
        <select id="docEmpFilter" onchange="renderDocumentCards(); updateDocSummaryCards();">
          <option value="">All Employees</option>
        </select>
        <select id="docTypeFilter" onchange="renderDocumentCards(); updateDocSummaryCards();">
          <option value="">All Document Types</option>
          <option>Aadhar Card</option>
          <option>PAN Card</option>
          <option>Passport</option>
          <option>Driving Licence</option>
          <option>Offer Letter</option>
          <option>Experience Letter</option>
          <option>Relieving Letter</option>
          <option>Bank Passbook</option>
          <option>Salary Slip</option>
          <option>Medical Certificate</option>
          <option>Police Verification</option>
          <option>Other</option>
        </select>
        <button class="doc-upload-btn" onclick="openDocUploadModal('')">&#8679; Upload Document</button>
      </div>

      <!-- Document cards grouped by employee -->
      <div id="docCardsContainer"></div>
    </section>


    <!-- ===== ATTENDANCE SECTION ===== -->
    <section id="attendanceSection" class="sub-section">
      <h2>Attendance Tracker</h2>

      <div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-bottom:20px;">
        <select id="attendanceMonthSelect" onchange="loadAttendanceTable();loadAttendanceSummaryCards();loadAttendanceMonthlySummary();"></select>
        <select id="attendanceEmployeeSelect" onchange="loadAttendanceTable();loadAttendanceSummaryCards();"></select>
        <select id="attendanceStatusFilter" onchange="loadAttendanceTable();loadAttendanceSummaryCards();">
          <option value="">All Statuses</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
          <option value="Half Day">Half Day</option>
          <option value="Holiday">Holiday</option>
        </select>
        <button onclick="openMarkAttendanceModal()" style="background:#6366f1;color:white;border:none;padding:9px 16px;border-radius:8px;cursor:pointer;font-weight:600;">+ Mark Attendance</button>
        <button onclick="bulkMarkAttendance('Present')" style="background:#16a34a;color:white;border:none;padding:9px 14px;border-radius:8px;cursor:pointer;font-weight:600;">&#10003; Bulk Present</button>
        <button onclick="bulkMarkAttendance('Absent')" style="background:#dc2626;color:white;border:none;padding:9px 14px;border-radius:8px;cursor:pointer;font-weight:600;">&#10007; Bulk Absent</button>
        <button onclick="exportAttendanceCSV()" style="background:#475569;color:white;border:none;padding:9px 14px;border-radius:8px;cursor:pointer;font-weight:600;">&#8681; Export CSV</button>
      </div>

      <div class="dashboard-grid" style="margin-bottom:25px;">
        <div class="card" style="border-top:3px solid #6366f1;">
          <h3>Total Records</h3><p id="attCardTotal">0</p>
        </div>
        <div class="card" style="border-top:3px solid #22c55e;">
          <h3>Present</h3><p id="attCardPresent">0</p>
        </div>
        <div class="card" style="border-top:3px solid #ef4444;">
          <h3>Absent</h3><p id="attCardAbsent">0</p>
        </div>
        <div class="card" style="border-top:3px solid #f59e0b;">
          <h3>Half Day</h3><p id="attCardHalfDay">0</p>
        </div>
      </div>

      <h3>Attendance Log</h3>
      <table>
        <thead>
          <tr><th>Date</th><th>Employee</th><th>Status</th><th>Notes</th><th>Action</th></tr>
        </thead>
        <tbody id="attendanceTableBody"></tbody>
      </table>

      <h3 style="margin-top:30px;">Monthly Summary</h3>
      <table>
        <thead>
          <tr><th>Employee</th><th>Present</th><th>Absent</th><th>Half Day</th><th>Total</th><th>Attendance %</th></tr>
        </thead>
        <tbody id="attSummaryBody"></tbody>
      </table>
    </section>

  </main>
  </div><!-- end main-wrapper -->
</div>

<div id="paymentModal" class="note-modal">
    <div class="note-modal-content">
        <h3>Record Payment</h3>
        <select id="invoicePaymentMode" style="width:100%; margin-top:10px;">
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="netbanking">Netbanking</option>
        </select>
        <div style="margin-top:20px; display:flex; gap:10px;">
            <button onclick="confirmInvoicePayment()" class="primary-btn">Confirm</button>
            <button onclick="closePaymentModal()" class="primary-btn" style="background:#dc3545;">Cancel</button>
        </div>
    </div>
</div>

<div id="leaveModal" class="custom-modal">
    <div class="custom-modal-content">
        <h3>Record Leave</h3>
        <label>Employee:</label>
        <select id="leaveEmployeeSelect" style="width:100%; margin-bottom:10px; padding:8px;"></select>
        <label>Leave Type:</label>
        <select id="leaveType" style="width:100%; margin-bottom:10px; padding:8px;">
            <option value="Casual Leave">Casual Leave</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Paid Leave">Paid Leave</option>
            <option value="Unpaid Leave">Unpaid Leave</option>
        </select>
        <label>Start Date:</label>
        <input type="date" id="leaveStartDate" style="width:100%; margin-bottom:10px; padding:8px;">
        <label>Duration (Days):</label>
        <input type="number" id="leaveDays" value="1" min="0.5" step="0.5" style="width:100%; margin-bottom:10px; padding:8px;">
        <label>Reason:</label>
        <input type="text" id="leaveReason" placeholder="e.g. Fever, Family Function" style="width:100%; margin-bottom:20px; padding:8px;">
        <div style="display: flex; justify-content: flex-end; gap: 10px;">
            <button onclick="closeLeaveModal()" style="background: #e0e0e0; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">Cancel</button>
            <button onclick="saveLeave()" style="background: #4caf50; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">Save</button>
        </div>
    </div>
</div>

<div id="workLocationModal" class="custom-modal">
    <div class="custom-modal-content">
        <h3 style="margin-top: 0; color: #333;">Approve Assignment</h3>
        <p style="color: #666; font-size: 14px;">Please enter the work location or address where the employee will be working:</p>
        <input type="text" id="workLocationInput" placeholder="e.g. Main Office, Site A..." style="width: 100%; padding: 10px; margin-top: 10px; margin-bottom: 20px; border: 1px solid #ccc; border-radius: 5px; box-sizing: border-box;">
        <div style="display: flex; justify-content: flex-end; gap: 10px;">
            <button onclick="cancelWorkLocation()" style="background: #e0e0e0; color: #333; padding: 8px 15px; border: none; border-radius: 5px; cursor: pointer;">Cancel</button>
            <button onclick="confirmWorkLocation()" style="background: #4caf50; color: white; padding: 8px 15px; border: none; border-radius: 5px; cursor: pointer;">Approve & Save</button>
        </div>
    </div>
</div>

<div id="cancelWorkingModal" class="custom-modal">
    <div class="custom-modal-content">
        <h3 style="margin-top: 0; color: #d32f2f;">Change to Active?</h3>
        <p style="color: #666; font-size: 14px;">This candidate is currently working. Are you sure you want to change their status to Active? This will remove them from their current location.</p>
        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
            <button onclick="abortCancelWorking()" style="background: #e0e0e0; color: #333; padding: 8px 15px; border: none; border-radius: 5px; cursor: pointer;">No, Keep Working</button>
            <button onclick="confirmCancelWorking()" style="background: #f44336; color: white; padding: 8px 15px; border: none; border-radius: 5px; cursor: pointer;">Yes, Change Status</button>
        </div>
    </div>
</div>

<!-- DOCUMENT UPLOAD MODAL -->
<div id="docUploadModal" class="custom-modal">
  <div class="custom-modal-content" style="max-width:480px;">
    <h3 style="margin-top:0;">Upload Document</h3>

    <label style="font-size:13px;font-weight:bold;">Employee</label>
    <select id="docUploadEmpSelect" style="width:100%;margin-bottom:14px;padding:8px;border-radius:5px;border:1px solid #ccc;"></select>

    <label style="font-size:13px;font-weight:bold;">Document Type</label>
    <select id="docTypeSelect" style="width:100%;margin-bottom:14px;padding:8px;border-radius:5px;border:1px solid #ccc;">
      <option>Aadhar Card</option>
      <option>PAN Card</option>
      <option>Passport</option>
      <option>Driving Licence</option>
      <option>Offer Letter</option>
      <option>Experience Letter</option>
      <option>Relieving Letter</option>
      <option>Bank Passbook</option>
      <option>Salary Slip</option>
      <option>Medical Certificate</option>
      <option>Police Verification</option>
      <option>Other</option>
    </select>

    <label style="font-size:13px;font-weight:bold;">File <span style="font-weight:normal;color:#888;">(PDF, JPG, PNG, Word — max 10 MB)</span></label>
    <input type="file" id="docFileInput" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
      onchange="previewDocFile()"
      style="width:100%;margin-bottom:10px;padding:8px;border:1px solid #ccc;border-radius:5px;box-sizing:border-box;">

    <div id="docUploadPreview" style="display:none;background:#f9f9f9;border:1px solid #ddd;border-radius:6px;padding:10px;margin-bottom:12px;"></div>

    <label style="font-size:13px;font-weight:bold;">Notes <span style="font-weight:normal;color:#888;">(optional)</span></label>
    <input type="text" id="docNotes" placeholder="e.g. Verified on 12 Jan 2025"
      style="width:100%;margin-bottom:20px;padding:8px;border-radius:5px;border:1px solid #ccc;box-sizing:border-box;">

    <div style="display:flex;justify-content:flex-end;gap:10px;">
      <button onclick="closeDocUploadModal()" style="background:#e0e0e0;border:none;padding:9px 18px;border-radius:5px;cursor:pointer;">Cancel</button>
      <button onclick="saveDocument()" style="background:#1f3c88;color:white;border:none;padding:9px 18px;border-radius:5px;cursor:pointer;font-weight:bold;">Upload</button>
    </div>
  </div>
</div>

<!-- MARK ATTENDANCE MODAL -->
<div id="markAttendanceModal" class="custom-modal">
  <div class="custom-modal-content">
    <h3 style="margin-top:0;margin-bottom:16px;">Mark Attendance</h3>
    <label style="font-size:13px;font-weight:600;display:block;margin-bottom:6px;">Employee</label>
    <select id="markAttEmpSelect" style="width:100%;margin-bottom:14px;"></select>
    <label style="font-size:13px;font-weight:600;display:block;margin-bottom:6px;">Date</label>
    <input type="date" id="markAttDate" style="width:100%;margin-bottom:14px;box-sizing:border-box;" max="">
    <label style="font-size:13px;font-weight:600;display:block;margin-bottom:6px;">Status</label>
    <select id="markAttStatus" style="width:100%;margin-bottom:14px;">
      <option value="Present">Present</option>
      <option value="Absent">Absent</option>
      <option value="Half Day">Half Day</option>
      <option value="Holiday">Holiday</option>
    </select>
    <label style="font-size:13px;font-weight:600;display:block;margin-bottom:6px;">Notes (optional)</label>
    <input type="text" id="markAttNotes" placeholder="e.g. Late arrival, Early leave..." style="width:100%;margin-bottom:20px;box-sizing:border-box;">
    <div style="display:flex;justify-content:flex-end;gap:10px;">
      <button onclick="closeMarkAttendanceModal()">Cancel</button>
      <button onclick="saveAttendanceRecord()" style="background:#6366f1;color:white;border:none;padding:9px 18px;border-radius:8px;font-weight:600;cursor:pointer;">Save</button>
    </div>
  </div>
</div>

<!-- Firebase compat SDK -->
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-storage-compat.js"></script>

<!-- Third-party libraries -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="https://cdn.jsdelivr.net/npm/choices.js/public/assets/scripts/choices.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/choices.js/public/assets/styles/choices.min.css" />

<!-- ERP scripts — order matters -->
<script src="invoice.js"></script>
<script src="employees.js"></script>
<script src="app.js"></script>

<script>
function toggleMobileSidebar() {
  const sidebar = document.getElementById('mainSidebar');
  const overlay = document.getElementById('sidebarOverlay');
  sidebar.classList.toggle('sidebar-open');
  overlay.classList.toggle('overlay-visible');
  document.body.classList.toggle('sidebar-is-open');
}
// Close sidebar when a nav item is clicked on mobile
document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      const sidebar = document.getElementById('mainSidebar');
      const overlay = document.getElementById('sidebarOverlay');
      sidebar.classList.remove('sidebar-open');
      overlay.classList.remove('overlay-visible');
      document.body.classList.remove('sidebar-is-open');
    }
  });
});
</script>

<div id="notificationContainer"></div>

<!-- Auth guard handled by app.js -->

</body>
</html>
