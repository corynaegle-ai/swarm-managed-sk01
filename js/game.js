/**
 * Game State Management Module
 * Manages player bids, tricks taken, and score calculations
 * Integrates with scoring.js for score calculation
 */

import { calculateScore } from './scoring.js';

/**
 * GameState object - manages all game state
 */
let gameState = {
  players: [],
  bids: {},        // { playerId: bidAmount }
  tricks: {},      // { playerId: tricksWon }
  scores: {},      // { playerId: totalScore }
  roundScores: {}, // { playerId: [roundScore1, roundScore2, ...] }
  currentRound: 1,
  totalRounds: 13
};

/**
 * Initialize game state with players
 * @param {Array} players - Array of player objects with { id, name }
 */
function initializeGame(players) {
  gameState.players = players;
  gameState.bids = {};
  gameState.tricks = {};
  gameState.scores = {};
  gameState.roundScores = {};
  gameState.currentRound = 1;
  
  // Initialize scores for each player
  players.forEach(player => {
    gameState.scores[player.id] = 0;
    gameState.roundScores[player.id] = [];
    gameState.bids[player.id] = null;
    gameState.tricks[player.id] = null;
  });
  
  return gameState;
}

/**
 * Store a player's bid
 * @param {string|number} playerId - Player ID
 * @param {number} bidAmount - Number of tricks player bids to win
 * @returns {boolean} - Success/failure
 */
function setBid(playerId, bidAmount) {
  if (!gameState.players.find(p => p.id === playerId)) {
    console.error(`Player with ID ${playerId} not found`);
    return false;
  }
  
  if (typeof bidAmount !== 'number' || bidAmount < 0) {
    console.error(`Invalid bid amount: ${bidAmount}`);
    return false;
  }
  
  gameState.bids[playerId] = bidAmount;
  return true;
}

/**
 * Store tricks taken by a player
 * @param {string|number} playerId - Player ID
 * @param {number} tricksWon - Number of tricks player won
 * @returns {boolean} - Success/failure
 */
function setTricks(playerId, tricksWon) {
  if (!gameState.players.find(p => p.id === playerId)) {
    console.error(`Player with ID ${playerId} not found`);
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
 * Get a player's current total score
 * @param {string|number} playerId - Player ID
 * @returns {number} - Player's total score or -1 if not found
 */
function getPlayerScore(playerId) {
  if (!(playerId in gameState.scores)) {
    console.error(`Player with ID ${playerId} not found in scores`);
    return -1;
  }
  return gameState.scores[playerId];
}

/**
 * Update a player's score
 * @param {string|number} playerId - Player ID
 * @param {number} scoreAmount - Score to add (can be negative)
 * @returns {boolean} - Success/failure
 */
function updatePlayerScore(playerId, scoreAmount) {
  if (!(playerId in gameState.scores)) {
    console.error(`Player with ID ${playerId} not found in scores`);
    return false;
  }
  
  if (typeof scoreAmount !== 'number') {
    console.error(`Invalid score amount: ${scoreAmount}`);
    return false;
  }
  
  gameState.scores[playerId] += scoreAmount;
  return true;
}

/**
 * Calculate scores for all players in current round
 * Uses scoring.js calculateScore function
 * @returns {Object} - { playerId: roundScore }
 */
function calculateRoundScores() {
  const roundScores = {};
  
  // Validate that all players have bids and tricks
  for (const player of gameState.players) {
    if (gameState.bids[player.id] === null || gameState.bids[player.id] === undefined) {
      console.error(`Player ${player.id} has not placed a bid`);
      return null;
    }
    if (gameState.tricks[player.id] === null || gameState.tricks[player.id] === undefined) {
      console.error(`Player ${player.id} trick count not set`);
      return null;
    }
  }
  
  // Calculate score for each player using scoring engine
  for (const player of gameState.players) {
    const bid = gameState.bids[player.id];
    const tricks = gameState.tricks[player.id];
    
    // Call scoring.js function to calculate score
    const score = calculateScore(bid, tricks);
    
    roundScores[player.id] = score;
    
    // Store round score in history
    if (!gameState.roundScores[player.id]) {
      gameState.roundScores[player.id] = [];
    }
    gameState.roundScores[player.id].push(score);
    
    // Update total score
    updatePlayerScore(player.id, score);
  }
  
  return roundScores;
}

/**
 * Reset bids and tricks for next round
 * @returns {boolean} - Success/failure
 */
function nextRound() {
  // Reset bids and tricks for next round
  for (const player of gameState.players) {
    gameState.bids[player.id] = null;
    gameState.tricks[player.id] = null;
  }
  
  gameState.currentRound += 1;
  
  if (gameState.currentRound > gameState.totalRounds) {
    console.warn('Game has ended - all rounds complete');
    return false;
  }
  
  return true;
}

/**
 * Get current game state
 * @returns {Object} - Full game state
 */
function getGameState() {
  return { ...gameState };
}

/**
 * Get round results for display
 * @returns {Object} - Round results including bids, tricks, and scores
 */
function getRoundResults() {
  const results = {};
  
  for (const player of gameState.players) {
    results[player.id] = {
      bid: gameState.bids[player.id],
      tricks: gameState.tricks[player.id],
      roundScore: gameState.roundScores[player.id]?.[gameState.currentRound - 1] || 0,
      totalScore: gameState.scores[player.id]
    };
  }
  
  return results;
}

/**
 * Get leaderboard sorted by score
 * @returns {Array} - Players sorted by score (highest first)
 */
function getLeaderboard() {
  return gameState.players
    .map(player => ({
      id: player.id,
      name: player.name,
      score: gameState.scores[player.id]
    }))
    .sort((a, b) => b.score - a.score);
}

// Export all functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    gameState,
    initializeGame,
    setBid,
    setTricks,
    getPlayerScore,
    updatePlayerScore,
    calculateRoundScores,
    nextRound,
    getGameState,
    getRoundResults,
    getLeaderboard
  };
}

// For ES6 module usage
export {
  gameState,
  initializeGame,
  setBid,
  setTricks,
  getPlayerScore,
  updatePlayerScore,
  calculateRoundScores,
  nextRound,
  getGameState,
  getRoundResults,
  getLeaderboard
};
