document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const twoFactorSection = document.getElementById('twoFactorSection');
    let currentRole = 'client';

    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentRole = this.dataset.tab;
            
            // Show/hide 2FA section for admin
            twoFactorSection.style.display = currentRole === 'admin' ? 'block' : 'none';
        });
    });

    // Toggle password visibility
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');

    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });

    // Form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        clearErrors();

        const email = document.getElementById('email').value.trim();
        const password = passwordInput.value.trim();
        const twoFactorCode = document.getElementById('twoFactorCode').value.trim();
        const rememberMe = document.getElementById('rememberMe').checked;

        if (!validateForm(email, password)) return;

        try {
            const response = await login(email, password, twoFactorCode, currentRole);
            handleLoginResponse(response, rememberMe);
        } catch (error) {
            showAlert(error.message, 'error');
        }
    });

    function validateForm(email, password) {
        let isValid = true;

        if (!isValidEmail(email)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        }

        if (password.length < 8) {
            showError('password', 'Password must be at least 8 characters long');
            isValid = false;
        }

        if (currentRole === 'admin' && !document.getElementById('twoFactorCode').value) {
            showError('twoFactorCode', '2FA code is required for admin login');
            isValid = false;
        }

        return isValid;
    }

    async function login(email, password, twoFactorCode, role) {
        // Show loading state
        const authBtn = document.querySelector('.auth-btn');
        authBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
        authBtn.disabled = true;

        try {
            // Simulate API call - Replace with actual API endpoint
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    twoFactorCode,
                    role
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            return data;
        } catch (error) {
            throw error;
        } finally {
            // Restore button state
            authBtn.innerHTML = '<span>Login</span><i class="fas fa-arrow-right"></i>';
            authBtn.disabled = false;
        }
    }

    function handleLoginResponse(response, rememberMe) {
        // Store auth token
        if (rememberMe) {
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('userRole', response.role);
        } else {
            sessionStorage.setItem('authToken', response.token);
            sessionStorage.setItem('userRole', response.role);
        }

        showAlert('Login successful! Redirecting...', 'success');

        // Redirect based on role
        setTimeout(() => {
            window.location.href = response.role === 'admin' 
                ? 'admin-dashboard.html' 
                : 'client-dashboard.html';
        }, 1500);
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showError(field, message) {
        const errorElement = document.getElementById(`${field}Error`);
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        document.getElementById(field).closest('.input-wrapper').style.borderColor = validateFormar(--error-color);
    }

    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(error => {
            error.style.display = 'none';
        });
        document.querySelectorAll('.input-wrapper').forEach(wrapper => {
            wrapper.style.borderColor = validateFormr(--border-color);
        });
        document.getElementById('alertMessage').style.display = 'none';
    }

    function showAlert(message, type) {
        const alertMessage = document.getElementById('alertMessage');
        alertMessage.textContent = message;
        alertMessage.className = `alert ${type}`;
        alertMessage.style.display = 'block';
    }
});