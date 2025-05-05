document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signupForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const togglePassword = document.querySelector('.toggle-password');

    // Toggle password visibility
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });

    // Form validation
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // Show success message
            showSuccess();
            
            // Simulate API call
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }
    });

    function validateForm() {
        let isValid = true;
        
        // Reset previous errors
        clearErrors();

        // Validate Full Name
        const fullName = document.getElementById('fullName').value.trim();
        if (fullName.length < 2) {
            showError('fullName', 'Please enter your full name');
            isValid = false;
        }

        // Validate Email
        const email = document.getElementById('email').value.trim();
        if (!isValidEmail(email)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        }

        // Validate Phone
        const phone = document.getElementById('phone').value.trim();
        if (!isValidPhone(phone)) {
            showError('phone', 'Please enter a valid phone number');
            isValid = false;
        }

        // Validate Password
        const password = passwordInput.value;
        if (!isValidPassword(password)) {
            showError('password', 'Password must be at least 8 characters long and contain letters and numbers');
            isValid = false;
        }

        // Validate Confirm Password
        if (password !== confirmPasswordInput.value) {
            showError('confirmPassword', 'Passwords do not match');
            isValid = false;
        }

        // Validate Terms
        if (!document.getElementById('terms').checked) {
            showError('terms', 'Please accept the terms and conditions');
            isValid = false;
        }

        return isValid;
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function isValidPhone(phone) {
        return /^\+?[\d\s-]{10,}$/.test(phone);
    }

    function isValidPassword(password) {
        return password.length >= 8 && /[A-Za-z]/.test(password) && /[0-9]/.test(password);
    }

    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(`${fieldId}Error`);
        field.closest('.form-group').classList.add('error');
        errorElement.textContent = message;
    }

    function clearErrors() {
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error');
        });
        document.querySelectorAll('.error-message').forEach(error => {
            error.textContent = '';
        });
    }

    function showSuccess() {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Sign up successful! Redirecting to login...';
        form.insertBefore(successMessage, form.firstChild);
    }

    // Real-time validation
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim()) {
                validateField(this);
            }
        });
    });

    function validateField(field) {
        switch(field.id) {
            case 'email':
                if (!isValidEmail(field.value.trim())) {
                    showError('email', 'Please enter a valid email address');
                }
                break;
            case 'password':
                if (!isValidPassword(field.value)) {
                    showError('password', 'Password must be at least 8 characters long and contain letters and numbers');
                }
                break;
            case 'confirmPassword':
                if (field.value !== passwordInput.value) {
                    showError('confirmPassword', 'Passwords do not match');
                }
                break;
        }
    }
});