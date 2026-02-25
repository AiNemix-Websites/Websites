document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header --- //
    const header = document.querySelector('.site-header');
    if (header) {
        const scrollObserver = new IntersectionObserver(([entry]) => {
            header.classList.toggle('scrolled', !entry.isIntersecting);
        }, { threshold: 0.9 });
        
        const sentinel = document.createElement('div');
        sentinel.style.height = '1px';
        document.body.prepend(sentinel);
        scrollObserver.observe(sentinel);
    }

    // --- Mobile Navigation --- //
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('#mobile-nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isOpen);
            navToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
            document.body.classList.toggle('nav-open');
        });
    }

    // --- Scroll Reveal --- //
    const revealItems = document.querySelectorAll('.reveal-item');
    if (revealItems.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealItems.forEach(item => {
            revealObserver.observe(item);
        });
    }

    // --- Testimonials Carousel --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = Array.from(carousel.children);
        const nextButton = document.querySelector('.carousel-next');
        const prevButton = document.querySelector('.carousel-prev');
        const dotsNav = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        // Create dots
        slides.forEach((_, i) => {
            const button = document.createElement('button');
            button.setAttribute('aria-label', `Gehe zu Bewertung ${i + 1}`);
            if (i === 0) button.classList.add('active');
            dotsNav.appendChild(button);
        });
        const dots = Array.from(dotsNav.children);

        const moveToSlide = (targetIndex) => {
            carousel.style.transform = 'translateX(-' + targetIndex * 100 + '%)';
            dots[currentIndex].classList.remove('active');
            dots[targetIndex].classList.add('active');
            currentIndex = targetIndex;
        };

        nextButton.addEventListener('click', () => {
            const newIndex = (currentIndex + 1) % slides.length;
            moveToSlide(newIndex);
        });

        prevButton.addEventListener('click', () => {
            const newIndex = (currentIndex - 1 + slides.length) % slides.length;
            moveToSlide(newIndex);
        });
        
        dotsNav.addEventListener('click', e => {
            const targetDot = e.target.closest('button');
            if (!targetDot) return;
            const targetIndex = dots.findIndex(dot => dot === targetDot);
            moveToSlide(targetIndex);
        });
        
        // Swipe functionality
        let touchstartX = 0;
        let touchendX = 0;
        
        carousel.addEventListener('touchstart', function(event) {
            touchstartX = event.changedTouches[0].screenX;
        }, {passive: true});

        carousel.addEventListener('touchend', function(event) {
            touchendX = event.changedTouches[0].screenX;
            handleSwipe();
        }); 

        function handleSwipe() {
            if (touchendX < touchstartX) { // Swiped left
                const newIndex = (currentIndex + 1) % slides.length;
                moveToSlide(newIndex);
            }
            if (touchendX > touchstartX) { // Swiped right
                const newIndex = (currentIndex - 1 + slides.length) % slides.length;
                moveToSlide(newIndex);
            }
        }
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 1000);
        }
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('show');
        });
    }

    // --- Sticky CTA --- //
    const stickyCta = document.getElementById('sticky-cta-bar');
    if (stickyCta) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                stickyCta.classList.add('visible');
            } else {
                stickyCta.classList.remove('visible');
            }
        });
    }
    
    // --- Smooth scroll for anchor links --- //
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if(targetElement){
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});