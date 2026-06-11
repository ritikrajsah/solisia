/*
   Solisia - Client-side Interactions
   Fidelity: 1:1 Responsive Behavior & Dynamic Animations
*/

const FORM_ENDPOINT = 'https://api.web3forms.com/submit';

document.addEventListener('DOMContentLoaded', () => {
    loadComponents();
});

async function loadComponents() {
    // 1. Fetch and inject Header
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        try {
            const response = await fetch('header.html');
            if (response.ok) {
                const html = await response.text();
                // Replace placeholder node with the header element
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html.trim();
                const parent = headerPlaceholder.parentNode;
                while (tempDiv.firstChild) {
                    parent.insertBefore(tempDiv.firstChild, headerPlaceholder);
                }
                parent.removeChild(headerPlaceholder);
            }
        } catch (err) {
            console.error('Error loading header:', err);
        }
    }

    // 2. Fetch and inject Footer
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        try {
            const response = await fetch('footer.html');
            if (response.ok) {
                const html = await response.text();
                // Replace placeholder node with the footer element
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html.trim();
                const parent = footerPlaceholder.parentNode;
                while (tempDiv.firstChild) {
                    parent.insertBefore(tempDiv.firstChild, footerPlaceholder);
                }
                parent.removeChild(footerPlaceholder);
            }
        } catch (err) {
            console.error('Error loading footer:', err);
        }
    }

    // 3. Initialize interactive features
    initializeInteractions();
}

function initializeInteractions() {
    // 1. Floating Header Scroll Effect
    const header = document.querySelector('header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check
    }

    // 2. Responsive Mobile Navigation Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    const closeNavBtn = document.getElementById('close-nav');

    const closeNavMenu = () => {
        if (mobileNavOverlay) {
            mobileNavOverlay.classList.remove('open');
            document.body.style.overflow = ''; // Restore scrolling
        }
    };

    if (menuToggle && mobileNavOverlay) {
        menuToggle.addEventListener('click', () => {
            mobileNavOverlay.classList.add('open');
            document.body.style.overflow = 'hidden'; // Stop background scrolling
        });
    }

    if (closeNavBtn) {
        closeNavBtn.addEventListener('click', closeNavMenu);
    }

    // Close mobile menu when links are clicked
    const mobileLinks = document.querySelectorAll('.mobile-nav-overlay a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeNavMenu);
    });

    // 3. Active Nav Link Tracking based on current Path
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.desktop-nav a, .mobile-nav-overlay a, .footer-links a');
    
    navLinks.forEach(link => {
        const hrefAttr = link.getAttribute('href');
        const pathName = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';
        const linkName = hrefAttr.substring(hrefAttr.lastIndexOf('/') + 1) || 'index.html';
        
        if (pathName === linkName) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // 4. Scroll Reveal Animations (fade-in-up)
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.85;
        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            if (elTop < triggerBottom) {
                el.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger once on load

    // 5. Subscription Newsletter Handling
    const subscribeForm = document.getElementById('subscribe-form');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = subscribeForm.querySelector('.input-email');
            const checkbox = subscribeForm.querySelector('input[type="checkbox"]');
            
            if (!emailInput.value.trim()) {
                alert('Please enter a valid email address.');
                return;
            }

            if (checkbox && !checkbox.checked) {
                alert('Please check the box to agree to updates.');
                return;
            }

            // Simulate subscribe response
            showToast("Thank you for subscribing to Solisia's mindful updates!");
            subscribeForm.reset();
        });
    }

    // 5.1. Contact Booking Form Handling
    const contactForm = document.getElementById('contact-booking-form');
    if (contactForm) {
        const nameInput = document.getElementById('contact-name');
        const phoneInput = document.getElementById('contact-phone');
        const emailInput = document.getElementById('contact-email');
        const supportSelect = document.getElementById('contact-support');
        const messageTextarea = document.getElementById('contact-message');
        
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent standard page reloads or redirects
            
            let isValid = true;
            
            // Reset error messages and invalid classes
            document.querySelectorAll('.error-message').forEach(el => {
                el.textContent = '';
                el.classList.remove('show');
            });
            document.querySelectorAll('.form-field').forEach(el => {
                el.classList.remove('invalid');
            });
            
            // Validate Name
            if (!nameInput.value.trim()) {
                showError('name-error', 'Full Name is required');
                nameInput.closest('.form-field').classList.add('invalid');
                isValid = false;
            }
            
            // Validate Phone
            if (!phoneInput.value.trim()) {
                showError('phone-error', 'Phone Number is required');
                phoneInput.closest('.form-field').classList.add('invalid');
                isValid = false;
            } else if (!/^\+?[\d\s-()]{7,20}$/.test(phoneInput.value.trim())) {
                showError('phone-error', 'Please enter a valid phone number');
                phoneInput.closest('.form-field').classList.add('invalid');
                isValid = false;
            }
            
            // Validate Email
            const emailVal = emailInput.value.trim();
            if (!emailVal) {
                showError('email-error', 'Email Address is required');
                emailInput.closest('.form-field').classList.add('invalid');
                isValid = false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
                showError('email-error', 'Please enter a valid email address');
                emailInput.closest('.form-field').classList.add('invalid');
                isValid = false;
            }

            // Support Type and Message are optional fields (no validation check required)
            
            if (isValid) {
                const submitButton = contactForm.querySelector('.btn-submit-booking');
                const originalButtonText = submitButton.textContent;
                
                // Disable button and show sending state
                submitButton.disabled = true;
                submitButton.textContent = 'Sending...';

                const formData = new FormData(contactForm);
                const data = {};
                formData.forEach((value, key) => {
                    data[key] = value;
                });

                if (FORM_ENDPOINT) {
                    fetch(FORM_ENDPOINT, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify(data)
                    })
                    .then(response => {
                        submitButton.disabled = false;
                        submitButton.textContent = originalButtonText;
                        if (response.ok) {
                            // Clear form fields
                            contactForm.reset();
                            
                            // Hide validation error states (if any are still visible)
                            document.querySelectorAll('.error-message').forEach(el => {
                                el.textContent = '';
                                el.classList.remove('show');
                            });
                            document.querySelectorAll('.form-field').forEach(el => {
                                el.classList.remove('invalid');
                            });

                            // Smoothly hide form and show success state
                            contactForm.style.transition = 'opacity 0.3s ease';
                            contactForm.style.opacity = '0';
                            
                            setTimeout(() => {
                                contactForm.style.display = 'none';
                                const successState = document.getElementById('contact-success-state');
                                if (successState) {
                                    successState.style.display = 'flex';
                                    // Trigger reflow to start fade-in animation
                                    successState.offsetHeight;
                                    successState.classList.add('show');
                                }
                            }, 300);
                        } else {
                            throw new Error('Form submission failed');
                        }
                    })
                    .catch(error => {
                        submitButton.disabled = false;
                        submitButton.textContent = originalButtonText;
                        console.error('Submission Error:', error);
                        showToast("Oops, there was an error submitting your request. Please try again.");
                    });
                } else {
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                    console.log('Mock Form Submission Success (No Endpoint Configured):', data);
                    
                    // Clear form fields
                    contactForm.reset();
                    
                    // Hide validation error states
                    document.querySelectorAll('.error-message').forEach(el => {
                        el.textContent = '';
                        el.classList.remove('show');
                    });
                    document.querySelectorAll('.form-field').forEach(el => {
                        el.classList.remove('invalid');
                    });

                    // Smoothly hide form and show success state
                    contactForm.style.transition = 'opacity 0.3s ease';
                    contactForm.style.opacity = '0';
                    
                    setTimeout(() => {
                        contactForm.style.display = 'none';
                        const successState = document.getElementById('contact-success-state');
                        if (successState) {
                            successState.style.display = 'flex';
                            successState.offsetHeight;
                            successState.classList.add('show');
                        }
                    }, 300);
                }
            }
        });
        
        function showError(id, message) {
            const errorEl = document.getElementById(id);
            if (errorEl) {
                errorEl.textContent = message;
                errorEl.classList.add('show');
            }
        }

        // Add input/change listeners to clear errors on typing or selection
        const fieldsToValidate = [
            { element: nameInput, event: 'input' },
            { element: phoneInput, event: 'input' },
            { element: emailInput, event: 'input' }
        ];

        fieldsToValidate.forEach(({ element, event }) => {
            if (element) {
                element.addEventListener(event, () => {
                    const field = element.closest('.form-field');
                    if (field && field.classList.contains('invalid')) {
                        field.classList.remove('invalid');
                        const errSpan = field.querySelector('.error-message');
                        if (errSpan) {
                            errSpan.textContent = '';
                            errSpan.classList.remove('show');
                        }
                    }
                });
            }
        });
    }
}

// 6. Toast Notification Helper
const showToast = (message) => {
    let toastEl = document.getElementById('toast-notification');
    if (!toastEl) {
        toastEl = document.createElement('div');
        toastEl.id = 'toast-notification';
        toastEl.className = 'toast';
        document.body.appendChild(toastEl);
    }
    
    toastEl.textContent = message;
    toastEl.classList.add('show');
    
    setTimeout(() => {
        toastEl.classList.remove('show');
    }, 4000);
};
