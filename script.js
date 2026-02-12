/* ============================================
   Valentine's Day Invitation — Script
   ============================================ */

// ——————————————————————————————————
// CONFIGURATION — Edit these easily!
// ——————————————————————————————————
const CONFIG = {
  // Valentine's date: February 14, 2026 at 7:00 PM EST
  // Format: "YYYY-MM-DDTHH:MM:SS" in your target timezone
  valentineDate: new Date('2026-02-14T15:30:00+03:00'),

  // Teleparty link (replace with your actual Teleparty session link)
  telepartyLink: 'https://www.teleparty.com',
};

// ——————————————————————————————————
// FLOATING HEARTS
// ——————————————————————————————————
function createFloatingHearts() {
  const container = document.getElementById('floatingHearts');
  const hearts = ['💕', '💗', '💖', '💓', '♡', '❤️', '🩷'];
  const count = 15;

  for (let i = 0; i < count; i++) {
    const heart = document.createElement('span');
    heart.classList.add('floating-heart');
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

    const size = 0.6 + Math.random() * 0.8;
    const left = Math.random() * 100;
    const duration = 8 + Math.random() * 12;
    const delay = Math.random() * duration;

    heart.style.cssText = `
      left: ${left}%;
      font-size: ${size}rem;
      animation-duration: ${duration}s;
      animation-delay: -${delay}s;
      opacity: 0;
    `;

    container.appendChild(heart);
  }
}

// ——————————————————————————————————
// SPARKLE BURST ON "YES" CLICK
// ——————————————————————————————————
function createSparkleBurst(x, y) {
  const burst = document.createElement('div');
  burst.classList.add('sparkle-burst');
  burst.style.left = x + 'px';
  burst.style.top = y + 'px';
  document.body.appendChild(burst);

  const emojis = ['💖', '💕', '✨', '💗', '🩷', '💓', '⭐', '🌸'];
  const count = 12;

  for (let i = 0; i < count; i++) {
    const sparkle = document.createElement('span');
    sparkle.classList.add('sparkle');
    sparkle.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    const angle = (360 / count) * i + (Math.random() * 30 - 15);
    const distance = 60 + Math.random() * 80;
    const tx = Math.cos((angle * Math.PI) / 180) * distance;
    const ty = Math.sin((angle * Math.PI) / 180) * distance;

    sparkle.style.setProperty('--tx', tx + 'px');
    sparkle.style.setProperty('--ty', ty + 'px');
    sparkle.style.animationDelay = Math.random() * 0.15 + 's';

    burst.appendChild(sparkle);
  }

  setTimeout(() => burst.remove(), 1200);
}

// ——————————————————————————————————
// "YES" BUTTON — REVEAL CONTENT
// ——————————————————————————————————
function initYesButton() {
  const btn = document.getElementById('btnYes');
  const btnNo = document.getElementById('btnNo');
  const mainContent = document.getElementById('mainContent');
  const hero = document.getElementById('hero');
  const musicToggle = document.getElementById('musicToggle');

  // "No" button — show popup
  btnNo.addEventListener('click', () => {
    const overlay = document.createElement('div');
    overlay.classList.add('no-popup-overlay');
    overlay.innerHTML = `
      <div class="no-popup">
        <div class="no-popup-emoji">🥺</div>
        <p class="no-popup-text">Sorry, that is not an option.</p>
        <p class="no-popup-subtext">Please try again 💕</p>
        <button class="no-popup-btn">Okay 💖</button>
      </div>
    `;
    document.body.appendChild(overlay);

    overlay.querySelector('.no-popup-btn').addEventListener('click', () => {
      overlay.remove();
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });
  });

  // "Yes" button — reveal content
  btn.addEventListener('click', (e) => {
    // Sparkle burst at click location
    createSparkleBurst(e.clientX, e.clientY);

    // Short delay, then reveal
    setTimeout(() => {
      mainContent.classList.add('revealed');
      musicToggle.classList.add('visible');

      // Smooth scroll to the next section
      setTimeout(() => {
        mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);

      // Start music
      const audio = document.getElementById('bgMusic');
      audio.play().then(() => {
        musicToggle.classList.add('playing');
        musicToggle.querySelector('.music-label').textContent = 'Playing';
      }).catch(() => {});

      // Start countdown
      startCountdown();

      // Init scroll animations
      initScrollAnimations();
    }, 500);
  });
}

// ——————————————————————————————————
// COUNTDOWN TIMER
// ——————————————————————————————————
let countdownInterval = null;

function startCountdown() {
  const daysEl = document.getElementById('countDays');
  const hoursEl = document.getElementById('countHours');
  const minsEl = document.getElementById('countMins');
  const secsEl = document.getElementById('countSecs');

  function updateCountdown() {
    const now = new Date();
    const diff = CONFIG.valentineDate - now;

    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      clearInterval(countdownInterval);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    const pad = (n) => String(n).padStart(2, '0');

    // Animate tick when value changes
    animateTick(daysEl, pad(days));
    animateTick(hoursEl, pad(hours));
    animateTick(minsEl, pad(mins));
    animateTick(secsEl, pad(secs));
  }

  function animateTick(el, newVal) {
    if (el.textContent !== newVal) {
      el.textContent = newVal;
      el.classList.remove('tick');
      // Force reflow to restart animation
      void el.offsetWidth;
      el.classList.add('tick');
    }
  }

  updateCountdown();
  countdownInterval = setInterval(updateCountdown, 1000);
}

// ——————————————————————————————————
// SCROLL ANIMATIONS (Intersection Observer)
// ——————————————————————————————————
function initScrollAnimations() {
  const animateElements = document.querySelectorAll('[data-animate]');

  if (!('IntersectionObserver' in window)) {
    // Fallback: just show everything
    animateElements.forEach((el) => el.classList.add('animated'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  animateElements.forEach((el) => observer.observe(el));
}

// ——————————————————————————————————
// BACKGROUND MUSIC
// ——————————————————————————————————
function initMusic() {
  const toggle = document.getElementById('musicToggle');
  const audio = document.getElementById('bgMusic');

  audio.volume = 0.3;

  toggle.addEventListener('click', () => {
    if (!audio.paused) {
      audio.pause();
      toggle.classList.remove('playing');
      toggle.querySelector('.music-label').textContent = 'Music';
    } else {
      audio.play().then(() => {
        toggle.classList.add('playing');
        toggle.querySelector('.music-label').textContent = 'Playing';
      }).catch((err) => {
        console.error('Audio playback failed:', err);
      });
    }
  });
}

// ——————————————————————————————————
// INITIALIZATION
// ——————————————————————————————————
document.addEventListener('DOMContentLoaded', () => {
  createFloatingHearts();
  initYesButton();
  initMusic();
});
