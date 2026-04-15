/**
 * Main game controller - Manages game phases and flow
 * Integrates bid collection, playing, and scoring phases
 */

// Game state management
window.gameApp = function() {
  return {
    // Game state
    gameState: {
      currentRound: 1,
      totalRounds: 13,
      phase: 'bidCollection', // 'bidCollection', 'playing', 'scoring'
      players: [],
      bids: {}, // { playerId: bidAmount }
      tricks: {}, // { playerId: tricksWon }
      scores: {}, // { playerId: totalScore }
      gameActive: false,
      allBidsCollected: false
    },

    // UI state
    uiState: {
      showBidCollection: false,
      showGameBoard: false,
      showScoring: false,
      transition: false
    },

    // Component references
    bidManager: null,
    bidCollectionUI: null,

    /**
     * Initialize the game
     */
    init() {
      console.log('Initializing game app');
      this.gameState.gameActive = false;
      this.gameState.phase = 'bidCollection';
      this.uiState.showBidCollection = false;
      this.uiState.showGameBoard = false;
      this.uiState.showScoring = false;
    },

    /**
     * Start a new game
     * @param {Array} players - Array of player objects with id and name
     */
    startGame(players) {
      console.log('Starting new game with players:', players);
      
      if (!players || players.length < 2) {
        console.error('At least 2 players required to start game');
        return false;
      }

      this.gameState.players = players;
      this.gameState.gameActive = true;
      this.gameState.currentRound = 1;
      this.gameState.allBidsCollected = false;
      
      // Initialize scores
      this.gameState.scores = {};
      players.forEach(player => {
        this.gameState.scores[player.id] = 0;
      });

      // Start first round
      this.startRound();
      return true;
    },

    /**
     * Start a new round - enters bid collection phase
     */
    startRound() {
      console.log('Starting round:', this.gameState.currentRound);
      
      if (this.gameState.currentRound > this.gameState.totalRounds) {
        console.log('All rounds completed');
        this.endGame();
        return;
      }

      this.gameState.phase = 'bidCollection';
      this.gameState.allBidsCollected = false;
      this.gameState.bids = {};
      this.gameState.tricks = {};
      
      // Show bid collection UI
      this.showBidCollectionPhase();
    },

    /**
     * Show bid collection phase
     */
    showBidCollectionPhase() {
      console.log('Showing bid collection phase');
      this.uiState.transition = true;
      
      // Hide other phases
      this.uiState.showGameBoard = false;
      this.uiState.showScoring = false;
      
      // Show bid collection after brief transition
      setTimeout(() => {
        this.uiState.showBidCollection = true;
        this.uiState.transition = false;
      }, 300);
    },

    /**
     * Register a bid from a player
     * @param {string} playerId - Player ID
     * @param {number} bidAmount - Amount bid (0 to number of cards in round)
     */
    registerBid(playerId, bidAmount) {
      console.log(`Bid registered - Player: ${playerId}, Bid: ${bidAmount}`);
      
      if (!this.gameState.players.find(p => p.id === playerId)) {
        console.error('Invalid player ID:', playerId);
        return false;
      }

      this.gameState.bids[playerId] = bidAmount;
      this.checkAllBidsCollected();
      return true;
    },

    /**
     * Check if all players have submitted bids
     */
    checkAllBidsCollected() {
      const bidCount = Object.keys(this.gameState.bids).length;
      const playerCount = this.gameState.players.length;
      
      console.log(`Bids collected: ${bidCount}/${playerCount}`);
      
      if (bidCount === playerCount) {
        this.gameState.allBidsCollected = true;
        console.log('All bids collected! Ready to proceed.');
        return true;
      }
      return false;
    },

    /**
     * Proceed to playing phase after all bids collected
     * This can be called manually or automatically
     */
    proceedToPlayingPhase() {
      if (!this.gameState.allBidsCollected) {
        console.error('Cannot proceed: not all bids collected yet');
        return false;
      }

      console.log('Proceeding to playing phase');
      this.gameState.phase = 'playing';
      
      // Hide bid collection and show game board
      this.uiState.transition = true;
      this.uiState.showBidCollection = false;
      
      setTimeout(() => {
        this.uiState.showGameBoard = true;
        this.uiState.transition = false;
      }, 300);

      // Emit event for other components
      this.emitEvent('phaseChanged', {
        phase: 'playing',
        round: this.gameState.currentRound,
        bids: this.gameState.bids
      });

      return true;
    },

    /**
     * Register tricks won in current round
     * @param {string} playerId - Player ID
     * @param {number} tricksWon - Number of tricks won
     */
    registerTricks(playerId, tricksWon) {
      console.log(`Tricks registered - Player: ${playerId}, Tricks: ${tricksWon}`);
      this.gameState.tricks[playerId] = tricksWon;
    },

    /**
     * Complete current round and calculate scores
     */
    completeRound() {
      console.log('Completing round:', this.gameState.currentRound);
      
      if (Object.keys(this.gameState.tricks).length !== this.gameState.players.length) {
        console.error('Not all trick data collected');
        return false;
      }

      // Calculate and update scores for this round
      this.calculateRoundScores();

      // Proceed to scoring phase
      this.proceedToScoringPhase();
      return true;
    },

    /**
     * Calculate scores for current round
     * Simple scoring: if bid matches tricks, award points
     */
    calculateRoundScores() {
      console.log('Calculating round scores');
      
      this.gameState.players.forEach(player => {
        const playerId = player.id;
        const bid = this.gameState.bids[playerId] || 0;
        const tricks = this.gameState.tricks[playerId] || 0;
        
        let roundScore = 0;
        
        if (bid === tricks) {
          // Made bid: 10 + (bid amount)
          roundScore = 10 + bid;
        } else {
          // Failed bid: -5 points
          roundScore = -5;
        }
        
        // Update total score
        this.gameState.scores[playerId] = (this.gameState.scores[playerId] || 0) + roundScore;
        console.log(`Player ${playerId}: bid=${bid}, tricks=${tricks}, roundScore=${roundScore}, total=${this.gameState.scores[playerId]}`);
      });
    },

    /**
     * Proceed to scoring phase
     */
    proceedToScoringPhase() {
      console.log('Proceeding to scoring phase');
      this.gameState.phase = 'scoring';
      
      this.uiState.transition = true;
      this.uiState.showGameBoard = false;
      
      setTimeout(() => {
        this.uiState.showScoring = true;
        this.uiState.transition = false;
      }, 300);

      // Emit event
      this.emitEvent('phaseChanged', {
        phase: 'scoring',
        round: this.gameState.currentRound,
        scores: this.gameState.scores
      });
    },

    /**
     * Move to next round
     */
    nextRound() {
      console.log('Moving to next round');
      
      if (this.gameState.currentRound >= this.gameState.totalRounds) {
        this.endGame();
        return;
      }

      this.gameState.currentRound++;
      this.startRound();
    },

    /**
     * End the game
     */
    endGame() {
      console.log('Game ended');
      this.gameState.gameActive = false;
      this.gameState.phase = 'gameOver';
      
      // Determine winner
      const winner = this.getWinner();
      
      this.uiState.transition = true;
      this.uiState.showScoring = false;
      
      setTimeout(() => {
        this.uiState.transition = false;
      }, 300);

      this.emitEvent('gameEnded', {
        finalScores: this.gameState.scores,
        winner: winner
      });
    },

    /**
     * Get the game winner
     */
    getWinner() {
      let maxScore = -Infinity;
      let winner = null;
      
      Object.entries(this.gameState.scores).forEach(([playerId, score]) => {
        if (score > maxScore) {
          maxScore = score;
          winner = this.gameState.players.find(p => p.id === playerId);
        }
      });
      
      return winner;
    },

    /**
     * Get current round information
     */
    getRoundInfo() {
      return {
        roundNumber: this.gameState.currentRound,
        totalRounds: this.gameState.totalRounds,
        cardsInRound: this.getCardsInRound(),
        phase: this.gameState.phase,
        bids: this.gameState.bids,
        allBidsCollected: this.gameState.allBidsCollected
      };
    },

    /**
     * Get number of cards in current round
     * Classic game: 13 cards round 1, then 12, 11, ... 1, then 2, 3... 13
     */
    getCardsInRound() {
      const round = this.gameState.currentRound;
      const totalRounds = this.gameState.totalRounds;
      const halfway = Math.ceil(totalRounds / 2);
      
      if (round <= halfway) {
        return totalRounds - round + 1;
      } else {
        return round - halfway;
      }
    },

    /**
     * Get player information
     */
    getPlayers() {
      return this.gameState.players.map(player => ({
        ...player,
        currentBid: this.gameState.bids[player.id],
        tricksWon: this.gameState.tricks[player.id],
        totalScore: this.gameState.scores[player.id]
      }));
    },

    /**
     * Event handling
     */
    emitEvent(eventName, data) {
      const event = new CustomEvent('gameApp:' + eventName, {
        detail: data,
        bubbles: true
      });
      document.dispatchEvent(event);
    }
  };
};