/**
 * Game State Manager
 * Manages core game state including phase progression, round tracking,
 * and game completion status.
 */

// Game phases
const PHASES = {
  SETUP: 'setup',
  BIDDING: 'bidding',
  SCORING: 'scoring'
};

// Phase progression order
const PHASE_ORDER = [PHASES.SETUP, PHASES.BIDDING, PHASES.SCORING];

// Total rounds in a game
const TOTAL_ROUNDS = 10;

/**
 * Game state object
 * Tracks current phase, round, and completion status for each phase
 */
let gameState = {
  currentPhase: PHASES.SETUP,
  currentRound: 1,
  phaseComplete: {
    setup: false,
    bidding: false,
    scoring: false
  },
  gameComplete: false
};

/**
 * Initialize game to starting state
 * Sets phase to 'setup' at round 1 with all phases incomplete
 */
function initializeGame() {
  gameState = {
    currentPhase: PHASES.SETUP,
    currentRound: 1,
    phaseComplete: {
      setup: false,
      bidding: false,
      scoring: false
    },
    gameComplete: false
  };
  return gameState;
}

/**
 * Get the current phase
 * @returns {string} Current phase (setup, bidding, or scoring)
 */
function getCurrentPhase() {
  return gameState.currentPhase;
}

/**
 * Get the current round number
 * @returns {number} Current round (1-10)
 */
function getCurrentRound() {
  return gameState.currentRound;
}

/**
 * Mark the current phase as complete
 */
function completePhase() {
  gameState.phaseComplete[gameState.currentPhase] = true;
}

/**
 * Check if current phase can be advanced
 * Can only advance if current phase is marked complete
 * @returns {boolean} True if phase can be advanced
 */
function canAdvancePhase() {
  return gameState.phaseComplete[gameState.currentPhase];
}

/**
 * Advance to the next phase
 * If at end of round (scoring phase), advances to next round's setup phase
 * If at end of round 10 (scoring), marks game as complete
 * Cannot advance unless current phase is marked complete
 * @returns {boolean} True if phase was advanced, false if cannot advance
 */
function advancePhase() {
  // Check if current phase is complete
  if (!canAdvancePhase()) {
    return false;
  }

  // Get current phase index
  const currentPhaseIndex = PHASE_ORDER.indexOf(gameState.currentPhase);

  // Check if we're at the end of a round (scoring phase)
  if (gameState.currentPhase === PHASES.SCORING) {
    // Check if game is complete (round 10 scoring)
    if (gameState.currentRound === TOTAL_ROUNDS) {
      gameState.gameComplete = true;
      return true;
    }

    // Advance to next round
    gameState.currentRound++;
    gameState.currentPhase = PHASES.SETUP;
    gameState.phaseComplete = {
      setup: false,
      bidding: false,
      scoring: false
    };
    return true;
  }

  // Advance to next phase within current round
  const nextPhaseIndex = currentPhaseIndex + 1;
  gameState.currentPhase = PHASE_ORDER[nextPhaseIndex];
  gameState.phaseComplete[gameState.currentPhase] = false;
  return true;
}

/**
 * Check if game is complete
 * Game is complete after finishing round 10 scoring phase
 * @returns {boolean} True if game is complete
 */
function isGameComplete() {
  return gameState.gameComplete;
}

/**
 * Reset game to initial state
 * Returns to setup phase at round 1 with all phases incomplete
 * @returns {object} Reset game state
 */
function resetGame() {
  return initializeGame();
}

/**
 * Get complete game state (useful for debugging/UI updates)
 * @returns {object} Current game state
 */
function getGameState() {
  return { ...gameState };
}

// Export functions as module exports
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeGame,
    getCurrentPhase,
    getCurrentRound,
    completePhase,
    canAdvancePhase,
    advancePhase,
    isGameComplete,
    resetGame,
    getGameState,
    PHASES,
    TOTAL_ROUNDS
  };
}
