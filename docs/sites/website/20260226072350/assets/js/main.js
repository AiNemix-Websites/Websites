document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Sticky Header --- //
    const header = document.getElementById('site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- 2. Mobile Navigation --- //
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavMenu = document.getElementById('mobile-nav-menu');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    const mobileNavBackdrop = document.querySelector('.mobile-nav-backdrop');

    const openMobileMenu = () => {
        if (mobileNavMenu) {
            mobileNavMenu.style.display = 'block';
            setTimeout(() => {
                mobileNavMenu.classList.add('is-open');
                document.body.classList.add('scroll-locked');
                mobileNavToggle.setAttribute('aria-expanded', 'true');
            }, 10);
        }
    };

    const closeMobileMenu = () => {
        if (mobileNavMenu) {
            mobileNavMenu.classList.remove('is-open');
            document.body.classList.remove('scroll-locked');
            mobileNavToggle.setAttribute('aria-expanded', 'false');
            setTimeout(() => {
                mobileNavMenu.style.display = 'none';
            }, 300);
        }
    };

    if (mobileNavToggle && mobileNavMenu) {
        mobileNavToggle.addEventListener('click', openMobileMenu);
        mobileNavClose.addEventListener('click', closeMobileMenu);
        mobileNavBackdrop.addEventListener('click', closeMobileMenu);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNavMenu.classList.contains('is-open')) {
                closeMobileMenu();
            }
        });
    }

    // --- 3. Scroll Reveal Animations --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.style.transitionDelay = `${index * 50}ms`;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- 4. Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    if (cookieBanner && acceptCookiesBtn) {
        if (!localStorage.getItem('yuma_cookies_accepted')) {
            cookieBanner.style.display = 'block';
        }

        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('yuma_cookies_accepted', 'true');
            cookieBanner.style.display = 'none';
        });
    }

    // --- 5. Testimonials Carousel --- //
    const carouselTrack = document.querySelector('.carousel-track');
    if (carouselTrack) {
        const slides = Array.from(carouselTrack.children);
        const nextButton = document.querySelector('.carousel-button.next');
        const prevButton = document.querySelector('.carousel-button.prev');
        const dotsNav = document.querySelector('.carousel-dots');
        const slideWidth = slides[0].getBoundingClientRect().width;

        const setSlidePosition = (slide, index) => {
            slide.style.left = slideWidth * index + 'px';
        };
        // slides.forEach(setSlidePosition); // Not needed for flexbox approach

        for (let i = 0; i < slides.length; i++) {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => moveToSlide(i));
            dotsNav.appendChild(dot);
        }
        const dots = Array.from(dotsNav.children);

        const moveToSlide = (targetIndex) => {
            const currentSlide = carouselTrack.querySelector('.current-slide') || slides[0];
            const currentIndex = slides.indexOf(currentSlide);
            
            carouselTrack.style.transform = 'translateX(-' + slides[targetIndex].getBoundingClientRect().width * targetIndex + 'px)';
            
            slides[currentIndex].classList.remove('current-slide');
            slides[targetIndex].classList.add('current-slide');

            dots[currentIndex].classList.remove('active');
            dots[targetIndex].classList.add('active');
        };

        let currentIndex = 0;
        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            moveToSlide(currentIndex);
        });

        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            moveToSlide(currentIndex);
        });
        
        // Auto-play
        setInterval(() => {
            currentIndex = (currentIndex + 1) % slides.length;
            moveToSlide(currentIndex);
        }, 7000);
    }

    // --- 6. Sticky CTA --- //
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 600) {
                stickyCta.style.opacity = '1';
                stickyCta.style.pointerEvents = 'auto';
            } else {
                stickyCta.style.opacity = '0';
                stickyCta.style.pointerEvents = 'none';
            }
        });
    }

    // --- 7. Contact Form --- //
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // This is a dummy form handler. In a real project, this would send data to a server.
            alert('Vielen Dank für Ihre Nachricht! Wir werden uns in Kürze bei Ihnen melden.');
            contactForm.reset();
        });
    }
});