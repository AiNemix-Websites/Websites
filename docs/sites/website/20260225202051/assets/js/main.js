document.addEventListener('DOMContentLoaded', () => {

    const initStickyHeader = () => {
        const header = document.getElementById('main-header');
        if (!header) return;
        const scrollThreshold = 50;
        const onScroll = () => {
            if (window.scrollY > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
    };

    const initMobileNav = () => {
        const toggleBtn = document.getElementById('mobile-menu-toggle');
        const closeBtn = document.getElementById('mobile-menu-close');
        const drawer = document.getElementById('mobile-menu');
        if (!toggleBtn || !drawer || !closeBtn) return;

        const openMenu = () => {
            drawer.classList.add('open');
            toggleBtn.setAttribute('aria-expanded', 'true');
            document.body.classList.add('scroll-locked');
        };

        const closeMenu = () => {
            drawer.classList.remove('open');
            toggleBtn.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('scroll-locked');
        };

        toggleBtn.addEventListener('click', openMenu);
        closeBtn.addEventListener('click', closeMenu);
        drawer.addEventListener('click', (e) => {
            if (e.target === drawer) closeMenu();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && drawer.classList.contains('open')) closeMenu();
        });
    };

    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        if (revealElements.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    const staggerChildren = entry.target.querySelectorAll(':scope > *');
                    if (staggerChildren.length > 0) {
                        staggerChildren.forEach((child, index) => {
                            child.style.setProperty('--stagger-index', index);
                        });
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
    };

    const initFaqAccordion = () => {
        const accordionItems = document.querySelectorAll('.faq-item');
        accordionItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            if (!question || !answer) return;

            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                if (!isExpanded) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    answer.style.maxHeight = '0';
                }
            });
        });
    };

    const initTestimonialCarousel = () => {
        const carousel = document.querySelector('.testimonial-carousel');
        if (!carousel) return;
        const wrapper = carousel.closest('.testimonial-carousel-wrapper');
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = wrapper.querySelector('.prev');
        const nextBtn = wrapper.querySelector('.next');
        const dotsContainer = wrapper.querySelector('.dots');
        let currentIndex = 0;

        if (slides.length <= 1) return;

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        };

        const updateDots = () => {
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
            updateCarousel();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
            updateCarousel();
        });

        updateCarousel();
    };

    const initLightbox = () => {
        const lightbox = document.getElementById('km-lightbox');
        if (!lightbox) return;

        const galleryItems = Array.from(document.querySelectorAll('.gallery-item, [data-km-image]'));
        const uniqueGalleryItems = galleryItems.filter((item, index, self) => 
            index === self.findIndex(t => t.dataset.kmImage === item.dataset.kmImage)
        );

        if (uniqueGalleryItems.length === 0) return;

        const img = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.close-lightbox');
        const prevBtn = lightbox.querySelector('.prev-lightbox');
        const nextBtn = lightbox.querySelector('.next-lightbox');
        let currentIndex = 0;

        const showImage = (index) => {
            const item = uniqueGalleryItems[index];
            if (!item) return;
            const imagePath = item.dataset.kmImage;
            const altText = item.alt || 'Großansicht';
            const relativePath = document.body.classList.contains('is-subpage') ? `../${imagePath}` : imagePath;
            img.src = relativePath;
            img.alt = altText;
            currentIndex = index;
        };

        const openLightbox = (index) => {
            showImage(index);
            lightbox.classList.add('show');
            document.body.classList.add('scroll-locked');
        };

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            document.body.classList.remove('scroll-locked');
        };

        const showPrev = () => {
            const newIndex = (currentIndex > 0) ? currentIndex - 1 : uniqueGalleryItems.length - 1;
            showImage(newIndex);
        };

        const showNext = () => {
            const newIndex = (currentIndex < uniqueGalleryItems.length - 1) ? currentIndex + 1 : 0;
            showImage(newIndex);
        };

        uniqueGalleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(index);
            });
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('show')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        });
        
        // Helper to determine relative path
        if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
            document.body.classList.add('is-subpage');
        }
    };

    const initCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('cookie-accept');
        const declineBtn = document.getElementById('cookie-decline');
        if (!banner || !acceptBtn || !declineBtn) return;

        const consent = localStorage.getItem('cookie_consent');
        if (consent === null) {
            banner.classList.add('show');
        }

        const hideBanner = () => banner.classList.remove('show');

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'accepted');
            hideBanner();
        });

        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'declined');
            hideBanner();
        });
    };

    const initStickyCTA = () => {
        const cta = document.getElementById('sticky-cta');
        const hero = document.querySelector('.hero');
        if (!cta || !hero) return;

        const observer = new IntersectionObserver(([entry]) => {
            cta.classList.toggle('show', !entry.isIntersecting);
        }, { rootMargin: '0px', threshold: 0 });

        observer.observe(hero);
    };

    const initContactForm = () => {
        const form = document.getElementById('contact-form');
        if (!form) return;

        const statusEl = document.getElementById('form-status');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            statusEl.textContent = 'Vielen Dank! Ihre Nachricht wird gesendet...';
            statusEl.className = 'form-status';

            // Simulate form submission
            setTimeout(() => {
                statusEl.textContent = 'Nachricht erfolgreich gesendet!';
                statusEl.classList.add('success');
                form.reset();
            }, 1000);
        });
    };

    // Initialize all modules
    initStickyHeader();
    initMobileNav();
    initScrollReveal();
    initFaqAccordion();
    initTestimonialCarousel();
    initLightbox();
    initCookieBanner();
    initStickyCTA();
    initContactForm();
});