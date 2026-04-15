/**
 * Bid Manager Module
 * Handles bid collection, validation, and state management for the game
 */

// Shared game state object
const bidGameState = {
  players: [],
  currentRound: 0,
  bids: {}, // Structure: { roundNumber: { playerId: bidAmount } }
  roundConstraints: {}, // Structure: { roundNumber: { min: 0, max: 13 } }
};

/**
 * Initialize the bid manager with game state
 * @param {Object} initialState - Game state object with players and round info
 */
function initBidManager(initialState) {
  if (initialState && initialState.players) {
    bidGameState.players = initialState.players;
  }
  if (initialState && typeof initialState.currentRound === 'number') {
    bidGameState.currentRound = initialState.currentRound;
  }
}

/**
 * Validate a bid against round constraints
 * @param {number} bid - The bid amount to validate
 * @param {number} roundNumber - The round number for context
 * @returns {Object} { isValid: boolean, error: string|null }
 */
function validateBid(bid, roundNumber) {
  // Ensure roundNumber is provided
  if (typeof roundNumber !== 'number' || roundNumber < 0) {
    return { isValid: false, error: 'Invalid round number' };
  }

  // Check if bid is a valid number
  if (typeof bid !== 'number' || bid < 0) {
    return { isValid: false, error: 'Bid must be a non-negative number' };
  }

  // Check if bid is an integer
  if (!Number.isInteger(bid)) {
    return { isValid: false, error: 'Bid must be a whole number' };
  }

  // Get round constraints (default: 0-13 tricks per round)
  const constraints = bidGameState.roundConstraints[roundNumber] || { min: 0, max: 13 };

  if (bid < constraints.min) {
    return { isValid: false, error: `Bid must be at least ${constraints.min}` };
  }

  if (bid > constraints.max) {
    return { isValid: false, error: `Bid cannot exceed ${constraints.max}` };
  }

  return { isValid: true, error: null };
}

/**
 * Collect a bid from a player and store it in game state
 * @param {string|number} playerId - The ID of the player placing the bid
 * @param {number} bid - The bid amount
 * @returns {Object} { success: boolean, error: string|null }
 */
function collectPlayerBid(playerId, bid) {
  // Validate playerId
  if (!playerId && playerId !== 0) {
    return { success: false, error: 'Invalid player ID' };
  }

  // Validate bid
  const validation = validateBid(bid, bidGameState.currentRound);
  if (!validation.isValid) {
    return { success: false, error: validation.error };
  }

  // Initialize round bids if not exists
  if (!bidGameState.bids[bidGameState.currentRound]) {
    bidGameState.bids[bidGameState.currentRound] = {};
  }

  // Store the bid
  bidGameState.bids[bidGameState.currentRound][playerId] = bid;

  return { success: true, error: null };
}

/**
 * Get all bids for the current round
 * @returns {Object} Object containing all bids for current round { playerId: bidAmount }
 */
function getAllBids() {
  return bidGameState.bids[bidGameState.currentRound] || {};
}

/**
 * Check if all players have submitted bids for the current round
 * @returns {boolean} True if all players have bids, false otherwise
 */
function isAllBidsCollected() {
  const currentRoundBids = getAllBids();
  const playerCount = bidGameState.players.length;
  const bidsCount = Object.keys(currentRoundBids).length;

  return bidsCount === playerCount && playerCount > 0;
}

/**
 * Reset bids for a new round
 * @param {number} newRoundNumber - Optional: the new round number to set
 */
function resetBids(newRoundNumber) {
  if (typeof newRoundNumber === 'number' && newRoundNumber >= 0) {
    bidGameState.currentRound = newRoundNumber;
  }

  // Clear bids for the new round if it exists
  if (bidGameState.bids[bidGameState.currentRound]) {
    delete bidGameState.bids[bidGameState.currentRound];
  }
}

/**
 * Set round constraints (e.g., maximum tricks per round)
 * @param {number} roundNumber - The round number
 * @param {Object} constraints - { min: number, max: number }
 */
function setRoundConstraints(roundNumber, constraints) {
  if (typeof roundNumber === 'number' && constraints && typeof constraints.min === 'number' && typeof constraints.max === 'number') {
    bidGameState.roundConstraints[roundNumber] = constraints;
  }
}

/**
 * Get current game state (for debugging/testing)
 * @returns {Object} The current bid game state
 */
function getGameState() {
  return bidGameState;
}

/**
 * Get the next player who needs to place a bid
 * @returns {Object|null} Player object or null if all bids collected
 */
function getNextPlayerForBid() {
  if (isAllBidsCollected()) {
    return null;
  }

  const currentRoundBids = getAllBids();
  for (const player of bidGameState.players) {
    if (!(player.id in currentRoundBids)) {
      return player;
    }
  }

  return null;
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initBidManager,
    validateBid,
    collectPlayerBid,
    getAllBids,
    isAllBidsCollected,
    resetBids,
    setRoundConstraints,
    getGameState,
    getNextPlayerForBid,
  };
}
