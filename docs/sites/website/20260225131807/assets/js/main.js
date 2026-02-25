document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header --- //
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

    // --- Mobile Menu --- //
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const menuClose = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.add('open');
            document.body.classList.add('no-scroll');
            menuToggle.setAttribute('aria-expanded', 'true');
        });

        const closeMenu = () => {
            mobileMenu.classList.remove('open');
            document.body.classList.remove('no-scroll');
            menuToggle.setAttribute('aria-expanded', 'false');
        };

        if (menuClose) {
            menuClose.addEventListener('click', closeMenu);
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                closeMenu();
            }
        });
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- FAQ Accordion --- //
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            question.setAttribute('aria-expanded', !isExpanded);
            if (!isExpanded) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
            }
        });
    });

    // --- Testimonials Carousel --- //
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = document.getElementById('carousel-prev');
        const nextBtn = document.getElementById('carousel-next');
        const dotsContainer = document.getElementById('carousel-dots');
        let currentIndex = 0;
        let slideInterval;

        function updateCarousel() {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        }

        function updateDots() {
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        function createDots() {
            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
                dot.addEventListener('click', () => {
                    currentIndex = index;
                    updateCarousel();
                    resetInterval();
                });
                dotsContainer.appendChild(dot);
            });
        }

        function resetInterval() {
            clearInterval(slideInterval);
            slideInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % slides.length;
                updateCarousel();
            }, 5000);
        }

        if (slides.length > 1) {
            createDots();

            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                updateCarousel();
                resetInterval();
            });

            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % slides.length;
                updateCarousel();
                resetInterval();
            });

            // Touch/Swipe support
            let touchStartX = 0;
            carousel.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; });
            carousel.addEventListener('touchend', (e) => {
                let touchEndX = e.changedTouches[0].clientX;
                if (touchStartX - touchEndX > 50) nextBtn.click();
                if (touchEndX - touchStartX > 50) prevBtn.click();
            });

            updateCarousel();
            resetInterval();
        } else {
             if(prevBtn) prevBtn.style.display = 'none';
             if(nextBtn) nextBtn.style.display = 'none';
        }
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');

    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieAccepted')) {
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 1000);
        }

        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieAccepted', 'true');
            cookieBanner.classList.remove('show');
        });
    }

    // --- Contact Form --- //
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // This is a dummy submission handler for demonstration.
            // In a real project, this would send data to a server.
            formStatus.textContent = 'Vielen Dank! Ihre Nachricht wurde versendet.';
            formStatus.style.color = 'green';
            contactForm.reset();
            setTimeout(() => { formStatus.textContent = ''; }, 5000);
        });
    }
});