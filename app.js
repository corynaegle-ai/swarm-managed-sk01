// Application initialization and global state setup

// Initialize global gameState BEFORE Alpine.js initializes
const gameState = new GameState();

// Application startup
document.addEventListener('DOMContentLoaded', function() {
  console.log('Application initialized');
  console.log('GameState instance created and available globally');
});

// Listen for trick entry submission
document.addEventListener('trickEntrySubmit', function(event) {
  console.log('Trick entry submitted:', event.detail);
  // Handle trick entry submission logic here
});
