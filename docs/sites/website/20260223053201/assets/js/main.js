document.addEventListener('DOMContentLoaded', () => {

    // --- MOBILE NAVIGATION ---
    const initMobileNav = () => {
        const navToggle = document.querySelector('.mobile-nav-toggle');
        const navList = document.querySelector('.nav-list');
        if (!navToggle || !navList) return;

        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navList.classList.toggle('open');
            navToggle.classList.toggle('open');
            document.body.style.overflow = !isExpanded ? 'hidden' : '';
        });
    };

    // --- STICKY HEADER ---
    const initStickyHeader = () => {
        const header = document.getElementById('site-header');
        if (!header) return;
        const stickyThreshold = 50;
        window.addEventListener('scroll', () => {
            if (window.scrollY > stickyThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    };

    // --- SCROLL REVEAL ANIMATION ---
    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll('.scroll-reveal');
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            revealElements.forEach(el => el.classList.add('visible'));
            return;
        }
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        revealElements.forEach(el => observer.observe(el));
    };

    // --- COOKIE BANNER ---
    const initCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('cookie-accept');
        if (!banner || !acceptBtn) return;

        if (!localStorage.getItem('cookieConsent')) {
            banner.hidden = false;
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            banner.hidden = true;
        });
    };

    // --- BEFORE/AFTER SLIDER ---
    const initBeforeAfterSlider = () => {
        const slider = document.querySelector('.before-after-slider');
        if (!slider) return;

        const beforeImg = slider.querySelector('.before-img');
        const handle = slider.querySelector('.slider-handle');
        let isDragging = false;

        const moveHandler = (x) => {
            const rect = slider.getBoundingClientRect();
            let newX = x - rect.left;
            if (newX < 0) newX = 0;
            if (newX > rect.width) newX = rect.width;
            const percentage = (newX / rect.width) * 100;
            beforeImg.style.width = percentage + '%';
            handle.style.left = percentage + '%';
        };

        handle.addEventListener('mousedown', () => { isDragging = true; });
        document.addEventListener('mouseup', () => { isDragging = false; });
        document.addEventListener('mousemove', (e) => {
            if (isDragging) moveHandler(e.clientX);
        });

        handle.addEventListener('touchstart', () => { isDragging = true; });
        document.addEventListener('touchend', () => { isDragging = false; });
        document.addEventListener('touchmove', (e) => {
            if (isDragging) moveHandler(e.touches[0].clientX);
        });
    };

    // --- TESTIMONIAL CAROUSEL ---
    const initCarousel = () => {
        const carousel = document.querySelector('.testimonial-carousel');
        if (!carousel) return;

        const wrapper = carousel.closest('.testimonial-carousel-wrapper');
        const prevBtn = wrapper.querySelector('.carousel-prev');
        const nextBtn = wrapper.querySelector('.carousel-next');
        const dotsContainer = wrapper.querySelector('.carousel-dots');
        const slides = Array.from(carousel.children);
        let currentIndex = 0;

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });

        const dots = Array.from(dotsContainer.children);

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        updateCarousel();
    };

    // --- GLOBAL LIGHTBOX ---
    const initLightbox = () => {
        const lightbox = document.getElementById('km-lightbox');
        if (!lightbox) return;

        const contentImg = lightbox.querySelector('.lightbox-content img');
        const closeBtn = lightbox.querySelector('.close-lightbox');
        const prevBtn = lightbox.querySelector('.prev-lightbox');
        const nextBtn = lightbox.querySelector('.next-lightbox');
        const triggers = document.querySelectorAll('.lightbox-trigger');
        let gallery = [];
        let currentIndex = 0;

        triggers.forEach((trigger, index) => {
            const imageSrc = trigger.dataset.kmImage || trigger.src;
            const altText = trigger.alt || 'Galeriebild';
            gallery.push({ src: imageSrc, alt: altText });

            trigger.addEventListener('click', () => {
                currentIndex = index;
                showImage(currentIndex);
                openLightbox();
            });
        });

        const showImage = (index) => {
            const imgPath = contentImg.src.includes('/leistungen/') ? '../' + gallery[index].src : gallery[index].src;
            contentImg.src = imgPath;
            contentImg.alt = gallery[index].alt;
        };

        const openLightbox = () => {
            lightbox.hidden = false;
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            lightbox.hidden = true;
            document.body.style.overflow = '';
        };

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + gallery.length) % gallery.length;
            showImage(currentIndex);
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % gallery.length;
            showImage(currentIndex);
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.hidden) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prevBtn.click();
            if (e.key === 'ArrowRight') nextBtn.click();
        });
    };
    
    // --- STICKY CTA BAR ---
    const initStickyCtaBar = () => {
        const bar = document.getElementById('sticky-cta-bar');
        if (!bar) return;
        const hero = document.querySelector('.hero');
        if (!hero) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show bar when hero is NOT intersecting (i.e., scrolled past it)
                if (!entry.isIntersecting) {
                    bar.classList.add('visible');
                } else {
                    bar.classList.remove('visible');
                }
            });
        }, { threshold: 0 });

        observer.observe(hero);
    };

    // --- INITIALIZE ALL MODULES ---
    initMobileNav();
    initStickyHeader();
    initScrollReveal();
    initCookieBanner();
    initBeforeAfterSlider();
    initCarousel();
    initLightbox();
    initStickyCtaBar();
});