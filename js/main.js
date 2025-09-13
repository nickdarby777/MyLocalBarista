/* 
===========================================
MAIN APPLICATION JAVASCRIPT
===========================================

This file handles general website interactions and functionality:
- Smooth scrolling navigation
- Interactive animations
- Performance optimizations
- Accessibility enhancements
- General UI interactions

FEATURES:
- Smooth scroll to sections
- Enhanced link interactions
- Performance monitoring
- Accessibility improvements
- Mobile-friendly interactions
*/

/* ===========================================
   MAIN APPLICATION CLASS
   =========================================== */

class MyLocalBaristaApp {
    constructor() {
        // App state
        this.isInitialized = false;
        this.scrollThreshold = 100;
        this.lastScrollY = 0;
        
        // Performance tracking
        this.performanceMetrics = {
            startTime: performance.now(),
            interactions: 0
        };
        
        this.init();
    }
    
    /* ===========================================
       INITIALIZATION
       =========================================== */
    
    init() {
        console.log('🚀 Initializing MyLocalBarista App...');
        
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }
    
    initializeApp() {
        // Set up smooth scrolling
        this.setupSmoothScrolling();
        
        // Set up navigation interactions
        this.setupNavigation();
        
        // Set up scroll effects
        this.setupScrollEffects();
        
        // Set up interactive elements
        this.setupInteractiveElements();
        
        // Set up accessibility improvements
        this.setupAccessibility();
        
        // Set up performance optimizations
        this.setupPerformanceOptimizations();
        
        // Mark as initialized
        this.isInitialized = true;
        
        console.log('✅ MyLocalBarista App initialized successfully');
        this.logPerformanceMetrics();
    }
    
    /* ===========================================
       SMOOTH SCROLLING NAVIGATION
       =========================================== */
    
    setupSmoothScrolling() {
        // Find all internal anchor links
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    this.smoothScrollToElement(targetElement);
                    this.trackInteraction('smooth_scroll', targetId);
                }
            });
        });
        
        console.log(`📍 Set up smooth scrolling for ${anchorLinks.length} anchor links`);
    }
    
    smoothScrollToElement(element, offset = 80) {
        const elementTop = element.offsetTop - offset;
        
        window.scrollTo({
            top: elementTop,
            behavior: 'smooth'
        });
        
        // Update URL hash after scroll completes
        setTimeout(() => {
            if (element.id) {
                history.replaceState(null, null, `#${element.id}`);
            }
        }, 600);
    }
    
    /* ===========================================
       NAVIGATION INTERACTIONS
       =========================================== */
    
    setupNavigation() {
        const navbar = document.querySelector('.navbar');
        const navLinks = document.querySelectorAll('.nav-link');
        
        if (navbar) {
            // Add scroll-based navbar styling
            this.setupScrollBasedNavbar(navbar);
        }
        
        if (navLinks.length > 0) {
            // Add active section highlighting
            this.setupActiveSectionHighlighting(navLinks);
        }
        
        console.log('🧭 Navigation interactions configured');
    }
    
    setupScrollBasedNavbar(navbar) {
        let isScrolled = false;
        
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > this.scrollThreshold && !isScrolled) {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
                navbar.style.boxShadow = 'var(--shadow-sm)';
                isScrolled = true;
            } else if (currentScrollY <= this.scrollThreshold && isScrolled) {
                navbar.style.background = '';
                navbar.style.backdropFilter = '';
                navbar.style.boxShadow = '';
                isScrolled = false;
            }
            
            this.lastScrollY = currentScrollY;
        };
        
        // Throttled scroll listener
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    setupActiveSectionHighlighting(navLinks) {
        const sections = document.querySelectorAll('section[id]');
        
        const highlightActiveSection = () => {
            let currentSection = '';
            const scrollPosition = window.scrollY + 150;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    currentSection = section.id;
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        };
        
        // Throttled scroll listener for active section
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    highlightActiveSection();
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        // Initial check
        highlightActiveSection();
    }
    
    /* ===========================================
       SCROLL EFFECTS
       =========================================== */
    
    setupScrollEffects() {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    this.trackInteraction('element_viewed', entry.target.className);
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const animateElements = document.querySelectorAll('.service-card, .benefit-item, .section-header');
        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
        
        console.log(`✨ Set up scroll animations for ${animateElements.length} elements`);
    }
    
    /* ===========================================
       INTERACTIVE ELEMENTS
       =========================================== */
    
    setupInteractiveElements() {
        // Enhanced button interactions
        this.setupButtonInteractions();
        
        // Service card hover effects
        this.setupServiceCardEffects();
        
        // Form field enhancements
        this.setupFormEnhancements();
        
        console.log('🎯 Interactive elements configured');
    }
    
    setupButtonInteractions() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            // Add ripple effect on click
            button.addEventListener('click', (e) => {
                this.createRippleEffect(e, button);
                this.trackInteraction('button_click', button.textContent.trim());
            });
            
            // Add subtle hover animations
            button.addEventListener('mouseenter', () => {
                if (!button.style.transform) {
                    button.style.transform = 'translateY(-2px)';
                }
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = '';
            });
        });
    }
    
    createRippleEffect(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            pointer-events: none;
        `;
        
        // Add ripple animation CSS if not exists
        if (!document.querySelector('#ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
                
                .btn {
                    position: relative;
                    overflow: hidden;
                }
            `;
            document.head.appendChild(style);
        }
        
        element.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    setupServiceCardEffects() {
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                // Add subtle glow effect
                card.style.boxShadow = `
                    var(--shadow-xl),
                    0 0 30px color-mix(in srgb, var(--primary-color) 15%, transparent)
                `;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.boxShadow = '';
            });
        });
    }
    
    setupFormEnhancements() {
        const formInputs = document.querySelectorAll('.form-input, .form-select, .form-textarea');
        
        formInputs.forEach(input => {
            // Add floating label effect
            this.setupFloatingLabel(input);
            
            // Add focus/blur animations
            input.addEventListener('focus', () => {
                input.style.transform = 'scale(1.02)';
                input.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--primary-color) 10%, transparent)';
            });
            
            input.addEventListener('blur', () => {
                input.style.transform = '';
                input.style.boxShadow = '';
            });
        });
    }
    
    setupFloatingLabel(input) {
        const formGroup = input.closest('.form-group');
        if (!formGroup) return;
        
        const label = formGroup.querySelector('.form-label');
        if (!label) return;
        
        const checkFloat = () => {
            if (input.value.trim() || input === document.activeElement) {
                label.style.transform = 'translateY(-10px) scale(0.9)';
                label.style.color = 'var(--primary-color)';
            } else {
                label.style.transform = '';
                label.style.color = '';
            }
        };
        
        input.addEventListener('focus', checkFloat);
        input.addEventListener('blur', checkFloat);
        input.addEventListener('input', checkFloat);
        
        // Initial check
        checkFloat();
    }
    
    /* ===========================================
       ACCESSIBILITY ENHANCEMENTS
       =========================================== */
    
    setupAccessibility() {
        // Skip to main content link
        this.addSkipToMainLink();
        
        // Keyboard navigation improvements
        this.improveKeyboardNavigation();
        
        // Screen reader announcements
        this.setupScreenReaderAnnouncements();
        
        // High contrast mode detection
        this.detectHighContrastMode();
        
        console.log('♿ Accessibility enhancements applied');
    }
    
    addSkipToMainLink() {
        if (document.querySelector('.skip-link')) return; // Already exists
        
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-color);
            color: white;
            padding: 8px;
            text-decoration: none;
            z-index: 1000;
            border-radius: 4px;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    improveKeyboardNavigation() {
        // Add visible focus indicators
        const focusableElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]');
        
        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.style.outline = '2px solid var(--primary-color)';
                element.style.outlineOffset = '2px';
            });
            
            element.addEventListener('blur', () => {
                element.style.outline = '';
                element.style.outlineOffset = '';
            });
        });
        
        // Escape key handling for modals/panels
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close any open panels or modals
                const openPanel = document.querySelector('.customization-panel.open');
                if (openPanel && window.customizationController) {
                    window.customizationController.closePanel();
                }
            }
        });
    }
    
    setupScreenReaderAnnouncements() {
        // Create live region for announcements
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-announcements';
        document.body.appendChild(liveRegion);
        
        // Function to announce messages
        window.announceToScreenReader = (message) => {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        };
    }
    
    detectHighContrastMode() {
        // Detect Windows High Contrast mode
        const isHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
        
        if (isHighContrast) {
            document.body.classList.add('high-contrast-mode');
            console.log('🔍 High contrast mode detected');
        }
        
        // Listen for changes
        window.matchMedia('(prefers-contrast: high)').addEventListener('change', (e) => {
            if (e.matches) {
                document.body.classList.add('high-contrast-mode');
            } else {
                document.body.classList.remove('high-contrast-mode');
            }
        });
    }
    
    /* ===========================================
       PERFORMANCE OPTIMIZATIONS
       =========================================== */
    
    setupPerformanceOptimizations() {
        // Lazy load images
        this.setupLazyLoading();
        
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Monitor performance
        this.monitorPerformance();
        
        console.log('⚡ Performance optimizations applied');
    }
    
    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if (images.length === 0) return;
        
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
        
        images.forEach(img => imageObserver.observe(img));
        
        console.log(`🖼️ Lazy loading set up for ${images.length} images`);
    }
    
    preloadCriticalResources() {
        // Preload theme CSS files for faster switching
        const themes = ['classic', 'modern', 'warm'];
        const currentTheme = document.getElementById('style-theme')?.href.match(/style-(\w+)\.css/)?.[1];
        
        themes.forEach(theme => {
            if (theme !== currentTheme) {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'style';
                link.href = `css/style-${theme}.css`;
                document.head.appendChild(link);
            }
        });
    }
    
    monitorPerformance() {
        // Log page load performance
        window.addEventListener('load', () => {
            const loadTime = performance.now() - this.performanceMetrics.startTime;
            console.log(`⚡ Page loaded in ${loadTime.toFixed(2)}ms`);
            
            // Log navigation timing
            if ('navigation' in performance) {
                const nav = performance.navigation;
                const timing = performance.timing;
                const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
                console.log(`📊 Navigation timing: ${pageLoadTime}ms`);
            }
        });
    }
    
    /* ===========================================
       ANALYTICS & TRACKING
       =========================================== */
    
    trackInteraction(type, details = '') {
        this.performanceMetrics.interactions++;
        
        // Log interaction for debugging
        console.log(`📈 Interaction: ${type}`, details);
        
        // Here you could send to analytics service
        // Example: gtag('event', type, { details });
    }
    
    logPerformanceMetrics() {
        console.log('📊 Performance Metrics:', {
            initTime: (performance.now() - this.performanceMetrics.startTime).toFixed(2) + 'ms',
            memoryUsage: performance.memory ? {
                used: (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2) + 'MB',
                total: (performance.memory.totalJSHeapSize / 1024 / 1024).toFixed(2) + 'MB'
            } : 'Not available'
        });
    }
}

/* ===========================================
   UTILITY FUNCTIONS
   =========================================== */

// Debounce utility function
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Throttle utility function
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/* ===========================================
   GLOBAL INITIALIZATION
   =========================================== */

// Initialize the main app
console.log('🏗️ Starting MyLocalBarista application...');
window.myLocalBaristaApp = new MyLocalBaristaApp();

// Add CSS for animations
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .high-contrast-mode * {
        border-color: currentColor !important;
    }
    
    .nav-link.active {
        color: var(--primary-color) !important;
        font-weight: var(--font-weight-semibold);
    }
`;
document.head.appendChild(animationStyles);