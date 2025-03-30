// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation functionality
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            // Transform hamburger to X
            const bars = hamburger.querySelectorAll('div');
            bars.forEach(bar => bar.classList.toggle('active'));
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navLinks && navLinks.classList.contains('active') && 
            !event.target.closest('.nav-links') && 
            !event.target.closest('.hamburger')) {
            navLinks.classList.remove('active');
            // Reset hamburger appearance
            const bars = hamburger.querySelectorAll('div');
            bars.forEach(bar => bar.classList.remove('active'));
        }
    });

    // Collection slider functionality
    const sliderContainer = document.querySelector('.slider-container');
    const prevButton = document.querySelector('.slider-arrow.prev');
    const nextButton = document.querySelector('.slider-arrow.next');
    
    if (sliderContainer && prevButton && nextButton) {
        const slides = document.querySelectorAll('.slide');
        const slideWidth = slides[0].clientWidth;
        let currentIndex = 0;
        const totalSlides = slides.length;

        // Initialize slider position
        updateSliderPosition();

        // Previous slide button
        prevButton.addEventListener('click', function() {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : totalSlides - 1;
            updateSliderPosition();
        });

        // Next slide button
        nextButton.addEventListener('click', function() {
            currentIndex = (currentIndex < totalSlides - 1) ? currentIndex + 1 : 0;
            updateSliderPosition();
        });

        // Update slider container position
        function updateSliderPosition() {
            sliderContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        // Auto slide every 5 seconds
        let autoSlideInterval = setInterval(function() {
            currentIndex = (currentIndex < totalSlides - 1) ? currentIndex + 1 : 0;
            updateSliderPosition();
        }, 5000);

        // Pause auto sliding when hovering over the slider
        sliderContainer.addEventListener('mouseenter', function() {
            clearInterval(autoSlideInterval);
        });

        // Resume auto sliding when mouse leaves the slider
        sliderContainer.addEventListener('mouseleave', function() {
            autoSlideInterval = setInterval(function() {
                currentIndex = (currentIndex < totalSlides - 1) ? currentIndex + 1 : 0;
                updateSliderPosition();
            }, 5000);
        });

        // Handle window resize for responsive behavior
        window.addEventListener('resize', function() {
            // Recalculate slide width on resize
            updateSliderPosition();
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip if it's just "#" or empty
            if (targetId === '#' || !targetId) return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                window.scrollTo({
                    top: targetElement.offsetTop - 60, // Adjust for fixed nav
                    behavior: 'smooth'
                });
                
                // Close mobile menu after clicking if it's open
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    const bars = hamburger.querySelectorAll('div');
                    bars.forEach(bar => bar.classList.remove('active'));
                }
            }
        });
    });

    // Animation for featured elements on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.feature-card, .step, .pricing-card, .testimonial');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('animated');
            }
        });
    };

    // Add CSS for animation
    const style = document.createElement('style');
    style.textContent = `
        .feature-card, .step, .pricing-card, .testimonial {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .feature-card.animated, .step.animated, .pricing-card.animated, .testimonial.animated {
            opacity: 1;
            transform: translateY(0);
        }
        /* Hamburger animation */
        .hamburger div {
            transition: transform 0.3s ease, opacity 0.3s ease;
        }
        .hamburger div.active:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        .hamburger div.active:nth-child(2) {
            opacity: 0;
        }
        .hamburger div.active:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -7px);
        }
    `;
    document.head.appendChild(style);

    // Run animation check on load and scroll
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on load

    // Form validation for contact form (if exists)
    const contactForm = document.querySelector('form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            let isValid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            // Email validation if email field exists
            const emailField = contactForm.querySelector('input[type="email"]');
            if (emailField && emailField.value) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(emailField.value)) {
                    isValid = false;
                    emailField.classList.add('error');
                }
            }
            
            if (!isValid) {
                e.preventDefault();
                // Show error message
                const errorMsg = document.createElement('p');
                errorMsg.classList.add('form-error');
                errorMsg.textContent = 'Please fill in all required fields correctly.';
                errorMsg.style.color = '#d81b60';
                errorMsg.style.fontWeight = 'bold';
                
                // Remove existing error messages
                const existingError = contactForm.querySelector('.form-error');
                if (existingError) {
                    existingError.remove();
                }
                
                contactForm.prepend(errorMsg);
            }
        });
        
        // Remove error highlight when user starts typing
        contactForm.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('input', function() {
                this.classList.remove('error');
            });
        });
    }

    // Pricing toggle functionality (if exists)
    const pricingToggle = document.querySelector('.pricing-toggle');
    if (pricingToggle) {
        pricingToggle.addEventListener('click', function() {
            const priceElements = document.querySelectorAll('.price');
            const isMonthly = this.classList.toggle('monthly');
            
            priceElements.forEach(element => {
                const currentPrice = parseFloat(element.textContent.replace(/[^0-9.]/g, ''));
                if (isMonthly) {
                    // Convert yearly to monthly
                    element.textContent = '₹' + Math.round(currentPrice / 12).toLocaleString();
                    document.querySelector('.pricing-period').textContent = '/month';
                } else {
                    // Convert monthly to yearly
                    element.textContent = '₹' + Math.round(currentPrice * 12).toLocaleString();
                    document.querySelector('.pricing-period').textContent = '/year';
                }
            });
        });
    }
});


// WhatsApp button animation
const whatsappButton = document.querySelector('.whatsapp-float');
if (whatsappButton) {
    // Stop animation after first loop
    setTimeout(() => {
        whatsappButton.classList.add('animated');
    }, 2000);
    
    // Click event for analytics (optional)
    whatsappButton.addEventListener('click', function() {
        // You can add analytics tracking here
        console.log('WhatsApp button clicked');
    });
}

// Update slider to support touch events
let touchStartX = 0;
let touchEndX = 0;

sliderContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, false);

sliderContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, false);

function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
        // Swipe left - next slide
        currentIndex = (currentIndex < totalSlides - 1) ? currentIndex + 1 : 0;
        updateSliderPosition();
    }
    if (touchEndX > touchStartX + 50) {
        // Swipe right - previous slide
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : totalSlides - 1;
        updateSliderPosition();
    }
}