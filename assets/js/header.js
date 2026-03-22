document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const siteNav = document.querySelector('.site-nav');
  const dropdownToggle = document.querySelector('.has-dropdown > a');

  // 1. Mobile Menu Toggle
  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    
    // Toggle classes and ARIA states
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    siteNav.style.display = isExpanded ? 'none' : 'block'; 
    
    // Note: If using a CSS class like .is-active, use:
    // siteNav.classList.toggle('is-active');
  });

  // 2. Mobile Dropdown Toggle (for touch devices)
  if (window.innerWidth < 768) {
    dropdownToggle.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent navigation on first click
      const dropdown = dropdownToggle.nextElementSibling;
      const isOpen = dropdown.style.display === 'block';
      
      dropdown.style.display = isOpen ? 'none' : 'block';
      dropdownToggle.setAttribute('aria-expanded', !isOpen);
    });
  }

  // 3. Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!siteNav.contains(e.target) && !menuToggle.contains(e.target)) {
      menuToggle.setAttribute('aria-expanded', 'false');
      if (window.innerWidth < 768) siteNav.style.display = 'none';
    }
  });
});