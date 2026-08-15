/**
 * Theme JavaScript — no dependencies.
 * Handles: mobile menu, submenu accordions, dropdown keyboard nav, search UI.
 */
(function () {
  'use strict';

  /* ── Mobile Menu ─────────────────────────────── */
  const toggle = document.getElementById('mobile-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      const isOpen = mobileNav.style.display === 'block';
      mobileNav.style.display = isOpen ? 'none' : 'block';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      // swap icon
      toggle.querySelector('.icon-menu').style.display = isOpen ? 'block' : 'none';
      toggle.querySelector('.icon-close').style.display = isOpen ? 'none' : 'block';
    });
  }

  /* ── Mobile submenu accordions ───────────────── */
  if (mobileNav) {
    mobileNav.addEventListener('click', function (e) {
      const btn = e.target.closest('.gp-mobile-nav-parent');
      if (!btn) return;
      const panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (!panel) return;
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!isOpen));
      panel.hidden = isOpen;
    });
  }



  /* ── Dropdown keyboard nav ───────────────────── */
  document.querySelectorAll('.gp-nav-item').forEach(function (item) {
    const btn = item.querySelector('.gp-nav-link[aria-haspopup]');
    const menu = item.querySelector('.gp-dropdown-menu');
    if (!btn || !menu) return;

    btn.addEventListener('click', function () {
      const open = menu.classList.toggle('gp-dropdown-open');
      btn.setAttribute('aria-expanded', String(open));
    });

    btn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const open = menu.classList.toggle('gp-dropdown-open');
        btn.setAttribute('aria-expanded', String(open));
      } else if (e.key === 'Escape') {
        menu.classList.remove('gp-dropdown-open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close if clicking outside
    document.addEventListener('click', function (e) {
      if (!item.contains(e.target)) {
        menu.classList.remove('gp-dropdown-open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  /* ── Header search toggle ────────────────────── */
  var searchToggle = document.getElementById('header-search-toggle');
  var headerSearch = document.getElementById('header-search');
  if (searchToggle && headerSearch) {
    searchToggle.addEventListener('click', function () {
      var open = !headerSearch.hasAttribute('hidden');
      if (open) {
        headerSearch.setAttribute('hidden', '');
      } else {
        headerSearch.removeAttribute('hidden');
        var input = headerSearch.querySelector('input[name="q"]');
        if (input) input.focus();
      }
      searchToggle.setAttribute('aria-expanded', String(!open));
      searchToggle.classList.toggle('is-open', !open);
    });
    headerSearch.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        headerSearch.setAttribute('hidden', '');
        searchToggle.setAttribute('aria-expanded', 'false');
        searchToggle.classList.remove('is-open');
        searchToggle.focus();
      }
    });
  }

  /* ── Search: block empty submit, allow non-empty ─── */
  document.querySelectorAll('.gp-search-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      var input = form.querySelector('input[name="q"]');
      if (!input || !input.value.trim()) {
        e.preventDefault(); // block empty searches
      }
      // non-empty query: let the browser navigate to action URL naturally
    });
  });
})();
