document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Header Logic: Sticky & Shrink ---
    const header = document.querySelector('.site-header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    // --- 2. Mobile Navigation ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    const mobileNavDrawer = document.querySelector('.mobile-nav-drawer');
    const body = document.body;

    const openMobileNav = () => {
        mobileNavDrawer.classList.add('open');
        body.classList.add('no-scroll');
        mobileNavClose.focus();
    };

    const closeMobileNav = () => {
        mobileNavDrawer.classList.remove('open');
        body.classList.remove('no-scroll');
        mobileNavToggle.focus();
    };

    if (mobileNavToggle && mobileNavDrawer && mobileNavClose) {
        mobileNavToggle.addEventListener('click', openMobileNav);
        mobileNavClose.addEventListener('click', closeMobileNav);

        // Close on backdrop click
        document.addEventListener('click', (e) => {
            if (mobileNavDrawer.classList.contains('open') && !mobileNavDrawer.contains(e.target) && !mobileNavToggle.contains(e.target)) {
                closeMobileNav();
            }
        });

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNavDrawer.classList.contains('open')) {
                closeMobileNav();
            }
        });
    }

    // --- 3. Scroll Animations ---
    const animatedElements = document.querySelectorAll('.animate-in');
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    // --- 4. Testimonials Carousel ---
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.carousel-controls .next');
        const prevBtn = document.querySelector('.carousel-controls .prev');
        const dotsContainer = document.querySelector('.carousel-controls .dots');
        let currentIndex = 0;

        const goToSlide = (index) => {
            carousel.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
            currentIndex = index;
        };

        slides.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('span');
        goToSlide(0);

        nextBtn.addEventListener('click', () => {
            const nextIndex = (currentIndex + 1) % slides.length;
            goToSlide(nextIndex);
        });

        prevBtn.addEventListener('click', () => {
            const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            goToSlide(prevIndex);
        });
        
        // Basic touch swipe
        let touchstartX = 0;
        let touchendX = 0;

        carousel.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, { passive: true });
        carousel.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            if (touchendX < touchstartX) nextBtn.click();
            if (touchendX > touchstartX) prevBtn.click();
        });
    }

    // --- 5. FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            
            // Close all other items
            // faqItems.forEach(i => {
            //     i.classList.remove('open');
            //     i.querySelector('.faq-answer').style.maxHeight = null;
            //     i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            // });

            if (!isOpen) {
                item.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                question.setAttribute('aria-expanded', 'true');
            } else {
                 item.classList.remove('open');
                 answer.style.maxHeight = null;
                 question.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // --- 6. Cookie Banner ---
    const cookieBanner = document.querySelector('.cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');

    if (cookieBanner && cookieAcceptBtn) {
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => {
                cookieBanner.classList.add('visible');
            }, 1000);
        }

        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- 7. Sticky CTA ---
    const stickyCTA = document.querySelector('.sticky-cta');
    if (stickyCTA) {
        const handleCTAScroll = () => {
            // Show after scrolling down 1 screen height, hide in the last 500px
            const show = window.scrollY > window.innerHeight;
            const hide = (document.documentElement.scrollHeight - window.scrollY - window.innerHeight) < 500;
            if (show && !hide) {
                stickyCTA.classList.add('visible');
            } else {
                stickyCTA.classList.remove('visible');
            }
        };
        window.addEventListener('scroll', handleCTAScroll, { passive: true });
    }

});