document.addEventListener('DOMContentLoaded', () => {

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- Sticky Header ---
    const header = document.getElementById('site-header');
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
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavMenu = document.getElementById('mobile-nav-menu');
    const mobileNavClose = document.querySelector('.mobile-nav-close');

    const toggleMobileNav = (open) => {
        const show = typeof open === 'boolean' ? open : !mobileNavMenu.classList.contains('open');
        mobileNavMenu.classList.toggle('open', show);
        mobileNavToggle.setAttribute('aria-expanded', show);
        document.body.classList.toggle('scroll-locked', show);
    };

    if (mobileNavToggle && mobileNavMenu) {
        mobileNavToggle.addEventListener('click', () => toggleMobileNav());
        mobileNavClose.addEventListener('click', () => toggleMobileNav(false));
        document.body.addEventListener('click', (e) => {
            if (mobileNavMenu.classList.contains('open') && !mobileNavMenu.contains(e.target) && !mobileNavToggle.contains(e.target)) {
                toggleMobileNav(false);
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNavMenu.classList.contains('open')) {
                toggleMobileNav(false);
            }
        });
    }

    // --- Scroll Reveal Animation ---
    if (!isReducedMotion) {
        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.staggerDelay) || 0;
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, delay);
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

    // --- Testimonial Carousel ---
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            if (!isReducedMotion) {
                carousel.style.transition = 'transform 0.5s ease-in-out';
            }
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
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('cookie-accept');

    if (cookieBanner && acceptButton) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.hidden = false;
            cookieBanner.classList.add('visible');
        }

        acceptButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
            setTimeout(() => { cookieBanner.hidden = true; }, 300);
        });
    }

    // --- Lightbox ---
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImage = document.getElementById('km-lightbox-image');
    const galleryImages = document.querySelectorAll('[data-lightbox-src]');
    let currentImageIndex = 0;

    if (lightbox && lightboxImage && galleryImages.length > 0) {
        const closeBtn = lightbox.querySelector('.km-lightbox-close');
        const prevBtn = lightbox.querySelector('.km-lightbox-prev');
        const nextBtn = lightbox.querySelector('.km-lightbox-next');

        const showImage = (index) => {
            currentImageIndex = index;
            const imgSrc = galleryImages[index].getAttribute('data-lightbox-src');
            lightboxImage.setAttribute('src', imgSrc);
        };

        const openLightbox = (index) => {
            lightbox.classList.add('visible');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('scroll-locked');
            showImage(index);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('scroll-locked');
            lightboxImage.setAttribute('src', ''); // Prevent loading when hidden
        };

        galleryImages.forEach((img, index) => {
            img.addEventListener('click', () => openLightbox(index));
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        prevBtn.addEventListener('click', () => {
            const newIndex = (currentImageIndex > 0) ? currentImageIndex - 1 : galleryImages.length - 1;
            showImage(newIndex);
        });

        nextBtn.addEventListener('click', () => {
            const newIndex = (currentImageIndex < galleryImages.length - 1) ? currentImageIndex + 1 : 0;
            showImage(newIndex);
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') prevBtn.click();
                if (e.key === 'ArrowRight') nextBtn.click();
            }
        });
    }

    // --- Back to Top Button ---
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        const progressCircle = backToTopButton.querySelector('.progress-ring__circle');
        const radius = progressCircle.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        progressCircle.style.strokeDashoffset = circumference;

        const setProgress = (percent) => {
            const offset = circumference - percent / 100 * circumference;
            progressCircle.style.strokeDashoffset = offset;
        };

        window.addEventListener('scroll', () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollTop = window.scrollY;
            if (scrollTop > 300) {
                backToTopButton.hidden = false;
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
                setTimeout(() => { if(!backToTopButton.classList.contains('visible')) backToTopButton.hidden = true; }, 300);
            }
            if (scrollHeight > 0) {
                setProgress((scrollTop / scrollHeight) * 100);
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: isReducedMotion ? 'auto' : 'smooth' });
        });
    }

    // --- Contact Form Handling ---
    const contactForm = document.getElementById('main-contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = this.querySelector('#name').value;
            const email = this.querySelector('#email').value;
            const phone = this.querySelector('#phone').value;
            const message = this.querySelector('#message').value;
            const subject = 'Kontaktanfrage von der Website';
            let body = `Name: ${name}\nEmail: ${email}\n\n`;
            if (phone) {
                body += `Telefon: ${phone}\n\n`;
            }
            body += `Nachricht:\n${message}`;
            window.location.href = `mailto:info@gera-gebaeudereinigung.de?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        });
    }

});