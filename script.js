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
gsap.from('.hud-element', {
    scrollTrigger: {
        trigger: '#technology',
        start: "top 60%"
    },
    x: (i) => i === 0 ? -100 : 100,
    opacity: 0,
    duration: 1,
    stagger: 0.2
});

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
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    body.classList.add('light-mode');
    sunIcon.style.display = 'none';
    moonIcon.style.display = 'block';
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

// 11. Service Modal Logic
const serviceFab = document.getElementById('service-fab');
const serviceModal = document.getElementById('service-modal');
const modalClose = document.querySelector('.modal-close');
const modalOverlay = document.querySelector('.modal-overlay');

if (serviceFab && serviceModal) {
    serviceFab.addEventListener('click', () => {
        serviceModal.classList.add('active');
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
    });

    const closeModal = () => {
        serviceModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    modalClose.addEventListener('click', closeModal);

    // Close on click outside
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && serviceModal.classList.contains('active')) {
            closeModal();
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
