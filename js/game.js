/**
 * Game State Management Module
 * Manages game state, player bids, tricks, and integrates with scoring engine
 */

// Import scoring functions
import { calculateScore } from './scoring.js';

/**
 * Game State Object
 * Tracks all game data including players, rounds, bids, tricks, and scores
 */
const gameState = {
  players: [],
  currentRound: 1,
  totalRounds: 13,
  bids: {}, // { playerId: bid }
  tricks: {}, // { playerId: tricksWon }
  scores: {}, // { playerId: totalScore }
  roundScores: {}, // { playerId: [roundScores] }
  roundHistory: [] // Track each round's results
};

/**
 * Initialize game state with players
 * @param {Array} players - Array of player objects with id and name
 */
function initializeGame(players) {
  gameState.players = players;
  gameState.currentRound = 1;
  gameState.bids = {};
  gameState.tricks = {};
  gameState.scores = {};
  gameState.roundScores = {};
  gameState.roundHistory = [];

  // Initialize scores and round scores for each player
  players.forEach(player => {
    gameState.scores[player.id] = 0;
    gameState.roundScores[player.id] = [];
    gameState.bids[player.id] = null;
    gameState.tricks[player.id] = 0;
  });

  return gameState;
}

/**
 * Store a player's bid for the current round
 * @param {string} playerId - The player's unique identifier
 * @param {number} bid - The number of tricks the player bids
 * @returns {boolean} - Success status
 */
function setBid(playerId, bid) {
  if (!gameState.players.find(p => p.id === playerId)) {
    console.error(`Player ${playerId} not found in game state`);
    return false;
  }

  if (typeof bid !== 'number' || bid < 0) {
    console.error(`Invalid bid value: ${bid}`);
    return false;
  }

  gameState.bids[playerId] = bid;
  return true;
}

/**
 * Record tricks won by a player in the current round
 * @param {string} playerId - The player's unique identifier
 * @param {number} tricksWon - The number of tricks won
 * @returns {boolean} - Success status
 */
function setTricks(playerId, tricksWon) {
  if (!gameState.players.find(p => p.id === playerId)) {
    console.error(`Player ${playerId} not found in game state`);
    return false;
  }

  if (typeof tricksWon !== 'number' || tricksWon < 0) {
    console.error(`Invalid tricks value: ${tricksWon}`);
    return false;
  }

  gameState.tricks[playerId] = tricksWon;
  return true;
}

/**
 * Get the current bid for a player
 * @param {string} playerId - The player's unique identifier
 * @returns {number|null} - The player's bid or null if not set
 */
function getBid(playerId) {
  return gameState.bids[playerId] ?? null;
}

/**
 * Get tricks won by a player
 * @param {string} playerId - The player's unique identifier
 * @returns {number|null} - The tricks won or null if not set
 */
function getTricks(playerId) {
  return gameState.tricks[playerId] ?? null;
}

/**
 * Calculate scores for all players in the current round using the scoring engine
 * @returns {object} - Object with playerId keys and calculated scores as values
 */
function calculateRoundScores() {
  const roundScoresMap = {};

  gameState.players.forEach(player => {
    const playerId = player.id;
    const bid = gameState.bids[playerId];
    const tricksWon = gameState.tricks[playerId];

    // Validate that both bid and tricks are set
    if (bid === null || bid === undefined || tricksWon === null || tricksWon === undefined) {
      console.warn(`Cannot calculate score for player ${playerId}: bid or tricks not set`);
      roundScoresMap[playerId] = 0;
      return;
    }

    // Use the scoring engine to calculate the score
    const score = calculateScore(bid, tricksWon);
    roundScoresMap[playerId] = score;
  });

  return roundScoresMap;
}

/**
 * Get the score for a specific player
 * @param {string} playerId - The player's unique identifier
 * @returns {number} - The player's total score
 */
function getPlayerScore(playerId) {
  if (!gameState.players.find(p => p.id === playerId)) {
    console.error(`Player ${playerId} not found in game state`);
    return 0;
  }

  return gameState.scores[playerId] ?? 0;
}

/**
 * Update a player's total score
 * @param {string} playerId - The player's unique identifier
 * @param {number} scoreIncrease - The amount to add to the player's score
 * @returns {boolean} - Success status
 */
function updatePlayerScore(playerId, scoreIncrease) {
  if (!gameState.players.find(p => p.id === playerId)) {
    console.error(`Player ${playerId} not found in game state`);
    return false;
  }

  if (typeof scoreIncrease !== 'number') {
    console.error(`Invalid score increase value: ${scoreIncrease}`);
    return false;
  }

  gameState.scores[playerId] = (gameState.scores[playerId] ?? 0) + scoreIncrease;
  return true;
}

/**
 * Finalize the current round by calculating scores and advancing to the next
 * @returns {object} - Round results with scores for each player
 */
function finalizeRound() {
  const roundResults = calculateRoundScores();

  // Update total scores and store round history
  gameState.players.forEach(player => {
    const playerId = player.id;
    const roundScore = roundResults[playerId];

    // Update total score
    updatePlayerScore(playerId, roundScore);

    // Store round score history
    if (!gameState.roundScores[playerId]) {
      gameState.roundScores[playerId] = [];
    }
    gameState.roundScores[playerId].push(roundScore);
  });

  // Store round history
  gameState.roundHistory.push({
    round: gameState.currentRound,
    bids: { ...gameState.bids },
    tricks: { ...gameState.tricks },
    scores: roundResults
  });

  // Reset for next round
  gameState.currentRound += 1;
  gameState.bids = {};
  gameState.tricks = {};

  return roundResults;
}

/**
 * Get all round scores for a player
 * @param {string} playerId - The player's unique identifier
 * @returns {array} - Array of scores from each round
 */
function getPlayerRoundScores(playerId) {
  return gameState.roundScores[playerId] ?? [];
}

/**
 * Get complete game state
 * @returns {object} - The current game state
 */
function getGameState() {
  return JSON.parse(JSON.stringify(gameState)); // Return a deep copy
}

/**
 * Reset game state
 */
function resetGame() {
  gameState.currentRound = 1;
  gameState.bids = {};
  gameState.tricks = {};
  gameState.scores = {};
  gameState.roundScores = {};
  gameState.roundHistory = [];

  gameState.players.forEach(player => {
    gameState.scores[player.id] = 0;
    gameState.roundScores[player.id] = [];
  });
}

// Export all functions for UI integration
export {
  initializeGame,
  setBid,
  setTricks,
  getBid,
  getTricks,
  calculateRoundScores,
  getPlayerScore,
  updatePlayerScore,
  finalizeRound,
  getPlayerRoundScores,
  getGameState,
  resetGame
};
