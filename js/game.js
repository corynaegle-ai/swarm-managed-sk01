/**
 * Game State Management Module
 * Manages player bids, tricks taken, and score calculations
 * Integrates with the scoring engine (scoring.js)
 */

// Import scoring functions (in browser context, these are global)
// In a module environment, you would: import { calculateScore } from './scoring.js';

// Game state object
const gameState = {
  players: [],
  currentRound: 1,
  totalRounds: 13,
  bids: {},        // { playerId: bidAmount }
  tricks: {},      // { playerId: tricksWon }
  scores: {},      // { playerId: totalScore }
  roundScores: {}, // { playerId: roundScore }
};

/**
 * Initialize game state with players
 * @param {Array} players - Array of player objects with id and name
 */
function initializeGame(players) {
  if (!players || !Array.isArray(players) || players.length === 0) {
    throw new Error('Players array must be non-empty');
  }
  
  gameState.players = players;
  gameState.bids = {};
  gameState.tricks = {};
  gameState.scores = {};
  gameState.roundScores = {};
  gameState.currentRound = 1;
  
  // Initialize scores for all players
  players.forEach(player => {
    gameState.scores[player.id] = 0;
    gameState.tricks[player.id] = 0;
    gameState.bids[player.id] = 0;
    gameState.roundScores[player.id] = 0;
  });
  
  return gameState;
}

/**
 * Store a player's bid for the current round
 * @param {string} playerId - The player's ID
 * @param {number} bidAmount - The number of tricks the player bids to win
 */
function setBid(playerId, bidAmount) {
  if (!gameState.players.some(p => p.id === playerId)) {
    throw new Error(`Player ${playerId} not found in game state`);
  }
  
  if (typeof bidAmount !== 'number' || bidAmount < 0) {
    throw new Error('Bid amount must be a non-negative number');
  }
  
  gameState.bids[playerId] = bidAmount;
  return gameState.bids[playerId];
}

/**
 * Store the number of tricks won by a player in the current round
 * @param {string} playerId - The player's ID
 * @param {number} tricksWon - The number of tricks won
 */
function setTricksTaken(playerId, tricksWon) {
  if (!gameState.players.some(p => p.id === playerId)) {
    throw new Error(`Player ${playerId} not found in game state`);
  }
  
  if (typeof tricksWon !== 'number' || tricksWon < 0) {
    throw new Error('Tricks won must be a non-negative number');
  }
  
  gameState.tricks[playerId] = tricksWon;
  return gameState.tricks[playerId];
}

/**
 * Get the current bid for a player
 * @param {string} playerId - The player's ID
 * @returns {number} The player's bid amount
 */
function getPlayerBid(playerId) {
  if (!gameState.players.some(p => p.id === playerId)) {
    throw new Error(`Player ${playerId} not found in game state`);
  }
  
  return gameState.bids[playerId] || 0;
}

/**
 * Get the tricks taken by a player in the current round
 * @param {string} playerId - The player's ID
 * @returns {number} The number of tricks taken
 */
function getPlayerTricks(playerId) {
  if (!gameState.players.some(p => p.id === playerId)) {
    throw new Error(`Player ${playerId} not found in game state`);
  }
  
  return gameState.tricks[playerId] || 0;
}

/**
 * Get the total score for a player across all rounds
 * @param {string} playerId - The player's ID
 * @returns {number} The player's total score
 */
function getPlayerScore(playerId) {
  if (!gameState.players.some(p => p.id === playerId)) {
    throw new Error(`Player ${playerId} not found in game state`);
  }
  
  return gameState.scores[playerId] || 0;
}

/**
 * Get the round score for a player (points from current/last round)
 * @param {string} playerId - The player's ID
 * @returns {number} The player's round score
 */
function getRoundScore(playerId) {
  if (!gameState.players.some(p => p.id === playerId)) {
    throw new Error(`Player ${playerId} not found in game state`);
  }
  
  return gameState.roundScores[playerId] || 0;
}

/**
 * Scoring calculation function - determines points based on bid vs tricks
 * This matches the scoring engine logic:
 * - Exact match: 10 + tricks won
 * - Missed bid: -|bid - tricks| (absolute value penalty)
 * @param {number} bid - The player's bid
 * @param {number} tricks - The tricks the player won
 * @returns {number} Points earned in this round
 */
function calculateScore(bid, tricks) {
  if (bid === tricks) {
    // Exact match: 10 base points + 1 point per trick
    return 10 + tricks;
  } else {
    // Missed bid: negative points equal to difference
    return -(Math.abs(bid - tricks));
  }
}

/**
 * Calculate scores for all players for the current round
 * Updates both round scores and cumulative scores
 * @returns {Object} Object with playerId -> score mapping
 */
function calculateRoundScores() {
  const roundResults = {};
  
  // Verify all players have bids and tricks set
  gameState.players.forEach(player => {
    const playerId = player.id;
    
    if (gameState.bids[playerId] === undefined) {
      throw new Error(`Player ${playerId} has no bid for current round`);
    }
    
    if (gameState.tricks[playerId] === undefined) {
      throw new Error(`Player ${playerId} has no tricks recorded for current round`);
    }
    
    const bid = gameState.bids[playerId];
    const tricks = gameState.tricks[playerId];
    
    // Use the scoring engine calculation
    const roundScore = calculateScore(bid, tricks);
    
    // Store round score
    gameState.roundScores[playerId] = roundScore;
    
    // Update cumulative score
    gameState.scores[playerId] = (gameState.scores[playerId] || 0) + roundScore;
    
    roundResults[playerId] = {
      bid: bid,
      tricks: tricks,
      roundScore: roundScore,
      totalScore: gameState.scores[playerId]
    };
  });
  
  return roundResults;
}

/**
 * Update a player's total score directly
 * @param {string} playerId - The player's ID
 * @param {number} scoreAmount - The amount to add to the player's score
 */
function updatePlayerScore(playerId, scoreAmount) {
  if (!gameState.players.some(p => p.id === playerId)) {
    throw new Error(`Player ${playerId} not found in game state`);
  }
  
  if (typeof scoreAmount !== 'number') {
    throw new Error('Score amount must be a number');
  }
  
  gameState.scores[playerId] = (gameState.scores[playerId] || 0) + scoreAmount;
  return gameState.scores[playerId];
}

/**
 * Advance to the next round
 * Clears bids and tricks for the next round
 */
function nextRound() {
  if (gameState.currentRound >= gameState.totalRounds) {
    throw new Error('Game has already reached the final round');
  }
  
  gameState.currentRound += 1;
  gameState.bids = {};
  gameState.tricks = {};
  gameState.roundScores = {};
  
  // Re-initialize bids and tricks for new round
  gameState.players.forEach(player => {
    gameState.bids[player.id] = 0;
    gameState.tricks[player.id] = 0;
    gameState.roundScores[player.id] = 0;
  });
  
  return gameState.currentRound;
}

/**
 * Get the current game state
 * @returns {Object} The current game state
 */
function getGameState() {
  return JSON.parse(JSON.stringify(gameState));
}

/**
 * Reset the game to initial state
 */
function resetGame() {
  gameState.players = [];
  gameState.currentRound = 1;
  gameState.bids = {};
  gameState.tricks = {};
  gameState.scores = {};
  gameState.roundScores = {};
}

/**
 * Get leaderboard sorted by score (descending)
 * @returns {Array} Array of players sorted by total score
 */
function getLeaderboard() {
  return gameState.players
    .map(player => ({
      ...player,
      totalScore: gameState.scores[player.id] || 0
    }))
    .sort((a, b) => b.totalScore - a.totalScore);
}

// Export all functions for use in UI components
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeGame,
    setBid,
    setTricksTaken,
    getPlayerBid,
    getPlayerTricks,
    getPlayerScore,
    getRoundScore,
    calculateScore,
    calculateRoundScores,
    updatePlayerScore,
    nextRound,
    getGameState,
    resetGame,
    getLeaderboard,
    gameState
  };
}
