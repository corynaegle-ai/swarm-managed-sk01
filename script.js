/**
 * Pirate Theme Interactive Script
 * Handles smooth scrolling, form validation, animations, and mobile interactions
 */

(function() {
  'use strict';

  // DOM Elements
  const app = document.getElementById('app');
  const mobileMenuBtn = document.querySelector('[data-mobile-menu-toggle]');
  const navLinks = document.querySelectorAll('a[data-scroll-to]');
  const form = document.querySelector('[data-pirate-form]');
  const buttons = document.querySelectorAll('button:not([data-mobile-menu-toggle])');
  const interactiveElements = document.querySelectorAll('[data-interactive]');

  /**
   * Initialize all interactive features
   */
  function init() {
    setupSmoothScrolling();
    setupFormValidation();
    setupMobileMenu();
    setupButtonInteractions();
    setupEntranceAnimations();
    setupHoverEffects();
  }

  /**
   * Smooth scrolling for navigation links
   * Criterion 1: Implement smooth scrolling navigation between page sections
   */
  function setupSmoothScrolling() {
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('data-scroll-to');
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Close mobile menu if open
          closeMobileMenu();
        }
      });
    });
  }

  /**
   * Form validation with pirate-themed messages
   * Criterion 3: Create form validation with pirate-themed error messages
   */
  function setupFormValidation() {
    if (!form) return;

    const pirateMessages = {
      required: "Arrr! This field be empty, ye scallywag!",
      email: "Blow me down! That be not a proper email address, matey!",
      minLength: "Shiver me timbers! That be too short, buccaneer!",
      pattern: "Avast ye! That don't follow the rules, landlubber!"
    };

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const inputs = form.querySelectorAll('input, textarea');
      let isValid = true;

      inputs.forEach(input => {
        const error = validateField(input, pirateMessages);
        if (error) {
          isValid = false;
          showFieldError(input, error);
        } else {
          clearFieldError(input);
        }
      });

      if (isValid) {
        form.classList.add('form-success');
        setTimeout(() => {
          form.classList.remove('form-success');
          form.reset();
        }, 2000);
      }
    });
  }

  /**
   * Validate individual form field
   */
  function validateField(input, messages) {
    const value = input.value.trim();
    const type = input.getAttribute('type') || input.tagName.toLowerCase();
    const required = input.hasAttribute('required');
    const minLength = input.getAttribute('minlength');

    if (required && !value) {
      return messages.required;
    }

    if (value && type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return messages.email;
      }
    }

    if (value && minLength && value.length < parseInt(minLength)) {
      return messages.minLength;
    }

    return null;
  }

  /**
   * Display field error with pirate message
   */
  function showFieldError(input, message) {
    input.classList.add('field-error');
    let errorElement = input.nextElementSibling;
    
    if (!errorElement || !errorElement.classList.contains('error-message')) {
      errorElement = document.createElement('span');
      errorElement.classList.add('error-message');
      input.parentNode.insertBefore(errorElement, input.nextSibling);
    }
    
    errorElement.textContent = message;
  }

  /**
   * Clear field error state
   */
  function clearFieldError(input) {
    input.classList.remove('field-error');
    const errorElement = input.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
      errorElement.remove();
    }
  }

  /**
   * Mobile menu toggle functionality
   * Criterion 4: Implement responsive mobile menu toggle functionality
   */
  function setupMobileMenu() {
    if (!mobileMenuBtn) return;

    mobileMenuBtn.addEventListener('click', function() {
      const nav = document.querySelector('nav[data-mobile-menu]');
      if (nav) {
        nav.classList.toggle('menu-open');
        mobileMenuBtn.classList.toggle('menu-active');
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('nav[data-mobile-menu]') && 
          !e.target.closest('[data-mobile-menu-toggle]')) {
        closeMobileMenu();
      }
    });
  }

  /**
   * Close mobile menu
   */
  function closeMobileMenu() {
    const nav = document.querySelector('nav[data-mobile-menu]');
    if (nav) {
      nav.classList.remove('menu-open');
      if (mobileMenuBtn) {
        mobileMenuBtn.classList.remove('menu-active');
      }
    }
  }

  /**
   * Button click interactions with visual feedback
   * Criterion 2: Add click handlers for buttons with visual feedback using CSS class toggles
   */
  function setupButtonInteractions() {
    buttons.forEach(button => {
      button.addEventListener('click', function(e) {
        // Add active state
        this.classList.add('btn-active');
        
        // Remove active state after animation completes
        setTimeout(() => {
          this.classList.remove('btn-active');
        }, 300);

        // Add ripple/press effect
        const ripple = document.createElement('span');
        ripple.classList.add('btn-ripple');
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        this.appendChild(ripple);
        
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });

      // Touch feedback for mobile
      button.addEventListener('touchstart', function() {
        this.classList.add('btn-touched');
      });

      button.addEventListener('touchend', function() {
        this.classList.remove('btn-touched');
      });
    });
  }

  /**
   * Entrance animations on page load
   * Criterion 5: Add entrance animations by toggling CSS animation classes on page load
   */
  function setupEntranceAnimations() {
    // Animate main app elements on load
    if (app) {
      const children = app.querySelectorAll('h1, p, section, article');
      children.forEach((child, index) => {
        setTimeout(() => {
          child.classList.add('entrance-animate');
        }, index * 100);
      });
    }

    // Animate interactive elements
    interactiveElements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('entrance-animate');
      }, index * 150);
    });
  }

  /**
   * Hover effects using CSS class manipulation
   * Criterion 6: Include hover effects for interactive elements using CSS class manipulation
   */
  function setupHoverEffects() {
    const hoverElements = document.querySelectorAll(
      'a, button, [data-interactive], .card, [role="button"]'
    );

    hoverElements.forEach(element => {
      element.addEventListener('mouseenter', function() {
        this.classList.add('hover-active');
      });

      element.addEventListener('mouseleave', function() {
        this.classList.remove('hover-active');
      });

      // Mobile equivalent using touch
      element.addEventListener('touchstart', function() {
        this.classList.add('touch-active');
      });

      element.addEventListener('touchend', function() {
        this.classList.remove('touch-active');
      });
    });
  }

  /**
   * Handle window resize for responsive behavior
   */
  function handleResize() {
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Handle window resize
  window.addEventListener('resize', handleResize);

  // Expose public API for testing/external use
  window.PirateApp = {
    validateField: validateField,
    closeMobileMenu: closeMobileMenu
  };

})();
