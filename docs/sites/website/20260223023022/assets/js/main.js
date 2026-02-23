document.addEventListener('DOMContentLoaded', () => {

    // --- Helper for staggered animations ---
    const setupStaggeredAnimation = (containerSelector, itemSelector) => {
        const container = document.querySelector(containerSelector);
        if (container) {
            const items = container.querySelectorAll(itemSelector);
            items.forEach((item, index) => {
                item.style.transitionDelay = `${index * 100}ms`;
            });
        }
    };

    // --- Sticky Header ---
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Mobile Navigation ---
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            mainNav.classList.toggle('open');
            document.body.classList.toggle('nav-open');
        });
    }

    // --- Scroll Reveal Animation ---
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-reveal').forEach(el => {
        revealObserver.observe(el);
    });
    setupStaggeredAnimation('.value-pillars', '.pillar');
    setupStaggeredAnimation('.service-cards-grid', '.service-card');
    setupStaggeredAnimation('.process-steps', '.step');

    // --- FAQ Accordion ---
    document.querySelectorAll('.faq-accordion .faq-question, .services-details-section .service-detail-title').forEach(button => {
        button.addEventListener('click', () => {
            const item = button.parentElement;
            const answer = button.nextElementSibling;
            const isExpanded = button.getAttribute('aria-expanded') === 'true';

            button.setAttribute('aria-expanded', !isExpanded);
            if (!isExpanded) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                if(answer.querySelector('p')) answer.querySelector('p').style.paddingBottom = '1.5rem';
            } else {
                answer.style.maxHeight = '0';
                if(answer.querySelector('p')) answer.querySelector('p').style.paddingBottom = '0';
            }
        });
    });

    // --- Testimonial Carousel ---
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.carousel-controls .next');
        const prevBtn = document.querySelector('.carousel-controls .prev');
        const dotsContainer = document.querySelector('.carousel-controls .dots');
        let currentIndex = 0;

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });
        const dots = dotsContainer.querySelectorAll('.dot');

        const goToSlide = (index) => {
            currentIndex = index;
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
        };

        nextBtn.addEventListener('click', () => {
            let nextIndex = (currentIndex + 1) % slides.length;
            goToSlide(nextIndex);
        });

        prevBtn.addEventListener('click', () => {
            let prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            goToSlide(prevIndex);
        });
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    if (cookieBanner && acceptCookiesBtn) {
        setTimeout(() => {
            if (!localStorage.getItem('cookieConsent')) {
                cookieBanner.hidden = false;
                setTimeout(() => cookieBanner.classList.add('visible'), 10);
            }
        }, 1000);

        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
            setTimeout(() => cookieBanner.hidden = true, 500);
        });
    }

    // --- References Page Filter ---
    const filterContainer = document.querySelector('.filter-buttons');
    if (filterContainer) {
        const filterButtons = filterContainer.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const filter = button.dataset.filter;

                projectCards.forEach(card => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                });
            });
        });
    }

    // --- Global Lightbox ---
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImg = document.getElementById('lightbox-img');
        const galleryItems = document.querySelectorAll('.gallery .gallery-item');
        let currentImageIndex = 0;
        const imageSources = Array.from(galleryItems).map(item => ({ src: item.src, alt: item.alt, dataKm: item.dataset.kmImage }));

        const showImage = (index) => {
            if (index < 0 || index >= imageSources.length) return;
            currentImageIndex = index;
            lightboxImg.src = imageSources[index].src;
            lightboxImg.alt = imageSources[index].alt;
            lightboxImg.dataset.kmImage = imageSources[index].dataKm;
        };

        const openLightbox = (index) => {
            document.body.style.overflow = 'hidden';
            showImage(index);
            lightbox.hidden = false;
            setTimeout(() => lightbox.classList.add('visible'), 10);
        };

        const closeLightbox = () => {
            document.body.style.overflow = '';
            lightbox.classList.remove('visible');
            setTimeout(() => lightbox.hidden = true, 300);
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => openLightbox(index));
        });

        lightbox.querySelector('.close-lightbox').addEventListener('click', closeLightbox);
        lightbox.querySelector('.prev-lightbox').addEventListener('click', () => showImage(currentImageIndex - 1));
        lightbox.querySelector('.next-lightbox').addEventListener('click', () => showImage(currentImageIndex + 1));
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showImage(currentImageIndex - 1);
                if (e.key === 'ArrowRight') showImage(currentImageIndex + 1);
            }
        });
    }

    // --- Sticky CTA Bar ---
    const stickyBar = document.getElementById('sticky-cta-bar');
    if (stickyBar) {
        const ctaFooter = document.getElementById('home-cta-footer') || document.querySelector('.cta-footer-section');
        if (ctaFooter) {
             const ctaObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    // Show sticky bar when footer CTA is NOT visible
                    if (!entry.isIntersecting && window.scrollY > 400) {
                        stickyBar.hidden = false;
                        stickyBar.classList.add('visible');
                    } else {
                        stickyBar.classList.remove('visible');
                         setTimeout(() => stickyBar.hidden = true, 400);
                    }
                });
            }, { threshold: 0.1 });
            ctaObserver.observe(ctaFooter);
        }
    }

    // --- Handle anchor links from other pages ---
    if (window.location.hash) {
        const id = window.location.hash.substring(1);
        const element = document.getElementById(id);
        if (element) {
            setTimeout(() => {
                const button = element.querySelector('button');
                if (button) {
                    button.click();
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 500);
        }
    }
});