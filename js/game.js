/**
 * Game State Management Module
 * Manages player bids, tricks taken, and score calculations using the scoring engine
 */

// Import scoring functions (these are available globally from scoring.js)
// scoring.calculatePlayerScore(tricks, bids) is available via global scope

/**
 * Game state object - tracks all game-related data
 */
const gameState = {
  players: [],
  currentRound: 1,
  totalRounds: 13,
  bids: {}, // { playerId: bidAmount }
  tricks: {}, // { playerId: tricksArray } where tricksArray = { round: tricksCount }
  scores: {}, // { playerId: { round: score } }
  roundScores: {}, // { round: { playerId: score } }
};

/**
 * Initialize game state with players
 * @param {Array} players - Array of player objects with id and name
 */
function initializeGameState(players) {
  gameState.players = players || [];
  gameState.bids = {};
  gameState.tricks = {};
  gameState.scores = {};
  gameState.roundScores = {};

  // Initialize player data structures
  players.forEach((player) => {
    gameState.bids[player.id] = {};
    gameState.tricks[player.id] = {};
    gameState.scores[player.id] = {};
  });
}

/**
 * Store a player's bid for a round
 * @param {string} playerId - The player ID
 * @param {number} round - The round number
 * @param {number} bidAmount - The bid amount
 */
function setPlayerBid(playerId, round, bidAmount) {
  if (!gameState.bids[playerId]) {
    gameState.bids[playerId] = {};
  }
  gameState.bids[playerId][round] = bidAmount;
}

/**
 * Get a player's bid for a round
 * @param {string} playerId - The player ID
 * @param {number} round - The round number
 * @returns {number} The bid amount
 */
function getPlayerBid(playerId, round) {
  return gameState.bids[playerId]?.[round] ?? 0;
}

/**
 * Store tricks taken by a player in a round
 * @param {string} playerId - The player ID
 * @param {number} round - The round number
 * @param {number} tricksCount - Number of tricks taken
 */
function setPlayerTricks(playerId, round, tricksCount) {
  if (!gameState.tricks[playerId]) {
    gameState.tricks[playerId] = {};
  }
  gameState.tricks[playerId][round] = tricksCount;
}

/**
 * Get tricks taken by a player in a round
 * @param {string} playerId - The player ID
 * @param {number} round - The round number
 * @returns {number} Number of tricks taken
 */
function getPlayerTricks(playerId, round) {
  return gameState.tricks[playerId]?.[round] ?? 0;
}

/**
 * Calculate score for a single player in a round using the scoring engine
 * @param {string} playerId - The player ID
 * @param {number} round - The round number
 * @returns {number} The calculated score for that round
 */
function calculatePlayerRoundScore(playerId, round) {
  const tricks = getPlayerTricks(playerId, round);
  const bid = getPlayerBid(playerId, round);

  // Use the scoring engine if available
  if (typeof calculatePlayerScore === 'function') {
    return calculatePlayerScore(tricks, bid);
  }

  // Fallback scoring logic: 10 + (tricks - bid)^2 if tricks === bid, else (tricks - bid)^2 * -1
  if (tricks === bid) {
    return 10 + Math.pow(tricks, 2);
  } else {
    return Math.pow(tricks - bid, 2) * -1;
  }
}

/**
 * Update a player's score for a round
 * @param {string} playerId - The player ID
 * @param {number} round - The round number
 * @param {number} score - The score to store
 */
function updatePlayerScore(playerId, round, score) {
  if (!gameState.scores[playerId]) {
    gameState.scores[playerId] = {};
  }
  gameState.scores[playerId][round] = score;
}

/**
 * Get a player's score for a round
 * @param {string} playerId - The player ID
 * @param {number} round - The round number
 * @returns {number} The player's score for that round
 */
function getPlayerScore(playerId, round) {
  return gameState.scores[playerId]?.[round] ?? 0;
}

/**
 * Get a player's cumulative score across all rounds
 * @param {string} playerId - The player ID
 * @returns {number} The cumulative score
 */
function getPlayerCumulativeScore(playerId) {
  const playerScores = gameState.scores[playerId] || {};
  return Object.values(playerScores).reduce((sum, score) => sum + score, 0);
}

/**
 * Calculate and update scores for all players in a round
 * Uses the scoring engine to calculate each player's score
 * @param {number} round - The round number
 * @returns {Object} Round scores { playerId: score }
 */
function calculateRoundScores(round) {
  const roundScores = {};

  // Calculate score for each player
  gameState.players.forEach((player) => {
    const score = calculatePlayerRoundScore(player.id, round);
    roundScores[player.id] = score;
    updatePlayerScore(player.id, round, score);
  });

  // Store round scores
  gameState.roundScores[round] = roundScores;

  return roundScores;
}

/**
 * Get all scores for a specific round
 * @param {number} round - The round number
 * @returns {Object} Scores { playerId: score }
 */
function getRoundScores(round) {
  return gameState.roundScores[round] || {};
}

/**
 * Reset game state for a new game
 */
function resetGameState() {
  const players = gameState.players;
  gameState.bids = {};
  gameState.tricks = {};
  gameState.scores = {};
  gameState.roundScores = {};
  gameState.currentRound = 1;

  players.forEach((player) => {
    gameState.bids[player.id] = {};
    gameState.tricks[player.id] = {};
    gameState.scores[player.id] = {};
  });
}

/**
 * Get the complete game state (for debugging/serialization)
 * @returns {Object} The current game state
 */
function getGameState() {
  return { ...gameState };
}

/**
 * Set the complete game state (for deserialization/restoration)
 * @param {Object} newState - The new game state
 */
function setGameState(newState) {
  Object.assign(gameState, newState);
}

// Export all functions for use in UI components
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    gameState,
    initializeGameState,
    setPlayerBid,
    getPlayerBid,
    setPlayerTricks,
    getPlayerTricks,
    calculatePlayerRoundScore,
    updatePlayerScore,
    getPlayerScore,
    getPlayerCumulativeScore,
    calculateRoundScores,
    getRoundScores,
    resetGameState,
    getGameState,
    setGameState,
  };
}

// Make functions available globally for browser environment
if (typeof window !== 'undefined') {
  window.gameState = gameState;
  window.initializeGameState = initializeGameState;
  window.setPlayerBid = setPlayerBid;
  window.getPlayerBid = getPlayerBid;
  window.setPlayerTricks = setPlayerTricks;
  window.getPlayerTricks = getPlayerTricks;
  window.calculatePlayerRoundScore = calculatePlayerRoundScore;
  window.updatePlayerScore = updatePlayerScore;
  window.getPlayerScore = getPlayerScore;
  window.getPlayerCumulativeScore = getPlayerCumulativeScore;
  window.calculateRoundScores = calculateRoundScores;
  window.getRoundScores = getRoundScores;
  window.resetGameState = resetGameState;
  window.getGameState = getGameState;
  window.setGameState = setGameState;
}
