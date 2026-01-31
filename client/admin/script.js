// Use the API_URL from config.js, or fallback to localhost if config is missing
const API_URL = (typeof CONFIG !== 'undefined' && CONFIG.API_URL) 
    ? CONFIG.API_URL 
    : 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {
    // Check if on dashboard or login page
    const loginForm = document.getElementById('adminLoginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = loginForm.querySelector('button');
            const originalText = btn.innerText;

            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Signing In...';
            btn.disabled = true;

            const email = loginForm.querySelector('input[type="email"]').value;
            const password = loginForm.querySelector('input[type="password"]').value;

            try {
                const response = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok && data.role === 'admin') {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userRole', data.role);
                    window.location.href = 'dashboard.html';
                } else {
                    alert(data.msg || 'Admin access denied');
                }
            } catch (error) {
                console.error('Login error:', error);
                alert('Connection error. Please check your internet connection.');
            } finally {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });
    }

    const adminMain = document.querySelector('.admin-main');
    if (adminMain) {
        // We are on dashboard
        loadDashboardData();
    }

    // Logout Handling
    const logoutBtn = document.querySelector('.btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('token');
                localStorage.removeItem('userRole');
                window.location.href = 'index.html';
            }
        });
    }
});

async function loadDashboardData() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/reports`, {
            headers: { 'x-auth-token': token }
        });
        const reports = await response.json();

        if (response.ok) {
            updateStats(reports);
            renderReports(reports);
        }
    } catch (error) {
        console.error('Dashboard load error:', error);
    }
}

function updateStats(reports) {
    const pending = reports.filter(r => r.status === 'pending').length;
    const progress = reports.filter(r => r.status === 'in-progress').length;
    const resolved = reports.filter(r => r.status === 'resolved').length;

    const statsElements = document.querySelectorAll('.stat-item h3');
    if (statsElements.length >= 3) {
        statsElements[0].innerText = pending;
        statsElements[1].innerText = progress;
        statsElements[2].innerText = resolved;
    }
}

function renderReports(reports) {
    const tbody = document.querySelector('table tbody');
    if (!tbody) return;

    tbody.innerHTML = reports.slice(0, 5).map(report => `
        <tr>
            <td>#${report._id.substring(report._id.length - 6)}</td>
            <td><span class="type-badge"><i class="fa-solid fa-circle" style="color:${getTypeColor(report.type)}; font-size:8px;"></i> ${report.type}</span></td>
            <td>${report.location}</td>
            <td><span class="status-badge ${report.status}">${report.status}</span></td>
            <td><button class="btn-sm" onclick="updateStatus('${report._id}')">Update</button></td>
        </tr>
    `).join('');
}

function getTypeColor(type) {
    const colors = {
        'overflow': '#ef4444',
        'dumping': '#f59e0b',
        'missed': '#3b82f6',
        'damage': '#8b5cf6',
        'other': '#6b7280'
    };
    return colors[type] || '#6b7280';
}

async function updateStatus(id) {
    const newStatus = prompt('Enter new status (pending, in-progress, resolved):', 'resolved');
    if (!newStatus || !['pending', 'in-progress', 'resolved'].includes(newStatus)) return;

    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_URL}/reports/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (response.ok) {
            alert('Status updated! User will be notified by email.');
            loadDashboardData();
        }
    } catch (err) {
        console.error('Update error:', err);
    }
}
