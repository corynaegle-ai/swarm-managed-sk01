/**
 * Pirate Theme Interactive Script
 * Handles smooth scrolling, form validation, animations, and interactive effects
 */

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeSmoothScrolling();
  initializeButtonHandlers();
  initializeFormValidation();
  initializeMobileMenuToggle();
  initializeEntranceAnimations();
  initializeHoverEffects();
});

/**
 * Criterion 1: Smooth Scrolling Navigation
 * Implement smooth scrolling for navigation links between page sections
 */
function initializeSmoothScrolling() {
  // Delegate event listener for all navigation links
  document.addEventListener('click', function(event) {
    // Check if clicked element is a navigation link
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      event.preventDefault();

      // Use native smooth scroll behavior
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      // Close mobile menu if open after navigation
      const mobileMenu = document.querySelector('nav.mobile-menu');
      if (mobileMenu && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
      }
    }
  });
}

/**
 * Criterion 2: Button Click Handlers with Visual Feedback
 * Add click handlers for buttons with CSS class-based visual feedback
 */
function initializeButtonHandlers() {
  // Delegate event listener for all buttons
  document.addEventListener('click', function(event) {
    const button = event.target.closest('button');
    if (!button) return;

    // Add active state class for visual feedback
    button.classList.add('active');

    // Remove active state after animation completes (300ms)
    setTimeout(function() {
      button.classList.remove('active');
    }, 300);

    // Add pressed animation class
    button.classList.add('pressed');
    setTimeout(function() {
      button.classList.remove('pressed');
    }, 150);
  });
}

/**
 * Criterion 3: Form Validation with Pirate-Themed Messages
 * Create form validation with pirate-themed error messages
 */
function initializeFormValidation() {
  const forms = document.querySelectorAll('form');

  forms.forEach(function(form) {
    form.addEventListener('submit', function(event) {
      const isValid = validateForm(form);
      if (!isValid) {
        event.preventDefault();
      }
    });

    // Validate on blur for better UX
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(function(input) {
      input.addEventListener('blur', function() {
        validateField(input);
      });
    });
  });
}

/**
 * Validate a single form field with pirate-themed messages
 */
function validateField(field) {
  let isValid = true;
  let errorMessage = '';

  // Remove existing error message
  const existingError = field.parentElement.querySelector('.pirate-error');
  if (existingError) {
    existingError.remove();
    field.classList.remove('error');
  }

  // Check required fields
  if (field.required && !field.value.trim()) {
    isValid = false;
    errorMessage = '🏴‍☠️ Arrr! This treasure map location be empty, matey!';
  }
  // Check email format
  else if (field.type === 'email' && field.value.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(field.value)) {
      isValid = false;
      errorMessage = '🏴‍☠️ Shiver me timbers! That be not a valid pirate ship message address!';
    }
  }
  // Check password strength if password field
  else if (field.type === 'password' && field.value.trim()) {
    if (field.value.length < 6) {
      isValid = false;
      errorMessage = '🏴‍☠️ Avast! That password be too weak for a pirate fortress!';
    }
  }
  // Check minimum length
  else if (field.minLength && field.value.trim().length < field.minLength) {
    isValid = false;
    errorMessage = '🏴‍☠️ Blow me down! Need more characters to plunder the seas properly!';
  }

  // Display error message if validation fails
  if (!isValid) {
    field.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'pirate-error';
    errorDiv.textContent = errorMessage;
    field.parentElement.insertBefore(errorDiv, field.nextSibling);
  } else {
    field.classList.remove('error');
  }

  return isValid;
}

/**
 * Validate entire form
 */
function validateForm(form) {
  const inputs = form.querySelectorAll('input, textarea, select');
  let formIsValid = true;

  inputs.forEach(function(input) {
    if (!validateField(input)) {
      formIsValid = false;
    }
  });

  return formIsValid;
}

/**
 * Criterion 4: Mobile Menu Toggle Functionality
 * Implement responsive mobile menu toggle with CSS class manipulation
 */
function initializeMobileMenuToggle() {
  // Find menu toggle button
  const menuToggle = document.querySelector('.menu-toggle, .hamburger-menu, .nav-toggle');
  const mobileMenu = document.querySelector('nav.mobile-menu, nav');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function(event) {
      event.stopPropagation();
      mobileMenu.classList.toggle('active');
      menuToggle.classList.toggle('open');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!event.target.closest('nav') && !event.target.closest('.menu-toggle') &&
          !event.target.closest('.hamburger-menu') && !event.target.closest('.nav-toggle')) {
        if (mobileMenu.classList.contains('active')) {
          mobileMenu.classList.remove('active');
          if (menuToggle) menuToggle.classList.remove('open');
        }
      }
    });
  }
}

/**
 * Criterion 5: Entrance Animations
 * Add entrance animations by toggling CSS animation classes on page load
 */
function initializeEntranceAnimations() {
  // Get all elements with animation classes
  const elementsWithAnimations = document.querySelectorAll(
    '[class*="animate"], [class*="fade"], [class*="slide"], [class*="bounce"]'
  );

  // Add animation trigger class after a brief delay for smooth entrance
  elementsWithAnimations.forEach(function(element, index) {
    setTimeout(function() {
      element.classList.add('in-view');
    }, index * 100);
  });

  // Also implement intersection observer for elements entering viewport during scroll
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    // Observe all elements with animation classes
    elementsWithAnimations.forEach(function(element) {
      observer.observe(element);
    });
  }
}

/**
 * Criterion 6: Hover Effects using CSS Class Manipulation
 * Implement hover effects by toggling CSS classes on interactive elements
 */
function initializeHoverEffects() {
  // Target interactive elements: buttons, links, cards, etc.
  const interactiveSelectors = [
    'button',
    'a[href]',
    '[role="button"]',
    '.card',
    '.interactive',
    'input[type="checkbox"], input[type="radio"]'
  ];

  const selector = interactiveSelectors.join(', ');
  const interactiveElements = document.querySelectorAll(selector);

  interactiveElements.forEach(function(element) {
    // Skip if it's a navigation link (handled by smooth scrolling)
    if (element.tagName === 'A' && element.getAttribute('href', '').startsWith('#')) {
      return;
    }

    // Add hover class on mouse enter
    element.addEventListener('mouseenter', function() {
      this.classList.add('hover');
    });

    // Remove hover class on mouse leave
    element.addEventListener('mouseleave', function() {
      this.classList.remove('hover');
    });

    // Support touch devices
    element.addEventListener('touchstart', function() {
      this.classList.add('hover');
    }, { passive: true });

    element.addEventListener('touchend', function() {
      this.classList.remove('hover');
    }, { passive: true });
  });
}

// Export functions for testing if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeSmoothScrolling,
    initializeButtonHandlers,
    initializeFormValidation,
    initializeMobileMenuToggle,
    initializeEntranceAnimations,
    initializeHoverEffects,
    validateField,
    validateForm
  };
}
