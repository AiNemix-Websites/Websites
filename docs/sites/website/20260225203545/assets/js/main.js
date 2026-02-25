document.addEventListener('DOMContentLoaded', () => {

    // --- STICKY HEADER --- //
    const initStickyHeader = () => {
        const header = document.querySelector('.sticky-header');
        if (!header) return;
        const scrollThreshold = 50;
        window.addEventListener('scroll', () => {
            if (window.scrollY > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    };

    // --- MOBILE NAVIGATION --- //
    const initMobileNav = () => {
        const toggleBtn = document.querySelector('.mobile-nav-toggle');
        const drawer = document.querySelector('.mobile-nav-drawer');
        if (!toggleBtn || !drawer) return;

        toggleBtn.addEventListener('click', () => {
            const isOpen = drawer.classList.toggle('open');
            toggleBtn.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });
    };

    // --- SCROLL REVEAL --- //
    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        if (revealElements.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
    };

    // --- TESTIMONIALS CAROUSEL --- //
    const initTestimonialsCarousel = () => {
        const carousel = document.querySelector('.testimonial-carousel');
        if (!carousel) return;

        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        if (slides.length <= 1) return;

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.dot');

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
        };

        const goToSlide = (index) => {
            currentIndex = index;
            updateCarousel();
        };

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
            updateCarousel();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
            updateCarousel();
        });

        updateCarousel();
    };

    // --- PROJECT GALLERY FILTER --- //
    const initProjectFilter = () => {
        const filterContainer = document.querySelector('.project-filters');
        if (!filterContainer) return;

        const filterBtns = filterContainer.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.dataset.filter;

                projectCards.forEach(card => {
                    if (filter === 'all' || card.dataset.category.includes(filter)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    };

    // --- GLOBAL LIGHTBOX --- //
    const initLightbox = () => {
        const lightbox = document.getElementById('km-lightbox');
        if (!lightbox) return;

        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.close-lightbox');
        const prevBtn = lightbox.querySelector('.prev-lightbox');
        const nextBtn = lightbox.querySelector('.next-lightbox');
        let currentGroup = [];
        let currentIndex = -1;

        const showImage = (index) => {
            if (index < 0 || index >= currentGroup.length) return;
            currentIndex = index;
            const imgSrc = currentGroup[currentIndex].dataset.kmImage || currentGroup[currentIndex].src;
            const imgAlt = currentGroup[currentIndex].alt;
            lightboxImg.src = (imgSrc.startsWith('..')) ? imgSrc : '../' + imgSrc;
            lightboxImg.alt = imgAlt;
            prevBtn.style.display = (currentIndex === 0) ? 'none' : 'block';
            nextBtn.style.display = (currentIndex === currentGroup.length - 1) ? 'none' : 'block';
        };

        document.body.addEventListener('click', (e) => {
            if (e.target.classList.contains('lightbox-trigger')) {
                e.preventDefault();
                const groupName = e.target.dataset.lightboxGroup;
                currentGroup = Array.from(document.querySelectorAll(`.lightbox-trigger[data-lightbox-group='${groupName}']`));
                const clickedIndex = currentGroup.indexOf(e.target);
                
                showImage(clickedIndex);
                lightbox.classList.add('show');
                document.body.style.overflow = 'hidden';
            }
        });

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            document.body.style.overflow = '';
            lightboxImg.src = ''; // Clear src to stop loading
        };

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
        nextBtn.addEventListener('click', () => showImage(currentIndex + 1));

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('show')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prevBtn.click();
            if (e.key === 'ArrowRight') nextBtn.click();
        });
    };

    // --- COOKIE BANNER --- //
    const initCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('accept-cookies');
        if (!banner || !acceptBtn) return;

        if (!localStorage.getItem('cookieConsent')) {
            banner.classList.add('show');
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            banner.classList.remove('show');
        });
    };

    // --- STICKY CTA --- //
    const initStickyCTA = () => {
        const cta = document.getElementById('sticky-cta');
        if (!cta) return;
        const scrollThreshold = 400;

        window.addEventListener('scroll', () => {
            if (window.scrollY > scrollThreshold) {
                cta.classList.add('show');
            } else {
                cta.classList.remove('show');
            }
        });
    };

    // --- INITIALIZE ALL MODULES --- //
    initStickyHeader();
    initMobileNav();
    initScrollReveal();
    initTestimonialsCarousel();
    initProjectFilter();
    initLightbox();
    initCookieBanner();
    initStickyCTA();
});