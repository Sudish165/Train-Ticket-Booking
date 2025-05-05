document.addEventListener('DOMContentLoaded', function() {
    if (!Auth.requireAuth(['admin'])) return;

    loadAdminDashboard();
    setupEventListeners();

    async function loadAdminDashboard() {
        try {
            // Fetch dashboard statistics
            const stats = await fetchDashboardStats();
            updateDashboardStats(stats);

            // Fetch active trains
            const trains = await fetchActiveTrains();
            displayTrains(trains);

            // Fetch recent bookings
            const bookings = await fetchRecentBookings();
            displayBookings(bookings);

            // Load revenue chart
            loadRevenueChart();
        } catch (error) {
            showAlert('Error loading dashboard', 'error');
        }
    }

    async function fetchDashboardStats() {
        const response = await fetch('http://localhost:5000/api/admin/dashboard/stats', {
            headers: {
                'Authorization': `Bearer ${Auth.isLoggedIn()}`
            }
        });
        return await response.json();
    }

    function updateDashboardStats(stats) {
        document.getElementById('totalRevenue').textContent = `$${stats.totalRevenue}`;
        document.getElementById('totalBookings').textContent = stats.totalBookings;
        document.getElementById('activeTrains').textContent = stats.activeTrains;
        document.getElementById('todayBookings').textContent = stats.todayBookings;
    }

    // Train Management
    document.getElementById('addTrainForm')?.addEventListener('submit', async function(e) {
        e.preventDefault();
        const trainData = {
            name: document.getElementById('trainName').value,
            route: document.getElementById('route').value,
            departureTime: document.getElementById('departureTime').value,
            arrivalTime: document.getElementById('arrivalTime').value,
            totalSeats: document.getElementById('totalSeats').value,
            price: document.getElementById('price').value
        };

        try {
            const response = await fetch('http://localhost:5000/api/admin/trains/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Auth.isLoggedIn()}`
                },
                body: JSON.stringify(trainData)
            });

            const data = await response.json();
            if (data.success) {
                showAlert('Train added successfully', 'success');
                loadAdminDashboard();
            }
        } catch (error) {
            showAlert('Error adding train', 'error');
        }
    });

    // Price Management
    document.getElementById('updatePriceForm')?.addEventListener('submit', async function(e) {
        e.preventDefault();
        const priceData = {
            trainId: document.getElementById('trainSelect').value,
            newPrice: document.getElementById('newPrice').value,
            effectiveDate: document.getElementById('effectiveDate').value
        };

        try {
            const response = await fetch('http://localhost:5000/api/admin/prices/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Auth.isLoggedIn()}`
                },
                body: JSON.stringify(priceData)
            });

            const data = await response.json();
            if (data.success) {
                showAlert('Price updated successfully', 'success');
                loadAdminDashboard();
            }
        } catch (error) {
            showAlert('Error updating price', 'error');
        }
    });

    // Analytics Chart
    function loadRevenueChart() {
        const ctx = document.getElementById('revenueChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Monthly Revenue',
                    data: [12000, 19000, 15000, 25000, 22000, 30000],
                    borderColor: '#4CAF50',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function showAlert(message, type) {
        const alertDiv = document.getElementById('alertMessage');
        if (alertDiv) {
            alertDiv.textContent = message;
            alertDiv.className = `alert ${type}`;
            alertDiv.style.display = 'block';
            setTimeout(() => {
                alertDiv.style.display = 'none';
            }, 3000);
        }
    }
}); 