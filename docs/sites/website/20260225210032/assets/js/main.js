document.addEventListener('DOMContentLoaded', function() {

    // --- Header Logic ---
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
    const mobileNav = document.getElementById('mobile-nav');
    if (mobileNavToggle && mobileNav) {
        mobileNavToggle.addEventListener('click', () => {
            const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
            mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
            mobileNavToggle.classList.toggle('active');
            mobileNav.classList.toggle('active');
            mobileNav.setAttribute('aria-hidden', isExpanded);
            document.body.classList.toggle('no-scroll');
        });

        const closeNav = () => {
            mobileNavToggle.setAttribute('aria-expanded', 'false');
            mobileNavToggle.classList.remove('active');
            mobileNav.classList.remove('active');
            mobileNav.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('no-scroll');
        };

        // Close with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
                closeNav();
            }
        });
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.revealDelay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

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
                answer.style.padding = '0 0 16px 0';
            } else {
                answer.style.maxHeight = '0';
                answer.style.padding = '0';
            }
        });
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

    // --- Sticky CTA & Back to Top ---
    const stickyCta = document.getElementById('sticky-cta');
    const backToTopButton = document.getElementById('back-to-top');
    const progressRing = document.querySelector('.progress-ring-circle');
    const radius = progressRing ? progressRing.r.baseVal.value : 0;
    const circumference = radius * 2 * Math.PI;

    if (progressRing) {
        progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
        progressRing.style.strokeDashoffset = circumference;
    }

    function setProgress(percent) {
        if (progressRing) {
            const offset = circumference - percent / 100 * circumference;
            progressRing.style.strokeDashoffset = offset;
        }
    }

    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollPercent = (scrollPosition / (documentHeight - windowHeight)) * 100;

        if (scrollPosition > 300) {
            if (stickyCta) stickyCta.classList.add('visible');
            if (backToTopButton) backToTopButton.classList.add('visible');
        } else {
            if (stickyCta) stickyCta.classList.remove('visible');
            if (backToTopButton) backToTopButton.classList.remove('visible');
        }

        if (window.innerWidth <= 768) {
            if (stickyCta) stickyCta.style.display = 'none';
        } else {
            if (stickyCta) stickyCta.style.display = 'block';
        }

        setProgress(scrollPercent);
    });

    if (backToTopButton) {
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Contact Form Placeholder ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Vielen Dank für Ihre Nachricht! Dieses Formular ist derzeit eine Demonstration.');
        });
    }
});