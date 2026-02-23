document.addEventListener('DOMContentLoaded', () => {

  // --- 1. STICKY HEADER --- //
  const header = document.getElementById('site-header');
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

  // --- 2. MOBILE NAVIGATION --- //
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  if (mobileNavToggle && mobileNavDrawer) {
    mobileNavToggle.addEventListener('click', () => {
      const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
      mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
      mobileNavDrawer.setAttribute('aria-hidden', isExpanded);
      document.body.classList.toggle('scroll-locked', !isExpanded);
    });
  }

  // --- 3. SCROLL-REVEAL ANIMATIONS --- //
  const animatedElements = document.querySelectorAll('.animate-in');
  if (animatedElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay || '0', 10);
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    animatedElements.forEach((el, index) => {
        const stagger = el.closest('[data-stagger]') ? parseInt(el.closest('[data-stagger]').dataset.stagger, 10) * index : 0;
        el.style.transitionDelay = `${stagger}ms`;
        observer.observe(el);
    });
  }

  // --- 4. ACCORDION --- //
  const accordions = document.querySelectorAll('.accordion');
  accordions.forEach(accordion => {
    const items = accordion.querySelectorAll('.accordion-item');
    items.forEach(item => {
      const header = item.querySelector('.accordion-header');
      const content = item.querySelector('.accordion-content');
      if (header && content) {
        header.addEventListener('click', () => {
          const isExpanded = header.getAttribute('aria-expanded') === 'true';
          header.setAttribute('aria-expanded', !isExpanded);
          content.hidden = isExpanded;
        });
      }
    });
  });

  // --- 5. COOKIE BANNER --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAcceptBtn = document.getElementById('cookie-accept');
  if (cookieBanner && cookieAcceptBtn) {
    if (!localStorage.getItem('cookieConsent')) {
      cookieBanner.hidden = false;
      setTimeout(() => cookieBanner.classList.add('visible'), 100);
    }

    cookieAcceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.classList.remove('visible');
      setTimeout(() => cookieBanner.hidden = true, 300);
    });
  }

  // --- 6. STICKY CTA --- //
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Show when hero is NOT intersecting
        if (!entry.isIntersecting) {
          stickyCTA.hidden = false;
          stickyCTA.classList.add('visible');
        } else {
          stickyCTA.classList.remove('visible');
          setTimeout(() => { stickyCTA.hidden = true; }, 300);
        }
      });
    }, { rootMargin: '200px 0px 0px 0px' });

    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        ctaObserver.observe(heroSection);
    }
  }

  // --- 7. NOTDIENST WIZARD --- //
  const wizard = document.getElementById('wizard');
  if (wizard) {
    const steps = wizard.querySelectorAll('.wizard-step');
    const buttons = wizard.querySelectorAll('.wizard-options button');
    const resultContainer = document.getElementById('wizard-result');
    const resetButton = document.getElementById('wizard-reset');
    let selections = {};

    const showStep = (stepNumber) => {
      steps.forEach(step => step.classList.remove('active'));
      const nextStep = wizard.querySelector(`.wizard-step[data-step='${stepNumber}']`);
      if (nextStep) nextStep.classList.add('active');
    };

    const showResult = () => {
        let resultHTML = '';
        if (selections[2] === 'Akut') {
            resultHTML = `<p>Bei einem akuten Notfall im Bereich <strong>${selections[1]}</strong> empfehlen wir einen sofortigen Anruf.</p><a href='tel:03742122444' class='btn btn-primary'>Notruf: 037421 22444</a>`;
        } else {
            resultHTML = `<p>Für Ihr Anliegen im Bereich <strong>${selections[1]}</strong>, das warten kann, können Sie uns gerne eine Nachricht senden oder während der Geschäftszeiten anrufen.</p><a href='../kontakt/' class='btn btn-primary'>Kontakt aufnehmen</a>`;
        }
        resultContainer.innerHTML = resultHTML;
        showStep(3);
    };

    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const currentStep = button.closest('.wizard-step');
        const stepNumber = parseInt(currentStep.dataset.step, 10);
        selections[stepNumber] = button.dataset.value;

        const nextStepNumber = button.dataset.next;
        if (parseInt(nextStepNumber, 10) >= 3) {
            showResult();
        } else {
            showStep(nextStepNumber);
        }
      });
    });

    resetButton.addEventListener('click', () => {
        selections = {};
        showStep(1);
    });
  }

});