document.addEventListener('DOMContentLoaded', function() {

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- Sticky Header ---
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

    // --- Mobile Menu ---
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
            mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('open');
            document.body.classList.toggle('no-scroll');
        });
    }

    // --- Scroll Reveal Animation ---
    if (!isReducedMotion) {
        const revealElements = document.querySelectorAll('.stagger-reveal');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
    }

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (question && answer) {
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                if (!isExpanded) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    answer.style.maxHeight = '0';
                }
            });
        }
    });

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => {
                cookieBanner.classList.add('visible');
            }, 1000);
        }
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Contextual CTA ---
    const contextCta = document.getElementById('context-cta');
    if (contextCta) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > window.innerHeight * 0.5) {
                contextCta.classList.add('visible');
            } else {
                contextCta.classList.remove('visible');
            }
        });
    }

    // --- Lightbox ---
    const lightbox = document.getElementById('km-lightbox');
    const lightboxTriggers = document.querySelectorAll('[data-lightbox-trigger]');
    let galleryImages = [];
    let currentIndex = 0;

    if (lightbox && lightboxTriggers.length > 0) {
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');

        lightboxTriggers.forEach((trigger, index) => {
            const imageSrc = trigger.dataset.kmImage || trigger.src;
            if (imageSrc) {
                galleryImages.push(imageSrc);
                trigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    currentIndex = galleryImages.indexOf(imageSrc);
                    openLightbox();
                });
            }
        });

        function updateImage() {
            if (galleryImages.length > 0) {
                lightboxImage.src = '../' + galleryImages[currentIndex];
                 // Handle root path for index.html
                if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
                    lightboxImage.src = galleryImages[currentIndex];
                }
            }
        }

        function openLightbox() {
            updateImage();
            lightbox.classList.add('visible');
            document.body.classList.add('no-scroll');
            addLightboxListeners();
        }

        function closeLightbox() {
            lightbox.classList.remove('visible');
            document.body.classList.remove('no-scroll');
            removeLightboxListeners();
        }

        function showPrev() {
            currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
            updateImage();
        }

        function showNext() {
            currentIndex = (currentIndex + 1) % galleryImages.length;
            updateImage();
        }

        function handleKeydown(e) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        }

        function addLightboxListeners() {
            closeBtn.addEventListener('click', closeLightbox);
            prevBtn.addEventListener('click', showPrev);
            nextBtn.addEventListener('click', showNext);
            lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
            document.addEventListener('keydown', handleKeydown);
        }

        function removeLightboxListeners() {
            closeBtn.removeEventListener('click', closeLightbox);
            prevBtn.removeEventListener('click', showPrev);
            nextBtn.removeEventListener('click', showNext);
            document.removeEventListener('keydown', handleKeydown);
        }
    }

    // --- Anchor Nav for Services Page ---
    const anchorNav = document.querySelector('.anchor-nav');
    if (anchorNav) {
        const navLinks = anchorNav.querySelectorAll('a');
        const sections = document.querySelectorAll('.service-detail-item');

        const observerOptions = {
            rootMargin: '-100px 0px -50% 0px',
            threshold: 0
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => sectionObserver.observe(section));
    }
});