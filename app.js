// Wedding Invitation JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initCountdown();
    initSmoothScrolling();
    initSectionAnimations();
    initFallingPetals();
    initRSVPForm();
    initCopyToClipboard();
    initSocialSharing();
});

// Countdown Timer
function initCountdown() {
    const weddingDate = new Date('2025-08-23T14:00:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = weddingDate - now;
        
        if (timeLeft > 0) {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            document.getElementById('days').textContent = days.toString().padStart(3, '0');
            document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        } else {
            document.getElementById('days').textContent = '000';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
        }
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Smooth Scrolling Navigation
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navHeight = 80; // Account for fixed navigation
                const targetPosition = targetSection.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update navigation active state
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            const activeLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);
            if (activeLink) activeLink.classList.add('active');
        }
    });
}

// Section Animations with Intersection Observer
function initSectionAnimations() {
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Falling Petals Animation
function initFallingPetals() {
    const petalsContainer = document.querySelector('.petals-container');
    const petalColors = ['rgba(255, 182, 193, 0.6)', 'rgba(255, 192, 203, 0.5)', 'rgba(255, 218, 224, 0.4)'];
    
    function createPetal() {
        const petal = document.createElement('div');
        petal.className = 'petal';
        petal.style.left = Math.random() * 100 + '%';
        petal.style.backgroundColor = petalColors[Math.floor(Math.random() * petalColors.length)];
        petal.style.animationDuration = (Math.random() * 3 + 2) + 's';
        petal.style.animationDelay = Math.random() * 2 + 's';
        
        petalsContainer.appendChild(petal);
        
        // Remove petal after animation
        setTimeout(() => {
            if (petal.parentNode) {
                petal.parentNode.removeChild(petal);
            }
        }, 5000);
    }
    
    // Create petals periodically
    setInterval(createPetal, 300);
    
    // Create initial petals
    for (let i = 0; i < 5; i++) {
        setTimeout(createPetal, i * 200);
    }
}

// RSVP Form Handling
function initRSVPForm() {
    const form = document.getElementById('rsvpForm');
    const formSuccess = document.getElementById('formSuccess');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        
        btnText.classList.add('hidden');
        btnLoader.classList.remove('hidden');
        submitBtn.disabled = true;
        
        // Validate form
        if (validateForm(form)) {
            // Simulate form submission
            setTimeout(() => {
                // Hide form and show success message
                form.style.display = 'none';
                formSuccess.classList.remove('hidden');
                
                // Scroll to success message
                formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 2000);
        } else {
            // Reset button state if validation fails
            setTimeout(() => {
                btnText.classList.remove('hidden');
                btnLoader.classList.add('hidden');
                submitBtn.disabled = false;
            }, 1000);
        }
    });
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, '필수 항목입니다.');
            isValid = false;
        } else {
            clearFieldError(field);
        }
    });
    
    // Email validation
    const emailField = form.querySelector('#email');
    if (emailField.value && !isValidEmail(emailField.value)) {
        showFieldError(emailField, '올바른 이메일 주소를 입력해주세요.');
        isValid = false;
    }
    
    // Phone validation
    const phoneField = form.querySelector('#phone');
    if (phoneField.value && !isValidPhone(phoneField.value)) {
        showFieldError(phoneField, '올바른 전화번호를 입력해주세요.');
        isValid = false;
    }
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = 'var(--color-error)';
    errorDiv.style.fontSize = 'var(--font-size-sm)';
    errorDiv.style.marginTop = 'var(--space-4)';
    errorDiv.textContent = message;
    
    field.style.borderColor = 'var(--color-error)';
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.style.borderColor = '';
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^01[0-9]-?[0-9]{4}-?[0-9]{4}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Copy to Clipboard Functionality
function initCopyToClipboard() {
    const copyButtons = document.querySelectorAll('.btn-copy');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const accountNumber = this.getAttribute('data-account');
            
            navigator.clipboard.writeText(accountNumber).then(() => {
                showCopySuccess(this);
            }).catch(() => {
                // Fallback for older browsers
                fallbackCopy(accountNumber);
                showCopySuccess(this);
            });
        });
    });
}

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

function showCopySuccess(button) {
    const originalText = button.textContent;
    button.textContent = '복사됨!';
    button.style.background = 'var(--color-success)';
    button.style.color = 'var(--color-btn-primary-text)';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
        button.style.color = '';
    }, 2000);
}

// Social Sharing
function initSocialSharing() {
    const shareButtons = document.querySelectorAll('.share-btn');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const platform = this.getAttribute('data-platform');
            const url = window.location.href;
            const title = '김예은 ♥ 박민준 결혼식에 초대합니다';
            const description = '2025년 8월 23일 토요일 오후 2시 그랜드 하얏트 서울에서 열리는 저희 결혼식에 참석해 주세요.';
            
            switch(platform) {
                case 'kakao':
                    shareKakao(url, title, description);
                    break;
                case 'facebook':
                    shareFacebook(url);
                    break;
                case 'link':
                    copyLink(url);
                    break;
            }
        });
    });
}

function shareKakao(url, title, description) {
    // This would normally use Kakao SDK
    // For demo purposes, we'll show an alert
    alert('카카오톡 공유 기능은 실제 도메인에서 카카오 SDK를 연동한 후 사용 가능합니다.');
}

function shareFacebook(url) {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
}

function copyLink(url) {
    navigator.clipboard.writeText(url).then(() => {
        alert('링크가 클립보드에 복사되었습니다!');
    }).catch(() => {
        // Fallback
        fallbackCopy(url);
        alert('링크가 클립보드에 복사되었습니다!');
    });
}

// Gallery Lightbox (Simple Implementation)
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            // In a real implementation, this would open a lightbox
            // For now, it's just a placeholder
            console.log(`Opening gallery item ${index + 1}`);
        });
    });
}

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.nav-bar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = 'var(--shadow-sm)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Utility function to add entrance animations to elements
function animateOnScroll() {
    const elements = document.querySelectorAll('.detail-card, .gallery-item, .account-card, .contact-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(element);
    });
}

// Initialize additional animations
document.addEventListener('DOMContentLoaded', function() {
    animateOnScroll();
    initGallery();
});

// Mobile menu handling (if needed)
function initMobileMenu() {
    // This would handle mobile menu toggle if we had a hamburger menu
    // For now, the navigation wraps on mobile
}

// Form field focus effects
document.addEventListener('DOMContentLoaded', function() {
    const formFields = document.querySelectorAll('.form-control');
    
    formFields.forEach(field => {
        field.addEventListener('focus', function() {
            this.parentNode.classList.add('field-focused');
        });
        
        field.addEventListener('blur', function() {
            this.parentNode.classList.remove('field-focused');
        });
    });
});

// Add loading states for better UX
function showLoading(element) {
    element.style.opacity = '0.7';
    element.style.pointerEvents = 'none';
}

function hideLoading(element) {
    element.style.opacity = '1';
    element.style.pointerEvents = 'auto';
}

// Error handling for async operations
function handleError(error, userMessage = '오류가 발생했습니다. 다시 시도해 주세요.') {
    console.error('Error:', error);
    alert(userMessage);
}

// Initialize all animations and interactions
document.addEventListener('DOMContentLoaded', function() {
    // Add a small delay to ensure all elements are loaded
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});