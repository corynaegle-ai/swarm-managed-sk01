/**
 * Game State and Scoring Manager
 * Manages overall game state, player data, and score calculation
 */

/**
 * Initialize and manage game state
 */
function gameStateManager() {
  return {
    // Game configuration
    gameState: {
      currentRound: 1,
      maxRounds: 0,
      players: [],
      roundHistory: []
    },

    // UI feedback
    feedback: {
      show: false,
      message: '',
      type: 'success' // 'success' or 'error'
    },

    /**
     * Initialize the game with players
     * @param {Array} playerNames - Array of player names
     * @param {number} maxRounds - Maximum number of rounds to play
     */
    initGame(playerNames, maxRounds = 10) {
      this.gameState.maxRounds = Math.min(maxRounds, 26); // Max 26 rounds (deck limit)
      this.gameState.players = playerNames.map((name, index) => ({
        id: index,
        name: name,
        bids: {},
        tricks: {},
        scores: {},
        totalScore: 0,
        roundHistory: []
      }));
      this.gameState.currentRound = 1;
      this.gameState.roundHistory = [];
    },

    /**
     * Record a player's bid for the current round
     * @param {number} playerId - The player ID
     * @param {number} bidAmount - Number of tricks bid
     */
    recordBid(playerId, bidAmount) {
      if (!this.gameState.players[playerId]) {
        this.showFeedback('Invalid player ID', 'error');
        return false;
      }

      const round = this.gameState.currentRound;
      this.gameState.players[playerId].bids[round] = bidAmount;
      return true;
    },

    /**
     * Record tricks taken by a player for the current round
     * @param {number} playerId - The player ID
     * @param {number} trickCount - Number of tricks taken
     */
    recordTricks(playerId, trickCount) {
      if (!this.gameState.players[playerId]) {
        this.showFeedback('Invalid player ID', 'error');
        return false;
      }

      const round = this.gameState.currentRound;
      this.gameState.players[playerId].tricks[round] = trickCount;
      return true;
    },

    /**
     * Calculate points for a single player in the current round
     * Scoring rules: 
     * - If tricks === bid: 10 + bid points
     * - If tricks !== bid: -abs(tricks - bid) points
     * @param {number} playerId - The player ID
     * @returns {number} Points earned in the round
     */
    calculateRoundScore(playerId) {
      const player = this.gameState.players[playerId];
      if (!player) return 0;

      const round = this.gameState.currentRound;
      const bid = player.bids[round] || 0;
      const tricks = player.tricks[round];

      // If tricks not yet recorded, return 0
      if (tricks === undefined) {
        return 0;
      }

      let roundScore = 0;
      if (tricks === bid) {
        // Made the bid: 10 bonus + bid amount
        roundScore = 10 + bid;
      } else {
        // Missed the bid: negative points for difference
        roundScore = -(Math.abs(tricks - bid));
      }

      return roundScore;
    },

    /**
     * Update all player scores after tricks are submitted
     * Calculates points for current round and updates cumulative scores
     * @param {Object} trickEntries - Object mapping player identifiers to trick counts
     * @returns {boolean} True if update was successful
     */
    updatePlayerScores(trickEntries) {
      try {
        // Record tricks for each player from submission
        for (let i = 0; i < this.gameState.players.length; i++) {
          const trickCount = trickEntries[`player${i}`];
          if (trickCount !== undefined) {
            this.recordTricks(i, trickCount);
          }
        }

        // Calculate scores for all players
        for (let i = 0; i < this.gameState.players.length; i++) {
          const roundScore = this.calculateRoundScore(i);
          const player = this.gameState.players[i];
          
          // Store round score
          player.scores[this.gameState.currentRound] = roundScore;
          
          // Update cumulative total
          player.totalScore += roundScore;
          
          // Add to round history
          player.roundHistory.push({
            round: this.gameState.currentRound,
            bid: player.bids[this.gameState.currentRound],
            tricks: player.tricks[this.gameState.currentRound],
            score: roundScore
          });
        }

        // Store round result
        this.gameState.roundHistory.push({
          round: this.gameState.currentRound,
          playerScores: this.gameState.players.map(p => ({
            playerId: p.id,
            playerName: p.name,
            bid: p.bids[this.gameState.currentRound],
            tricks: p.tricks[this.gameState.currentRound],
            score: p.scores[this.gameState.currentRound],
            totalScore: p.totalScore
          }))
        });

        return true;
      } catch (error) {
        console.error('Error updating player scores:', error);
        this.showFeedback(`Error calculating scores: ${error.message}`, 'error');
        return false;
      }
    },

    /**
     * Advance to the next round
     * @returns {boolean} True if successfully advanced, false if at max rounds
     */
    advanceRound() {
      if (this.gameState.currentRound >= this.gameState.maxRounds) {
        return false;
      }

      this.gameState.currentRound += 1;
      return true;
    },

    /**
     * Get the current round number
     * @returns {number} Current round
     */
    getCurrentRound() {
      return this.gameState.currentRound;
    },

    /**
     * Check if game is over
     * @returns {boolean} True if current round exceeds max rounds
     */
    isGameOver() {
      return this.gameState.currentRound > this.gameState.maxRounds;
    },

    /**
     * Get player standings (sorted by total score)
     * @returns {Array} Array of players sorted by total score descending
     */
    getStandings() {
      return [...this.gameState.players].sort(
        (a, b) => b.totalScore - a.totalScore
      );
    },

    /**
     * Get detailed round results
     * @param {number} roundNum - Round number (optional, defaults to current)
     * @returns {Object} Round result object
     */
    getRoundResults(roundNum = this.gameState.currentRound) {
      const roundResult = this.gameState.roundHistory.find(
        r => r.round === roundNum
      );
      return roundResult || null;
    },

    /**
     * Display feedback message
     * @param {string} message - Message to display
     * @param {string} type - Message type ('success' or 'error')
     */
    showFeedback(message, type = 'success') {
      this.feedback.message = message;
      this.feedback.type = type;
      this.feedback.show = true;

      // Auto-hide feedback after 3 seconds
      setTimeout(() => {
        this.feedback.show = false;
      }, 3000);
    },

    /**
     * Get current game state (read-only snapshot)
     * @returns {Object} Current game state
     */
    getGameState() {
      return JSON.parse(JSON.stringify(this.gameState));
    }
  };
}

/**
 * Export for testing and external use
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = gameStateManager;
}
