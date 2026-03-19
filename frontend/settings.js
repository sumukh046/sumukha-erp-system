// ===============================
// SETTINGS MODULE
// ===============================

// Logout
function logoutUser(){

    localStorage.removeItem("erpUser");

    window.location.href = "login.html";

}


// Change Password
function changePassword(){

    const newPass = prompt("Enter new password");

    if(!newPass) return;

    localStorage.setItem("erpPassword", newPass);

    alert("Password changed successfully");
}


// Backup ERP Data
function backupERP(){

    const data = JSON.stringify(localStorage);

    const blob = new Blob([data], {type:"application/json"});

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "erp-backup.json";

    link.click();
    showNotification("💾 ERP backup created","success");
}


// Reset Invoice Counter
function resetInvoiceCounter(){

    if(confirm("Reset invoice numbering?")){

        localStorage.setItem("invoiceCounter",1);

        alert("Invoice counter reset");

    }

}


// Reset Employee Status
function resetEmployeeStatus(){

    const db = JSON.parse(localStorage.getItem("erpDB")) || {};

    if(!db.employees) return;

    db.employees.forEach(e => {

        if(e.status === "On Leave"){

            e.status = "Active";

        }

    });

    localStorage.setItem("erpDB", JSON.stringify(db));

    alert("Employee statuses reset");

}


// Reset Entire ERP
function clearERP(){

    if(!confirm("This will delete ALL ERP data. Continue?")) return;

    localStorage.clear();

    alert("ERP reset completed");

    showNotification("⚠ ERP has been reset","warning");
    location.reload();
}
function restoreERP(){

    const input = document.createElement("input");
    input.type = "file";

    input.onchange = function(e){

        const file = e.target.files[0];

        const reader = new FileReader();

        reader.onload = function(event){

            const data = JSON.parse(event.target.result);

            Object.keys(data).forEach(key=>{
                localStorage.setItem(key, data[key]);
            });

            alert("ERP data restored");

            showNotification("♻ ERP restored successfully","info");
            location.reload();
        }

        reader.readAsText(file);
    }

    input.click();
}
// ===============================
// AUTO LOGOUT SYSTEM
// ===============================

let inactivityTimer;
let warningTimer;

const AUTO_LOGOUT_TIME = 5 * 60 * 1000; // 5 minutes
const WARNING_TIME = 4 * 60 * 1000; // warn at 4 minutes

function resetInactivityTimer(){

    clearTimeout(inactivityTimer);
    clearTimeout(warningTimer);

    warningTimer = setTimeout(showLogoutWarning, WARNING_TIME);

    inactivityTimer = setTimeout(autoLogout, AUTO_LOGOUT_TIME);
}

function showLogoutWarning(){

    alert("You will be logged out in 1 minute due to inactivity.");

}

function autoLogout(){

    alert("Logged out due to inactivity.");

    localStorage.removeItem("erpUser");

    window.location.href = "login.html";

}
// ===============================
// DARK MODE
// ===============================

function toggleDarkMode(){

    const isDark = document.body.classList.toggle("dark-mode");

    localStorage.setItem("erpDarkMode", isDark ? "enabled" : "disabled");

    // Re-apply invoice field lock colours immediately when mode switches
    if (typeof toggleCustomerLock === "function") {
        const locked = document.getElementById("billName")?.readOnly || false;
        toggleCustomerLock(locked);
    }

    if (typeof updateDashboardAnalytics === "function") updateDashboardAnalytics();

}

function loadDarkMode(){

    const mode = localStorage.getItem("erpDarkMode");

    if(mode === "enabled"){

        document.body.classList.add("dark-mode");

        const toggle = document.getElementById("darkModeToggle");
        if(toggle) toggle.checked = true;

    }

}
function showNotification(message,type="success"){

const container=document.getElementById("notificationContainer");

if(!container) return;

const note=document.createElement("div");

note.className="erp-notification erp-"+type;

note.innerHTML=message;

container.appendChild(note);

/* auto remove */

setTimeout(()=>{
note.style.opacity="0";
note.style.transform="translateX(40px)";
setTimeout(()=>{
note.remove();
},300);
},3000);

}
if(typeof updateDashboardAnalytics === "function"){
    updateDashboardAnalytics();
}
["mousemove","keydown","click","scroll"].forEach(event => {

    document.addEventListener(event, resetInactivityTimer);

});

document.addEventListener("DOMContentLoaded", resetInactivityTimer);
document.addEventListener("DOMContentLoaded", loadDarkMode);