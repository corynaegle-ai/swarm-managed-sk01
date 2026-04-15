// Main application initialization and coordination
import { GameState } from './gameState.js';
import { GameFlow } from './gameFlow.js';

// Global references for debugging/inspection
let gameState = null;
let gameFlow = null;

/**
 * Initialize the game flow system and coordinate between state and UI
 */
function initializeGame() {
  try {
    // Create game state manager
    gameState = new GameState();
    
    // Get the app container
    const appContainer = document.getElementById('app');
    if (!appContainer) {
      throw new Error('Application container #app not found in DOM');
    }
    
    // Create game flow UI controller
    gameFlow = new GameFlow(appContainer);
    
    // Initialize the game flow display with current state
    gameFlow.displayPhase(gameState.getCurrentPhase());
    
    // Set up event listeners for game flow controls
    setupEventListeners();
    
    // Set up state change listener
    setupStateChangeListener();
    
    console.log('Game initialized successfully');
  } catch (error) {
    console.error('Failed to initialize game:', error);
    handleInitializationError(error);
  }
}

/**
 * Set up event listeners for game flow controls
 */
function setupEventListeners() {
  try {
    // Listen for start game event
    document.addEventListener('startGame', handleStartGame);
    
    // Listen for advance phase event
    document.addEventListener('advancePhase', handleAdvancePhase);
    
    // Listen for restart game event
    document.addEventListener('restartGame', handleRestartGame);
    
    // Listen for button clicks (event delegation)
    const appContainer = document.getElementById('app');
    appContainer.addEventListener('click', handleUIClick);
    
    console.log('Event listeners set up successfully');
  } catch (error) {
    console.error('Failed to set up event listeners:', error);
  }
}

/**
 * Handle start game action
 */
function handleStartGame(event) {
  try {
    if (gameState && gameFlow) {
      gameState.startGame();
      gameFlow.displayPhase(gameState.getCurrentPhase());
      console.log('Game started');
    }
  } catch (error) {
    console.error('Failed to start game:', error);
  }
}

/**
 * Handle advance phase action
 */
function handleAdvancePhase(event) {
  try {
    if (gameState && gameFlow) {
      const currentPhase = gameState.getCurrentPhase();
      gameState.advancePhase();
      const newPhase = gameState.getCurrentPhase();
      
      // Update UI to reflect new phase
      gameFlow.displayPhase(newPhase);
      
      console.log(`Advanced from ${currentPhase} to ${newPhase}`);
    }
  } catch (error) {
    console.error('Failed to advance phase:', error);
  }
}

/**
 * Handle restart game action
 */
function handleRestartGame(event) {
  try {
    if (gameState && gameFlow) {
      gameState.restart();
      gameFlow.displayPhase(gameState.getCurrentPhase());
      console.log('Game restarted');
    }
  } catch (error) {
    console.error('Failed to restart game:', error);
  }
}

/**
 * Handle UI clicks for button controls
 */
function handleUIClick(event) {
  const target = event.target;
  
  // Check for start button
  if (target.id === 'startBtn' || target.classList.contains('start-btn')) {
    event.preventDefault();
    document.dispatchEvent(new CustomEvent('startGame'));
  }
  
  // Check for advance button
  if (target.id === 'advanceBtn' || target.classList.contains('advance-btn')) {
    event.preventDefault();
    document.dispatchEvent(new CustomEvent('advancePhase'));
  }
  
  // Check for restart button
  if (target.id === 'restartBtn' || target.classList.contains('restart-btn')) {
    event.preventDefault();
    document.dispatchEvent(new CustomEvent('restartGame'));
  }
}

/**
 * Set up listener for game state changes
 */
function setupStateChangeListener() {
  try {
    if (gameState && gameFlow) {
      // Listen for state change events
      document.addEventListener('gameStateChanged', handleStateChange);
    }
  } catch (error) {
    console.error('Failed to set up state change listener:', error);
  }
}

/**
 * Handle game state changes
 */
function handleStateChange(event) {
  try {
    if (gameState && gameFlow) {
      const currentPhase = gameState.getCurrentPhase();
      gameFlow.displayPhase(currentPhase);
    }
  } catch (error) {
    console.error('Failed to handle state change:', error);
  }
}

/**
 * Handle initialization errors gracefully
 */
function handleInitializationError(error) {
  try {
    const appContainer = document.getElementById('app');
    if (appContainer) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.textContent = `Application Error: ${error.message}`;
      appContainer.appendChild(errorDiv);
    }
  } catch (e) {
    console.error('Failed to display error:', e);
  }
}

// Initialize the game when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeGame);
} else {
  // DOM is already ready
  initializeGame();
}

// Export for testing purposes
export { gameState, gameFlow, initializeGame, setupEventListeners };