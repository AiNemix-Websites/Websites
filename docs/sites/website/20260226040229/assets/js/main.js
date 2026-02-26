document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header --- //
    const initStickyHeader = () => {
        const header = document.getElementById('main-header');
        if (!header) return;
        const scrollThreshold = 50;

        const handleScroll = () => {
            if (window.scrollY > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
    };

    // --- Mobile Menu --- //
    const initMobileMenu = () => {
        const toggleBtn = document.getElementById('mobile-menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        if (!toggleBtn || !mobileMenu) return;

        const toggleMenu = (forceClose = false) => {
            const isActive = mobileMenu.classList.contains('active');
            if (forceClose || isActive) {
                toggleBtn.classList.remove('active');
                toggleBtn.setAttribute('aria-expanded', 'false');
                mobileMenu.classList.remove('active');
                mobileMenu.setAttribute('aria-hidden', 'true');
                document.body.classList.remove('no-scroll');
            } else {
                toggleBtn.classList.add('active');
                toggleBtn.setAttribute('aria-expanded', 'true');
                mobileMenu.classList.add('active');
                mobileMenu.setAttribute('aria-hidden', 'false');
                document.body.classList.add('no-scroll');
            }
        };

        toggleBtn.addEventListener('click', () => toggleMenu());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                toggleMenu(true);
            }
        });
    };

    // --- Scroll Reveal Animations --- //
    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll('.reveal');
        if (revealElements.length === 0) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 100); // Staggered delay
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach(el => observer.observe(el));
    };

    // --- Cookie Banner --- //
    const initCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('cookie-accept');
        if (!banner || !acceptBtn) return;

        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            banner.classList.add('visible');
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'true');
            banner.classList.remove('visible');
        });
    };

    // --- Lightbox --- //
    const initLightbox = () => {
        const lightbox = document.getElementById('km-lightbox');
        if (!lightbox) return;

        const content = lightbox.querySelector('.km-lightbox-content');
        const imgEl = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.km-lightbox-close');
        const prevBtn = lightbox.querySelector('.km-lightbox-prev');
        const nextBtn = lightbox.querySelector('.km-lightbox-next');
        const backdrop = lightbox.querySelector('.km-lightbox-backdrop');

        let galleryImages = [];
        let currentIndex = -1;

        const openLightbox = (index) => {
            currentIndex = index;
            updateImage();
            lightbox.classList.add('active');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('no-scroll');
            document.addEventListener('keydown', handleKeydown);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('no-scroll');
            document.removeEventListener('keydown', handleKeydown);
        };

        const updateImage = () => {
            if (currentIndex < 0 || currentIndex >= galleryImages.length) return;
            const imageSrc = galleryImages[currentIndex].src;
            const imageAlt = galleryImages[currentIndex].alt;
            imgEl.src = imageSrc;
            imgEl.alt = imageAlt;
            prevBtn.style.display = (currentIndex === 0) ? 'none' : 'flex';
            nextBtn.style.display = (currentIndex === galleryImages.length - 1) ? 'none' : 'flex';
        };

        const showPrev = () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateImage();
            }
        };

        const showNext = () => {
            if (currentIndex < galleryImages.length - 1) {
                currentIndex++;
                updateImage();
            }
        };

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        };

        document.querySelectorAll('.lightbox-gallery img').forEach((img, index) => {
            galleryImages.push({ src: img.src, alt: img.alt });
            img.parentElement.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(index);
            });
        });

        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);
    };

    // --- Project Filter --- //
    const initProjectFilter = () => {
        const filterContainer = document.getElementById('project-filter');
        if (!filterContainer) return;

        const filterButtons = filterContainer.querySelectorAll('button');
        const projectGrid = document.getElementById('project-grid');
        const projects = projectGrid.querySelectorAll('.project-card');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;

                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                projects.forEach(project => {
                    if (filter === 'all' || project.dataset.category === filter) {
                        project.classList.remove('hide');
                    } else {
                        project.classList.add('hide');
                    }
                });
            });
        });
    };

    // --- Context CTA --- //
    const initContextCta = () => {
        const cta = document.getElementById('context-cta');
        if (!cta) return;
        const scrollThreshold = 400;

        const handleScroll = () => {
            if (window.scrollY > scrollThreshold) {
                cta.classList.add('visible');
            } else {
                cta.classList.remove('visible');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
    };

    // --- Initialize all modules --- //
    initStickyHeader();
    initMobileMenu();
    initScrollReveal();
    initCookieBanner();
    initLightbox();
    initProjectFilter();
    initContextCta();
});