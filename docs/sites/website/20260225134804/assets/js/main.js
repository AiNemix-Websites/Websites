document.addEventListener('DOMContentLoaded', () => {

    // 1. Sticky Header
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // 2. Mobile Navigation
    const navToggle = document.getElementById('mobile-nav-toggle');
    const mainNav = document.getElementById('main-nav');
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            const isOpen = document.body.classList.toggle('nav-open');
            navToggle.setAttribute('aria-expanded', isOpen);
        });

        mainNav.addEventListener('click', (e) => {
            if (e.target === mainNav) { // Click on backdrop
                document.body.classList.remove('nav-open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
                document.body.classList.remove('nav-open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // 3. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => {
            observer.observe(el);
        });
    }

    // 4. Cookie Banner
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    if (cookieBanner && acceptCookiesBtn) {
        if (!localStorage.getItem('cookiesAccepted')) {
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 1000);
        }

        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.classList.remove('show');
        });
    }

    // 5. Testimonial Carousel
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        let currentIndex = 0;

        function updateCarousel() {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % slides.length;
                updateCarousel();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                updateCarousel();
            });
        }
        
        // Basic swipe functionality
        let touchstartX = 0;
        let touchendX = 0;
        
        carousel.addEventListener('touchstart', function(event) {
            touchstartX = event.changedTouches[0].screenX;
        }, false);
        
        carousel.addEventListener('touchend', function(event) {
            touchendX = event.changedTouches[0].screenX;
            handleSwipe();
        }, false); 

        function handleSwipe() {
            if (touchendX < touchstartX) { // Swiped left
                nextBtn.click();
            }
            if (touchendX > touchstartX) { // Swiped right
                prevBtn.click();
            }
        }

        updateCarousel(); // Initial position
    }

    // 6. Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
