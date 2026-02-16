// ===========================
// Matrix Code Rain Effect
// ===========================
function initMatrixRain() {
  const canvas = document.getElementById('matrix-bg');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*(){}[]<>/\\|;:+=~`';
  const fontSize = 14;
  let columns = Math.floor(canvas.width / fontSize);
  let drops = Array(columns).fill(1);

  function draw() {
    ctx.fillStyle = 'rgba(10, 15, 28, 0.06)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00ff8822';
    ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

    for (let i = 0; i < drops.length; i++) {
      const text = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }

    requestAnimationFrame(draw);
  }

  // Recalculate columns on resize
  window.addEventListener('resize', () => {
    columns = Math.floor(canvas.width / fontSize);
    drops = Array(columns).fill(1);
  });

  draw();
}

// ===========================
// Typing Effect
// ===========================
function initTypingEffect() {
  const typingElement = document.getElementById('typing-text');
  if (!typingElement) return;

  const phrases = [
    'Systems Engineer · C++ & C#',
    'Distributed Systems Architect',
    'Low-Latency Backend Developer',
    'Fault-Tolerant Service Builder',
    'Performance Engineering Expert'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 500; // Pause before next phrase
    }

    setTimeout(type, typingSpeed);
  }

  setTimeout(type, 1000);
}

// ===========================
// Hamburger Menu Toggle
// ===========================
function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  if (!toggle || !menu) return;

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'menu-overlay';
  document.body.appendChild(overlay);

  function toggleMenu() {
    const isActive = toggle.classList.toggle('active');
    menu.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.classList.toggle('menu-open');
    toggle.setAttribute('aria-expanded', isActive);
  }

  function closeMenu() {
    toggle.classList.remove('active');
    menu.classList.remove('active');
    overlay.classList.remove('active');
    document.body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', closeMenu);

  // Close menu when a nav link is clicked
  menu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('active')) {
      closeMenu();
    }
  });
}

// ===========================
// Smooth Scrolling Navigation
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const targetSection = document.querySelector(targetId);
    if (targetSection) {
      const navHeight = document.querySelector('.nav').offsetHeight;
      const targetPosition = targetSection.offsetTop - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ===========================
// Active Navigation Link
// ===========================
function updateActiveNavLink() {
  const sections = document.querySelectorAll('.section, .hero');
  const navLinks = document.querySelectorAll('.nav-link');
  const navHeight = document.querySelector('.nav').offsetHeight;

  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - navHeight - 100;
    const sectionHeight = section.clientHeight;

    if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveNavLink);
window.addEventListener('load', updateActiveNavLink);

// ===========================
// Navbar Background on Scroll
// ===========================
function updateNavbarBackground() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  if (window.scrollY > 50) {
    navbar.style.background = 'rgba(10, 15, 28, 0.95)';
    navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 30px rgba(0, 255, 136, 0.05)';
  } else {
    navbar.style.background = 'rgba(10, 15, 28, 0.85)';
    navbar.style.boxShadow = 'none';
  }
}

window.addEventListener('scroll', updateNavbarBackground);
window.addEventListener('load', updateNavbarBackground);

// ===========================
// Scroll Animation Observer
// ===========================
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const animateOnScroll = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');

      // Staggered animation for skill tags
      if (entry.target.classList.contains('skill-tags')) {
        const tags = entry.target.querySelectorAll('.skill-tag');
        tags.forEach((tag, index) => {
          setTimeout(() => {
            tag.style.opacity = '0';
            tag.style.transform = 'translateY(15px)';
            tag.style.transition = 'all 0.4s ease-out';

            setTimeout(() => {
              tag.style.opacity = '1';
              tag.style.transform = 'translateY(0)';
            }, 50);
          }, index * 40);
        });
      }

      // Staggered animation for project cards
      if (entry.target.classList.contains('project-card')) {
        entry.target.style.opacity = '0';
        entry.target.style.transform = 'translateY(30px)';

        setTimeout(() => {
          entry.target.style.transition = 'all 0.6s ease-out';
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, 100);
      }

      // Animate timeline items
      if (entry.target.classList.contains('timeline-item')) {
        entry.target.style.opacity = '0';
        entry.target.style.transform = 'translateX(-30px)';

        setTimeout(() => {
          entry.target.style.transition = 'all 0.6s ease-out';
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';
        }, 100);
      }
    }
  });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.card').forEach(el => animateOnScroll.observe(el));
  document.querySelectorAll('.skill-tags').forEach(el => animateOnScroll.observe(el));
  document.querySelectorAll('.project-card').forEach(el => animateOnScroll.observe(el));
  document.querySelectorAll('.timeline-item').forEach(el => animateOnScroll.observe(el));
  document.querySelectorAll('.social-link').forEach(el => animateOnScroll.observe(el));
  document.querySelectorAll('.skill-category').forEach(el => animateOnScroll.observe(el));
});

// ===========================
// Interactive Skill Tags
// ===========================
document.addEventListener('DOMContentLoaded', () => {
  const skillTags = document.querySelectorAll('.skill-tag');

  skillTags.forEach(tag => {
    tag.addEventListener('mouseenter', function () {
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        width: 5px;
        height: 5px;
        background: rgba(0, 255, 136, 0.5);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
      `;

      this.style.position = 'relative';
      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });
});

// ===========================
// Add Ripple Animation CSS
// ===========================
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes ripple {
    to {
      transform: scale(20);
      opacity: 0;
    }
  }
`;
document.head.appendChild(rippleStyle);

// ===========================
// Project Card Interactions
// ===========================
document.addEventListener('DOMContentLoaded', () => {
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach(card => {
    card.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-12px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });
});

// ===========================
// Parallax Effect for Hero
// ===========================
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector('.hero');

  if (hero && scrolled < window.innerHeight) {
    hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    hero.style.opacity = 1 - (scrolled / (window.innerHeight * 1.2));
  }
});

// ===========================
// Initialize Everything
// ===========================
document.addEventListener('DOMContentLoaded', () => {
  initMatrixRain();
  initTypingEffect();
  initMobileMenu();
});

// ===========================
// Console Message
// ===========================
console.log('%c> SYSTEM ONLINE', 'color: #00ff88; font-size: 20px; font-weight: bold; font-family: "JetBrains Mono", monospace;');
console.log('%c> Divakar Singh — Senior Software Engineer', 'color: #00d4ff; font-size: 14px; font-family: "JetBrains Mono", monospace;');
console.log('%c> Interested in the source? Let\'s connect.', 'color: #7a9b8a; font-size: 12px; font-family: "JetBrains Mono", monospace;');
