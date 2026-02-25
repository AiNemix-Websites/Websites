document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header ---
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Mobile Navigation ---
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('open');
            mainNav.classList.toggle('open');
            document.body.classList.toggle('no-scroll');
        });
    }

    // --- Scroll Reveal Animation ---
    const revealItems = document.querySelectorAll('.reveal-item');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealItems.forEach(item => {
        revealObserver.observe(item);
    });

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookies = document.getElementById('accept-cookies');
    const declineCookies = document.getElementById('decline-cookies');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 1000);
    }

    if (acceptCookies) {
        acceptCookies.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('show');
        });
    }

    if (declineCookies) {
        declineCookies.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('show');
        });
    }

    // --- Global Lightbox ---
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item, .gallery-grid a'));
    let currentIndex = 0;

    function showImage(index) {
        if (index >= 0 && index < galleryItems.length) {
            const item = galleryItems[index];
            const imageSrc = item.getAttribute('href');
            const imageAlt = item.querySelector('img')?.getAttribute('alt') || 'Galeriebild';
            lightboxImg.setAttribute('src', imageSrc);
            lightboxImg.setAttribute('alt', imageAlt);
            currentIndex = index;
        }
    }

    function openLightbox(e) {
        e.preventDefault();
        const clickedItem = e.currentTarget;
        const itemIndex = galleryItems.indexOf(clickedItem);
        if (itemIndex !== -1) {
            showImage(itemIndex);
            lightbox.classList.add('show');
            document.body.classList.add('no-scroll');
            document.addEventListener('keydown', handleKeydown);
        }
    }

    function closeLightbox() {
        lightbox.classList.remove('show');
        document.body.classList.remove('no-scroll');
        document.removeEventListener('keydown', handleKeydown);
    }

    function showNext() { showImage((currentIndex + 1) % galleryItems.length); }
    function showPrev() { showImage((currentIndex - 1 + galleryItems.length) % galleryItems.length); }

    function handleKeydown(e) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    }

    if (lightbox && lightboxImg && galleryItems.length > 0) {
        galleryItems.forEach(item => item.addEventListener('click', openLightbox));
        lightbox.querySelector('.close-lightbox').addEventListener('click', closeLightbox);
        lightbox.querySelector('.next-lightbox').addEventListener('click', showNext);
        lightbox.querySelector('.prev-lightbox').addEventListener('click', showPrev);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    // --- Project Gallery Filter ---
    const filterContainer = document.querySelector('.gallery-filters');
    if (filterContainer) {
        const galleryGrid = document.getElementById('gallery-container');
        const items = galleryGrid.querySelectorAll('.gallery-item');

        filterContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                filterContainer.querySelector('.active').classList.remove('active');
                e.target.classList.add('active');

                const filter = e.target.dataset.filter;
                items.forEach(item => {
                    if (filter === 'all' || item.dataset.category === filter) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                });
            }
        });
    }
    
    // --- Sticky CTA Bar ---
    const stickyCta = document.querySelector('.sticky-cta-bar');
    if (stickyCta) {
        const contactPage = window.location.pathname.includes('/kontakt');
        const legalPages = window.location.pathname.includes('/impressum') || window.location.pathname.includes('/datenschutz');
        
        if (!contactPage && !legalPages) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 400) {
                    stickyCta.classList.add('show');
                } else {
                    stickyCta.classList.remove('show');
                }
            });
        }
    }

});