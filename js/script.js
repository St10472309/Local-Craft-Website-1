document.addEventListener('DOMContentLoaded', function() {
    console.log('Local Craft Website Loaded');
    
    // Initialize all functionality
    initMobileNavigation();
    initFormValidation();
    initGalleryFilter();
    initGallerySearch();
    initLightbox();
    initFAQAccordion();
    initSmoothScrolling();
    initInteractiveMap();
    initAnimations();
    
    
    highlightActiveNav();
    
    window.addEventListener('hashchange', highlightActiveNav);
});

// 1. MOBILE NAVIGATION
function initMobileNavigation() {
    const toggle = document.querySelector('.mobile-nav-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (toggle && mobileNav) {
        toggle.addEventListener('click', function() {
            mobileNav.classList.toggle('active');
            toggle.textContent = mobileNav.classList.contains('active') ? '✕' : '☰';
            toggle.setAttribute('aria-expanded', mobileNav.classList.contains('active'));
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.nav-content') && mobileNav.classList.contains('active')) {
                mobileNav.classList.remove('active');
                toggle.textContent = '☰';
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

// 2. FORM VALIDATION
function initFormValidation() {
    const enquiryForm = document.getElementById('projectEnquiryForm');
    const contactForm = document.getElementById('contactForm');
    
    if (enquiryForm) validateEnquiryForm(enquiryForm);
    if (contactForm) validateContactForm(contactForm);
}

function validateEnquiryForm(form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        clearErrors();
        
        let isValid = true;
        const fields = [
            { id: 'name', message: 'Please enter your full name' },
            { id: 'email', message: 'Please enter a valid email address', validate: validateEmail },
            { id: 'service', message: 'Please select a service' },
            { id: 'message', message: 'Please describe your project (min. 10 characters)', validate: validateMinLength(10) }
        ];
        
        fields.forEach(field => {
            const element = document.getElementById(field.id);
            if (!element) return;
            
            if (!element.value.trim()) {
                showError(element, field.message);
                isValid = false;
            } else if (field.validate && !field.validate(element.value)) {
                showError(element, field.message);
                isValid = false;
            }
        });
        
        if (isValid) {
            showSuccess('Thank you! Your enquiry has been submitted. We\'ll contact you within 24 hours.');
            form.reset();
        }
    });
}

function validateContactForm(form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        clearErrors();
        
        let isValid = true;
        const fields = [
            { id: 'contactName', message: 'Please enter your full name' },
            { id: 'contactEmail', message: 'Please enter a valid email address', validate: validateEmail },
            { id: 'contactSubject', message: 'Please enter a subject' },
            { id: 'contactMessage', message: 'Please enter your message (min. 10 characters)', validate: validateMinLength(10) }
        ];
        
        fields.forEach(field => {
            const element = document.getElementById(field.id);
            if (!element) return;
            
            if (!element.value.trim()) {
                showError(element, field.message);
                isValid = false;
            } else if (field.validate && !field.validate(element.value)) {
                showError(element, field.message);
                isValid = false;
            }
        });
        
        if (isValid) {
            showSuccess('Thank you! Your message has been sent successfully.');
            form.reset();
        }
    });
}

// Validation helpers
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateMinLength(min) {
    return function(value) {
        return value.length >= min;
    };
}

function showError(element, message) {
    element.style.borderColor = 'var(--color-error)';
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = 'color: var(--color-error); font-size: 0.875rem; margin-top: 0.25rem;';
    errorDiv.textContent = message;
    element.parentNode.appendChild(errorDiv);
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(error => error.remove());
    document.querySelectorAll('input, select, textarea').forEach(field => {
        field.style.borderColor = '';
    });
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.cssText = `
        background-color: var(--color-success);
        color: white;
        padding: 1rem;
        border-radius: var(--radius-md);
        margin: 1rem 0;
        text-align: center;
        animation: slideDown 0.3s ease;
    `;
    successDiv.textContent = message;
    
    const form = document.querySelector('form');
    form.parentNode.insertBefore(successDiv, form);
    
    setTimeout(() => {
        successDiv.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => successDiv.remove(), 300);
    }, 5000);
}

// 3. GALLERY FILTERING WITH SEARCH
function initGalleryFilter() {
    const filterButtons = document.querySelectorAll('.filter-button');
    const projects = document.querySelectorAll('.project');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filterProjects(filter);
        });
    });
}

function initGallerySearch() {
    const searchInput = document.getElementById('gallerySearch');
    const searchButton = document.getElementById('searchButton');
    
    if (searchInput && searchButton) {
        const performSearch = () => {
            const searchTerm = searchInput.value.toLowerCase();
            const projects = document.querySelectorAll('.project');
            
            projects.forEach(project => {
                const title = project.querySelector('h3').textContent.toLowerCase();
                const description = project.querySelector('p').textContent.toLowerCase();
                const category = project.getAttribute('data-category');
                
                const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
                const matchesFilter = document.querySelector('.filter-button.active').getAttribute('data-filter');
                const shouldShow = matchesSearch && (matchesFilter === 'all' || category === matchesFilter);
                
                project.style.display = shouldShow ? 'block' : 'none';
                
                if (shouldShow) {
                    project.style.animation = 'fadeIn 0.5s ease';
                }
            });
        };
        
        searchInput.addEventListener('input', performSearch);
        searchButton.addEventListener('click', performSearch);
    }
}

function filterProjects(filter) {
    const projects = document.querySelectorAll('.project');
    const searchTerm = document.getElementById('gallerySearch')?.value.toLowerCase() || '';
    
    projects.forEach(project => {
        const title = project.querySelector('h3').textContent.toLowerCase();
        const description = project.querySelector('p').textContent.toLowerCase();
        const category = project.getAttribute('data-category');
        
        const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
        const matchesFilter = filter === 'all' || category === filter;
        const shouldShow = matchesSearch && matchesFilter;
        
        if (shouldShow) {
            project.style.display = 'block';
            setTimeout(() => {
                project.style.opacity = '1';
                project.style.transform = 'scale(1)';
            }, 100);
        } else {
            project.style.opacity = '0';
            project.style.transform = 'scale(0.8)';
            setTimeout(() => {
                project.style.display = 'none';
            }, 300);
        }
    });
}

// 4. LIGHTBOX FUNCTIONALITY
function initLightbox() {
    const galleryImages = document.querySelectorAll('.project img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    
    let currentImageIndex = 0;
    const images = Array.from(galleryImages);
    
    galleryImages.forEach((img, index) => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function() {
            currentImageIndex = index;
            openLightbox(this.src, this.alt);
        });
    });
    
    function openLightbox(src, alt) {
        lightbox.style.display = 'block';
        lightboxImg.src = src;
        lightboxCaption.textContent = alt;
        document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    function navigateLightbox(direction) {
        currentImageIndex += direction;
        if (currentImageIndex >= images.length) currentImageIndex = 0;
        if (currentImageIndex < 0) currentImageIndex = images.length - 1;
        
        const img = images[currentImageIndex];
        lightboxImg.src = img.src;
        lightboxCaption.textContent = img.alt;
    }
    
    // Event listeners
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => navigateLightbox(-1));
    nextBtn.addEventListener('click', () => navigateLightbox(1));
    
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) closeLightbox();
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (lightbox.style.display === 'block') {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigateLightbox(-1);
            if (e.key === 'ArrowRight') navigateLightbox(1);
        }
    });
}

// 5. INTERACTIVE MAP
function initInteractiveMap() {
    const mapContainer = document.getElementById('interactiveMap');
    if (!mapContainer) return;
    
    // Using Leaflet.js for interactive map (you'll need to include Leaflet CSS/JS)
    // For now, using Google Maps embed with enhanced styling
    mapContainer.innerHTML = `
        <div class="map-embed">
            <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14319.096431066045!2d28.034041!3d-26.204102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e950c1b6c2d85e1%3A0x33cee2c6f2c18700!2sJohannesburg%2C%20South%20Africa!5e0!3m2!1sen!2sus!4v1641234567890!5m2!1sen!2sus" 
                width="100%" 
                height="400" 
                style="border:0; border-radius: var(--radius-lg);" 
                allowfullscreen="" 
                loading="lazy" 
                referrerpolicy="no-referrer-when-downgrade">
            </iframe>
        </div>
    `;
    
    // Directions button
    const directionsBtn = document.getElementById('getDirections');
    if (directionsBtn) {
        directionsBtn.addEventListener('click', function() {
            window.open('https://www.google.com/maps/dir//123+Woodworking+Street+Craftville+South+Africa', '_blank');
        });
    }
}

// 6. ANIMATIONS & TRANSITIONS
function initAnimations() {
    // Add animation classes to elements
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.service-card, .testimonial-card, .team-member, .project');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = "1";
                element.style.transform = "translateY(0)";
            }
        });
    };
    
    // Set initial state for animated elements
    document.querySelectorAll('.service-card, .testimonial-card, .team-member, .project').forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    });
    
    // Trigger on load and scroll
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
}

// 7. FAQ ACCORDION
function initFAQAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const isActive = this.classList.contains('active');
            const answer = this.nextElementSibling;
            
            // Close all FAQs
            faqQuestions.forEach(q => {
                q.classList.remove('active');
                q.nextElementSibling.style.maxHeight = null;
            });
            
            // Open current if not active
            if (!isActive) {
                this.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });
}

// 8. SMOOTH SCROLLING
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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
}

// 9. ACTIVE NAVIGATION
function highlightActiveNav() {
    // Get current page filename
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Remove active class from all navigation items
    const allNavLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    allNavLinks.forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
    });
    
    // Find and highlight the active link
    allNavLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        
        // Check if this link matches the current page
        if (linkHref === currentPage) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
        
        // Special handling for home page
        if (currentPage === 'index.html' && linkHref === 'index.html') {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
        
        // Handle case when accessing root (no filename)
        if ((currentPage === '' || currentPage === '/') && linkHref === 'index.html') {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
    
    console.log('Navigation updated. Current page:', currentPage);
}