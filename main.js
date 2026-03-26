/* ========================================
   ShintoPC Labs — Shared Interactivity
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ---- tsParticles (Interactive Hero Background) ----
  const tsParticlesContainer = document.getElementById('tsparticles');
  if (tsParticlesContainer && window.tsParticles) {
    tsParticles.load("tsparticles", {
      particles: {
        number: { value: 60, density: { enable: true, value_area: 800 } },
        color: { value: "#ffffff" },
        links: {
          enable: true,
          distance: 150,
          color: "#ffffff",
          opacity: 0.15,
          width: 1
        },
        shape: { type: "circle" },
        opacity: { value: 0.3, random: true },
        size: { value: 2, random: true },
        move: {
          enable: true,
          speed: 1,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
          bounce: false,
        }
      },
      interactivity: {
        detect_on: "window",
        events: {
          onhover: { enable: true, mode: "grab" },
          onclick: { enable: true, mode: "push" },
          resize: true
        },
        modes: {
          grab: { distance: 200, line_linked: { opacity: 0.4 } },
          push: { particles_nb: 4 }
        }
      },
      retina_detect: true
    });
  }

  // ---- Dark / Light Mode Toggle ----
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;

  // Always ensure dark mode is the default on page load
  html.classList.remove('light');
  html.classList.add('dark');

  if (themeToggle) {
    // Update icon based on current mode
    const updateIcon = () => {
      const icon = themeToggle.querySelector('.material-symbols-outlined');
      if (icon) {
        icon.textContent = html.classList.contains('light') ? 'dark_mode' : 'light_mode';
      }
    };
    updateIcon();

    themeToggle.addEventListener('click', () => {
      html.classList.toggle('light');
      html.classList.toggle('dark');
      localStorage.setItem('shintopc-theme', html.classList.contains('light') ? 'light' : 'dark');
      updateIcon();
    });
  }

  // ---- Hamburger Menu Toggle ----
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const icon = hamburgerBtn.querySelector('span');
      if (mobileMenu.classList.contains('open')) {
        icon.innerText = 'close';
        icon.classList.add('text-primary');
      } else {
        icon.innerText = 'menu';
        icon.classList.remove('text-primary');
      }
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        const icon = hamburgerBtn.querySelector('span');
        icon.innerText = 'menu';
        icon.classList.remove('text-primary');
      });
    });
  }

  // ---- Scroll Reveal (IntersectionObserver) ----
  const revealSelectors = '.fade-in, .slide-left, .slide-right, .scale-in, .glass-panel, .glass-card';
  const revealElements = document.querySelectorAll(revealSelectors);
  
  if (revealElements.length > 0) {
    // Auto-add fade-in class to glass elements that don't already have an animation class
    revealElements.forEach(el => {
      const hasAnim = el.classList.contains('fade-in') || el.classList.contains('slide-left') || 
                      el.classList.contains('slide-right') || el.classList.contains('scale-in');
      if (!hasAnim) {
        el.classList.add('fade-in');
      }
    });

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px'
    });

    // Re-query after adding classes, apply stagger
    document.querySelectorAll('.fade-in, .slide-left, .slide-right, .scale-in').forEach((el, i) => {
      // Stagger siblings in the same parent for cascade effect
      if (!el.className.includes('delay-')) {
        const parent = el.parentElement;
        const siblings = parent ? Array.from(parent.querySelectorAll(':scope > .fade-in, :scope > .slide-left, :scope > .slide-right, :scope > .scale-in')) : [];
        const indexInParent = siblings.indexOf(el);
        el.style.transitionDelay = `${(indexInParent >= 0 ? indexInParent : i % 4) * 100}ms`;
      }
      revealObserver.observe(el);
    });
  }

  // ---- Button Ripple Effect ----
  document.querySelectorAll('.btn-ripple').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const circle = document.createElement('span');
      circle.classList.add('ripple-circle');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      circle.style.width = circle.style.height = size + 'px';
      circle.style.left = (e.clientX - rect.left - size / 2) + 'px';
      circle.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(circle);
      circle.addEventListener('animationend', () => circle.remove());
    });
  });

  // ---- Carousel Arrow Navigation ----
  const carousel = document.getElementById('gallery-carousel');
  const arrowLeft = document.getElementById('carousel-left');
  const arrowRight = document.getElementById('carousel-right');

  if (carousel) {
    const scrollAmount = 340;

    if (arrowLeft) {
      arrowLeft.addEventListener('click', () => {
        carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      });
    }
    if (arrowRight) {
      arrowRight.addEventListener('click', () => {
        carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      });
    }

    // Touch/swipe support
    let startX = 0;
    let scrollStart = 0;
    let isDragging = false;

    carousel.addEventListener('touchstart', (e) => {
      startX = e.touches[0].pageX;
      scrollStart = carousel.scrollLeft;
      isDragging = true;
    }, { passive: true });

    carousel.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const diff = startX - e.touches[0].pageX;
      carousel.scrollLeft = scrollStart + diff;
    }, { passive: true });

    carousel.addEventListener('touchend', () => {
      isDragging = false;
    });

    // Mouse drag support for desktop
    carousel.addEventListener('mousedown', (e) => {
      startX = e.pageX;
      scrollStart = carousel.scrollLeft;
      isDragging = true;
      carousel.style.cursor = 'grabbing';
      e.preventDefault();
    });

    carousel.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const diff = startX - e.pageX;
      carousel.scrollLeft = scrollStart + diff;
    });

    carousel.addEventListener('mouseup', () => {
      isDragging = false;
      carousel.style.cursor = 'grab';
    });

    carousel.addEventListener('mouseleave', () => {
      isDragging = false;
      carousel.style.cursor = 'grab';
    });

    carousel.style.cursor = 'grab';
  }

  // ---- Navbar Scroll Enhancement ----
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const navInner = navbar.querySelector('div');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      if (currentScroll > 80) {
        navbar.classList.add('navbar-scrolled');
      } else {
        navbar.classList.remove('navbar-scrolled');
      }
      lastScroll = currentScroll;
    }, { passive: true });
  }

});
