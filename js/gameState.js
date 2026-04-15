/**
 * Game State Management System
 * Manages core game state: phases, rounds, and progression logic
 * Supports phases: setup, bidding, scoring
 * Tracks rounds 1-10 with phase transitions and completion detection
 */

// Game phase constants
const PHASES = {
  SETUP: 'setup',
  BIDDING: 'bidding',
  SCORING: 'scoring'
};

// Phase progression order
const PHASE_ORDER = [PHASES.SETUP, PHASES.BIDDING, PHASES.SCORING];

// Game configuration
const GAME_CONFIG = {
  MAX_ROUNDS: 10,
  MIN_ROUNDS: 1
};

/**
 * Game state object - central store for all game state
 */
const gameState = {
  // Current round (1-10)
  currentRound: GAME_CONFIG.MIN_ROUNDS,
  
  // Current phase within the round
  currentPhase: PHASES.SETUP,
  
  // Track if game has been initialized
  isInitialized: false,
  
  // Track completion status of each phase in current round
  phaseCompletion: {
    [PHASES.SETUP]: false,
    [PHASES.BIDDING]: false,
    [PHASES.SCORING]: false
  }
};

/**
 * Initialize game state
 * Sets all values to starting state
 * @returns {Object} The initialized game state
 */
function initializeGame() {
  gameState.currentRound = GAME_CONFIG.MIN_ROUNDS;
  gameState.currentPhase = PHASES.SETUP;
  gameState.isInitialized = true;
  gameState.phaseCompletion = {
    [PHASES.SETUP]: false,
    [PHASES.BIDDING]: false,
    [PHASES.SCORING]: false
  };
  
  return { ...gameState };
}

/**
 * Mark current phase as complete
 * @returns {Object} Updated game state
 * @throws {Error} If game is not initialized
 */
function completeCurrentPhase() {
  if (!gameState.isInitialized) {
    throw new Error('Game must be initialized before completing phases');
  }
  
  gameState.phaseCompletion[gameState.currentPhase] = true;
  return { ...gameState };
}

/**
 * Check if all phases in current round are complete
 * @returns {boolean} True if all phases (setup, bidding, scoring) are complete
 */
function isRoundComplete() {
  return Object.values(gameState.phaseCompletion).every(completed => completed === true);
}

/**
 * Check if game is complete (after round 10 finishes)
 * @returns {boolean} True if game is finished
 */
function isGameComplete() {
  const pastMaxRounds = gameState.currentRound > GAME_CONFIG.MAX_ROUNDS;
  const atMaxRoundAndComplete = gameState.currentRound === GAME_CONFIG.MAX_ROUNDS && isRoundComplete();
  
  return pastMaxRounds || atMaxRoundAndComplete;
}

/**
 * Get the next phase in sequence
 * @param {string} currentPhase - The current phase
 * @returns {string|null} The next phase, or null if no next phase exists
 */
function getNextPhase(currentPhase) {
  const currentIndex = PHASE_ORDER.indexOf(currentPhase);
  
  if (currentIndex === -1) {
    return null;
  }
  
  if (currentIndex < PHASE_ORDER.length - 1) {
    return PHASE_ORDER[currentIndex + 1];
  }
  
  return null;
}

/**
 * Validate phase transition
 * Ensures phases follow the correct order and only advance when current phase is complete
 * @param {string} targetPhase - The phase to transition to
 * @returns {Object} { isValid: boolean, error: string|null }
 */
function validatePhaseTransition(targetPhase) {
  // Check if target phase is valid
  if (!Object.values(PHASES).includes(targetPhase)) {
    return {
      isValid: false,
      error: `Invalid phase: ${targetPhase}. Must be one of: ${Object.values(PHASES).join(', ')}`
    };
  }
  
  // If trying to move to the same phase, that's valid (idempotent)
  if (targetPhase === gameState.currentPhase) {
    return {
      isValid: true,
      error: null
    };
  }
  
  // Check if target is the next phase in sequence
  const nextPhase = getNextPhase(gameState.currentPhase);
  if (targetPhase !== nextPhase) {
    return {
      isValid: false,
      error: `Cannot transition from ${gameState.currentPhase} to ${targetPhase}. Next valid phase is ${nextPhase || 'none (round complete)'}`
    };
  }
  
  // Check if current phase is complete
  if (!gameState.phaseCompletion[gameState.currentPhase]) {
    return {
      isValid: false,
      error: `Cannot advance: ${gameState.currentPhase} phase is not complete`
    };
  }
  
  return {
    isValid: true,
    error: null
  };
}

/**
 * Advance to the next phase
 * @returns {Object} { success: boolean, state: Object, error: string|null }
 * @throws {Error} If game is not initialized
 */
function advancePhase() {
  if (!gameState.isInitialized) {
    throw new Error('Game must be initialized before advancing phases');
  }
  
  const nextPhase = getNextPhase(gameState.currentPhase);
  
  // No next phase means current round is complete
  if (!nextPhase) {
    return {
      success: false,
      state: { ...gameState },
      error: 'No next phase. Complete the round first with advanceRound()'
    };
  }
  
  const validation = validatePhaseTransition(nextPhase);
  if (!validation.isValid) {
    return {
      success: false,
      state: { ...gameState },
      error: validation.error
    };
  }
  
  gameState.currentPhase = nextPhase;
  return {
    success: true,
    state: { ...gameState },
    error: null
  };
}

/**
 * Advance to the next round
 * Can only be called when current round is complete
 * @returns {Object} { success: boolean, state: Object, error: string|null }
 * @throws {Error} If game is not initialized
 */
function advanceRound() {
  if (!gameState.isInitialized) {
    throw new Error('Game must be initialized before advancing rounds');
  }
  
  // Check if current round is complete
  if (!isRoundComplete()) {
    return {
      success: false,
      state: { ...gameState },
      error: `Cannot advance round: Round ${gameState.currentRound} is not complete. All phases must be finished.`
    };
  }
  
  // Check if game would be complete after this advance
  if (gameState.currentRound >= GAME_CONFIG.MAX_ROUNDS) {
    return {
      success: false,
      state: { ...gameState },
      error: `Game is complete. Cannot advance past round ${GAME_CONFIG.MAX_ROUNDS}`
    };
  }
  
  // Advance to next round
  gameState.currentRound += 1;
  gameState.currentPhase = PHASES.SETUP;
  gameState.phaseCompletion = {
    [PHASES.SETUP]: false,
    [PHASES.BIDDING]: false,
    [PHASES.SCORING]: false
  };
  
  return {
    success: true,
    state: { ...gameState },
    error: null
  };
}

/**
 * Get current game state (read-only copy)
 * @returns {Object} Copy of current game state
 */
function getGameState() {
  return { ...gameState };
}

/**
 * Get current round number
 * @returns {number} Current round (1-10)
 */
function getCurrentRound() {
  return gameState.currentRound;
}

/**
 * Get current phase
 * @returns {string} Current phase (setup, bidding, or scoring)
 */
function getCurrentPhase() {
  return gameState.currentPhase;
}

/**
 * Check if a specific phase is complete
 * @param {string} phase - The phase to check
 * @returns {boolean} True if phase is complete
 */
function isPhaseComplete(phase) {
  if (!Object.values(PHASES).includes(phase)) {
    throw new Error(`Invalid phase: ${phase}`);
  }
  return gameState.phaseCompletion[phase];
}

/**
 * Reset game to initial state
 * Useful for testing or restarting the game
 * @returns {Object} The reset game state
 */
function resetGame() {
  gameState.currentRound = GAME_CONFIG.MIN_ROUNDS;
  gameState.currentPhase = PHASES.SETUP;
  gameState.isInitialized = false;
  gameState.phaseCompletion = {
    [PHASES.SETUP]: false,
    [PHASES.BIDDING]: false,
    [PHASES.SCORING]: false
  };
  
  return { ...gameState };
}

// Export public API
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    // State object
    gameState,
    
    // Constants
    PHASES,
    PHASE_ORDER,
    GAME_CONFIG,
    
    // Initialization
    initializeGame,
    resetGame,
    
    // Phase management
    completeCurrentPhase,
    advancePhase,
    validatePhaseTransition,
    
    // Round management
    advanceRound,
    isRoundComplete,
    
    // Game completion
    isGameComplete,
    
    // State queries
    getGameState,
    getCurrentRound,
    getCurrentPhase,
    isPhaseComplete,
    getNextPhase
  };
}
