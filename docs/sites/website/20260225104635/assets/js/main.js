document.addEventListener('DOMContentLoaded', () => {

    const initStickyHeader = () => {
        const header = document.getElementById('main-header');
        if (!header) return;
        const scrollThreshold = 50;
        window.addEventListener('scroll', () => {
            if (window.scrollY > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    };

    const initMobileMenu = () => {
        const toggleBtn = document.getElementById('mobile-menu-toggle');
        const menu = document.getElementById('mobile-menu');
        if (!toggleBtn || !menu) return;

        const toggleMenu = (isOpen) => {
            const open = typeof isOpen === 'boolean' ? isOpen : !menu.classList.contains('open');
            toggleBtn.classList.toggle('open', open);
            menu.classList.toggle('open', open);
            toggleBtn.setAttribute('aria-expanded', open);
            document.body.classList.toggle('no-scroll', open);
        };

        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        document.addEventListener('click', (e) => {
            if (menu.classList.contains('open') && !menu.contains(e.target)) {
                toggleMenu(false);
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menu.classList.contains('open')) {
                toggleMenu(false);
            }
        });
    };

    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll('.reveal-fade, .reveal-stagger');
        if (revealElements.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    if (el.classList.contains('reveal-stagger')) {
                        el.style.transitionDelay = `${index * 100}ms`;
                    }
                    el.classList.add('visible');
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
    };

    const initTestimonialCarousel = () => {
        const carousel = document.querySelector('.testimonial-carousel');
        if (!carousel) return;

        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        if (slides.length <= 1) {
            if(prevBtn) prevBtn.style.display = 'none';
            if(nextBtn) nextBtn.style.display = 'none';
            return;
        }

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
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

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        updateCarousel();
    };

    const initFaqAccordion = () => {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
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

    const initCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('cookie-accept');
        const declineBtn = document.getElementById('cookie-decline');
        if (!banner || !acceptBtn || !declineBtn) return;

        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            banner.classList.add('show');
        }

        const setConsent = (value) => {
            localStorage.setItem('cookie_consent', value);
            banner.classList.remove('show');
        };

        acceptBtn.addEventListener('click', () => setConsent('accepted'));
        declineBtn.addEventListener('click', () => setConsent('declined'));
    };

    const initLightbox = () => {
        const lightbox = document.getElementById('km-lightbox');
        if (!lightbox) return;

        const content = lightbox.querySelector('.lightbox-content');
        const closeBtn = lightbox.querySelector('.close-lightbox');
        const prevBtn = lightbox.querySelector('.prev-lightbox');
        const nextBtn = lightbox.querySelector('.next-lightbox');
        const galleries = document.querySelectorAll('.lightbox-gallery');
        let currentImages = [];
        let currentIndex = 0;

        const showImage = (index) => {
            if (index < 0 || index >= currentImages.length) return;
            currentIndex = index;
            content.src = currentImages[index];
        };

        const openLightbox = (e) => {
            e.preventDefault();
            const gallery = e.currentTarget.closest('.lightbox-gallery');
            const links = Array.from(gallery.querySelectorAll('a.gallery-item'));
            currentImages = links.map(a => a.href);
            const clickedIndex = links.findIndex(a => a === e.currentTarget);
            
            showImage(clickedIndex);
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('show'), 10);
            document.body.classList.add('no-scroll');
            addLightboxListeners();
        };

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            setTimeout(() => {
                lightbox.style.display = 'none';
                content.src = '';
            }, 300);
            document.body.classList.remove('no-scroll');
            removeLightboxListeners();
        };

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
            if (e.key === 'ArrowRight') showImage(currentIndex + 1);
        };

        const addLightboxListeners = () => {
            closeBtn.addEventListener('click', closeLightbox);
            lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
            prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
            nextBtn.addEventListener('click', () => showImage(currentIndex + 1));
            document.addEventListener('keydown', handleKeydown);
        };

        const removeLightboxListeners = () => {
            closeBtn.removeEventListener('click', closeLightbox);
            lightbox.removeEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
            prevBtn.removeEventListener('click', () => showImage(currentIndex - 1));
            nextBtn.removeEventListener('click', () => showImage(currentIndex + 1));
            document.removeEventListener('keydown', handleKeydown);
        };

        galleries.forEach(gallery => {
            gallery.querySelectorAll('a.gallery-item').forEach(link => {
                link.addEventListener('click', openLightbox);
            });
        });
    };

    const initStickyCTA = () => {
        const cta = document.getElementById('sticky-cta');
        if (!cta) return;

        const trigger = document.querySelector('.value-proposition'); // Trigger after the first main section
        if (!trigger) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                cta.classList.toggle('show', !entry.isIntersecting);
            });
        }, { rootMargin: '0px 0px -100% 0px' });

        observer.observe(trigger);
    };

    // Initialize all modules
    initStickyHeader();
    initMobileMenu();
    initScrollReveal();
    initTestimonialCarousel();
    initFaqAccordion();
    initCookieBanner();
    initLightbox();
    initStickyCTA();
});