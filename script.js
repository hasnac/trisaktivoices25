// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeScrollEffects();
    initializeImageModal();
    initializeRegistrationForm();
    initializeAnimations();
    initializeScrollToTop();
});

// Navigation functionality
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('nav-open');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('nav-open');
        }
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Close mobile menu after clicking
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('nav-open');

                // Update active link
                updateActiveNavLink(targetId);
            }
        });
    });

    // Update active navigation link based on scroll position
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        if (current) {
            updateActiveNavLink('#' + current);
        }
    });

    function updateActiveNavLink(targetId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === targetId) {
                link.classList.add('active');
            }
        });
    }
}

// Scroll effects and animations
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const elementsToObserve = document.querySelectorAll(
        '.activity-card, .award-item, .vision, .mission, .requirement-item, .timeline-item'
    );
    
    elementsToObserve.forEach(element => {
        observer.observe(element);
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-visual');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Image modal functionality
function initializeImageModal() {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const closeModal = document.getElementById('closeModal');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const imageCounter = document.getElementById('imageCounter');
    
    let currentImages = [];
    let currentIndex = 0;

    // Add click listeners to all gallery images
    const galleryImages = document.querySelectorAll('.activity-gallery img, .award-image');
    galleryImages.forEach((img, index) => {
        img.addEventListener('click', function() {
            openModal(this);
        });
    });

    function openModal(clickedImage) {
        const parentCard = clickedImage.closest('.activity-card') || clickedImage.closest('.award-content');
        if (parentCard) {
            currentImages = Array.from(parentCard.querySelectorAll('.activity-gallery img, .award-image'));
        } else {
            currentImages = [clickedImage];
        }
        
        currentIndex = currentImages.indexOf(clickedImage);
        showImage(currentIndex);
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function showImage(index) {
        if (currentImages.length === 0) return;
        
        modalImage.src = currentImages[index].src;
        modalImage.alt = currentImages[index].alt;
        updateCounter();
        
        // Show/hide navigation buttons
        prevBtn.style.display = currentImages.length > 1 ? 'block' : 'none';
        nextBtn.style.display = currentImages.length > 1 ? 'block' : 'none';
    }

    function updateCounter() {
        if (currentImages.length > 1) {
            imageCounter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
            imageCounter.style.display = 'block';
        } else {
            imageCounter.style.display = 'none';
        }
    }

    function closeModalFunc() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        currentImages = [];
        currentIndex = 0;
    }

    // Event listeners for modal controls
    closeModal.addEventListener('click', closeModalFunc);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModalFunc();
        }
    });

    prevBtn.addEventListener('click', function() {
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        showImage(currentIndex);
    });

    nextBtn.addEventListener('click', function() {
        currentIndex = (currentIndex + 1) % currentImages.length;
        showImage(currentIndex);
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (modal.style.display === 'block') {
            switch(e.key) {
                case 'Escape':
                    closeModalFunc();
                    break;
                case 'ArrowLeft':
                    if (currentImages.length > 1) {
                        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
                        showImage(currentIndex);
                    }
                    break;
                case 'ArrowRight':
                    if (currentImages.length > 1) {
                        currentIndex = (currentIndex + 1) % currentImages.length;
                        showImage(currentIndex);
                    }
                    break;
            }
        }
    });
}

// Registration form functionality
function initializeRegistrationForm() {
    const form = document.getElementById('registrationForm');
    
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
        }
    });

    function validateForm() {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        // Remove existing error messages
        const existingErrors = form.querySelectorAll('.error-message');
        existingErrors.forEach(error => error.remove());
        
        requiredFields.forEach(field => {
            field.classList.remove('error');
            
            if (!field.value.trim()) {
                showFieldError(field, 'Field ini wajib diisi');
                isValid = false;
            } else {
                // Specific validation for different field types
                if (field.type === 'email' && !isValidEmail(field.value)) {
                    showFieldError(field, 'Format email tidak valid');
                    isValid = false;
                }
                
                if (field.name === 'phone' && !isValidPhone(field.value)) {
                    showFieldError(field, 'Format nomor telepon tidak valid');
                    isValid = false;
                }
                
                if (field.name === 'studentId' && !isValidStudentId(field.value)) {
                    showFieldError(field, 'Format NIM tidak valid');
                    isValid = false;
                }
            }
        });

        return isValid;
    }

    function showFieldError(field, message) {
        field.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = '#ef4444';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        
        field.parentNode.appendChild(errorDiv);
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
        return phoneRegex.test(phone.replace(/[\s-]/g, ''));
    }

    function isValidStudentId(studentId) {
        // Assuming student ID should be numeric and 8-10 digits
        const studentIdRegex = /^[0-9]{8,10}$/;
        return studentIdRegex.test(studentId);
    }

    function submitForm() {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="loading"></span> Mengirim...';
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // Log form data (remove in production)
            console.log('Form data:', data);
            
            // Show success message
            showMessage('success', 'Pendaftaran berhasil dikirim! Kami akan segera menghubungi Anda.');
            
            // Reset form
            form.reset();
            
            // Reset button
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            
        }, 2000);
    }

    function showMessage(type, message) {
        // Remove existing messages
        const existingMessages = form.querySelectorAll('.success-message, .error-message');
        existingMessages.forEach(msg => msg.remove());
        
        const messageDiv = document.createElement('div');
        messageDiv.className = type === 'success' ? 'success-message show' : 'error-message show';
        messageDiv.textContent = message;
        
        form.appendChild(messageDiv);
        
        // Auto-hide message after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    // Add input event listeners for real-time validation feedback
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.classList.add('error');
            } else {
                this.classList.remove('error');
                // Remove field error if exists
                const fieldError = this.parentNode.querySelector('.field-error');
                if (fieldError) {
                    fieldError.remove();
                }
            }
        });
        
        input.addEventListener('input', function() {
            this.classList.remove('error');
            // Remove field error if exists
            const fieldError = this.parentNode.querySelector('.field-error');
            if (fieldError) {
                fieldError.remove();
            }
        });
    });
}

// Animation initialization
function initializeAnimations() {
    // Add entrance animations to elements
    const animatedElements = document.querySelectorAll(
        '.hero-text, .hero-visual, .section-header, .about-text'
    );
    
    // Add staggered animation to activity cards
    const activityCards = document.querySelectorAll('.activity-card');
    activityCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll(
        '.btn, .activity-card, .award-content, .delegate-card'
    );
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Typing animation for hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        
        // Start typing animation after page load
        setTimeout(typeWriter, 500);
    }
}

// Scroll to top functionality
function initializeScrollToTop() {
    // Create scroll to top button
    const scrollButton = document.createElement('button');
    scrollButton.className = 'scroll-to-top';
    scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollButton.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollButton);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollButton.classList.add('show');
        } else {
            scrollButton.classList.remove('show');
        }
    });
    
    // Scroll to top when button is clicked
    scrollButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    return function (...args) {
        const currentTime = Date.now();
        
        if (currentTime - lastExecTime > delay) {
            func.apply(this, args);
            lastExecTime = currentTime;
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
                lastExecTime = Date.now();
            }, delay - (currentTime - lastExecTime));
        }
    };
}

// Performance optimization
function optimizePerformance() {
    // Lazy load images
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Optimize scroll events
    const optimizedScrollHandler = throttle(() => {
        // Handle scroll events here
        updateScrollProgress();
    }, 16); // ~60fps
    
    window.addEventListener('scroll', optimizedScrollHandler);
}

// Scroll progress indicator
function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    // Update progress bar if exists
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
        progressBar.style.width = scrollPercent + '%';
    }
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // You can add error reporting here
});

// Initialize performance optimizations when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    optimizePerformance();
});

// Service Worker registration (for PWA support)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeNavigation,
        initializeScrollEffects,
        initializeImageModal,
        initializeRegistrationForm,
        initializeAnimations,
        debounce,
        throttle
    };
}