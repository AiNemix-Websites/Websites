document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header --- //
    const header = document.getElementById('site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('is-scrolled');
            } else {
                header.classList.remove('is-scrolled');
            }
        });
    }

    // --- Mobile Navigation --- //
    const navToggle = document.getElementById('mobile-nav-toggle');
    const mainNav = document.getElementById('main-nav');
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isOpen);
            navToggle.classList.toggle('is-active');
            mainNav.classList.toggle('is-open');
            document.body.classList.toggle('no-scroll', !isOpen);
        });
    }

    // --- Scroll Animations --- //
    const animatedElements = document.querySelectorAll('.animate-in');
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.delay) || 0;
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    // --- Accordion --- //
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

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');

    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => {
                cookieBanner.classList.add('is-visible');
            }, 2000);
        }

        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('is-visible');
        });
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const heroSection = document.querySelector('.hero, .hero-subpage');
        let heroHeight = heroSection ? heroSection.offsetHeight : 400;

        window.addEventListener('scroll', () => {
            if (window.scrollY > heroHeight) {
                stickyCTA.classList.add('is-visible');
            } else {
                stickyCTA.classList.remove('is-visible');
            }
        });
    }
    
    // --- Lightbox (Singleton Pattern) --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const closeBtn = lightbox.querySelector('.close-btn');
        const prevBtn = lightbox.querySelector('.prev-btn');
        const nextBtn = lightbox.querySelector('.next-btn');
        const lightboxImg = lightbox.querySelector('img');
        let currentImageIndex = -1;
        let galleryImages = [];

        const openLightbox = (index) => {
            currentImageIndex = index;
            updateLightboxImage();
            document.body.classList.add('no-scroll');
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('is-visible'), 10);
            document.addEventListener('keydown', handleKeydown);
        };

        const closeLightbox = () => {
            document.body.classList.remove('no-scroll');
            lightbox.classList.remove('is-visible');
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightboxImg.src = '';
            }, 300);
            document.removeEventListener('keydown', handleKeydown);
        };

        const updateLightboxImage = () => {
            if (currentImageIndex >= 0 && currentImageIndex < galleryImages.length) {
                const imgData = galleryImages[currentImageIndex];
                lightboxImg.src = imgData.src;
                lightboxImg.alt = imgData.alt;
            }
            prevBtn.style.display = currentImageIndex > 0 ? 'block' : 'none';
            nextBtn.style.display = currentImageIndex < galleryImages.length - 1 ? 'block' : 'none';
        };

        const showPrev = () => {
            if (currentImageIndex > 0) {
                currentImageIndex--;
                updateLightboxImage();
            }
        };

        const showNext = () => {
            if (currentImageIndex < galleryImages.length - 1) {
                currentImageIndex++;
                updateLightboxImage();
            }
        };
        
        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        };

        document.querySelectorAll('[data-lightbox-trigger]').forEach(trigger => {
            const galleryId = trigger.dataset.gallery || 'default';
            const imageSrc = trigger.dataset.kmImage || trigger.querySelector('img')?.src;
            const imageAlt = trigger.dataset.alt || trigger.querySelector('img')?.alt || 'Detailansicht';

            if (!galleryImages.find(img => img.src === imageSrc)) {
                 galleryImages.push({ src: imageSrc, alt: imageAlt, gallery: galleryId });
            }
            
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const clickedIndex = galleryImages.findIndex(img => img.src === imageSrc);
                openLightbox(clickedIndex);
            });
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);
    }
});