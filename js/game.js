/**
 * Game State Manager
 * Manages overall game state, scoring, and round progression
 */

class GameStateManager {
  constructor() {
    this.gameState = {
      players: [],
      currentRound: 1,
      maxRounds: 13,
      gameActive: false
    };
    
    this.isInitialized = false;
    this.setupEventListeners();
  }

  /**
   * Initialize game with players and game settings
   * @param {Array} players - Array of player objects with name, bid, and tricks properties
   * @param {number} maxRounds - Maximum number of rounds (default 13)
   */
  initializeGame(players, maxRounds = 13) {
    if (!players || players.length === 0) {
      throw new Error('At least one player is required to initialize the game');
    }
    
    this.gameState.players = players.map((player, index) => ({
      id: `player${index}`,
      name: player.name || `Player ${index + 1}`,
      bid: player.bid || 0,
      tricks: 0,
      score: 0,
      roundScores: [],
      ...player
    }));
    
    this.gameState.maxRounds = maxRounds;
    this.gameState.currentRound = 1;
    this.gameState.gameActive = true;
    this.isInitialized = true;
    
    console.log('Game initialized with players:', this.gameState.players);
    console.log('Max rounds:', this.gameState.maxRounds);
  }

  /**
   * Set up event listeners for game flow
   */
  setupEventListeners() {
    // Listen for trick submission events from trick-entry.js
    document.addEventListener('trickSubmission', (event) => {
      this.handleTrickSubmission(event);
    });
  }

  /**
   * Handle trick submission event
   * @param {CustomEvent} event - Event containing trick data
   */
  handleTrickSubmission(event) {
    try {
      const { round, tricks } = event.detail;
      
      if (!this.isInitialized) {
        console.error('Game not initialized. Cannot process trick submission.');
        this.dispatchGameEvent('trickSubmissionError', {
          error: 'Game not initialized',
          message: 'Please initialize the game first'
        });
        return;
      }
      
      if (round !== this.gameState.currentRound) {
        console.error(`Round mismatch: expected ${this.gameState.currentRound}, got ${round}`);
        this.dispatchGameEvent('trickSubmissionError', {
          error: 'Round mismatch',
          message: `Expected round ${this.gameState.currentRound}. Please refresh.`
        });
        return;
      }
      
      // Update player scores based on tricks taken vs bid
      this.updatePlayerScores(tricks);
      
      // Advance to next round
      this.advanceRound();
      
      // Dispatch success event so UI can respond
      this.dispatchGameEvent('trickSubmissionSuccess', {
        round: this.gameState.currentRound - 1,
        currentRound: this.gameState.currentRound,
        scores: this.getPlayerScores()
      });
      
    } catch (error) {
      console.error('Error processing trick submission:', error);
      this.dispatchGameEvent('trickSubmissionError', {
        error: error.message,
        message: 'An error occurred while processing tricks'
      });
    }
  }

  /**
   * Update player scores based on tricks taken vs bids
   * Calculates points: 10 points if tricks match bid, otherwise -|tricks - bid| points
   * @param {Object} tricks - Object with keys 'player0', 'player1', etc., values are tricks taken
   */
  updatePlayerScores(tricks) {
    if (!tricks || typeof tricks !== 'object') {
      throw new Error('Invalid tricks object provided to updatePlayerScores');
    }
    
    for (let i = 0; i < this.gameState.players.length; i++) {
      const playerId = `player${i}`;
      const player = this.gameState.players[i];
      const tricksTaken = tricks[playerId];
      
      if (tricksTaken === undefined || tricksTaken === null) {
        throw new Error(`Missing tricks entry for ${playerId}`);
      }
      
      // Calculate round points
      let roundPoints = 0;
      if (tricksTaken === player.bid) {
        // Bonus points if tricks match bid
        roundPoints = 10;
      } else {
        // Penalty for not matching bid: -|tricks - bid|
        roundPoints = -(Math.abs(tricksTaken - player.bid));
      }
      
      // Update player's tricks for this round
      player.tricks = tricksTaken;
      
      // Update total score
      player.score += roundPoints;
      
      // Track round scores
      if (!player.roundScores) {
        player.roundScores = [];
      }
      player.roundScores.push({
        round: this.gameState.currentRound,
        bid: player.bid,
        tricks: tricksTaken,
        points: roundPoints
      });
      
      console.log(`Player ${i+1} (${player.name}): Bid=${player.bid}, Tricks=${tricksTaken}, Points=${roundPoints}, Total=${player.score}`);
    }
  }

  /**
   * Advance to the next round
   * @returns {boolean} True if game continues, false if game ended
   */
  advanceRound() {
    if (!this.gameState.gameActive) {
      console.warn('Game is not active. Cannot advance round.');
      return false;
    }
    
    // Reset bids and tricks for next round
    for (const player of this.gameState.players) {
      player.bid = 0;
      player.tricks = 0;
    }
    
    // Move to next round
    this.gameState.currentRound += 1;
    
    // Check if game ended
    if (this.gameState.currentRound > this.gameState.maxRounds) {
      this.gameState.gameActive = false;
      console.log('Game ended. Final scores:', this.getPlayerScores());
      return false;
    }
    
    console.log(`Advanced to round ${this.gameState.currentRound}`);
    return true;
  }

  /**
   * Get current scores for all players
   * @returns {Array} Array of player score objects
   */
  getPlayerScores() {
    return this.gameState.players.map(player => ({
      id: player.id,
      name: player.name,
      score: player.score,
      bid: player.bid,
      tricks: player.tricks
    }));
  }

  /**
   * Get results for a specific round
   * @param {number} round - Round number (defaults to currentRound - 1 for last completed round)
   * @returns {Array} Array of round results
   */
  getRoundResults(round = null) {
    const targetRound = round !== null ? round : this.gameState.currentRound - 1;
    
    return this.gameState.players.map(player => {
      const roundScore = player.roundScores?.find(rs => rs.round === targetRound);
      return {
        playerId: player.id,
        playerName: player.name,
        bid: roundScore?.bid || 0,
        tricks: roundScore?.tricks || 0,
        points: roundScore?.points || 0
      };
    });
  }

  /**
   * Dispatch custom game event
   * @param {string} eventName - Name of the event
   * @param {Object} detail - Event detail data
   */
  dispatchGameEvent(eventName, detail) {
    const event = new CustomEvent(eventName, {
      detail,
      bubbles: true,
      cancelable: true
    });
    document.dispatchEvent(event);
  }

  /**
   * Get current game state
   * @returns {Object} Current game state
   */
  getGameState() {
    return {
      ...this.gameState,
      players: this.gameState.players.map(p => ({ ...p }))
    };
  }

  /**
   * Check if game is active
   * @returns {boolean} True if game is active
   */
  isGameActive() {
    return this.gameState.gameActive && this.gameState.currentRound <= this.gameState.maxRounds;
  }

  /**
   * Get current round number
   * @returns {number} Current round
   */
  getCurrentRound() {
    return this.gameState.currentRound;
  }
}

// Create singleton instance
const gameStateManager = new GameStateManager();

// Export for use in modules and testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GameStateManager, gameStateManager };
}
