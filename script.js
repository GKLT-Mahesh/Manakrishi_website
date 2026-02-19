gsap.registerPlugin(ScrollTrigger);

// 1. Hero Interaction: Movable Drone & Spraying Effect - Removed per user request
// (Logic removed)


// Reveal Text in Hero
gsap.from('.reveal-text', {
    y: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: "power3.out",
    delay: 0.5
});


// Staggered Gallery Animation
ScrollTrigger.batch(".gallery-card", {
    onEnter: batch => gsap.to(batch, {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power2.out",
        overwrite: true
    }),
    onLeave: batch => gsap.set(batch, { opacity: 0, y: 50 }), // Optional: reset on leave
    onEnterBack: batch => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, overwrite: true }),
    onLeaveBack: batch => gsap.set(batch, { opacity: 0, y: 50 }), // Optional: reset on leave
    // Initial state set via CSS or immediate set
});

// Ensure initial state is hidden for animation to work
gsap.set(".gallery-card", { y: 50, opacity: 0 });

// Counter Animation Logic
const counters = document.querySelectorAll('.counter');
counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');

    ScrollTrigger.create({
        trigger: counter,
        start: "top 80%",
        once: true,
        onEnter: () => {
            gsap.to(counter, {
                innerHTML: target,
                duration: 2,
                snap: { innerHTML: 1 },
                ease: "power1.out"
            });
        }
    });
});

// 4. Tech Section Reveal


// 5. Landing Drone Animation - Removed


// 6. Newsletter Form Handling
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = newsletterForm.querySelector('button');
        const originalContent = btn.innerHTML;

        // Visual feedback
        btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        btn.style.backgroundColor = '#4caf50';

        // Reset after a few seconds
        setTimeout(() => {
            btn.innerHTML = originalContent;
            btn.style.backgroundColor = '';
            newsletterForm.reset();
        }, 3000);
    });
}
// 7. Theme Toggle Logic
const themeBtn = document.getElementById('theme-toggle');
const sunIcon = document.querySelector('.sun-icon');
const moonIcon = document.querySelector('.moon-icon');
const body = document.body;

// Check for saved theme
// Check for saved theme
const savedTheme = localStorage.getItem('theme');

// Default to Light Mode unless 'dark' is explicitly set
if (savedTheme !== 'dark') {
    body.classList.add('light-mode');
    if (sunIcon) sunIcon.style.display = 'none';
    if (moonIcon) moonIcon.style.display = 'block';
} else {
    // Keep Dark Mode (default CSS)
    if (sunIcon) sunIcon.style.display = 'block';
    if (moonIcon) moonIcon.style.display = 'none';
}

if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        const isLight = body.classList.contains('light-mode');

        // Update Icons
        sunIcon.style.display = isLight ? 'none' : 'block';
        moonIcon.style.display = isLight ? 'block' : 'none';

        // Save Preference
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
}

// 8. Navbar Scroll Effect
const nav = document.querySelector('.premium-nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// 9. Vision Gallery Staggered Reveal
gsap.from('.vision-image-wrapper', {
    scrollTrigger: {
        trigger: '.vision-gallery',
        start: "top 80%"
    },
    y: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.3,
    ease: "power2.out"
});

// 10. Leadership Section Reveal - DISABLED to Fix Visibility Issues
/*
gsap.from('.leader-row', {
    scrollTrigger: {
        trigger: '.leadership-section',
        start: "top 75%"
    },
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power2.out"
});
*/

// 11. Service Modal Logic (GSAP + focus trap + a11y)
const serviceFab = document.getElementById('service-fab');
const serviceModal = document.getElementById('service-modal');
const modalClose = document.querySelector('.modal-close');
const modalOverlay = document.querySelector('.modal-overlay');
const modalContent = document.querySelector('#service-modal .modal-content');
const modalItems = document.querySelectorAll('#service-modal .modal-item');
const modalSubtitle = document.querySelector('#service-modal .modal-subtitle');
const modalCta = document.querySelector('#service-modal .modal-cta-btn');

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

function getFocusables(container) {
    if (!container) return [];
    return Array.from(container.querySelectorAll(FOCUSABLE)).filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);
}

function openServiceModal() {
    if (!serviceModal) return;
    if (serviceModal.classList.contains('active')) return; // prevent double-open
    const previouslyFocused = document.activeElement;
    serviceModal.dataset.previousFocus = previouslyFocused && previouslyFocused.id ? previouslyFocused.id : '';
    serviceModal.classList.add('active');
    serviceModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    if (typeof gsap !== 'undefined') {
        gsap.fromTo(serviceModal, { opacity: 0 }, { opacity: 1, duration: 0.28, ease: 'power2.out' });
        if (modalContent) {
            gsap.fromTo(modalContent, { scale: 0.9, y: 30 }, { scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.15)' });
        }
        if (modalSubtitle) {
            gsap.fromTo(modalSubtitle, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35, delay: 0.1, ease: 'power2.out' });
        }
        if (modalItems.length) {
            gsap.fromTo(modalItems, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.07, delay: 0.12, ease: 'power2.out' });
        }
        if (modalCta) {
            gsap.fromTo(modalCta, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35, delay: 0.45, ease: 'power2.out' });
        }
    }

    requestAnimationFrame(() => {
        const focusables = getFocusables(modalContent || serviceModal);
        if (focusables.length) focusables[0].focus();
    });
}

function closeServiceModal() {
    if (!serviceModal || !serviceModal.classList.contains('active')) return;

    function finishClose() {
        serviceModal.classList.remove('active');
        serviceModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
        if (modalContent && typeof gsap !== 'undefined') gsap.set(modalContent, { clearProps: 'all' });
        const prevId = serviceModal.dataset.previousFocus;
        if (prevId && document.getElementById(prevId)) document.getElementById(prevId).focus();
        else if (serviceFab) serviceFab.focus();
    }

    if (typeof gsap !== 'undefined' && modalContent) {
        gsap.timeline({ onComplete: finishClose })
            .to(modalContent, { scale: 0.95, y: 12, opacity: 0.9, duration: 0.15, ease: 'power2.in' }, 0)
            .to(serviceModal, { opacity: 0, duration: 0.2, ease: 'power2.in' }, 0.05);
    } else {
        finishClose();
    }
}

if (serviceFab && serviceModal) {
    serviceFab.addEventListener('click', openServiceModal);
    if (modalClose) modalClose.addEventListener('click', closeServiceModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeServiceModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && serviceModal.classList.contains('active')) {
            e.preventDefault();
            closeServiceModal();
        }
    });

    serviceModal.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab' || !serviceModal.classList.contains('active')) return;
        const focusables = getFocusables(modalContent || serviceModal);
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey) {
            if (document.activeElement === first) {
                e.preventDefault();
                last.focus();
            }
        } else {
            if (document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });
}

// Hero Background Slider
const heroSlides = document.querySelectorAll('.slide');
let currentHeroSlide = 0;

if (heroSlides.length > 0) {
    setInterval(() => {
        heroSlides[currentHeroSlide].classList.remove('active');
        currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
        heroSlides[currentHeroSlide].classList.add('active');
    }, 5000); // Change image every 5 seconds
}
