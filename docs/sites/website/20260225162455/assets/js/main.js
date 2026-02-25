document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header --- //
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Mobile Navigation --- //
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav-drawer');
    let isMenuOpen = false;

    function closeMenu() {
        if (!isMenuOpen) return;
        mobileNav.classList.remove('is-open');
        document.body.classList.remove('scroll-locked');
        menuToggle.setAttribute('aria-expanded', 'false');
        isMenuOpen = false;
        document.removeEventListener('keydown', handleEscKey);
    }

    function openMenu() {
        if (isMenuOpen) return;
        mobileNav.classList.add('is-open');
        document.body.classList.add('scroll-locked');
        menuToggle.setAttribute('aria-expanded', 'true');
        isMenuOpen = true;
        document.addEventListener('keydown', handleEscKey);
    }

    function handleEscKey(e) {
        if (e.key === 'Escape') {
            closeMenu();
        }
    }

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', () => {
            isMenuOpen ? closeMenu() : openMenu();
        });

        // Close on backdrop click (by creating a temporary overlay)
        document.addEventListener('click', (e) => {
            if (isMenuOpen && !mobileNav.contains(e.target) && !menuToggle.contains(e.target)) {
                closeMenu();
            }
        });
    }

    // --- Scroll Reveal Animations --- //
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.revealDelay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        observer.observe(el);
    });

    // --- Global Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-content img');
    const closeBtn = lightbox.querySelector('.close-btn');
    const prevBtn = lightbox.querySelector('.prev-btn');
    const nextBtn = lightbox.querySelector('.next-btn');
    const galleryImages = Array.from(document.querySelectorAll('.lightbox-trigger'));
    let currentIndex = 0;

    function showImage(index) {
        if (index < 0 || index >= galleryImages.length) return;
        const imgElement = galleryImages[index];
        const imgSrc = imgElement.dataset.kmImage || imgElement.src;
        lightboxImg.src = imgElement.src.startsWith('..') ? '../' + imgSrc : imgSrc;
        lightboxImg.alt = imgElement.alt;
        currentIndex = index;
        prevBtn.style.display = index === 0 ? 'none' : 'block';
        nextBtn.style.display = index === galleryImages.length - 1 ? 'none' : 'block';
    }

    function openLightbox(index) {
        showImage(index);
        lightbox.classList.add('is-visible');
        document.body.classList.add('scroll-locked');
        document.addEventListener('keydown', handleLightboxKeys);
    }

    function closeLightbox() {
        lightbox.classList.remove('is-visible');
        document.body.classList.remove('scroll-locked');
        document.removeEventListener('keydown', handleLightboxKeys);
    }

    function handleLightboxKeys(e) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
        if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    }

    if (lightbox && galleryImages.length > 0) {
        galleryImages.forEach((img, index) => {
            img.addEventListener('click', () => openLightbox(index));
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
        nextBtn.addEventListener('click', () => showImage(currentIndex + 1));
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');

    if (cookieBanner && acceptBtn) {
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => {
                cookieBanner.classList.add('is-visible');
            }, 1000);
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('is-visible');
        });
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const heroSection = document.querySelector('.hero');
        const heroHeight = heroSection ? heroSection.offsetHeight : 500;

        window.addEventListener('scroll', () => {
            if (window.scrollY > heroHeight) {
                stickyCTA.classList.add('is-visible');
            } else {
                stickyCTA.classList.remove('is-visible');
            }
        });
    }
    
    // --- Contact Form Subject from URL --- //
    const urlParams = new URLSearchParams(window.location.search);
    const subject = urlParams.get('subject');
    if (subject) {
        const messageField = document.getElementById('message');
        if (messageField) {
            messageField.value = `Anfrage bezüglich: ${subject}\n\n`;
        }
    }

});