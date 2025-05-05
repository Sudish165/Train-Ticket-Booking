document.addEventListener('DOMContentLoaded', function() {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            navbar.classList.remove('navbar-scrolled');
            return;
        }

        if (currentScroll > lastScroll && !navbar.classList.contains('navbar-scrolled')) {
            // Scroll down
            navbar.classList.add('navbar-scrolled');
        } else if (currentScroll < lastScroll && navbar.classList.contains('navbar-scrolled')) {
            // Scroll up
            navbar.classList.remove('navbar-scrolled');
        }

        lastScroll = currentScroll;
    });

    // Add active class to current nav item
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}); 