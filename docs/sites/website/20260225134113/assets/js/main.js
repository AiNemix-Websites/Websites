document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Sticky Header --- //
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

    // --- 2. Mobile Navigation --- //
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (navToggle && mainNav) {
        // Clone nav for mobile to avoid conflicts
        const mobileNav = mainNav.cloneNode(true);
        mobileNav.classList.add('mobile-menu');
        mobileNav.id = 'mobile-nav-menu';
        document.body.appendChild(mobileNav);

        const toggleMenu = () => {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isOpen);
            mobileNav.classList.toggle('open');
            navToggle.classList.toggle('open');
            document.body.classList.toggle('no-scroll', !isOpen);
        };

        navToggle.addEventListener('click', toggleMenu);

        // Close on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
                toggleMenu();
            }
        });
    }

    // --- 3. Scroll Reveal Animations --- //
    const revealItems = document.querySelectorAll('.reveal-item');
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

    // --- 4. Testimonials Carousel --- //
    const carousel = document.querySelector('.carousel-container');
    if (carousel) {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.carousel-btn.next');
        const prevButton = document.querySelector('.carousel-btn.prev');
        const dotsNav = document.querySelector('.carousel-dots');
        const slideWidth = slides[0].getBoundingClientRect().width;

        let currentIndex = 0;

        const setSlidePosition = (slide, index) => {
            slide.style.left = slideWidth * index + 'px';
        };
        // slides.forEach(setSlidePosition);

        const moveToSlide = (targetIndex) => {
            track.style.transform = 'translateX(-' + (slideWidth * targetIndex) + 'px)';
            currentIndex = targetIndex;
            updateDots(targetIndex);
        };

        // Create dots
        slides.forEach((_, index) => {
            const button = document.createElement('button');
            button.classList.add('carousel-dot');
            if (index === 0) button.classList.add('active');
            button.addEventListener('click', () => moveToSlide(index));
            dotsNav.appendChild(button);
        });

        const dots = Array.from(dotsNav.children);
        const updateDots = (targetIndex) => {
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === targetIndex);
            });
        };

        nextButton.addEventListener('click', () => {
            const newIndex = (currentIndex + 1) % slides.length;
            moveToSlide(newIndex);
        });

        prevButton.addEventListener('click', () => {
            const newIndex = (currentIndex - 1 + slides.length) % slides.length;
            moveToSlide(newIndex);
        });
        
        // Auto-resize on window change
        window.addEventListener('resize', () => {
             const newSlideWidth = slides[0].getBoundingClientRect().width;
             track.style.transform = 'translateX(-' + (newSlideWidth * currentIndex) + 'px)';
        });
    }

    // --- 5. FAQ Accordion --- //
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            header.setAttribute('aria-expanded', !isExpanded);
            if (!isExpanded) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = '0';
            }
        });
    });

    // --- 6. Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('cookie-accept');

    if (cookieBanner && acceptButton) {
        if (!localStorage.getItem('cookie_consent')) {
            cookieBanner.classList.add('show');
        }

        acceptButton.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'true');
            cookieBanner.classList.remove('show');
        });
    }

    // --- 7. Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    const heroSection = document.querySelector('.hero');

    if (stickyCTA && heroSection) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show CTA when hero is NOT intersecting (i.e., scrolled past it)
                stickyCTA.classList.toggle('visible', !entry.isIntersecting);
            });
        }, { threshold: 0 });

        ctaObserver.observe(heroSection);
    }

    // --- 8. Lightbox (Singleton) --- //
    // NOTE: This code is included to meet requirements, but will not be triggered
    // as there are no images with `data-km-image` attributes in the HTML.
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const closeBtn = lightbox.querySelector('.km-lightbox-close');
        const lightboxImg = lightbox.querySelector('.km-lightbox-content img');
        let currentImageSources = [];
        let currentIndex = -1;

        const openLightbox = (index) => {
            if (index < 0 || index >= currentImageSources.length) return;
            currentIndex = index;
            lightboxImg.src = currentImageSources[currentIndex];
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('visible'), 10);
            document.body.classList.add('no-scroll');
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            document.body.classList.remove('no-scroll');
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightboxImg.src = '';
            }, 300);
        };

        // Event delegation for opening
        document.body.addEventListener('click', (e) => {
            const trigger = e.target.closest('[data-km-image]');
            if (trigger) {
                e.preventDefault();
                const gallery = trigger.closest('[data-gallery]');
                if (gallery) {
                    const items = gallery.querySelectorAll('[data-km-image]');
                    currentImageSources = Array.from(items).map(item => item.dataset.kmImage);
                    const clickedIndex = Array.from(items).indexOf(trigger);
                    openLightbox(clickedIndex);
                } else {
                    currentImageSources = [trigger.dataset.kmImage];
                    openLightbox(0);
                }
            }
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('visible')) {
                closeLightbox();
            }
        });
    }
});