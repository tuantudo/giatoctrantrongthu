import { login, getCurrentUser } from './api.js';

const form = document.getElementById('login-form');
const errorBox = document.getElementById('login-error');
const submitBtn = document.getElementById('login-submit');

// Already logged in? skip straight to the dashboard.
getCurrentUser().then(user => {
    if (user) window.location.href = '/admin/index.html';
}).catch(() => {});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorBox.classList.add('hidden');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Đang đăng nhập...';

    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    try {
        await login(username, password);
        window.location.href = '/admin/index.html';
    } catch (err) {
        errorBox.textContent = err.message || 'Đăng nhập thất bại';
        errorBox.classList.remove('hidden');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Đăng nhập';
    }
});
