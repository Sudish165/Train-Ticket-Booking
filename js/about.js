document.addEventListener('DOMContentLoaded', function() {
    // Animation on scroll functionality
    function animateOnScroll() {
        const fadeElements = document.querySelectorAll('.fade-in');
        const slideLeftElements = document.querySelectorAll('.slide-in-left');
        const slideRightElements = document.querySelectorAll('.slide-in-right');
        
        const triggerBottom = window.innerHeight * 0.8;
        
        // Handle fade-in animations
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < triggerBottom) {
                element.classList.add('active');
            }
        });
        
        // Handle slide-in-left animations
        slideLeftElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < triggerBottom) {
                element.classList.add('active');
            }
        });
        
        // Handle slide-in-right animations
        slideRightElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < triggerBottom) {
                element.classList.add('active');
            }
        });
        
        // Handle count-up animations
        const countElements = document.querySelectorAll('.count-up .stat-number');
        countElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < triggerBottom && !element.classList.contains('counted')) {
                countUp(element);
                element.classList.add('counted');
            }
        });
    }
    
    // Count up animation function
    function countUp(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // For 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            element.textContent = Math.floor(current);
            
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 16);
    }
    
    // Team slider functionality
    function initTeamSlider() {
        const teamMembers = document.querySelectorAll('.team-member');
        const prevBtn = document.getElementById('team-prev');
        const nextBtn = document.getElementById('team-next');
        
        if (!teamMembers.length || !prevBtn || !nextBtn) return;
        
        let currentIndex = 0;
        
        // Hide all team members except the first one
        teamMembers.forEach((member, index) => {
            if (index !== 0) {
                member.style.display = 'none';
            }
        });
        
        // Previous button click
        prevBtn.addEventListener('click', () => {
            teamMembers[currentIndex].style.display = 'none';
            currentIndex = (currentIndex - 1 + teamMembers.length) % teamMembers.length;
            teamMembers[currentIndex].style.display = 'flex';
        });
        
        // Next button click
        nextBtn.addEventListener('click', () => {
            teamMembers[currentIndex].style.display = 'none';
            currentIndex = (currentIndex + 1) % teamMembers.length;
            teamMembers[currentIndex].style.display = 'flex';
        });
    }
    
    // Testimonial slider functionality
    function initTestimonialSlider() {
        const testimonials = document.querySelectorAll('.testimonial');
        const prevBtn = document.getElementById('testimonial-prev');
        const nextBtn = document.getElementById('testimonial-next');
        
        if (!testimonials.length || !prevBtn || !nextBtn) return;
        
        let currentIndex = 0;
        
        // Hide all testimonials except the first one
        testimonials.forEach((testimonial, index) => {
            if (index !== 0) {
                testimonial.style.display = 'none';
            }
        });
        
        // Previous button click
        prevBtn.addEventListener('click', () => {
            testimonials[currentIndex].style.display = 'none';
            currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
            testimonials[currentIndex].style.display = 'block';
        });
        
        // Next button click
        nextBtn.addEventListener('click', () => {
            testimonials[currentIndex].style.display = 'none';
            currentIndex = (currentIndex + 1) % testimonials.length;
            testimonials[currentIndex].style.display = 'block';
        });
    }
    
    // Mobile menu toggle
    function initMobileMenu() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (!navToggle || !navMenu) return;
        
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Initialize all functions
    animateOnScroll();
    initTeamSlider();
    initTestimonialSlider();
    initMobileMenu();
    
    // Add scroll event listener for animations
    window.addEventListener('scroll', animateOnScroll);
});