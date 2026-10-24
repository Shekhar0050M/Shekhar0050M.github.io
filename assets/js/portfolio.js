/**
 * SHEKHAR SUMAN — PERSONAL PORTFOLIO INTERACTION LOGIC
 * Dynamic Navbar, Theme Switcher, Resume Modal, Toast System & Micro-Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initScrollEffects();
  initNavigation();
  initResumeModal();
  initClipboardAndToasts();
  initActiveNavSpy();
});

/* -------------------------------------------------------------------------
   1. Theme Management (Light / Dark Mode)
   ------------------------------------------------------------------------- */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('portfolio-theme') || 'dark';

  document.documentElement.setAttribute('data-theme', storedTheme);
  updateThemeIcon(storedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
      updateThemeIcon(newTheme);
      showToast(`Switched to ${newTheme} theme`);
    });
  }
}

function updateThemeIcon(theme) {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  if (theme === 'light') {
    themeToggle.innerHTML = `
      <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
      </svg>
    `;
    themeToggle.setAttribute('title', 'Switch to Dark Mode');
  } else {
    themeToggle.innerHTML = `
      <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
      </svg>
    `;
    themeToggle.setAttribute('title', 'Switch to Light Mode');
  }
}

/* -------------------------------------------------------------------------
   2. Scroll Effects (Progress Bar & Scrolled Navbar)
   ------------------------------------------------------------------------- */
function initScrollEffects() {
  const progressBar = document.getElementById('scroll-progress');
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    if (navbar) {
      if (scrollTop > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  }, { passive: true });
}

/* -------------------------------------------------------------------------
   3. Navigation (Mobile Drawer & Smooth Scrolling)
   ------------------------------------------------------------------------- */
function initNavigation() {
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const closeDrawer = document.getElementById('close-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  function hideDrawer() {
    if (mobileDrawer) {
      mobileDrawer.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (closeDrawer) closeDrawer.addEventListener('click', hideDrawer);

  mobileLinks.forEach(link => {
    link.addEventListener('click', hideDrawer);
  });
}

/* -------------------------------------------------------------------------
   4. Interactive Resume Modal
   ------------------------------------------------------------------------- */
function initResumeModal() {
  const resumeModal = document.getElementById('resume-modal');
  const resumeTriggers = document.querySelectorAll('.js-open-resume');
  const closeResumeBtn = document.getElementById('close-resume-modal');

  function openResume() {
    if (resumeModal) {
      resumeModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeResume() {
    if (resumeModal) {
      resumeModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  resumeTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openResume();
    });
  });

  if (closeResumeBtn) {
    closeResumeBtn.addEventListener('click', closeResume);
  }

  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) {
        closeResume();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resumeModal && resumeModal.classList.contains('open')) {
      closeResume();
    }
  });
}

/* -------------------------------------------------------------------------
   5. Clipboard Copying & Toast Notifications
   ------------------------------------------------------------------------- */
function initClipboardAndToasts() {
  const copyButtons = document.querySelectorAll('[data-copy]');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const text = btn.getAttribute('data-copy');
      if (!text) return;

      try {
        await navigator.clipboard.writeText(text);
        showToast(`Copied to clipboard: ${text}`);
      } catch (err) {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`Copied: ${text}`);
      }
    });
  });
}

function showToast(message) {
  let toast = document.getElementById('portfolio-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'portfolio-toast';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="color: #10b981;">
      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
    </svg>
    <span>${message}</span>
  `;

  toast.classList.add('show');

  if (window.toastTimeout) clearTimeout(window.toastTimeout);
  window.toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* -------------------------------------------------------------------------
   6. Active Nav Item Spy with IntersectionObserver
   ------------------------------------------------------------------------- */
function initActiveNavSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links .nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-30% 0px -60% 0px'
  });

  sections.forEach(section => observer.observe(section));
}
