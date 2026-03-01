/* ============================================
   GSAP + LENIS SCROLL-DRIVEN PORTFOLIO
   ============================================ */

// ── Lenis Smooth Scroll ──────────────────────
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Connect Lenis to GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// ── Register ScrollTrigger ───────────────────
gsap.registerPlugin(ScrollTrigger);

// ── Navbar scroll state ──────────────────────
const navbar = document.getElementById('navbar');
ScrollTrigger.create({
  start: 'top -80',
  onUpdate: (self) => {
    if (self.progress > 0) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  },
});

// ── Hero Name Entrance ──────────────────────
gsap.from('.hero-name', {
  opacity: 0,
  y: 60,
  duration: 1,
  ease: 'power3.out',
  delay: 0.2,
});

gsap.from('.hero-subtitle', {
  opacity: 0,
  y: 40,
  duration: 0.8,
  ease: 'power3.out',
  delay: 0.5,
});

// ── Skill Cards Fan Animation (Pinned Hero) ─────
const cards = gsap.utils.toArray('.skill-card');
const totalCards = cards.length;

// Initial fan layout
cards.forEach((card, i) => {
  const center = (totalCards - 1) / 2;
  const offset = i - center;
  const angle = offset * 12;
  const xShift = offset * 80;
  gsap.set(card, {
    rotation: angle,
    x: xShift,
    y: Math.abs(offset) * 15,
    opacity: 1,
  });
});

// Create a pinned timeline on the hero
const heroTL = gsap.timeline({
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: '+=800',
    pin: true,
    scrub: 1,
    anticipatePin: 1,
  },
});

// Phase 1 (0-0.5): Fan collapses into a flat row
cards.forEach((card, i) => {
  const center = (totalCards - 1) / 2;
  const offset = i - center;
  heroTL.to(
    card,
    {
      rotation: 0,
      x: offset * 170,
      y: 0,
      duration: 0.5,
    },
    0
  );
});

// Phase 2 (0.5-1.0): Cards scatter off in different directions
cards.forEach((card, i) => {
  const center = (totalCards - 1) / 2;
  const offset = i - center;
  // Each card flies in its own direction
  const xTarget = offset * 350;
  const yTarget = -250 - Math.abs(offset) * 80;
  const rotTarget = offset * 20;
  heroTL.to(
    card,
    {
      x: xTarget,
      y: yTarget,
      rotation: rotTarget,
      scale: 0.6,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in',
    },
    0.5
  );
});

// ── Text Fill Reveal ─────────────────────────
function createTextReveal(selector) {
  const el = document.querySelector(selector);
  if (!el) return;

  // Collect word info from existing spans (with their special classes)
  const wordData = [];
  const existingSpans = el.querySelectorAll('.word');

  if (existingSpans.length > 0) {
    // Words are already wrapped — collect their classes and text
    existingSpans.forEach((span) => {
      const classes = Array.from(span.classList).filter(c => c !== 'word');
      wordData.push({ text: span.textContent.trim(), extraClasses: classes });
    });

    // Also get text NOT inside .word spans (plain text nodes)
    const fullText = el.textContent;
    const plainWords = fullText.split(/\s+/).filter(w => w.length > 0);

    // Rebuild: use plainWords for ordering, match accent classes from wordData
    const classMap = {};
    wordData.forEach((wd) => {
      classMap[wd.text] = wd.extraClasses;
    });

    el.innerHTML = '';
    plainWords.forEach((word, i) => {
      const span = document.createElement('span');
      span.className = 'word';
      if (classMap[word]) {
        classMap[word].forEach(c => span.classList.add(c));
      }
      span.textContent = word;
      el.appendChild(span);
      // Add a space text node after each word except the last
      if (i < plainWords.length - 1) {
        el.appendChild(document.createTextNode(' '));
      }
    });
  }

  // Now get all .word elements
  const wordEls = el.querySelectorAll('.word');

  // Create ScrollTrigger for progressive fill
  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
    end: 'bottom 40%',
    scrub: 0.5,
    onUpdate: (self) => {
      const progress = self.progress;
      const total = wordEls.length;
      const wordsToFill = Math.floor(progress * total);

      wordEls.forEach((word, i) => {
        if (i < wordsToFill) {
          word.classList.add('filled');
        } else {
          word.classList.remove('filled');
        }
      });
    },
  });
}

createTextReveal('#aboutReveal');
createTextReveal('#expReveal');
createTextReveal('#skillsReveal');
createTextReveal('#contactReveal');

// ── Scroll Fade Animations ───────────────────
gsap.utils.toArray('.scroll-fade').forEach((el, i) => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
      end: 'top 50%',
      toggleActions: 'play none none reverse',
    },
  });
});

gsap.utils.toArray('.scroll-fade-left').forEach((el) => {
  gsap.to(el, {
    opacity: 1,
    x: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
      toggleActions: 'play none none reverse',
    },
  });
});

gsap.utils.toArray('.scroll-fade-right').forEach((el) => {
  gsap.to(el, {
    opacity: 1,
    x: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
      toggleActions: 'play none none reverse',
    },
  });
});

gsap.utils.toArray('.scroll-scale').forEach((el) => {
  gsap.to(el, {
    opacity: 1,
    scale: 1,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
      toggleActions: 'play none none reverse',
    },
  });
});

// ── Horizontal Scroll for Projects ───────────
const horizontalSection = document.querySelector('.projects-wrapper');
const scrollContainer = document.querySelector('#horizontalScroll');

if (horizontalSection && scrollContainer) {
  // Calculate the scroll distance — enough to bring all 3 cards into view
  const getScrollWidth = () => scrollContainer.scrollWidth - window.innerWidth;

  gsap.to(scrollContainer, {
    x: () => -getScrollWidth(),
    ease: 'none',
    scrollTrigger: {
      trigger: horizontalSection,
      start: 'top top',
      end: () => `+=${getScrollWidth() + 300}`,
      scrub: 1,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });
}

// ── Stat Counter Animation ───────────────────
gsap.utils.toArray('.stat-number').forEach((el) => {
  const target = parseInt(el.getAttribute('data-count'), 10);
  if (!target) return;

  const suffix = el.closest('.stat').querySelector('.stat-label').textContent.includes('%') ? '%' : '+';

  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      gsap.to(el, {
        innerHTML: target,
        duration: 1.5,
        ease: 'power2.out',
        snap: { innerHTML: 1 },
        onUpdate: function () {
          el.textContent = Math.floor(parseFloat(el.textContent)) + suffix;
        },
      });
    },
  });
});

// ── Skill Bar Fill on Scroll ─────────────────
gsap.utils.toArray('.skill-bar-fill').forEach((bar) => {
  const width = bar.getAttribute('data-width');
  ScrollTrigger.create({
    trigger: bar,
    start: 'top 90%',
    once: true,
    onEnter: () => {
      bar.style.width = width + '%';
    },
  });
});

// ── Active Navigation Link ───────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveLink() {
  const scrollY = window.scrollY + 200;
  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + id) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });

// ── Mobile Navigation Toggle ─────────────────
const navToggle = document.getElementById('navToggle');
const navLinksContainer = document.getElementById('navLinks');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinksContainer.classList.toggle('open');
  });
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navLinksContainer.classList.remove('open');
    });
  });
}

// ── Smooth anchor scrolling via Lenis ────────
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      lenis.scrollTo(target, { offset: 0, duration: 1.2 });
    }
  });
});
