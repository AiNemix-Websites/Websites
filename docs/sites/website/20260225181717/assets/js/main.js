document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation ---
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            document.body.classList.toggle('nav-open');
        });
    }

    // --- Sticky Header ---
    const header = document.getElementById('site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('is-scrolled');
            } else {
                header.classList.remove('is-scrolled');
            }
        });
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));

    // --- Testimonial Carousel ---
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = carousel.parentElement.querySelector('.next');
        const prevButton = carousel.parentElement.querySelector('.prev');
        const dotsNav = carousel.parentElement.querySelector('.carousel-dots');
        const slideWidth = slides[0].getBoundingClientRect().width;

        let currentIndex = 0;

        const setSlidePosition = (slide, index) => {
            slide.style.left = slideWidth * index + 'px';
        };
        // slides.forEach(setSlidePosition);

        const moveToSlide = (targetIndex) => {
            track.style.transform = 'translateX(-' + (slideWidth * targetIndex) + 'px)';
            currentIndex = targetIndex;
            updateControls();
        };

        const updateControls = () => {
            if (prevButton) prevButton.disabled = currentIndex === 0;
            if (nextButton) nextButton.disabled = currentIndex === slides.length - 1;
            if (dotsNav) {
                const currentDot = dotsNav.querySelector('.active');
                if(currentDot) currentDot.classList.remove('active');
                dotsNav.children[currentIndex].classList.add('active');
            }
        };

        if (dotsNav) {
            slides.forEach((_, index) => {
                const button = document.createElement('button');
                button.classList.add('carousel-dot');
                button.addEventListener('click', () => moveToSlide(index));
                dotsNav.appendChild(button);
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                if (currentIndex < slides.length - 1) moveToSlide(currentIndex + 1);
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                if (currentIndex > 0) moveToSlide(currentIndex - 1);
            });
        }

        // Auto-clone for infinite loop illusion
        const firstClone = slides[0].cloneNode(true);
        const lastClone = slides[slides.length - 1].cloneNode(true);
        track.appendChild(firstClone);
        track.insertBefore(lastClone, slides[0]);

        const allSlides = Array.from(track.children);
        track.style.transform = `translateX(-${slideWidth}px)`;
        let currentSlide = 1;

        const slideTo = (slideIndex) => {
            track.style.transition = 'transform 0.5s ease-in-out';
            track.style.transform = `translateX(-${slideIndex * slideWidth}px)`;
        };

        if (nextButton) nextButton.addEventListener('click', () => {
            currentSlide++;
            slideTo(currentSlide);
            if (currentSlide >= allSlides.length - 1) {
                setTimeout(() => {
                    track.style.transition = 'none';
                    currentSlide = 1;
                    track.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
                }, 500);
            }
        });
        
        if (prevButton) prevButton.addEventListener('click', () => {
            currentSlide--;
            slideTo(currentSlide);
            if (currentSlide <= 0) {
                setTimeout(() => {
                    track.style.transition = 'none';
                    currentSlide = allSlides.length - 2;
                    track.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
                }, 500);
            }
        });
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    if (cookieBanner && acceptCookiesBtn) {
        if (!localStorage.getItem('cookiesAccepted')) {
            cookieBanner.hidden = false;
        }
        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.hidden = true;
        });
    }

    // --- Sticky CTA ---
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (scrolled past hero)
                if (!entry.isIntersecting) {
                    stickyCTA.hidden = false;
                } else {
                    stickyCTA.hidden = true;
                }
            });
        }, { rootMargin: '-200px 0px 0px 0px' });
        const heroSection = document.querySelector('.hero');
        if (heroSection) ctaObserver.observe(heroSection);
    }

    // --- Global Lightbox (Structure and Closing Logic) ---
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const backdrop = lightbox.querySelector('.lightbox-backdrop');
        
        const closeLightbox = () => {
            lightbox.classList.remove('is-visible');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };

        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('is-visible')) {
                closeLightbox();
            }
        });
    }

    // --- Contact Form --- 
    const form = document.querySelector('[data-form-submit]');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // This is a dummy submission handler for demonstration.
            // In a real project, this would send data to a server.
            const successMessage = form.querySelector('.form-success-message');
            if (successMessage) {
                form.reset();
                successMessage.hidden = false;
                setTimeout(() => { successMessage.hidden = true; }, 5000);
            }
        });
    }

});