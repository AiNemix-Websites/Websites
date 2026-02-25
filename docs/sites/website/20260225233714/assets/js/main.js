document.addEventListener('DOMContentLoaded', function() {

    // --- Helper to prevent event listener duplication ---
    const eventListeners = new WeakMap();
    function addSafeEventListener(element, event, handler) {
        if (!eventListeners.has(element)) {
            eventListeners.set(element, new Map());
        }
        const elementListeners = eventListeners.get(element);
        if (!elementListeners.has(event)) {
            element.addEventListener(event, handler);
            elementListeners.set(event, handler);
        }
    }

    // --- Sticky Header ---
    const header = document.getElementById('main-header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll);
    }

    // --- Mobile Menu ---
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        const toggleMenu = () => {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll', mobileMenu.classList.contains('active'));
        };
        menuToggle.addEventListener('click', toggleMenu);
        // Close on backdrop click
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) toggleMenu();
        });
    }

    // --- Accordion ---
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        if (header && content) {
            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                // Close all items
                // accordionItems.forEach(i => {
                //     i.classList.remove('active');
                //     i.querySelector('.accordion-content').style.maxHeight = null;
                // });
                if (!isActive) {
                    item.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + 'px';
                } else {
                    item.classList.remove('active');
                    content.style.maxHeight = null;
                }
            });
        }
    });

    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal-group');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => observer.observe(el));

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.classList.add('active');
        }
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('active');
        });
    }

    // --- Sticky CTA ---
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                stickyCTA.classList.add('visible');
            } else {
                stickyCTA.classList.remove('visible');
            }
        });
    }

    // --- Lightbox --- 
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImg = lightbox ? lightbox.querySelector('.lightbox-content img') : null;
    const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
    let currentIndex = 0;
    const galleryImages = Array.from(lightboxTriggers).map(img => ({ 
        src: img.dataset.kmImage || img.src,
        alt: img.alt
    }));

    if (lightbox && lightboxImg && galleryImages.length > 0) {
        const closeBtn = lightbox.querySelector('.close-btn');
        const prevBtn = lightbox.querySelector('.prev-btn');
        const nextBtn = lightbox.querySelector('.next-btn');

        function showImage(index) {
            if (index < 0 || index >= galleryImages.length) return;
            const image = galleryImages[index];
            // Use the correct relative path for src
            const currentPath = window.location.pathname;
            const isSubfolder = currentPath.includes('/leistungen/') || currentPath.includes('/ueber-uns/') || currentPath.includes('/kontakt/') || currentPath.includes('/faq/') || currentPath.includes('/impressum/') || currentPath.includes('/datenschutz/');
            const prefix = isSubfolder ? '../' : './';
            lightboxImg.src = prefix + image.src;
            lightboxImg.alt = image.alt;
            currentIndex = index;
        }

        function openLightbox(index) {
            lightbox.classList.add('active');
            document.body.classList.add('no-scroll');
            showImage(index);
            addSafeEventListener(document, 'keydown', handleKeydown);
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.classList.remove('no-scroll');
            document.removeEventListener('keydown', handleKeydown);
        }

        function showNext() { showImage((currentIndex + 1) % galleryImages.length); }
        function showPrev() { showImage((currentIndex - 1 + galleryImages.length) % galleryImages.length); }

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
        };

        lightboxTriggers.forEach((trigger, index) => {
            trigger.addEventListener('click', () => openLightbox(index));
        });

        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }
});