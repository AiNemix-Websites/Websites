(function() {
    'use strict';

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

        // --- Mobile Menu --- //
        const menuToggle = document.getElementById('mobile-menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        if (menuToggle && mobileMenu) {
            menuToggle.addEventListener('click', () => {
                const isActive = mobileMenu.classList.toggle('active');
                menuToggle.classList.toggle('active');
                menuToggle.setAttribute('aria-expanded', isActive);
                mobileMenu.setAttribute('aria-hidden', !isActive);
                document.body.classList.toggle('no-scroll', isActive);
            });
        }

        // --- Scroll Reveal --- //
        const revealElements = document.querySelectorAll('[data-scroll-reveal]');
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 100); // Staggered delay
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });

        // --- FAQ Accordion --- //
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

        // --- Before/After Slider --- //
        const sliders = document.querySelectorAll('.comparison-slider');
        sliders.forEach(slider => {
            const afterImage = slider.querySelector('.after-image');
            const rangeInput = slider.querySelector('.slider');
            if(afterImage && rangeInput) {
                rangeInput.addEventListener('input', (e) => {
                    afterImage.style.clipPath = `polygon(${e.target.value}% 0, 100% 0, 100% 100%, ${e.target.value}% 100%)`;
                });
            }
        });

        // --- Before/After Tabs --- //
        const tabsContainer = document.querySelector('.tabs');
        if(tabsContainer) {
            const tabLinks = tabsContainer.querySelectorAll('.tab-link');
            const tabContents = document.querySelectorAll('.tab-content');

            tabLinks.forEach(link => {
                link.addEventListener('click', () => {
                    const tabId = link.dataset.tab;
                    
                    tabLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');

                    tabContents.forEach(content => {
                        if(content.id === tabId) {
                            content.classList.add('active');
                        } else {
                            content.classList.remove('active');
                        }
                    });
                });
            });
        }

        // --- Cookie Banner --- //
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

        // --- Lightbox --- //
        const lightbox = document.getElementById('km-lightbox');
        const lightboxImg = lightbox.querySelector('.lightbox-content');
        const galleryItems = Array.from(document.querySelectorAll('.gallery-grid .gallery-item img'));
        let currentIndex = 0;

        function showImage(index) {
            const img = galleryItems[index];
            if (img) {
                lightboxImg.src = img.getAttribute('data-km-image');
                lightboxImg.alt = img.alt;
                currentIndex = index;
                lightbox.style.display = 'flex';
                setTimeout(() => lightbox.classList.add('visible'), 10);
                document.body.classList.add('no-scroll');
            }
        }

        function hideLightbox() {
            lightbox.classList.remove('visible');
            document.body.classList.remove('no-scroll');
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightboxImg.src = '';
            }, 300);
        }

        galleryItems.forEach((img, index) => {
            img.addEventListener('click', () => showImage(index));
        });

        if (lightbox) {
            lightbox.querySelector('.close-btn').addEventListener('click', hideLightbox);
            lightbox.querySelector('.prev-btn').addEventListener('click', () => showImage((currentIndex - 1 + galleryItems.length) % galleryItems.length));
            lightbox.querySelector('.next-btn').addEventListener('click', () => showImage((currentIndex + 1) % galleryItems.length));
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) hideLightbox();
            });
            document.addEventListener('keydown', (e) => {
                if (lightbox.classList.contains('visible')) {
                    if (e.key === 'Escape') hideLightbox();
                    if (e.key === 'ArrowLeft') showImage((currentIndex - 1 + galleryItems.length) % galleryItems.length);
                    if (e.key === 'ArrowRight') showImage((currentIndex + 1) % galleryItems.length);
                }
            });
        }

        // --- Sticky CTA --- //
        const stickyCTA = document.getElementById('sticky-cta');
        if (stickyCTA) {
            const ctaObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    // Show when hero is NOT intersecting (scrolled past it)
                    if (!entry.isIntersecting) {
                        stickyCTA.classList.add('visible');
                    } else {
                        stickyCTA.classList.remove('visible');
                    }
                });
            }, { threshold: 0.1 });

            const heroSection = document.querySelector('.hero');
            if (heroSection) {
                ctaObserver.observe(heroSection);
            }
        }

    });
})();