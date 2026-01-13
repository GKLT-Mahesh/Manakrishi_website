gsap.registerPlugin(ScrollTrigger);

// 1. Hero Interaction: Movable Drone & Spraying Effect
const heroSection = document.getElementById('hero');
const droneContainer = document.getElementById('hero-drone');
const drone = document.querySelector('.drone-svg');

if (heroSection && droneContainer) {
    // Initial Hover Animation (idle state)
    const hoverAnim = gsap.to(drone, {
        y: -15,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    // Rotor Animation
    gsap.to('.rotor', {
        scaleX: 0.8,
        duration: 0.1,
        repeat: -1,
        yoyo: true,
        opacity: 0.8
    });

    // Mouse Follow Logic
    let heroBounds = heroSection.getBoundingClientRect();

    window.addEventListener('resize', () => {
        heroBounds = heroSection.getBoundingClientRect();
    });

    heroSection.addEventListener('mousemove', (e) => {
        // Calculate mouse position relative to hero section
        const mouseX = e.clientX - heroBounds.left;
        const mouseY = e.clientY - heroBounds.top;

        // Move the drone container towards the mouse
        // We use GSAP for smooth delay/lag effect
        gsap.to(droneContainer, {
            x: mouseX - (heroBounds.width / 2), // Center relative to original position
            y: mouseY - (heroBounds.height / 2),
            duration: 0.8,
            ease: "power2.out"
        });

        // Slight rotation based on movement direction could be cool, but keeping it simple for now
    });

    // Water Spraying System
    function updateSpray() {
        // Only spray if drone is visible/active (simplified: always for now in hero)
        createSprayParticle();
        requestAnimationFrame(updateSpray);
    }

    // Start spraying
    updateSpray();

    function createSprayParticle() {
        // Get current drone position
        // We need the bounding rect of the drone *SVG* specifically to spawn from bottom
        const droneRect = droneContainer.getBoundingClientRect();
        const heroBounds = heroSection.getBoundingClientRect();

        // Create particle
        const particle = document.createElement('div');
        particle.classList.add('spray-particle');
        heroSection.appendChild(particle);

        // Position particle at the bottom center of the drone
        // Randomize slightly for spread
        const randomX = (Math.random() - 0.5) * 40;

        // Relative to hero section
        const startX = (droneRect.left - heroBounds.left) + (droneRect.width / 2) + randomX;
        const startY = (droneRect.top - heroBounds.top) + droneRect.height - 20; // Slightly up from bottom edge

        // Initial CSS set
        particle.style.left = startX + 'px';
        particle.style.top = startY + 'px';

        // Animate falling
        gsap.to(particle, {
            y: 300 + Math.random() * 100, // Fall distance
            opacity: 0,
            duration: 1 + Math.random() * 0.5,
            ease: "power1.in",
            onComplete: () => {
                particle.remove();
            }
        });
    }
}

// Reveal Text in Hero
gsap.from('.reveal-text', {
    y: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: "power3.out",
    delay: 0.5
});

// 2. Story Section Interactions
const storyBlocks = document.querySelectorAll('.story-block');
const companionDrone = document.querySelector('.drone-companion');
const plantStem = document.querySelectorAll('.stem');

// Pin the left side (visuals) while scrolling text
ScrollTrigger.create({
    trigger: ".story-section",
    start: "top top",
    end: "bottom bottom",
    pin: ".story-sticky",
    scrub: 1
});

// Animate text blocks and update visual state
storyBlocks.forEach((block, i) => {
    ScrollTrigger.create({
        trigger: block,
        start: "top center",
        end: "bottom center",
        onEnter: () => updateStory(i + 1),
        onEnterBack: () => updateStory(i + 1),
        toggleClass: "active"
    });
});

function updateStory(step) {
    // Move Drone Companion based on step
    const positions = [20, 50, 80]; // Top percentages
    gsap.to(companionDrone, {
        top: positions[step - 1] + "%",
        duration: 1,
        ease: "power2.out"
    });

    // Update 3D Backgrounds
    document.querySelectorAll('.story-bg').forEach(bg => bg.classList.remove('active'));
    const activeBg = document.getElementById(`bg-${step}`);
    if (activeBg) activeBg.classList.add('active');

    // Plant growth effect at step 2
    if (step === 2) {
        gsap.to(plantStem, {
            strokeDashoffset: 0,
            duration: 2,
            opacity: 1,
            stroke: "#4caf50"
        });
    }

    // Spray effect at step 3
    if (step === 3) {
        pulseDroneEffect();
    }
}

function pulseDroneEffect() {
    gsap.fromTo(companionDrone,
        { boxShadow: "0 0 0px var(--color-secondary)" },
        { boxShadow: "0 0 50px var(--color-secondary)", duration: 0.5, yoyo: true, repeat: 3 }
    );
}

// 3. Impact Counters
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

// 5. Landing Drone Animation
gsap.to('.landing-drone', {
    y: 10,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
});

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
const nav = document.querySelector('.glass-nav');
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
