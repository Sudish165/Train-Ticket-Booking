document.addEventListener('DOMContentLoaded', function() {
    if (!Auth.requireAuth(['client'])) return;

    loadClientDashboard();
    setupEventListeners();

    async function loadClientDashboard() {
        try {
            // Fetch user's booking history
            const bookings = await fetchBookingHistory();
            displayBookingHistory(bookings);

            // Fetch available trains
            const trains = await fetchAvailableTrains();
            displayAvailableTrains(trains);
        } catch (error) {
            showAlert('Error loading dashboard', 'error');
        }
    }

    async function fetchBookingHistory() {
        const response = await fetch('http://localhost:5000/api/client/bookings', {
            headers: {
                'Authorization': `Bearer ${Auth.isLoggedIn()}`
            }
        });
        return await response.json();
    }

    function displayBookingHistory(bookings) {
        const historyContainer = document.getElementById('bookingHistory');
        historyContainer.innerHTML = bookings.map(booking => `
            <div class="booking-card">
                <div class="booking-details">
                    <h3>Booking #${booking.id}</h3>
                    <p>Train: ${booking.trainName}</p>
                    <p>Date: ${booking.date}</p>
                    <p>Status: ${booking.status}</p>
                </div>
                <div class="booking-actions">
                    ${booking.status === 'confirmed' ? 
                        `<button onclick="cancelBooking('${booking.id}')" class="btn-cancel">
                            Cancel Booking
                        </button>` : ''
                    }
                    <button onclick="viewTicket('${booking.id}')" class="btn-view">
                        View Ticket
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Handle booking cancellation
    window.cancelBooking = async function(bookingId) {
        if (confirm('Are you sure you want to cancel this booking?')) {
            try {
                const response = await fetch(`http://localhost:5000/api/client/bookings/${bookingId}/cancel`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${Auth.isLoggedIn()}`
                    }
                });

                const data = await response.json();
                if (data.success) {
                    showAlert('Booking cancelled successfully', 'success');
                    loadClientDashboard();
                }
            } catch (error) {
                showAlert('Error cancelling booking', 'error');
            }
        }
    };

    // Handle ticket viewing
    window.viewTicket = function(bookingId) {
        window.location.href = `ticket.html?id=${bookingId}`;
    };

    function setupEventListeners() {
        // Search form handler
        document.getElementById('searchForm')?.addEventListener('submit', async function(e) {
            e.preventDefault();
            const searchData = {
                from: document.getElementById('fromStation').value,
                to: document.getElementById('toStation').value,
                date: document.getElementById('travelDate').value
            };

            try {
                const trains = await searchTrains(searchData);
                displaySearchResults(trains);
            } catch (error) {
                showAlert('Error searching trains', 'error');
            }
        });
    }
}); 