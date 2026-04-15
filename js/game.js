/**
 * Game State Management Module
 * Manages game state including player bids, tricks, and scores
 * Integrates with the scoring engine for score calculations
 */

import { calculateScore } from './scoring.js';

/**
 * Game state object
 * Tracks all game-related data
 */
const gameState = {
  players: [],
  currentRound: 1,
  totalRounds: 13,
  bids: {},        // { playerId: bidAmount }
  tricks: {},      // { playerId: tricksWon }
  scores: {},      // { playerId: currentRoundScore }
  totalScores: {}, // { playerId: totalScore }
};

/**
 * Initialize game with players
 * @param {Array} players - Array of player objects with id and name
 */
export function initializeGame(players) {
  gameState.players = players;
  gameState.bids = {};
  gameState.tricks = {};
  gameState.scores = {};
  gameState.totalScores = {};
  
  // Initialize player scores to 0
  players.forEach(player => {
    gameState.totalScores[player.id] = 0;
    gameState.bids[player.id] = null;
    gameState.tricks[player.id] = 0;
    gameState.scores[player.id] = 0;
  });
  
  gameState.currentRound = 1;
  return gameState;
}

/**
 * Record a player's bid for the current round
 * @param {string} playerId - Player ID
 * @param {number} bidAmount - Number of tricks player is bidding
 * @returns {boolean} Success status
 */
export function setBid(playerId, bidAmount) {
  if (typeof bidAmount !== 'number' || bidAmount < 0) {
    console.error('Invalid bid amount:', bidAmount);
    return false;
  }
  
  gameState.bids[playerId] = bidAmount;
  return true;
}

/**
 * Record tricks won by a player in the current round
 * @param {string} playerId - Player ID
 * @param {number} tricksWon - Number of tricks won
 * @returns {boolean} Success status
 */
export function setTricks(playerId, tricksWon) {
  if (typeof tricksWon !== 'number' || tricksWon < 0) {
    console.error('Invalid tricks count:', tricksWon);
    return false;
  }
  
  gameState.tricks[playerId] = tricksWon;
  return true;
}

/**
 * Get a player's score for the current round
 * @param {string} playerId - Player ID
 * @returns {number} Player's score for current round
 */
export function getPlayerScore(playerId) {
  return gameState.scores[playerId] || 0;
}

/**
 * Update a player's score
 * @param {string} playerId - Player ID
 * @param {number} scoreValue - Score to set
 * @returns {boolean} Success status
 */
export function updatePlayerScore(playerId, scoreValue) {
  if (typeof scoreValue !== 'number') {
    console.error('Invalid score value:', scoreValue);
    return false;
  }
  
  gameState.scores[playerId] = scoreValue;
  gameState.totalScores[playerId] = (gameState.totalScores[playerId] || 0) + scoreValue;
  return true;
}

/**
 * Calculate scores for all players in the current round
 * Uses the scoring engine to determine points based on bid vs tricks
 * @returns {Object} Object with playerId as key and score as value
 */
export function calculateRoundScores() {
  const roundScores = {};
  
  gameState.players.forEach(player => {
    const bid = gameState.bids[player.id];
    const tricks = gameState.tricks[player.id];
    
    // Validate that both bid and tricks are set
    if (bid === null || bid === undefined || tricks === null || tricks === undefined) {
      console.warn(`Missing bid or tricks for player ${player.id}`);
      roundScores[player.id] = 0;
      return;
    }
    
    // Use the scoring engine to calculate the score
    const score = calculateScore(bid, tricks);
    roundScores[player.id] = score;
    
    // Update the game state with the calculated score
    updatePlayerScore(player.id, score);
  });
  
  return roundScores;
}

/**
 * Get all player total scores
 * @returns {Object} Object with playerId as key and total score as value
 */
export function getTotalScores() {
  return { ...gameState.totalScores };
}

/**
 * Get the current game state
 * @returns {Object} Copy of the current game state
 */
export function getGameState() {
  return { ...gameState };
}

/**
 * Reset game for a new round
 * Clears bids and tricks, increments round counter
 * @returns {boolean} Success status
 */
export function startNewRound() {
  if (gameState.currentRound >= gameState.totalRounds) {
    console.warn('All rounds completed');
    return false;
  }
  
  gameState.currentRound++;
  gameState.bids = {};
  gameState.tricks = {};
  gameState.scores = {};
  
  // Re-initialize bids and tricks for new round
  gameState.players.forEach(player => {
    gameState.bids[player.id] = null;
    gameState.tricks[player.id] = 0;
    gameState.scores[player.id] = 0;
  });
  
  return true;
}

/**
 * Check if all players have placed their bids
 * @returns {boolean} True if all bids are set
 */
export function allBidsPlaced() {
  return gameState.players.every(player => 
    gameState.bids[player.id] !== null && gameState.bids[player.id] !== undefined
  );
}

/**
 * Check if all players have reported their tricks
 * @returns {boolean} True if all tricks are set
 */
export function allTricksReported() {
  return gameState.players.every(player => 
    gameState.tricks[player.id] !== null && gameState.tricks[player.id] !== undefined
  );
}

/**
 * Get the current round number
 * @returns {number} Current round number
 */
export function getCurrentRound() {
  return gameState.currentRound;
}

/**
 * Check if game is complete
 * @returns {boolean} True if all rounds have been played
 */
export function isGameComplete() {
  return gameState.currentRound > gameState.totalRounds;
}
