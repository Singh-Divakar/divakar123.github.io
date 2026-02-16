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
  
  if (window.scrollY > 50) {
    navbar.style.background = 'rgba(15, 16, 28, 0.95)';
    navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)';
  } else {
    navbar.style.background = 'rgba(15, 16, 28, 0.8)';
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
      
      // Add staggered animation for skill tags
      if (entry.target.classList.contains('skill-tags')) {
        const tags = entry.target.querySelectorAll('.skill-tag');
        tags.forEach((tag, index) => {
          setTimeout(() => {
            tag.style.opacity = '0';
            tag.style.transform = 'translateY(20px)';
            tag.style.transition = 'all 0.4s ease-out';
            
            setTimeout(() => {
              tag.style.opacity = '1';
              tag.style.transform = 'translateY(0)';
            }, 50);
          }, index * 50);
        });
      }
      
      // Add staggered animation for project cards
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
  // Observe cards
  document.querySelectorAll('.card').forEach(card => {
    animateOnScroll.observe(card);
  });
  
  // Observe skill tags containers
  document.querySelectorAll('.skill-tags').forEach(container => {
    animateOnScroll.observe(container);
  });
  
  // Observe project cards
  document.querySelectorAll('.project-card').forEach(card => {
    animateOnScroll.observe(card);
  });
  
  // Observe timeline items
  document.querySelectorAll('.timeline-item').forEach(item => {
    animateOnScroll.observe(item);
  });
  
  // Observe social links
  document.querySelectorAll('.social-link').forEach(link => {
    animateOnScroll.observe(link);
  });
});

// ===========================
// Interactive Skill Tags
// ===========================
document.addEventListener('DOMContentLoaded', () => {
  const skillTags = document.querySelectorAll('.skill-tag');
  
  skillTags.forEach(tag => {
    tag.addEventListener('mouseenter', function() {
      // Create ripple effect
      const ripple = document.createElement('span');
      ripple.style.position = 'absolute';
      ripple.style.width = '5px';
      ripple.style.height = '5px';
      ripple.style.background = 'rgba(255, 255, 255, 0.5)';
      ripple.style.borderRadius = '50%';
      ripple.style.transform = 'scale(0)';
      ripple.style.animation = 'ripple 0.6s ease-out';
      ripple.style.pointerEvents = 'none';
      
      this.style.position = 'relative';
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });
});

// ===========================
// Add Ripple Animation CSS
// ===========================
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to {
      transform: scale(20);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// ===========================
// Project Card Interactions
// ===========================
document.addEventListener('DOMContentLoaded', () => {
  const projectCards = document.querySelectorAll('.project-card');
  
  projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-12px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
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
    hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    hero.style.opacity = 1 - (scrolled / window.innerHeight);
  }
});

// ===========================
// Console Message
// ===========================
console.log('%c👋 Welcome to my portfolio!', 'color: #a855f7; font-size: 20px; font-weight: bold;');
console.log('%cInterested in the code? Check out the source or reach out!', 'color: #60a5fa; font-size: 14px;');
