document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header --- //
    const header = document.querySelector('.site-header');
    if (header) {
        const onScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    // --- Mobile Navigation --- //
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.getElementById('main-nav-menu');
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isOpen);
            mainNav.classList.toggle('open');
            document.body.classList.toggle('no-scroll');
        });
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => {
            observer.observe(el);
        });
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');
    const cookieAccepted = localStorage.getItem('cookie_accepted');

    if (!cookieAccepted && cookieBanner) {
        cookieBanner.style.display = 'block';
    }

    if (cookieAcceptBtn) {
        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_accepted', 'true');
            cookieBanner.style.display = 'none';
        });
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const onScrollCTA = () => {
            // Show after scrolling down 1 viewport height
            if (window.scrollY > window.innerHeight * 0.8) {
                stickyCTA.style.display = 'block';
            } else {
                stickyCTA.style.display = 'none';
            }
        };
        window.addEventListener('scroll', onScrollCTA, { passive: true });
    }

    // --- Project Filter --- //
    const filterContainer = document.getElementById('project-filter');
    const projectGrid = document.getElementById('project-grid');

    if (filterContainer && projectGrid) {
        const projectCards = projectGrid.querySelectorAll('.project-card');

        filterContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                const filterValue = e.target.dataset.filter;

                // Update active button state
                filterContainer.querySelector('.active').classList.remove('active');
                e.target.classList.add('active');

                projectCards.forEach(card => {
                    if (filterValue === 'all' || card.dataset.category === filterValue) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }
        });
    }

});