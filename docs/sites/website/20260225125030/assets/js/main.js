document.addEventListener('DOMContentLoaded', () => {

    const init = () => {
        handleMobileMenu();
        handleStickyHeader();
        handleScrollReveal();
        handleAccordion();
        handleCookieBanner();
        handleLightbox();
        // A simple submit handler to prevent default form action
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Vielen Dank für Ihre Nachricht! Wir werden uns in Kürze bei Ihnen melden.');
                contactForm.reset();
            });
        }
    };

    const handleMobileMenu = () => {
        const toggleBtn = document.getElementById('mobile-menu-toggle');
        const closeBtn = document.getElementById('mobile-menu-close');
        const mobileMenu = document.getElementById('mobile-menu');

        if (!toggleBtn || !mobileMenu || !closeBtn) return;

        const openMenu = () => {
            document.body.classList.add('menu-open');
            mobileMenu.setAttribute('aria-hidden', 'false');
            toggleBtn.setAttribute('aria-expanded', 'true');
        };

        const closeMenu = () => {
            document.body.classList.remove('menu-open');
            mobileMenu.setAttribute('aria-hidden', 'true');
            toggleBtn.setAttribute('aria-expanded', 'false');
        };

        toggleBtn.addEventListener('click', openMenu);
        closeBtn.addEventListener('click', closeMenu);
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) closeMenu();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
                closeMenu();
            }
        });
    };

    const handleStickyHeader = () => {
        const header = document.getElementById('main-header');
        if (!header) return;

        const onScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
    };

    const handleScrollReveal = () => {
        const revealElements = document.querySelectorAll('[data-reveal]');
        if (revealElements.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.dataset.reveal === 'stagger') {
                        const children = entry.target.children;
                        for (let i = 0; i < children.length; i++) {
                            children[i].style.transitionDelay = `${i * 100}ms`;
                            children[i].classList.add('is-visible');
                        }
                    } else {
                        entry.target.classList.add('is-visible');
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
    };

    const handleAccordion = () => {
        const accordionItems = document.querySelectorAll('.accordion-item');
        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            const content = item.querySelector('.accordion-content');

            header.addEventListener('click', () => {
                const isExpanded = header.getAttribute('aria-expanded') === 'true';
                header.setAttribute('aria-expanded', !isExpanded);
                content.style.maxHeight = isExpanded ? null : content.scrollHeight + 'px';
            });
        });
    };

    const handleCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('cookie-accept');
        if (!banner || !acceptBtn) return;

        if (!localStorage.getItem('cookieConsent')) {
            banner.classList.add('visible');
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            banner.classList.remove('visible');
            setTimeout(() => { banner.style.display = 'none'; }, 300);
        });
    };

    const handleLightbox = () => {
        const lightbox = document.getElementById('km-lightbox');
        if (!lightbox) return;

        const galleryImages = Array.from(document.querySelectorAll('[data-lightbox-src]'));
        if (galleryImages.length === 0) return;

        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.close-btn');
        const prevBtn = lightbox.querySelector('.prev-btn');
        const nextBtn = lightbox.querySelector('.next-btn');
        let currentIndex = 0;

        const showImage = (index) => {
            currentIndex = index;
            lightboxImg.src = galleryImages[currentIndex].dataset.lightboxSrc;
            prevBtn.style.display = (galleryImages.length > 1) ? 'block' : 'none';
            nextBtn.style.display = (galleryImages.length > 1) ? 'block' : 'none';
        };

        const openLightbox = (index) => {
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('visible'), 10);
            document.body.classList.add('lightbox-open');
            showImage(index);
            addLightboxEventListeners();
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            document.body.classList.remove('lightbox-open');
            setTimeout(() => { lightbox.style.display = 'none'; }, 300);
            removeLightboxEventListeners();
        };

        const showPrev = () => showImage((currentIndex - 1 + galleryImages.length) % galleryImages.length);
        const showNext = () => showImage((currentIndex + 1) % galleryImages.length);

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        };

        const addLightboxEventListeners = () => {
            closeBtn.addEventListener('click', closeLightbox);
            prevBtn.addEventListener('click', showPrev);
            nextBtn.addEventListener('click', showNext);
            lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
            document.addEventListener('keydown', handleKeydown);
        };
        
        const removeLightboxEventListeners = () => {
            closeBtn.removeEventListener('click', closeLightbox);
            prevBtn.removeEventListener('click', showPrev);
            nextBtn.removeEventListener('click', showNext);
            lightbox.removeEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
            document.removeEventListener('keydown', handleKeydown);
        };

        galleryImages.forEach((img, index) => {
            img.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(index);
            });
        });
    };

    init();
});