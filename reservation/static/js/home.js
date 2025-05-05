document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', 
                navToggle.getAttribute('aria-expanded') === 'false' ? 'true' : 'false'
            );
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Booking Form Validation
    const bookingForm = document.querySelector('.booking-form');
    if (bookingForm) {
        const dateInput = bookingForm.querySelector('input[type="date"]');
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);

        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fromStation = this.querySelector('select[name="from_station"]').value;
            const toStation = this.querySelector('select[name="to_station"]').value;
            const date = dateInput.value;
            const passengers = this.querySelector('select[name="passengers"]').value;

            if (!fromStation || !toStation || !date || !passengers) {
                showAlert('Please fill in all fields', 'error');
                return;
            }

            if (fromStation === toStation) {
                showAlert('Source and destination cannot be the same', 'error');
                return;
            }

            // If validation passes, submit the form
            this.submit();
        });
    }

    // Alert message system
    function showAlert(message, type = 'success') {
        const alertContainer = document.createElement('div');
        alertContainer.className = `alert alert-${type} fade-in`;
        alertContainer.textContent = message;

        const container = document.querySelector('.booking-card');
        container.insertBefore(alertContainer, container.firstChild);

        setTimeout(() => {
            alertContainer.remove();
        }, 5000);
    }

    // Animate elements when they come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.feature-card, .route-card');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('animate');
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
        });
    }
}); 