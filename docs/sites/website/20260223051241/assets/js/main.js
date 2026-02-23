document.addEventListener('DOMContentLoaded', function() {

    // --- Mobile Navigation --- //
    const navToggle = document.getElementById('mobile-nav-toggle');
    const navList = document.getElementById('main-nav-list');

    if (navToggle && navList) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navList.classList.toggle('open');
            document.body.classList.toggle('no-scroll');
        });
    }

    // --- Sticky Header --- //
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

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- FAQ Accordion --- //
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (question && answer) {
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                answer.hidden = isExpanded;
            });
        }
    });

    // --- Interactive House --- //
    const houseContainer = document.querySelector('.interactive-house-container');
    if (houseContainer) {
        const hotspots = houseContainer.querySelectorAll('.hotspot');
        const popups = houseContainer.querySelectorAll('.info-popup');

        const closeAllPopups = () => {
            popups.forEach(p => {
                p.classList.remove('active');
                p.setAttribute('aria-hidden', 'true');
            });
        };

        hotspots.forEach(hotspot => {
            hotspot.addEventListener('click', (e) => {
                e.stopPropagation();
                const area = hotspot.dataset.area;
                const targetPopup = document.getElementById(`popup-${area}`);
                if (targetPopup) {
                    const isActive = targetPopup.classList.contains('active');
                    closeAllPopups();
                    if (!isActive) {
                        targetPopup.classList.add('active');
                        targetPopup.setAttribute('aria-hidden', 'false');
                    }
                }
            });
        });

        popups.forEach(popup => {
            const closeButton = popup.querySelector('.popup-close');
            if (closeButton) {
                closeButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    closeAllPopups();
                });
            }
        });

        document.addEventListener('click', (e) => {
            if (!houseContainer.contains(e.target)) {
                closeAllPopups();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeAllPopups();
            }
        });
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    const cookieConsent = localStorage.getItem('cookie_consent');

    if (cookieBanner && cookieAccept && !cookieConsent) {
        cookieBanner.classList.add('visible');
        cookieBanner.setAttribute('aria-hidden', 'false');

        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'true');
            cookieBanner.classList.remove('visible');
            cookieBanner.setAttribute('aria-hidden', 'true');
        });
    }

    // --- Sticky CTA --- //
    const stickyCta = document.getElementById('sticky-cta');
    const heroSection = document.querySelector('.hero');

    if (stickyCta && heroSection) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show CTA when hero is NOT intersecting (i.e., scrolled past)
                if (!entry.isIntersecting) {
                    stickyCta.classList.add('visible');
                    stickyCta.setAttribute('aria-hidden', 'false');
                } else {
                    stickyCta.classList.remove('visible');
                    stickyCta.setAttribute('aria-hidden', 'true');
                }
            });
        }, { threshold: 0 });
        ctaObserver.observe(heroSection);
    }

});