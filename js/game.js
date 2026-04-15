/**
 * Game State Management Module
 * Manages player bids, tricks taken, and score calculations
 * Integrates with the scoring engine (js/scoring.js)
 */

const { calculateScore } = require('./scoring.js');

// Module-level mutable singleton game state
const gameState = {
  players: [],
  bids: {},
  tricksTaken: {},
  scores: {},
  currentRound: 0,
  totalRounds: 13,
  roundHistory: []
};

/**
 * Initialize game with players and total rounds
 * @param {Array<{id: string, name: string}>} players - Array of player objects
 * @param {number} totalRounds - Total number of rounds (default: 13)
 */
function initializeGame(players, totalRounds = 13) {
  if (!Array.isArray(players) || players.length === 0) {
    throw new Error('Players must be a non-empty array');
  }
  
  if (typeof totalRounds !== 'number' || totalRounds <= 0) {
    throw new Error('Total rounds must be a positive number');
  }
  
  // Reset game state
  gameState.players = players;
  gameState.bids = {};
  gameState.tricksTaken = {};
  gameState.scores = {};
  gameState.currentRound = 0;
  gameState.totalRounds = totalRounds;
  gameState.roundHistory = [];
  
  // Initialize player states
  players.forEach(player => {
    gameState.bids[player.id] = null;
    gameState.tricksTaken[player.id] = null;
    gameState.scores[player.id] = 0;
  });
  
  return gameState;
}

/**
 * Set bid for a player
 * @param {string} playerId - Player ID
 * @param {number} bid - Bid amount
 */
function setBid(playerId, bid) {
  if (!gameState.players.some(p => p.id === playerId)) {
    throw new Error('Player not found');
  }
  
  if (typeof bid !== 'number' || bid < 0) {
    throw new Error('Bid must be a non-negative number');
  }
  
  gameState.bids[playerId] = bid;
}

/**
 * Set tricks taken for a player
 * @param {string} playerId - Player ID
 * @param {number} tricks - Tricks taken
 */
function setTricksTaken(playerId, tricks) {
  if (!gameState.players.some(p => p.id === playerId)) {
    throw new Error('Player not found');
  }
  
  if (typeof tricks !== 'number' || tricks < 0) {
    throw new Error('Tricks taken must be a non-negative number');
  }
  
  gameState.tricksTaken[playerId] = tricks;
}

/**
 * Get player score
 * @param {string} playerId - Player ID
 * @returns {number} Player score
 */
function getPlayerScore(playerId) {
  if (!gameState.players.some(p => p.id === playerId)) {
    throw new Error('Player not found');
  }
  
  return gameState.scores[playerId];
}

/**
 * Update player score by adding points
 * @param {string} playerId - Player ID
 * @param {number} points - Points to add
 */
function updatePlayerScore(playerId, points) {
  if (!gameState.players.some(p => p.id === playerId)) {
    throw new Error('Player not found');
  }
  
  if (typeof points !== 'number') {
    throw new Error('Points must be a number');
  }
  
  gameState.scores[playerId] += points;
}

/**
 * Calculate round scores for all players using scoring engine
 * Updates player scores and records round history
 */
function calculateRoundScores() {
  // Check if all players have bids and tricks set
  for (const player of gameState.players) {
    if (gameState.bids[player.id] === null) {
      throw new Error(`Bid not set for player ${player.id}`);
    }
    if (gameState.tricksTaken[player.id] === null) {
      throw new Error(`Tricks not set for player ${player.id}`);
    }
  }
  
  const roundResults = [];
  
  // Calculate scores for each player
  for (const player of gameState.players) {
    const bid = gameState.bids[player.id];
    const tricks = gameState.tricksTaken[player.id];
    
    // Use scoring engine to calculate points
    const points = calculateScore(bid, tricks);
    
    // Update player score
    gameState.scores[player.id] += points;
    
    // Record round result
    roundResults.push({
      playerId: player.id,
      playerName: player.name,
      bid,
      tricks,
      points
    });
  }
  
  // Add to round history
  gameState.roundHistory.push({
    round: gameState.currentRound + 1,
    results: roundResults
  });
  
  // Increment round counter
  gameState.currentRound++;
  
  // Reset bids and tricks for next round
  for (const player of gameState.players) {
    gameState.bids[player.id] = null;
    gameState.tricksTaken[player.id] = null;
  }
  
  return roundResults;
}

/**
 * Reset current round (clear bids and tricks)
 */
function resetRound() {
  for (const player of gameState.players) {
    gameState.bids[player.id] = null;
    gameState.tricksTaken[player.id] = null;
  }
}

/**
 * Get current game state
 * @returns {Object} Game state object
 */
function getGameState() {
  return {
    players: [...gameState.players],
    bids: {...gameState.bids},
    tricksTaken: {...gameState.tricksTaken},
    scores: {...gameState.scores},
    currentRound: gameState.currentRound,
    totalRounds: gameState.totalRounds,
    roundHistory: [...gameState.roundHistory]
  };
}

/**
 * Get leaderboard sorted by score
 * @returns {Array} Sorted array of player scores
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

// Export all functions and the gameState object
module.exports = {
  gameState,
  initializeGame,
  setBid,
  setTricksTaken,
  getPlayerScore,
  updatePlayerScore,
  calculateRoundScores,
  resetRound,
  getGameState,
  getLeaderboard
};
