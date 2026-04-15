/**
 * Game State Management Module
 * Manages player bids, tricks, and scores with integration to scoring engine
 */

// Import scoring functions (assumes scoring.js is loaded in HTML)
// Note: scoring.js functions are accessed globally after loading

/**
 * Game state object - stores all game-related information
 */
const gameState = {
  players: [],
  currentRound: 1,
  totalRounds: 0,
  rounds: {}, // Structure: { 1: { bids: {playerId: bidValue}, tricks: {playerId: tricksValue}, scores: {playerId: scoreValue} } }
  gameScores: {}, // Structure: { playerId: totalScore }
  
  /**
   * Initialize game state with players and total rounds
   * @param {Array} playerList - Array of player objects with id and name
   * @param {number} rounds - Total number of rounds
   */
  initialize: function(playerList, rounds) {
    if (!playerList || playerList.length === 0) {
      throw new Error('At least one player is required');
    }
    if (rounds < 1 || !Number.isInteger(rounds)) {
      throw new Error('Rounds must be a positive integer');
    }
    
    this.players = playerList.map(p => ({ ...p }));
    this.totalRounds = rounds;
    this.currentRound = 1;
    this.rounds = {};
    this.gameScores = {};
    
    // Initialize rounds and player scores
    for (let i = 1; i <= rounds; i++) {
      this.rounds[i] = {
        bids: {},
        tricks: {},
        scores: {}
      };
    }
    
    // Initialize total scores for each player
    this.players.forEach(player => {
      this.gameScores[player.id] = 0;
    });
  },
  
  /**
   * Record a player's bid for the current round
   * @param {string|number} playerId - Player ID
   * @param {number} bidAmount - Number of tricks player bids to win
   */
  recordBid: function(playerId, bidAmount) {
    if (this.currentRound < 1 || this.currentRound > this.totalRounds) {
      throw new Error(`Invalid round: ${this.currentRound}`);
    }
    if (!Number.isInteger(bidAmount) || bidAmount < 0) {
      throw new Error(`Invalid bid amount: ${bidAmount}`);
    }
    
    const player = this.players.find(p => p.id === playerId);
    if (!player) {
      throw new Error(`Player not found: ${playerId}`);
    }
    
    this.rounds[this.currentRound].bids[playerId] = bidAmount;
  },
  
  /**
   * Record tricks taken by a player in current round
   * @param {string|number} playerId - Player ID
   * @param {number} tricksAmount - Number of tricks won
   */
  recordTricks: function(playerId, tricksAmount) {
    if (this.currentRound < 1 || this.currentRound > this.totalRounds) {
      throw new Error(`Invalid round: ${this.currentRound}`);
    }
    if (!Number.isInteger(tricksAmount) || tricksAmount < 0) {
      throw new Error(`Invalid tricks amount: ${tricksAmount}`);
    }
    
    const player = this.players.find(p => p.id === playerId);
    if (!player) {
      throw new Error(`Player not found: ${playerId}`);
    }
    
    this.rounds[this.currentRound].tricks[playerId] = tricksAmount;
  },
  
  /**
   * Get bid for player in current round
   * @param {string|number} playerId - Player ID
   * @returns {number|undefined} - Bid amount or undefined if not set
   */
  getBid: function(playerId) {
    return this.rounds[this.currentRound].bids[playerId];
  },
  
  /**
   * Get tricks taken for player in current round
   * @param {string|number} playerId - Player ID
   * @returns {number|undefined} - Tricks amount or undefined if not set
   */
  getTricks: function(playerId) {
    return this.rounds[this.currentRound].tricks[playerId];
  },
  
  /**
   * Move to next round
   */
  nextRound: function() {
    if (this.currentRound < this.totalRounds) {
      this.currentRound++;
    } else {
      throw new Error('No more rounds available');
    }
  },
  
  /**
   * Check if current round is complete (all players have bids and tricks)
   * @returns {boolean}
   */
  isRoundComplete: function() {
    const roundData = this.rounds[this.currentRound];
    return this.players.every(player => 
      roundData.bids.hasOwnProperty(player.id) && 
      roundData.tricks.hasOwnProperty(player.id)
    );
  },
  
  /**
   * Reset current round data
   */
  resetCurrentRound: function() {
    this.rounds[this.currentRound] = {
      bids: {},
      tricks: {},
      scores: {}
    };
  }
};

/**
 * Calculate scores for the current round using the scoring engine
 * Assumes scoring.js is loaded and provides calculateScore(bid, tricks) function
 * @returns {Object} - Object with playerId as keys and scores as values
 */
function calculateRoundScores() {
  if (!gameState.isRoundComplete()) {
    throw new Error('Cannot calculate scores: round is not complete');
  }
  
  const round = gameState.currentRound;
  const roundScores = {};
  
  gameState.players.forEach(player => {
    const bid = gameState.rounds[round].bids[player.id];
    const tricks = gameState.rounds[round].tricks[player.id];
    
    // Use scoring engine if available, otherwise use basic scoring
    let score = 0;
    if (typeof calculateScore === 'function') {
      // Call scoring engine from scoring.js
      score = calculateScore(bid, tricks);
    } else {
      // Fallback basic scoring: 10 points for matching bid + 1 point per trick
      score = (bid === tricks) ? (10 + tricks) : Math.max(0, tricks - bid);
    }
    
    roundScores[player.id] = score;
    gameState.rounds[round].scores[player.id] = score;
    
    // Update total game score
    gameState.gameScores[player.id] += score;
  });
  
  return roundScores;
}

/**
 * Get the current score for a player
 * @param {string|number} playerId - Player ID
 * @returns {number} - Player's total game score
 */
function getPlayerScore(playerId) {
  if (!gameState.gameScores.hasOwnProperty(playerId)) {
    throw new Error(`Player not found: ${playerId}`);
  }
  return gameState.gameScores[playerId];
}

/**
 * Update a player's score
 * @param {string|number} playerId - Player ID
 * @param {number} scoreAmount - Amount to set score to (replaces current)
 */
function updatePlayerScore(playerId, scoreAmount) {
  if (!gameState.gameScores.hasOwnProperty(playerId)) {
    throw new Error(`Player not found: ${playerId}`);
  }
  if (!Number.isInteger(scoreAmount) || scoreAmount < 0) {
    throw new Error(`Invalid score amount: ${scoreAmount}`);
  }
  gameState.gameScores[playerId] = scoreAmount;
}

/**
 * Get all current scores
 * @returns {Object} - Object with playerId as keys and scores as values
 */
function getAllScores() {
  return { ...gameState.gameScores };
}

/**
 * Get round data for current round
 * @returns {Object} - Round data with bids, tricks, and scores
 */
function getRoundData() {
  return {
    round: gameState.currentRound,
    bids: { ...gameState.rounds[gameState.currentRound].bids },
    tricks: { ...gameState.rounds[gameState.currentRound].tricks },
    scores: { ...gameState.rounds[gameState.currentRound].scores }
  };
}

/**
 * Get all historical data
 * @returns {Object} - All rounds and scores
 */
function getGameHistory() {
  return {
    players: gameState.players.map(p => ({ ...p })),
    totalRounds: gameState.totalRounds,
    currentRound: gameState.currentRound,
    rounds: JSON.parse(JSON.stringify(gameState.rounds)),
    gameScores: { ...gameState.gameScores }
  };
}

/**
 * Initialize game with players and rounds (convenience function)
 * @param {Array} playerList - Array of player objects
 * @param {number} rounds - Total rounds to play
 */
function initializeGame(playerList, rounds) {
  gameState.initialize(playerList, rounds);
}

/**
 * Reset the entire game state
 */
function resetGameState() {
  gameState.players = [];
  gameState.currentRound = 1;
  gameState.totalRounds = 0;
  gameState.rounds = {};
  gameState.gameScores = {};
}

// Export all functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    gameState,
    calculateRoundScores,
    getPlayerScore,
    updatePlayerScore,
    getAllScores,
    getRoundData,
    getGameHistory,
    initializeGame,
    resetGameState
  };
}
