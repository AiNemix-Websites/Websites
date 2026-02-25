document.addEventListener('DOMContentLoaded', function() {

    // --- Helper Functions ---
    const select = (selector) => document.querySelector(selector);
    const selectAll = (selector) => document.querySelectorAll(selector);

    // --- Sticky Header ---
    const header = select('#main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Mobile Menu ---
    const mobileMenuToggle = select('#mobile-menu-toggle');
    const mobileMenuClose = select('#mobile-menu-close');
    const mobileMenu = select('#mobile-menu');

    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenu.classList.add('open');
            document.body.classList.add('no-scroll');
            mobileMenuToggle.setAttribute('aria-expanded', 'true');
        });

        const closeMenu = () => {
            mobileMenu.classList.remove('open');
            document.body.classList.remove('no-scroll');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        };

        mobileMenuClose.addEventListener('click', closeMenu);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                closeMenu();
            }
        });
    }

    // --- Scroll Reveal Animation ---
    const revealItems = selectAll('.reveal-item');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealItems.forEach(item => {
        revealObserver.observe(item);
    });

    // Staggered animation
    const staggerContainers = selectAll('.reveal-stagger-container');
    staggerContainers.forEach(container => {
        const items = container.querySelectorAll('.reveal-item');
        items.forEach((item, index) => {
            item.style.setProperty('--stagger-index', index);
        });
    });

    // --- Testimonial Carousel ---
    const carousel = select('#testimonial-carousel');
    if (carousel) {
        const slides = selectAll('.testimonial-slide');
        const nextBtn = select('#carousel-next');
        const prevBtn = select('#carousel-prev');
        const dotsContainer = select('#carousel-dots');
        let currentIndex = 0;
        let slideInterval;

        const goToSlide = (index) => {
            carousel.style.transform = `translateX(-${index * 100}%)`;
            carousel.style.transition = 'transform 0.5s ease';
            updateDots(index);
            currentIndex = index;
        };

        const updateDots = (index) => {
            const dots = selectAll('.dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        };

        const createDots = () => {
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                dot.addEventListener('click', () => {
                    goToSlide(i);
                    resetInterval();
                });
                dotsContainer.appendChild(dot);
            });
        };
        
        const startInterval = () => {
            slideInterval = setInterval(() => {
                const nextIndex = (currentIndex + 1) % slides.length;
                goToSlide(nextIndex);
            }, 5000);
        };

        const resetInterval = () => {
            clearInterval(slideInterval);
            startInterval();
        };

        if (slides.length > 0) {
            createDots();
            goToSlide(0);
            startInterval();

            nextBtn.addEventListener('click', () => {
                const nextIndex = (currentIndex + 1) % slides.length;
                goToSlide(nextIndex);
                resetInterval();
            });

            prevBtn.addEventListener('click', () => {
                const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
                goToSlide(prevIndex);
                resetInterval();
            });
        }
    }

    // --- Cookie Banner ---
    const cookieBanner = select('#cookie-banner');
    const cookieAccept = select('#cookie-accept');
    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => {
                cookieBanner.classList.add('visible');
            }, 1000);
        }

        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Lightbox ---
    const lightbox = select('#km-lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.close-btn');
        const prevBtn = lightbox.querySelector('.prev-btn');
        const nextBtn = lightbox.querySelector('.next-btn');
        let galleryImages = [];
        let currentIndex = -1;

        const openLightbox = (index) => {
            currentIndex = index;
            lightboxImg.src = galleryImages[currentIndex].src;
            lightboxImg.alt = galleryImages[currentIndex].alt;
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('visible'), 10);
            document.body.classList.add('no-scroll');
            updateLightboxNav();
            document.addEventListener('keydown', handleKeydown);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightboxImg.src = '';
            }, 300);
            document.body.classList.remove('no-scroll');
            document.removeEventListener('keydown', handleKeydown);
        };

        const showPrev = () => {
            if (currentIndex > 0) {
                openLightbox(currentIndex - 1);
            }
        };

        const showNext = () => {
            if (currentIndex < galleryImages.length - 1) {
                openLightbox(currentIndex + 1);
            }
        };

        const updateLightboxNav = () => {
            prevBtn.style.display = currentIndex > 0 ? 'block' : 'none';
            nextBtn.style.display = currentIndex < galleryImages.length - 1 ? 'block' : 'none';
        };

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        };

        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-lightbox-src]')) {
                e.preventDefault();
                galleryImages = Array.from(selectAll('[data-lightbox-src]'));
                const clickedIndex = galleryImages.indexOf(e.target);
                openLightbox(clickedIndex);
            }
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);
    }

    // --- Sticky CTA ---
    const stickyCTA = select('#sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (user has scrolled past it)
                if (!entry.isIntersecting && window.scrollY > 300) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { threshold: 0 });

        const heroSection = select('.hero, .page-hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

    // --- Contact Form --- 
    const contactForm = select('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const feedbackEl = select('#form-feedback');
            feedbackEl.textContent = 'Vielen Dank! Ihre Nachricht wird verarbeitet.';
            feedbackEl.classList.add('success');
            
            // In a real application, you would send the data to a server here.
            // For this static site, we just show a message and reset the form.
            setTimeout(() => {
                feedbackEl.textContent = '';
                feedbackEl.classList.remove('success');
                contactForm.reset();
            }, 4000);
        });
    }
});