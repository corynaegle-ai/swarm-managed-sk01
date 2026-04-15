/**
 * Pirate Theme UI - JavaScript Functionality
 * Handles form submission, interactivity, and dynamic content
 */

'use strict';

/**
 * Initialize the pirate theme UI
 */
function initPirateUI() {
  // Setup form submission handler
  const crewForm = document.getElementById('crewForm');
  if (crewForm) {
    crewForm.addEventListener('submit', handleFormSubmit);
  }

  // Setup quick link click handlers
  const quickLinks = document.querySelectorAll('.quick-link');
  quickLinks.forEach(link => {
    link.addEventListener('click', handleQuickLinkClick);
  });

  // Setup navigation link highlighting
  setupNavigation();

  console.log('⚓ Pirate UI initialized successfully!');
}

/**
 * Handle form submission
 * @param {Event} event - Form submit event
 */
function handleFormSubmit(event) {
  event.preventDefault();

  // Get form values
  const crewName = document.getElementById('crewName').value.trim();
  const crewRole = document.getElementById('crewRole').value;
  const crewExperience = document.getElementById('crewExperience').value;

  // Validate required fields
  if (!crewName) {
    alert('Shiver me timbers! Please enter your pirate name!');
    return;
  }

  if (!crewRole) {
    alert('Ye must choose a role, matey!');
    return;
  }

  // Create success message
  const message = `Welcome aboard, ${crewName}!\n` +
    `Your role: ${crewRole}\n` +
    `Years at sea: ${crewExperience || 'Unknown'}\n` +
    `Prepare to set sail! ⚓`;

  alert(message);

  // Log crew member
  console.log('New crew member registered:', {
    name: crewName,
    role: crewRole,
    experience: crewExperience,
    joinedAt: new Date().toISOString()
  });

  // Reset form
  event.target.reset();
  document.getElementById('crewName').focus();
}

/**
 * Handle quick link clicks
 * @param {Event} event - Click event
 */
function handleQuickLinkClick(event) {
  event.preventDefault();

  const linkText = event.currentTarget.getAttribute('data-link');

  // Display themed message
  alert(`Setting sail to '${linkText}'! Arrr!`);

  // Log navigation
  console.log(`Navigating to: ${linkText}`);
}

/**
 * Setup navigation functionality
 */
function setupNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      // Remove active class from all links
      navLinks.forEach(l => l.classList.remove('active'));

      // Add active class to clicked link
      this.classList.add('active');

      // Log navigation
      const target = this.getAttribute('href');
      console.log(`Navigation: ${target}`);
    });
  });
}

/**
 * Utility function to get pirate-themed message
 * @returns {string} Random pirate greeting
 */
function getPirateGreeting() {
  const greetings = [
    'Ahoy, matey!',
    'Shiver me timbers!',
    'Avast, ye scurvy dog!',
    'Blow me down!',
    'Yo ho ho!',
    'Batten down the hatches!',
    'Land ho!',
    'Weigh anchor!'
  ];

  return greetings[Math.floor(Math.random() * greetings.length)];
}

/**
 * Utility function to validate email (if needed)
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Utility function to format date in pirate style
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
function formatPirateDate(date) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;
}

/**
 * Log crew member data (mock storage)
 * @param {Object} crewMember - Crew member data
 */
function registerCrewMember(crewMember) {
  try {
    // Retrieve existing crew from localStorage
    let crew = JSON.parse(localStorage.getItem('pirates') || '[]');

    // Add new member
    crew.push({
      ...crewMember,
      id: Date.now(),
      joinDate: new Date().toISOString()
    });

    // Save to localStorage
    localStorage.setItem('pirates', JSON.stringify(crew));

    console.log('Crew member registered:', crewMember);
    return true;
  } catch (error) {
    console.error('Error registering crew member:', error);
    return false;
  }
}

/**
 * Retrieve all crew members
 * @returns {Array} Array of crew members
 */
function getCrewMembers() {
  try {
    return JSON.parse(localStorage.getItem('pirates') || '[]');
  } catch (error) {
    console.error('Error retrieving crew members:', error);
    return [];
  }
}

/**
 * Initialize when DOM is ready
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPirateUI);
} else {
  // DOM is already ready
  initPirateUI();
}
