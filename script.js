/* ============================================================
   script.js — Restaurant Website
   ============================================================ */


/* ── 1. NAVBAR HAMBURGER TOGGLE ─────────────────────────── */

var navToggle = document.getElementById('navToggle');
var navMenu   = document.getElementById('navMenu');

if (navToggle && navMenu) {

  navToggle.addEventListener('click', function () {
    var isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  /* Close menu when clicking outside it */
  document.addEventListener('click', function (e) {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}


/* ── 2. ACTIVE NAV LINK ──────────────────────────────────── */

var currentPage = window.location.pathname.split('/').pop() || 'index.html';
var navLinks    = document.querySelectorAll('.navbar__link');

for (var i = 0; i < navLinks.length; i++) {
  var linkHref = navLinks[i].getAttribute('href').split('/').pop();
  if (linkHref === currentPage) {
    navLinks[i].classList.add('active');
  }
}


/* ── 3. AUTO COPYRIGHT YEAR ──────────────────────────────── */

var yearEl = document.getElementById('footerYear');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}


/* ============================================================
   4. MENU CATEGORY FILTER
   ──────────────────────────────────────────────────────────
   HOW IT WORKS:
   - Every filter button has:    data-filter="starters"
   - Every menu card has:        data-category="starters"
   - JS reads both with getAttribute()
   - If they match → card.style.display = 'flex'  (show)
   - If no match  → card.style.display = 'none'   (hide)
   - "all" always shows every card
   ──────────────────────────────────────────────────────────
   WHY style.display DIRECTLY?
   Inline styles have the highest CSS specificity.
   No class can override them. The filter always works.
   ============================================================ */

var filterBtns  = document.querySelectorAll('.filter-btn');
var menuCards   = document.querySelectorAll('.menu-card');
var itemCount   = document.getElementById('itemCount');
var emptyState  = document.getElementById('emptyState');

/* Only run this block on pages that have filter buttons */
if (filterBtns.length > 0) {

  /* Loop through every filter button */
  for (var b = 0; b < filterBtns.length; b++) {

    filterBtns[b].addEventListener('click', function () {

      /* ── STEP 1: Read which category was clicked ── */
      var selectedFilter = this.getAttribute('data-filter');
      /*
        selectedFilter will be one of:
        "all" | "starters" | "main" | "drinks" | "desserts"
      */

      /* ── STEP 2: Move active class to clicked button ── */
      for (var x = 0; x < filterBtns.length; x++) {
        filterBtns[x].classList.remove('active');
      }
      this.classList.add('active');

      /* ── STEP 3: Show or hide each card ── */
      var visibleCount = 0;

      for (var c = 0; c < menuCards.length; c++) {

        /* Read the category this card belongs to */
        var cardCategory = menuCards[c].getAttribute('data-category');
        /*
          cardCategory will be one of:
          "starters" | "main" | "drinks" | "desserts"
        */

        /* Decide: should this card be shown? */
        var showCard = (selectedFilter === 'all') || (selectedFilter === cardCategory);

        if (showCard) {
          menuCards[c].style.display = 'flex';  /* SHOW */
          visibleCount++;
        } else {
          menuCards[c].style.display = 'none';  /* HIDE */
        }
      }

      /* ── STEP 4: Update the item count label ── */
      if (itemCount) {
        itemCount.textContent = visibleCount;
      }

      /* ── STEP 5: Show empty state if no items match ── */
      if (emptyState) {
        if (visibleCount === 0) {
          emptyState.style.display = 'flex';
        } else {
          emptyState.style.display = 'none';
        }
      }

    }); /* end click listener */

  } /* end for loop */

} /* end if filterBtns */
/* ── CONTACT FORM VALIDATION ──────────────────────────────── */

var contactForm = document.getElementById('contactForm');
var formSuccess = document.getElementById('formSuccess');

if (contactForm) {

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();  /* Stop real submit — no backend needed */

    var isValid = true;

    /* Helper: show or clear an error message */
    function setError(fieldId, errorId, message) {
      var field = document.getElementById(fieldId);
      var error = document.getElementById(errorId);
      if (!field || !error) return;
      if (message) {
        field.style.borderColor = '#e63946';
        error.textContent = message;
        isValid = false;
      } else {
        field.style.borderColor = '';
        error.textContent = '';
      }
    }

    /* Validate Name */
    var name = document.getElementById('contactName');
    if (!name || name.value.trim().length < 2) {
      setError('contactName', 'nameError', 'Please enter your full name.');
    } else {
      setError('contactName', 'nameError', '');
    }

    /* Validate Email */
    var email    = document.getElementById('contactEmail');
    var emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailReg.test(email.value.trim())) {
      setError('contactEmail', 'emailError', 'Please enter a valid email address.');
    } else {
      setError('contactEmail', 'emailError', '');
    }

    /* Validate Subject */
    var subject = document.getElementById('contactSubject');
    if (!subject || subject.value === '') {
      setError('contactSubject', 'subjectError', 'Please select a subject.');
    } else {
      setError('contactSubject', 'subjectError', '');
    }

    /* Validate Message */
    var message = document.getElementById('contactMessage');
    if (!message || message.value.trim().length < 10) {
      setError('contactMessage', 'messageError', 'Message must be at least 10 characters.');
    } else {
      setError('contactMessage', 'messageError', '');
    }

    /* If all fields pass — show success message */
    if (isValid && formSuccess) {
      contactForm.style.display = 'none';
      formSuccess.classList.add('visible');
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

  });

}
/* ============================================================
   UI ENHANCEMENTS — Append to bottom of script.js
   ============================================================ */


/* ── 1. NAVBAR SCROLL SHADOW ──────────────────────────────
   Adds .scrolled class to header once user scrolls 60px.
   CSS uses this class to deepen the shadow.
   ──────────────────────────────────────────────────────── */

(function initNavbarScroll() {
  var header = document.querySelector('.site-header');
  if (!header) return;

  function onScroll() {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); /* Run once on load in case page is already scrolled */
})();


/* ── 2. SCROLL-IN REVEAL ANIMATION ───────────────────────
   Uses IntersectionObserver to add .reveal--visible once
   an element enters the viewport.
   Add class="reveal" to any HTML element to animate it in.
   ──────────────────────────────────────────────────────── */

(function initReveal() {

  var revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  /* IntersectionObserver fires when element enters viewport */
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          /* Stop watching once revealed — no need to re-animate */
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,    /* Trigger when 12% of element is visible */
      rootMargin: '0px'
    }
  );

  revealEls.forEach(function (el) {
    observer.observe(el);
  });

})();


/* ── 3. SMOOTH SCROLL for same-page anchor links ─────────
   Handles links like <a href="#section"> smoothly.
   CSS scroll-behavior:smooth already handles most cases,
   this adds JS fallback for older browsers.
   ──────────────────────────────────────────────────────── */

(function initSmoothScroll() {

  var anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {

      var targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      var targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      var navHeight = document.querySelector('.site-header')
        ? document.querySelector('.site-header').offsetHeight
        : 0;

      var targetTop = targetEl.getBoundingClientRect().top
        + window.scrollY
        - navHeight
        - 20;  /* 20px breathing room */

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });

      /* Close mobile menu after clicking anchor link */
      var navMenu = document.getElementById('navMenu');
      var navToggle = document.getElementById('navToggle');
      if (navMenu && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
      }

    });
  });

})();


/* ── 4. SCROLL TO TOP BUTTON ──────────────────────────────
   Shows a back-to-top arrow when user scrolls 400px.
   Creates the button in JS so no HTML changes are needed.
   ──────────────────────────────────────────────────────── */

(function initScrollToTop() {

  /* Create the button element */
  var scrollBtn = document.createElement('button');
  scrollBtn.id = 'scrollToTop';
  scrollBtn.setAttribute('aria-label', 'Scroll back to top');
  scrollBtn.innerHTML = '↑';
  scrollBtn.style.cssText = [
    'position:fixed',
    'bottom:100px',
    'right:28px',
    'z-index:9998',
    'width:44px',
    'height:44px',
    'border-radius:50%',
    'background-color:var(--gold)',
    'color:#fff',
    'border:none',
    'font-size:1.2rem',
    'font-weight:700',
    'cursor:pointer',
    'box-shadow:0 4px 14px rgba(200,169,110,0.45)',
    'opacity:0',
    'transform:translateY(16px)',
    'transition:opacity 0.3s ease, transform 0.3s ease',
    'line-height:1'
  ].join(';');

  document.body.appendChild(scrollBtn);

  /* Show/hide based on scroll position */
  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      scrollBtn.style.opacity = '1';
      scrollBtn.style.transform = 'translateY(0)';
    } else {
      scrollBtn.style.opacity = '0';
      scrollBtn.style.transform = 'translateY(16px)';
    }
  }, { passive: true });

  /* Scroll to top on click */
  scrollBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

})();