// ============================================
// MOBILE MENU TOGGLE & NAVIGATION
// ============================================

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// ============================================
// NAVBAR SCROLL EFFECT - SOPHISTICATED
// ============================================

const navbar = document.querySelector('.navbar');
let lastScrollY = 0;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScrollY = currentScrollY;
});

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================

const observerOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Add staggered delay for multiple elements
            setTimeout(() => {
                entry.target.classList.add('fade-in');
            }, index * 50);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements that should animate on scroll
document.querySelectorAll(
    '.project-card, .testimonial-card, .section-title, .section-subtitle'
).forEach((el, index) => {
    el.style.setProperty('--stagger-delay', `${index * 0.05}s`);
    observer.observe(el);
});

// ============================================
// CONTACT FORM VALIDATION & SUBMISSION
// ============================================

const contactForm = document.getElementById('contactForm');
const formFeedback = document.getElementById('formFeedback');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    // Validation
    if (!name) {
        showFormFeedback('Por favor, preencha o seu nome.', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showFormFeedback('Por favor, insira um email válido.', 'error');
        return;
    }

    if (message.length < 10) {
        showFormFeedback('A mensagem deve ter no mínimo 10 caracteres.', 'error');
        return;
    }

    // Simulate form submission
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    // Simulate API call delay
    setTimeout(() => {
        showFormFeedback('✓ Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;

        // Clear feedback after 5 seconds
        setTimeout(() => {
            formFeedback.style.display = 'none';
        }, 5000);
    }, 1000);
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFormFeedback(message, type) {
    formFeedback.textContent = message;
    formFeedback.className = `form-feedback ${type}`;
    formFeedback.style.display = 'block';

    if (type === 'error') {
        setTimeout(() => {
            formFeedback.style.display = 'none';
        }, 4000);
    }
}

// ============================================
// TESTIMONIALS CAROUSEL - ENHANCED
// ============================================

class Carousel {
    constructor() {
        this.carousel = document.getElementById('testimonialsCarousel');
        if (!this.carousel) return;

        this.cards = this.carousel.querySelectorAll('.testimonial-card');
        this.currentIndex = 0;
        this.cardsPerView = this.getCardsPerView();
        this.totalCards = this.cards.length;
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.indicatorsContainer = document.getElementById('indicators');
        this.autoPlayInterval = null;

        this.init();
        this.setupEventListeners();
        this.createIndicators();
    }

    init() {
        this.updateCarousel();
        this.startAutoPlay();
    }

    getCardsPerView() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }

    updateCarousel() {
        this.cards.forEach((card, index) => {
            card.style.display = 'none';
            card.style.animation = 'none';
        });

        // Show current cards with staggered animation
        for (let i = 0; i < this.cardsPerView; i++) {
            const idx = (this.currentIndex + i) % this.totalCards;
            this.cards[idx].style.display = 'block';
            this.cards[idx].style.animation = `fadeInUp 0.4s ease ${i * 0.1}s`;
        }

        this.updateIndicators();
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.totalCards;
        this.updateCarousel();
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.totalCards) % this.totalCards;
        this.updateCarousel();
    }

    createIndicators() {
        if (!this.indicatorsContainer) return;

        for (let i = 0; i < this.totalCards; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'carousel-indicator';
            if (i === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => {
                clearInterval(this.autoPlayInterval);
                this.currentIndex = i;
                this.updateCarousel();
                this.startAutoPlay();
            });
            this.indicatorsContainer.appendChild(indicator);
        }
    }

    updateIndicators() {
        document.querySelectorAll('.carousel-indicator').forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.next();
        }, 6000);
    }

    setupEventListeners() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                clearInterval(this.autoPlayInterval);
                this.prev();
                this.startAutoPlay();
            });
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                clearInterval(this.autoPlayInterval);
                this.next();
                this.startAutoPlay();
            });
        }

        // Responsive update
        window.addEventListener('resize', () => {
            const newCardsPerView = this.getCardsPerView();
            if (newCardsPerView !== this.cardsPerView) {
                this.cardsPerView = newCardsPerView;
                this.updateCarousel();
            }
        });
    }
}

// Initialize carousel
const carousel = new Carousel();

// ============================================
// SMOOTH SCROLL ENHANCEMENT
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            const offsetTop = target.offsetTop - navbar.offsetHeight;

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// LAZY LOAD IMAGES (placeholder)
// ============================================

const imageElements = document.querySelectorAll('img[data-src]');
if (imageElements.length > 0) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    imageElements.forEach(img => imageObserver.observe(img));
}

// ============================================
// SCROLL TO TOP BUTTON (optional)
// ============================================

let scrollTopBtn = document.querySelector('.scroll-to-top');

if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopBtn.style.display = 'block';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// PAGE LOAD ANIMATION
// ============================================

window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// Initial body opacity setup for loading animation
document.body.style.opacity = '0.95';

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function for window resize
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

// Add scroll animation to elements
function addScrollAnimation() {
    const elements = document.querySelectorAll('[data-animate]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
}

addScrollAnimation();

// ============================================
// CONSOLE MESSAGE (for fun)
// ============================================

console.log('%c👋 Bem-vindo ao portfólio de Caio Henrique!', 'font-size: 16px; color: #ff9f43; font-weight: bold;');
console.log('%cSe você está vendo isso, é porque é curioso! 😄', 'font-size: 12px; color: #1f3a93;');
console.log('%cPara mais informações, entre em contato comigo!', 'font-size: 12px; color: #666;');
