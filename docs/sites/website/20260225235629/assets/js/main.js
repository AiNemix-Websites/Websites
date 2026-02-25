document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu --- //
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isOpen);
            mainNav.classList.toggle('mobile-drawer');
            mainNav.classList.toggle('open');
            document.body.classList.toggle('mobile-menu-open');
            document.body.classList.toggle('scroll-locked');
        });
    }

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

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));

    // --- Accordion --- //
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        if(header && content) {
            header.addEventListener('click', () => {
                const isExpanded = header.getAttribute('aria-expanded') === 'true';
                header.setAttribute('aria-expanded', !isExpanded);
                if (!isExpanded) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                } else {
                    content.style.maxHeight = '0';
                }
            });
        }
    });
    
    // --- FAQ Filter --- //
    const faqSearch = document.getElementById('faq-search');
    const faqAccordion = document.getElementById('faq-accordion');
    if (faqSearch && faqAccordion) {
        const items = faqAccordion.querySelectorAll('.accordion-item');
        const noResults = document.getElementById('faq-no-results');
        faqSearch.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            let visibleCount = 0;
            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    item.style.display = '';
                    visibleCount++;
                } else {
                    item.style.display = 'none';
                }
            });
            noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        });
    }

    // --- Testimonial Carousel --- //
    const carouselContainer = document.querySelector('.testimonial-carousel-container');
    if (carouselContainer) {
        const carousel = carouselContainer.querySelector('.testimonial-carousel');
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevButton = carouselContainer.querySelector('.carousel-prev');
        const nextButton = carouselContainer.querySelector('.carousel-next');
        const dotsContainer = carouselContainer.querySelector('.carousel-dots');
        let currentIndex = 0;

        function updateCarousel() {
            const slideWidth = slides[0].offsetWidth;
            carousel.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
            updateDots();
        }

        function updateDots() {
            if (!dotsContainer) return;
            const dots = dotsContainer.querySelectorAll('button');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        if (dotsContainer) {
            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
                dot.addEventListener('click', () => {
                    currentIndex = index;
                    updateCarousel();
                });
                dotsContainer.appendChild(dot);
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % slides.length;
                updateCarousel();
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                updateCarousel();
            });
        }
        
        let touchStartX = 0;
        carousel.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; });
        carousel.addEventListener('touchend', (e) => {
            let touchEndX = e.changedTouches[0].clientX;
            if (touchStartX - touchEndX > 50) nextButton.click();
            if (touchStartX - touchEndX < -50) prevButton.click();
        });

        window.addEventListener('resize', updateCarousel);
        updateCarousel();
    }

    // --- Interactive House --- //
    const house = document.getElementById('house-visualization');
    if (house) {
        const hotspots = house.querySelectorAll('.hotspot');
        const outputPanels = document.querySelectorAll('.output-panel');
        const defaultPanel = document.getElementById('output-default');

        const showPanel = (area) => {
            outputPanels.forEach(panel => {
                panel.classList.remove('active');
            });
            const targetPanel = document.getElementById(`output-${area}`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            } else {
                defaultPanel.classList.add('active');
            }
        };

        hotspots.forEach(hotspot => {
            const area = hotspot.dataset.area;
            hotspot.addEventListener('click', () => showPanel(area));
            hotspot.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    showPanel(area);
                }
            });
        });
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('cookie-accept');
    const declineButton = document.getElementById('cookie-decline');

    if (cookieBanner && acceptButton && declineButton) {
        const cookieConsent = localStorage.getItem('cookieConsent');
        if (!cookieConsent) {
            setTimeout(() => cookieBanner.classList.add('visible'), 1000);
        }

        acceptButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('visible');
        });

        declineButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const heroSection = document.querySelector('.hero');
        const threshold = heroSection ? heroSection.offsetHeight : 300;
        window.addEventListener('scroll', () => {
            if (window.scrollY > threshold) {
                stickyCTA.classList.add('visible');
            } else {
                stickyCTA.classList.remove('visible');
            }
        });
    }
    
    // --- Contact Form --- //
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const statusDiv = document.getElementById('form-status');
            statusDiv.textContent = 'Nachricht wird gesendet...';
            // This is a dummy handler. A real implementation would use fetch() to send data.
            setTimeout(() => {
                statusDiv.textContent = 'Vielen Dank! Ihre Nachricht wurde empfangen.';
                statusDiv.style.color = 'var(--color-accent)';
                contactForm.reset();
            }, 1000);
        });
    }

    // --- Global Lightbox (Singleton) --- //
    // This is the required global lightbox logic. It will remain unused as there are no images.
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const backdrop = lightbox.querySelector('.lightbox-backdrop');
        
        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('scroll-locked');
        };

        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('visible')) {
                closeLightbox();
            }
        });
        // The function to open the lightbox would be called by image click events.
        // e.g. function openLightbox(src, alt) { ... }
    }
});