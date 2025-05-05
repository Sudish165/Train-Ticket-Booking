// Role-based authentication handler
const Auth = {
    // Check if user is logged in
    isLoggedIn() {
        return localStorage.getItem('isLoggedIn') || sessionStorage.getItem('isLoggedIn');
    },

    // Get user role
    getUserRole() {
        return localStorage.getItem('userRole') || sessionStorage.getItem('userRole');
    },

    // Check if user is admin
    isAdmin() {
        return this.getUserRole() === 'admin';
    },

    // Check if user is client
    isClient() {
        return this.getUserRole() === 'client';
    },

    // Redirect unauthorized users
    requireAuth(allowedRoles = ['client', 'admin']) {
        if (!this.isLoggedIn()) {
            window.location.href = 'login.html';
            return false;
        }

        const userRole = this.getUserRole();
        if (!allowedRoles.includes(userRole)) {
            window.location.href = userRole === 'admin' ? 'admin-dashboard.html' : 'client-dashboard.html';
            return false;
        }

        return true;
    }
};

// Update your login.js to handle roles
document.getElementById('loginForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (data.success) {
            // Store auth data
            const storage = rememberMe ? localStorage : sessionStorage;
            storage.setItem('isLoggedIn', 'true');
            storage.setItem('userRole', data.role);
            storage.setItem('userEmail', email);

            // Redirect based on role
            window.location.href = data.role === 'admin' ? 'admin-dashboard.html' : 'client-dashboard.html';
        } else {
            showAlert(data.message || 'Login failed', 'error');
        }
    } catch (error) {
        showAlert('Login failed. Please try again.', 'error');
    }
}); 