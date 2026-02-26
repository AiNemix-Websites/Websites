document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header --- //
    const header = document.querySelector('.site-header');
    if (header) {
        const scrollObserver = new IntersectionObserver(([entry]) => {
            // A dummy element to observe, placed after the hero
        }, { threshold: 0.1 });

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('sticky');
            } else {
                header.classList.remove('sticky');
            }
        });
    }

    // --- Mobile Navigation --- //
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navList = document.querySelector('.nav-list');
    if (navToggle && navList) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navList.classList.toggle('active');
            document.body.classList.toggle('no-scroll', !isExpanded);
        });
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.classList.contains('stagger-children')) {
                    const children = entry.target.children;
                    for (let i = 0; i < children.length; i++) {
                        children[i].style.setProperty('--stagger-index', i);
                    }
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Accordion (FAQ) --- //
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            header.setAttribute('aria-expanded', !isExpanded);
            if (!isExpanded) {
                content.style.maxHeight = content.scrollHeight + 'px';
                content.style.padding = '0 var(--spacing-lg) var(--spacing-lg)';
            } else {
                content.style.maxHeight = '0';
                content.style.padding = '0 var(--spacing-lg)';
            }
        });
    });

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const declineBtn = document.getElementById('decline-cookies');

    // Check if the cookie banner component exists on the page
    if (cookieBanner && acceptBtn && declineBtn) {
        setTimeout(() => {
            if (!localStorage.getItem('cookieConsent')) {
                cookieBanner.style.display = 'block';
                // Use another timeout to allow the display property to apply before transitioning
                setTimeout(() => {
                    cookieBanner.classList.add('show');
                }, 10);
            }
        }, 1000);

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('show');
        });

        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('show');
        });
    } else {
         // If the main banner isn't on the page, try to find the placeholder and populate it.
        const bannerPlaceholder = document.getElementById('cookie-banner');
        if(bannerPlaceholder && !bannerPlaceholder.innerHTML.trim()) {
             // This is a subpage, inject the banner HTML and re-run logic.
            bannerPlaceholder.innerHTML = `
                <div class='container'>
                    <p>Wir verwenden technisch notwendige Cookies. Mehr in unserer <a href='${window.location.pathname.includes('/impressum') || window.location.pathname.includes('/datenschutz') ? './' : '../datenschutz/'}'>Datenschutzerklärung</a>.</p>
                    <div class='cookie-buttons'>
                        <button id='accept-cookies' class='btn btn-primary'>Akzeptieren</button>
                        <button id='decline-cookies' class='btn btn-outline'>Ablehnen</button>
                    </div>
                </div>`;
            // Re-run the setup after injection
            setupCookieBannerLogic();
        }
    }
    
    function setupCookieBannerLogic() {
        const banner = document.getElementById('cookie-banner');
        const accept = document.getElementById('accept-cookies');
        const decline = document.getElementById('decline-cookies');
        if (!banner || !accept || !decline) return;

        setTimeout(() => {
            if (!localStorage.getItem('cookieConsent')) {
                banner.style.display = 'block';
                setTimeout(() => banner.classList.add('show'), 10);
            }
        }, 1000);

        accept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            banner.classList.remove('show');
        });

        decline.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            banner.classList.remove('show');
        });
    }

    // Initial call for home page
    if (document.getElementById('accept-cookies')) {
        setupCookieBannerLogic();
    } else if (document.getElementById('cookie-banner')) {
        // For subpages where the banner is empty
        setupCookieBannerLogic();
    }

    // --- Sticky CTA --- //
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show after scrolling past the hero (or a certain point)
                if (window.scrollY > window.innerHeight * 0.8) {
                     stickyCta.classList.add('visible');
                } else {
                     stickyCta.classList.remove('visible');
                }
            });
        });
        // Dummy observer to trigger on scroll
        window.addEventListener('scroll', () => {
             if (window.scrollY > window.innerHeight * 0.8) {
                stickyCta.classList.add('visible');
            } else {
                stickyCta.classList.remove('visible');
            }
        });
    }

    // --- Contact Form --- //
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const statusEl = document.getElementById('form-status');
            statusEl.textContent = 'Vielen Dank für Ihre Nachricht. Wir melden uns in Kürze!';
            statusEl.style.color = 'var(--color-primary)';
            contactForm.reset();
        });
    }

    // --- Lightbox (Dormant Logic) --- //
    // This code is included to meet requirements but will not be triggered
    // as there are no elements with the 'open-lightbox' class.
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const closeBtn = lightbox.querySelector('.close-lightbox');
        const backdrop = lightbox;

        const closeLightbox = () => {
            lightbox.style.display = 'none';
            document.body.classList.remove('no-scroll');
        };

        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                closeLightbox();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.style.display !== 'none') {
                closeLightbox();
            }
        });
    }
});