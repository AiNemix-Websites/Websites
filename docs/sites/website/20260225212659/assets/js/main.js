document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header --- //
    const header = document.getElementById('site-header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    // --- Mobile Navigation --- //
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navContainer = document.getElementById('mobile-nav-container');
    const mobileNav = document.getElementById('mobile-nav');

    if (navToggle && navContainer) {
        const toggleNav = (isOpen) => {
            const open = typeof isOpen === 'boolean' ? isOpen : !navContainer.classList.contains('open');
            navContainer.classList.toggle('open', open);
            navToggle.classList.toggle('open', open);
            navToggle.setAttribute('aria-expanded', open);
            document.body.classList.toggle('scroll-locked', open);
        };

        navToggle.addEventListener('click', () => toggleNav());

        navContainer.addEventListener('click', (e) => {
            if (e.target === navContainer) {
                toggleNav(false);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navContainer.classList.contains('open')) {
                toggleNav(false);
            }
        });
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.dataset.reveal === 'stagger') {
                    const children = entry.target.querySelectorAll('[data-reveal-child]');
                    children.forEach((child, index) => {
                        child.style.setProperty('--stagger-index', index);
                        child.classList.add('visible');
                    });
                } else {
                    entry.target.classList.add('visible');
                }
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -10% 0px' });

    revealElements.forEach(el => {
        if (el.dataset.reveal === 'stagger') {
            const children = el.querySelectorAll('[data-reveal-child]');
            children.forEach(child => {
                child.classList.add('reveal-child-base'); // Base class for staggering
            });
        }
        revealObserver.observe(el);
    });

    // --- Testimonial Carousel --- //
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.carousel-button.next');
        const prevButton = document.querySelector('.carousel-button.prev');
        const dotsNav = document.querySelector('.carousel-dots');
        const slideWidth = slides[0].getBoundingClientRect().width;

        const setSlidePosition = (slide, index) => {
            slide.style.left = slideWidth * index + 'px';
        };
        // slides.forEach(setSlidePosition);

        let currentIndex = 0;

        const moveToSlide = (targetIndex) => {
            track.style.transform = 'translateX(-' + (slideWidth * targetIndex) + 'px)';
            currentIndex = targetIndex;
            updateControls();
        };

        const updateControls = () => {
            prevButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex === slides.length - 1;
            
            const currentDot = dotsNav.querySelector('.active');
            if(currentDot) currentDot.classList.remove('active');
            dotsNav.children[currentIndex].classList.add('active');
        };

        // Create dots
        slides.forEach((_, index) => {
            const button = document.createElement('button');
            button.classList.add('carousel-dot');
            if (index === 0) button.classList.add('active');
            button.addEventListener('click', () => moveToSlide(index));
            dotsNav.appendChild(button);
        });

        nextButton.addEventListener('click', () => {
            if (currentIndex < slides.length - 1) {
                moveToSlide(currentIndex + 1);
            }
        });

        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) {
                moveToSlide(currentIndex - 1);
            }
        });

        // Touch/Swipe logic
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            track.style.transition = 'none';
        });

        track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
            const diff = currentX - startX;
            track.style.transform = `translateX(${-currentIndex * slideWidth + diff}px)`;
        });

        track.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            track.style.transition = 'transform var(--transition)';
            const diff = currentX - startX;
            if (Math.abs(diff) > 50) {
                if (diff < 0 && currentIndex < slides.length - 1) {
                    moveToSlide(currentIndex + 1);
                } else if (diff > 0 && currentIndex > 0) {
                    moveToSlide(currentIndex - 1);
                }
            } else {
                 moveToSlide(currentIndex);
            }
        });

        window.addEventListener('resize', () => {
            const newSlideWidth = slides[0].getBoundingClientRect().width;
            moveToSlide(currentIndex); // Recalculate position
        });

        moveToSlide(0);
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');

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

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const handleScrollCTA = () => {
            const heroHeight = document.querySelector('.hero')?.offsetHeight || 400;
            if (window.scrollY > heroHeight) {
                stickyCTA.classList.add('visible');
            } else {
                stickyCTA.classList.remove('visible');
            }
        };
        window.addEventListener('scroll', handleScrollCTA, { passive: true });
    }
});