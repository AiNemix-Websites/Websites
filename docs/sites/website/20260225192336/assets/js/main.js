document.addEventListener('DOMContentLoaded', function() {

    // --- 1. COMMON UTILITIES --- //
    const select = (el, all = false) => all ? document.querySelectorAll(el) : document.querySelector(el);
    const body = select('body');

    // --- 2. STICKY HEADER --- //
    const header = select('.site-header');
    if (header) {
        const handleScroll = () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check
    }

    // --- 3. MOBILE NAVIGATION --- //
    const mobileNavToggle = select('.mobile-nav-toggle');
    const mobileNavContainer = select('.mobile-nav-container');
    const mobileNav = select('.mobile-nav');

    if (mobileNavToggle && mobileNavContainer && mobileNav) {
        const toggleNav = (isOpen) => {
            const open = typeof isOpen === 'boolean' ? isOpen : !mobileNavToggle.classList.contains('open');
            mobileNavToggle.classList.toggle('open', open);
            mobileNav.classList.toggle('open', open);
            mobileNavContainer.classList.toggle('open', open);
            mobileNavToggle.setAttribute('aria-expanded', open);
            body.classList.toggle('scroll-locked', open);
        };

        mobileNavToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleNav();
        });

        mobileNavContainer.addEventListener('click', () => toggleNav(false));
        mobileNav.addEventListener('click', (e) => e.stopPropagation());
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
                toggleNav(false);
            }
        });
    }

    // --- 4. SCROLL REVEAL ANIMATIONS --- //
    const revealItems = select('.reveal-item', true);
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealItems.forEach(item => revealObserver.observe(item));

    // --- 5. TESTIMONIAL CAROUSEL --- //
    const carouselContainer = select('.testimonial-carousel-container');
    if (carouselContainer) {
        const carousel = carouselContainer.querySelector('.testimonial-carousel');
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const dotsContainer = carouselContainer.querySelector('.carousel-dots');
        let currentIndex = 0;

        if (slides.length > 1) {
            // Create dots
            slides.forEach((_, i) => {
                const button = document.createElement('button');
                button.setAttribute('aria-label', `Go to slide ${i + 1}`);
                button.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(button);
            });
            const dots = dotsContainer.querySelectorAll('button');

            const updateCarousel = () => {
                carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
                dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
            };

            const goToSlide = (index) => {
                currentIndex = index;
                updateCarousel();
            };

            // Clone slides for infinite loop effect
            const firstClone = slides[0].cloneNode(true);
            const lastClone = slides[slides.length - 1].cloneNode(true);
            carousel.appendChild(firstClone);
            carousel.insertBefore(lastClone, slides[0]);

            // Wrap slides
            const wrapper = document.createElement('div');
            wrapper.classList.add('carousel-wrapper');
            carousel.parentNode.insertBefore(wrapper, carousel);
            wrapper.appendChild(carousel);
            
            // Apply styles after DOM manipulation
            carousel.style.display = 'flex';
            carousel.style.transition = 'transform 0.5s ease-in-out';
            slides.forEach(slide => slide.style.flex = '0 0 100%');

            updateCarousel();
            setInterval(() => {
                currentIndex = (currentIndex + 1) % slides.length;
                updateCarousel();
            }, 5000);
        }
    }

    // --- 6. COOKIE BANNER --- //
    const cookieBannerContainer = select('#cookie-banner');
    if (cookieBannerContainer && !localStorage.getItem('cookieConsent')) {
        // Inject banner content if it's not hardcoded
        if (!cookieBannerContainer.innerHTML.trim()) {
            cookieBannerContainer.innerHTML = `
                <div class='cookie-card'>
                    <p>Wir verwenden notwendige Cookies, um die Funktionalität unserer Website zu gewährleisten.</p>
                    <div class='cookie-actions'>
                        <button id='accept-cookies' class='btn btn-primary'>Verstanden</button>
                        <a href='${cookieBannerContainer.dataset.privacyUrl || 'datenschutz/'}' class='btn btn-link'>Mehr erfahren</a>
                    </div>
                </div>`;
        }
        
        const acceptButton = select('#accept-cookies');
        setTimeout(() => {
            cookieBannerContainer.classList.add('visible');
        }, 500);

        if (acceptButton) {
            acceptButton.addEventListener('click', () => {
                localStorage.setItem('cookieConsent', 'true');
                cookieBannerContainer.classList.remove('visible');
            });
        }
    }

    // --- 7. GLOBAL LIGHTBOX --- //
    const lightbox = select('#km-lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('.lightbox-content');
        const closeBtn = lightbox.querySelector('.close-lightbox');
        const prevBtn = lightbox.querySelector('.prev-lightbox');
        const nextBtn = lightbox.querySelector('.next-lightbox');
        let galleryItems = [];
        let currentIndex = -1;

        const updateLightboxNav = () => {
            prevBtn.style.display = currentIndex > 0 ? 'block' : 'none';
            nextBtn.style.display = currentIndex < galleryItems.length - 1 ? 'block' : 'none';
        };

        const showImage = (index) => {
            if (index < 0 || index >= galleryItems.length) return;
            currentIndex = index;
            // Use data-km-image for the full-res version
            const imagePath = galleryItems[index].dataset.kmImage || galleryItems[index].src;
            const pagePath = window.location.pathname;
            const isSubfolder = pagePath.split('/').length > 2 && pagePath.endsWith('/');
            lightboxImg.src = isSubfolder ? `../${imagePath}` : imagePath;
            updateLightboxNav();
        };

        const openLightbox = (e) => {
            const clickedItem = e.target.closest('.gallery-item');
            if (clickedItem) {
                galleryItems = Array.from(select('.gallery-item', true));
                const index = galleryItems.indexOf(clickedItem);
                showImage(index);
                lightbox.style.display = 'flex';
                setTimeout(() => lightbox.classList.add('visible'), 10);
                body.classList.add('scroll-locked');
            }
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            body.classList.remove('scroll-locked');
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightboxImg.src = '';
            }, 300);
        };

        document.addEventListener('click', openLightbox);
        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
        nextBtn.addEventListener('click', () => showImage(currentIndex + 1));
        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
                if (e.key === 'ArrowRight') showImage(currentIndex + 1);
            }
        });
    }

    // --- 8. STICKY CONTEXT CTA --- //
    const stickyCta = select('#sticky-cta');
    if (stickyCta) {
        // Inject CTA content if it's not hardcoded
        if (!stickyCta.innerHTML.trim()) {
             const isSubfolder = window.location.pathname.split('/').length > 2 && window.location.pathname.endsWith('/');
             const contactPath = isSubfolder ? '../kontakt/' : 'kontakt/';
             stickyCta.innerHTML = `<a href='${contactPath}' class='btn btn-primary'>Termin anfragen</a>`;
        }

        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when the hero is NOT intersecting (i.e., scrolled past it)
                stickyCta.classList.toggle('visible', !entry.isIntersecting);
            });
        }, { threshold: 0 });

        const heroSection = select('.hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

    // --- 9. INJECT GLOBAL COMPONENTS ON SUBPAGES --- //
    // This ensures that components like lightbox and cookie banner work even if forgotten in the subpage HTML
    const injectGlobalComponents = () => {
        if (!select('#km-lightbox')) {
            const lightboxHTML = `<div id='km-lightbox' class='km-lightbox' style='display: none;'><button class='close-lightbox' aria-label='Galerie schließen'>&times;</button><button class='prev-lightbox' aria-label='Voriges Bild'>&#10094;</button><img src='' alt='Großansicht Bild' class='lightbox-content'><button class='next-lightbox' aria-label='Nächstes Bild'>&#10095;</button></div>`;
            body.insertAdjacentHTML('beforeend', lightboxHTML);
        }
        if (!select('#cookie-banner')) {
            const isSubfolder = window.location.pathname.split('/').length > 2 && window.location.pathname.endsWith('/');
            const privacyPath = isSubfolder ? '../datenschutz/' : 'datenschutz/';
            const bannerHTML = `<div id='cookie-banner' class='cookie-banner-container' data-privacy-url='${privacyPath}'></div>`;
            body.insertAdjacentHTML('beforeend', bannerHTML);
        }
        if (!select('#sticky-cta')) {
             const ctaHTML = `<div class='sticky-cta' id='sticky-cta'></div>`;
             body.insertAdjacentHTML('beforeend', ctaHTML);
        }
    };

    // Check if we are on a subpage and run injections if needed
    if (window.location.pathname !== '/' && !window.location.pathname.endsWith('index.html')) {
        injectGlobalComponents();
    }
});