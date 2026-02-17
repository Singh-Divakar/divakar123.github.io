// ===========================
// Particle Network Background
// ===========================
function initMatrixRain() {
  const canvas = document.getElementById('matrix-bg');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  const particleCount = 80;
  const connectionDistance = 150;
  let mouse = { x: null, y: null };

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Track mouse for interactive effect
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 2 + 1;
      this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off edges
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

      // Subtle mouse attraction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          this.vx += dx * 0.00008;
          this.vy += dy * 0.00008;
        }
      }

      // Speed limit
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed > 1.2) {
        this.vx = (this.vx / speed) * 1.2;
        this.vy = (this.vy / speed) * 1.2;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(108, 99, 255, ${this.opacity})`;
      ctx.fill();
    }
  }

  // Initialize particles
  function initParticles() {
    particles = [];
    const count = Math.min(particleCount, Math.floor((canvas.width * canvas.height) / 15000));
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }
  initParticles();

  window.addEventListener('resize', () => {
    resize();
    initParticles();
  });

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          const opacity = (1 - dist / connectionDistance) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(108, 99, 255, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    drawConnections();
    requestAnimationFrame(animate);
  }

  animate();
}

// ===========================
// Typing Effect
// ===========================
function initTypingEffect() {
  const typingElement = document.getElementById('typing-text');
  if (!typingElement) return;

  const phrases = [
    'Software Developer',
    'Systems & Backend Architect',
    'Building Scalable Solutions',
    'Low-Latency C++ / C# Engineer',
    'Distributed Systems Builder'
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
// Multi-Page Navigation Handling
// ===========================
function initNavigation() {
  // Handle smooth scrolling for same-page anchor links
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

  // Handle cross-page links with hash (e.g., index.html#about)
  // On page load, scroll to hash target if present
  if (window.location.hash) {
    setTimeout(() => {
      const targetSection = document.querySelector(window.location.hash);
      if (targetSection) {
        const navHeight = document.querySelector('.nav').offsetHeight;
        const targetPosition = targetSection.offsetTop - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }, 300);
  }
}

// ===========================
// Active Navigation Link (Multi-Page)
// ===========================
function setActiveNavLink() {
  const navLinks = document.querySelectorAll('.nav-link');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const currentHash = window.location.hash;

  // Page-to-link mapping
  const pageMap = {
    'index.html': 'index.html',
    'skills.html': 'skills.html',
    'projects.html': 'projects.html',
    'experience.html': 'experience.html',
    'contact.html': 'contact.html'
  };

  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');

    // If we're on index.html and scrolled to #about, highlight About link
    if (currentPage === 'index.html' || currentPage === '') {
      if (currentHash === '#about' && href === 'index.html#about') {
        link.classList.add('active');
      } else if (!currentHash && href === 'index.html') {
        link.classList.add('active');
      }
    } else {
      // For other pages, match the filename
      if (href === currentPage) {
        link.classList.add('active');
      }
    }
  });
}

// Update active link on scroll for index.html (Home vs About)
function updateActiveNavOnScroll() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  if (currentPage !== 'index.html' && currentPage !== '') return;

  const sections = document.querySelectorAll('.section, .hero');
  const navLinks = document.querySelectorAll('.nav-link');
  const navHeight = document.querySelector('.nav') ? document.querySelector('.nav').offsetHeight : 0;

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
    const href = link.getAttribute('href');

    if (current === 'home' && href === 'index.html') {
      link.classList.add('active');
    } else if (current === 'about' && href === 'index.html#about') {
      link.classList.add('active');
    }
  });
}

// ===========================
// Navbar Background on Scroll
// ===========================
function updateNavbarBackground() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  if (window.scrollY > 50) {
    navbar.style.background = 'rgba(15, 14, 23, 0.95)';
    navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 30px rgba(108, 99, 255, 0.05)';
  } else {
    navbar.style.background = 'rgba(15, 14, 23, 0.85)';
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
        background: rgba(108, 99, 255, 0.5);
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
  initNavigation();
  setActiveNavLink();
});

// Update active nav on scroll (for index.html Home/About switching)
window.addEventListener('scroll', updateActiveNavOnScroll);

// ===========================
// Console Message
// ===========================
console.log('%c> BUILD SUCCESSFUL', 'color: #6C63FF; font-size: 20px; font-weight: bold; font-family: "JetBrains Mono", monospace;');
console.log('%c> Divakar Singh — Software Developer', 'color: #00D9FF; font-size: 14px; font-family: "JetBrains Mono", monospace;');
console.log('%c> Interested in the source? Let\'s connect.', 'color: #9a95b0; font-size: 12px; font-family: "JetBrains Mono", monospace;');
