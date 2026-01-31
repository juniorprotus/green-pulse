// Use the API_URL from config.js, or fallback to localhost if config is missing
const API_URL = (typeof CONFIG !== 'undefined' && CONFIG.API_URL) 
    ? CONFIG.API_URL 
    : 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {
    // Check Auth Status
    checkAuth();

    // Navigation Scroll Effect
    const nav = document.querySelector('.nav-container');
    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.style.background = 'rgba(255, 255, 255, 0.95)';
                nav.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
            } else {
                nav.style.background = 'rgba(255, 255, 255, 0.9)';
                nav.style.boxShadow = 'none';
            }
        });
    }

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Report Form Handling
    const reportForm = document.getElementById('reportForm');
    if (reportForm) {
        reportForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please login to submit a report');
                openLoginModal();
                return;
            }

            const btn = reportForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;

            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';
            btn.disabled = true;

            const reportData = {
                type: document.getElementById('reportType').value,
                location: document.getElementById('location').value,
                description: document.getElementById('description').value
            };

            try {
                const response = await fetch(`${API_URL}/reports`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    },
                    body: JSON.stringify(reportData)
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Report submitted successfully! Check your email for confirmation.');
                    reportForm.reset();
                } else {
                    alert(data.msg || 'Submission failed');
                }
            } catch (error) {
                console.error('Error submitting report:', error);
                alert('Server error. Please try again later.');
            } finally {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });
    }

    // Auth Form Handling
    const authForm = document.getElementById('authForm');
    if (authForm) {
        authForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const isSignup = !document.getElementById('nameGroup').classList.contains('hidden');
            const btn = authForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;

            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
            btn.disabled = true;

            const email = authForm.querySelector('input[type="email"]').value;
            const password = authForm.querySelector('input[type="password"]').value;
            const name = isSignup ? document.getElementById('nameInput').value : '';

            const endpoint = isSignup ? '/auth/register' : '/auth/login';
            const body = isSignup ? { name, email, password } : { email, password };

            try {
                const response = await fetch(`${API_URL}${endpoint}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userRole', data.role || 'citizen');

                    if (data.role === 'admin') {
                        window.location.href = 'admin/dashboard.html';
                    } else {
                        alert(isSignup ? 'Registered and Logged in!' : 'Logged in successfully!');
                        checkAuth();
                        closeAuthModal();
                    }
                } else {
                    alert(data.msg || 'Authentication failed');
                }
            } catch (error) {
                console.error('Auth error:', error);
                alert('Connection error. Please check your internet connection.');
            } finally {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });
    }

    // Load Schedules
    loadSchedules();
});

async function loadSchedules() {
    const scheduleContainer = document.querySelector('#schedule .card');
    if (!scheduleContainer) return;

    try {
        const response = await fetch(`${API_URL}/schedules`);
        const schedules = await response.json();

        if (response.ok && schedules.length > 0) {
            // In a real app, we'd build a list/table here
            console.log('Schedules loaded:', schedules);
        }
    } catch (err) {
        console.error('Error loading schedules:', err);
    }
}

function checkAuth() {
    const token = localStorage.getItem('token');
    const authBtns = document.querySelector('.auth-buttons');

    if (token) {
        authBtns.innerHTML = `
            <span style="margin-right:1rem; color:var(--text-muted); font-size:0.9rem;">Account Active</span>
            <button class="btn btn-secondary" onclick="logout()">Logout</button>
        `;
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    location.reload();
}

function scrollToReport() {
    const el = document.getElementById('report');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function scrollToSchedule() {
    const el = document.getElementById('schedule');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// Modal Functions
function openLoginModal() {
    document.getElementById('authModal').classList.remove('hidden');
    document.getElementById('modalTitle').textContent = 'Welcome Back';
    document.getElementById('nameGroup').classList.add('hidden');
    document.getElementById('nameInput').removeAttribute('required');
    document.querySelector('#authForm button').textContent = 'Login';
}

function openSignupModal() {
    document.getElementById('authModal').classList.remove('hidden');
    document.getElementById('modalTitle').textContent = 'Join GreenPulse';
    document.getElementById('nameGroup').classList.remove('hidden');
    document.getElementById('nameInput').setAttribute('required', 'true');
    document.querySelector('#authForm button').textContent = 'Sign Up';
}

function closeAuthModal() {
    document.getElementById('authModal').classList.add('hidden');
}

// Close modal on outside click
const authModalContainer = document.getElementById('authModal');
if (authModalContainer) {
    authModalContainer.addEventListener('click', (e) => {
        if (e.target === authModalContainer) {
            closeAuthModal();
        }
    });
}

// Geolocation
function getLocation() {
    const locInput = document.getElementById('location');
    const iconBtn = document.querySelector('.btn-icon-inside');

    if (navigator.geolocation) {
        iconBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                locInput.value = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
                iconBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
                setTimeout(() => iconBtn.innerHTML = '<i class="fa-solid fa-crosshairs"></i>', 2000);
            },
            (error) => {
                alert('Unable to retrieve your location. Please enter it manually.');
                iconBtn.innerHTML = '<i class="fa-solid fa-crosshairs"></i>';
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}
