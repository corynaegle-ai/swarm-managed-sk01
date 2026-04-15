// Player management app - handles setup form and game initialization

import { addPlayer, getPlayers, validatePlayer, clearPlayers } from './players.js';

// Configuration
const MIN_PLAYERS = 2;
const MAX_PLAYERS = 6;

/**
 * Initialize the app - set up event listeners and initialize state
 */
function initializeApp() {
  const playerNameInput = document.getElementById('pirate-name');
  const playerEmailInput = document.getElementById('pirate-email');
  const form = document.querySelector('form[data-player-form]');
  const startBtn = document.querySelector('button[data-start-game]');

  // Validate elements exist
  if (!playerNameInput || !playerEmailInput || !form || !startBtn) {
    console.error('Required form elements not found in DOM');
    return;
  }

  // Form submission handler - add player
  form.addEventListener('submit', handleFormSubmit);

  // Start game button handler
  startBtn.addEventListener('click', handleStartGame);

  // Initialize with cleared players
  clearPlayers();
}

/**
 * Handle form submission to add a player
 * @param {Event} event - Form submit event
 */
function handleFormSubmit(event) {
  event.preventDefault();

  const playerNameInput = document.getElementById('pirate-name');
  const playerEmailInput = document.getElementById('pirate-email');
  const errorContainer = document.querySelector('[data-form-errors]');

  // Clear previous errors
  if (errorContainer) {
    errorContainer.innerHTML = '';
    errorContainer.style.display = 'none';
  }

  // Get input values
  const name = playerNameInput.value.trim();
  const email = playerEmailInput.value.trim();

  // Validate inputs
  const validationError = validateFormInput(name, email);
  if (validationError) {
    displayError(validationError);
    return;
  }

  // Attempt to add player
  const player = {
    name: name,
    email: email
  };

  const error = validatePlayer(player);
  if (error) {
    displayError(error);
    return;
  }

  // Add player using player management function
  addPlayer(player);

  // Clear form inputs
  playerNameInput.value = '';
  playerEmailInput.value = '';

  // Provide feedback
  const successContainer = document.querySelector('[data-form-success]');
  if (successContainer) {
    successContainer.textContent = `${name} joined the crew!`;
    successContainer.style.display = 'block';
    setTimeout(() => {
      successContainer.style.display = 'none';
    }, 3000);
  }

  // Update player list display
  updatePlayerListDisplay();
}

/**
 * Validate form input values
 * @param {string} name - Player name
 * @param {string} email - Player email
 * @returns {string|null} Error message or null if valid
 */
function validateFormInput(name, email) {
  if (!name) {
    return 'Please enter a pirate name';
  }

  if (name.length < 2) {
    return 'Pirate name must be at least 2 characters';
  }

  if (!email) {
    return 'Please enter an email address';
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }

  return null;
}

/**
 * Display error message to user
 * @param {string} message - Error message
 */
function displayError(message) {
  const errorContainer = document.querySelector('[data-form-errors]');
  if (errorContainer) {
    errorContainer.innerHTML = `<span class="text-red-700">${escapeHtml(message)}</span>`;
    errorContainer.style.display = 'block';
  } else {
    console.error('Error:', message);
  }
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Handle start game button click
 */
function handleStartGame() {
  const errorContainer = document.querySelector('[data-form-errors]');

  // Clear previous errors
  if (errorContainer) {
    errorContainer.innerHTML = '';
    errorContainer.style.display = 'none';
  }

  // Get current players
  const players = getPlayers();

  // Validate player count
  if (players.length < MIN_PLAYERS) {
    displayError(`Need at least ${MIN_PLAYERS} players to start (currently ${players.length})`);
    return;
  }

  if (players.length > MAX_PLAYERS) {
    displayError(`Maximum ${MAX_PLAYERS} players allowed (currently ${players.length})`);
    return;
  }

  // All validations passed - transition to game
  transitionToGame(players);
}

/**
 * Update the player list display
 */
function updatePlayerListDisplay() {
  const players = getPlayers();
  const listContainer = document.querySelector('[data-player-list]');

  if (!listContainer) {
    return;
  }

  if (players.length === 0) {
    listContainer.innerHTML = '<p class="text-gray-500">No players joined yet</p>';
    return;
  }

  let html = '<ul class="space-y-2">';
  players.forEach((player, index) => {
    html += `<li class="flex justify-between items-center p-2 bg-gray-50 rounded">`;
    html += `<span class="font-semibold">${escapeHtml(player.name)}</span>`;
    html += `<span class="text-sm text-gray-600">${escapeHtml(player.email)}</span>`;
    html += `</li>`;
  });
  html += '</ul>';

  listContainer.innerHTML = html;
}

/**
 * Transition from setup to game view
 * @param {Array} players - Array of player objects
 */
function transitionToGame(players) {
  // Get DOM elements
  const setupView = document.querySelector('[data-setup-view]');
  const gameView = document.querySelector('[data-game-view]');

  // Hide setup view
  if (setupView) {
    setupView.style.display = 'none';
  }

  // Show game view
  if (gameView) {
    gameView.style.display = 'block';
  }

  // Initialize game with players
  initializeGame(players);
}

/**
 * Initialize the game with loaded players
 * @param {Array} players - Array of player objects
 */
function initializeGame(players) {
  console.log('Game initialized with players:', players);

  // Dispatch custom event that other modules can listen to
  const gameStartEvent = new CustomEvent('gameStarted', {
    detail: { players: players }
  });
  document.dispatchEvent(gameStartEvent);
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Export functions for testing
export { handleFormSubmit, handleStartGame, validateFormInput, transitionToGame, initializeGame };