document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.querySelector('.ticket-booking-form form');
    const alertMessage = document.getElementById('alertMessage');

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') || sessionStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }

    bookingForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const bookingData = {
            departure: document.getElementById('departure').value,
            destination: document.getElementById('destination').value,
            date: document.getElementById('date').value,
            seats: document.getElementById('seats').value
        };

        // Validate form data
        if (!validateBookingData(bookingData)) {
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/bookings/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData)
            });

            const data = await response.json();
            
            if (data.success) {
                showAlert('Booking successful! Redirecting to payment...', 'success');
                setTimeout(() => {
                    window.location.href = `payment.html?bookingId=${data.bookingId}`;
                }, 2000);
            } else {
                showAlert(data.message || 'Booking failed. Please try again.', 'error');
            }
        } catch (error) {
            showAlert('Error processing booking. Please try again.', 'error');
        }
    });

    function validateBookingData(data) {
        if (!data.departure || !data.destination) {
            showAlert('Please select departure and destination stations', 'error');
            return false;
        }

        if (!data.date) {
            showAlert('Please select a travel date', 'error');
            return false;
        }

        if (!data.seats || data.seats < 1) {
            showAlert('Please select at least one seat', 'error');
            return false;
        }

        // Validate date is not in the past
        const selectedDate = new Date(data.date);
        const today = new Date();
        if (selectedDate < today) {
            showAlert('Please select a future date', 'error');
            return false;
        }

        return true;
    }

    function showAlert(message, type) {
        alertMessage.textContent = message;
        alertMessage.className = `alert ${type}`;
        alertMessage.style.display = 'block';
        setTimeout(() => {
            alertMessage.style.display = 'none';
        }, 3000);
    }

    // Set minimum date for date input to today
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}); 