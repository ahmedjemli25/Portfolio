/* ============================================================
   script.js — vanilla JS only, no dependencies
   Sections:
     1. Mobile nav toggle
     2. Project filter (All / Cybersecurity / Web Dev / CTF)
     3. Scroll fade-in animations (IntersectionObserver)
     4. Hero terminal typing effect (simulated nmap scan)
     5. Footer year
     6. Contact form basic client-side validation
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1. MOBILE NAV TOGGLE
     ---------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu after tapping a link (mobile UX)
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ----------------------------------------------------------
     2. PROJECT FILTER
     No page reload — just show/hide cards based on data-category.
     ---------------------------------------------------------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const emptyState = document.getElementById('emptyState');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active button state
      filterButtons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      let visibleCount = 0;

      projectCards.forEach(card => {
        const matches = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('is-hidden', !matches);
        if (matches) visibleCount++;
      });

      // Show a message if a category has no cards yet
      if (emptyState) {
        emptyState.classList.toggle('is-hidden', visibleCount !== 0);
      }
    });
  });

  /* ----------------------------------------------------------
     3. SCROLL FADE-IN
     Adds .fade-in to elements we want to animate, then reveals
     them with .is-visible once they enter the viewport.
     ---------------------------------------------------------- */
  const revealTargets = document.querySelectorAll(
    '.section-title, .about-grid, .project-card, .writeup-item, .contact-grid'
  );

  revealTargets.forEach(el => el.classList.add('fade-in'));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // animate once only
        }
      });
    }, { threshold: 0.15 });

    revealTargets.forEach(el => observer.observe(el));
  } else {
    // Fallback for very old browsers: just show everything
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }

  /* ----------------------------------------------------------
     4. HERO TERMINAL TYPING EFFECT
     Simulates an nmap-style scan of this site. Purely
     decorative — respects prefers-reduced-motion by skipping
     straight to the final text.
     ---------------------------------------------------------- */
  const terminalBody = document.getElementById('terminalBody');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const scanLines = [
    '$ nmap -sV portfolio.local',
    '',
    'Starting Nmap scan...',
    'PORT      STATE  SERVICE',
    '22/tcp    open   about-me',
    '80/tcp    open   projects',
    '443/tcp   open   writeups',
    '8080/tcp  open   resume',
    '31337/tcp open   contact',
    '',
    'Scan complete: 5 ports open.',
    'Status: available for internships ✓'
  ];

  function renderInstant() {
    terminalBody.textContent = scanLines.join('\n');
  }

  function typeScan() {
    let lineIndex = 0;
    let charIndex = 0;
    let output = '';

    function typeNextChar() {
      if (lineIndex >= scanLines.length) return;

      const currentLine = scanLines[lineIndex];

      if (charIndex < currentLine.length) {
        output += currentLine[charIndex];
        charIndex++;
        terminalBody.textContent = output;
        setTimeout(typeNextChar, 12); // typing speed
      } else {
        output += '\n';
        lineIndex++;
        charIndex = 0;
        terminalBody.textContent = output;
        setTimeout(typeNextChar, 90); // pause between lines
      }
    }

    typeNextChar();
  }

  if (terminalBody) {
    if (prefersReducedMotion) {
      renderInstant();
    } else {
      typeScan();
    }
  }

  /* ----------------------------------------------------------
     5. FOOTER YEAR
     ---------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----------------------------------------------------------
     6. CONTACT FORM
     No backend — the form posts via mailto:. This just adds a
     lightweight native-validation nudge before handoff.
     ---------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      if (!contactForm.checkValidity()) {
        e.preventDefault();
        contactForm.reportValidity();
      }
      // Otherwise let the mailto: submission proceed natively.
    });
  }

});
