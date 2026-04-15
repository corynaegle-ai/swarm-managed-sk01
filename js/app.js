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
      phase: 'bidCollection', // 'bidCollection', 'playing', 'scoring', 'finalScores'
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
      showFinalScores: false,
      transition: false
    },

    // Input state for bid and trick collection
    bidInput: {},
    tricksInput: {},

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
      this.uiState.showFinalScores = false;
      this.bidInput = {};
      this.tricksInput = {};
    },

    /**
     * Initialize and start a demo game with default players
     */
    initializeGameDemo() {
      console.log('Initializing demo game');
      const demoPlayers = [
        { id: 'p1', name: 'Captain Blackbeard' },
        { id: 'p2', name: 'Anne Bonny' },
        { id: 'p3', name: 'Calico Jack' }
      ];
      this.startGame(demoPlayers);
    },

    /**
     * Start a new game
     * @param {Array} players - Array of player objects with id and name
     * @returns {boolean} True if game started successfully
     */
    startGame(players) {
      console.log('Starting new game with players:', players);
      
      // Validate players array
      if (!Array.isArray(players) || players.length < 2) {
        console.error('At least 2 players required to start game. Received:', players);
        return false;
      }

      // Validate player objects have required fields
      for (let player of players) {
        if (!player.id || !player.name) {
          console.error('Each player must have id and name fields. Invalid player:', player);
          return false;
        }
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
      
      // Reset input states for new round
      this.bidInput = {};
      this.tricksInput = {};
      
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
      this.uiState.showFinalScores = false;
      
      // Show bid collection after brief transition
      setTimeout(() => {
        this.uiState.showBidCollection = true;
        this.uiState.transition = false;
      }, 300);
    },

    /**
     * Submit a bid from a player via UI
     * Validates and registers the bid
     * @param {string} playerId - Player ID
     */
    submitPlayerBid(playerId) {
      const bidAmount = this.bidInput[playerId];
      
      // Validate that a bid was entered
      if (bidAmount === undefined || bidAmount === null || bidAmount === '') {
        console.error('No bid entered for player:', playerId);
        return;
      }

      // Register the bid through proper validation
      if (this.registerBid(playerId, bidAmount)) {
        // Bid was successfully registered
        console.log('Bid submitted successfully for player:', playerId);
      } else {
        console.error('Failed to register bid for player:', playerId);
      }
    },

    /**
     * Register a bid from a player
     * @param {string} playerId - Player ID
     * @param {number} bidAmount - Amount bid (0 to number of cards in round)
     * @returns {boolean} True if bid registered successfully
     */
    registerBid(playerId, bidAmount) {
      console.log(`Bid registered - Player: ${playerId}, Bid: ${bidAmount}`);
      
      // Validate player exists
      if (!this.gameState.players.find(p => p.id === playerId)) {
        console.error('Invalid player ID:', playerId);
        return false;
      }

      // Validate bid amount is a non-negative integer
      if (!Number.isInteger(bidAmount) || bidAmount < 0) {
        console.error('Bid must be a non-negative integer. Received:', bidAmount);
        return false;
      }

      // Validate bid is within valid range
      const maxBid = this.getCardsInRound();
      if (bidAmount > maxBid) {
        console.error(`Bid must be <= ${maxBid} for this round. Received:`, bidAmount);
        return false;
      }

      this.gameState.bids[playerId] = bidAmount;
      this.checkAllBidsCollected();
      return true;
    },

    /**
     * Check if all players have submitted bids
     * @returns {boolean} True if all bids collected
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
     * @returns {boolean} True if proceeding successfully
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
     * @returns {boolean} True if tricks registered successfully
     */
    registerTricks(playerId, tricksWon) {
      console.log(`Tricks registered - Player: ${playerId}, Tricks: ${tricksWon}`);
      
      // Validate player exists
      if (!this.gameState.players.find(p => p.id === playerId)) {
        console.error('Invalid player ID:', playerId);
        return false;
      }

      // Validate tricks is a non-negative integer
      if (!Number.isInteger(tricksWon) || tricksWon < 0) {
        console.error('Tricks won must be a non-negative integer. Received:', tricksWon);
        return false;
      }

      // Validate tricks doesn't exceed cards in round
      const maxTricks = this.getCardsInRound();
      if (tricksWon > maxTricks) {
        console.error(`Tricks won cannot exceed ${maxTricks}. Received:`, tricksWon);
        return false;
      }

      this.gameState.tricks[playerId] = tricksWon;
      return true;
    },

    /**
     * Submit all tricks from UI inputs and proceed to scoring
     * @returns {boolean} True if tricks submitted successfully
     */
    submitTricksAndScore() {
      console.log('Submitting tricks from UI');
      
      // Register all tricks from input
      for (let playerId in this.tricksInput) {
        const tricksWon = this.tricksInput[playerId];
        
        // Skip empty/undefined inputs
        if (tricksWon === undefined || tricksWon === null || tricksWon === '') {
          continue;
        }

        if (!this.registerTricks(playerId, tricksWon)) {
          console.error('Failed to register tricks for player:', playerId);
          return false;
        }
      }

      // Verify all trick data has been collected
      return this.completeRound();
    },

    /**
     * Complete current round and calculate scores
     * @returns {boolean} True if round completed successfully
     */
    completeRound() {
      console.log('Completing round:', this.gameState.currentRound);
      
      // Verify all trick data has been collected
      const tricksCount = Object.keys(this.gameState.tricks).length;
      const playerCount = this.gameState.players.length;
      
      if (tricksCount !== playerCount) {
        console.error(`Not all trick data collected: ${tricksCount}/${playerCount}`);
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
     * Scoring: If bid matches tricks won, award 10 points
     *          Otherwise, award -5 points
     */
    calculateRoundScores() {
      console.log('Calculating round scores');
      
      this.gameState.players.forEach(player => {
        const playerId = player.id;
        const bid = this.gameState.bids[playerId] || 0;
        const tricks = this.gameState.tricks[playerId] || 0;
        
        let roundScore = 0;
        
        if (bid === tricks) {
          // Made bid: 10 points
          roundScore = 10;
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
     * Proceed to final scores phase
     */
    proceedToFinalScores() {
      console.log('Proceeding to final scores phase');
      this.gameState.phase = 'finalScores';
      
      this.uiState.transition = true;
      this.uiState.showScoring = false;
      
      setTimeout(() => {
        this.uiState.showFinalScores = true;
        this.uiState.transition = false;
      }, 300);
    },

    /**
     * End the game and show final scores
     */
    endGame() {
      console.log('Game ended');
      this.gameState.gameActive = false;
      this.gameState.phase = 'finalScores';
      
      // Determine winner
      const winner = this.getWinner();
      console.log('Game winner:', winner);
      
      this.uiState.transition = true;
      this.uiState.showScoring = false;
      
      setTimeout(() => {
        this.uiState.showFinalScores = true;
        this.uiState.transition = false;
      }, 300);

      this.emitEvent('gameEnded', {
        finalScores: this.gameState.scores,
        winner: winner
      });
    },

    /**
     * Get the game winner
     * @returns {Object|null} Winner player object or null if no valid game state
     */
    getWinner() {
      if (this.gameState.players.length === 0) {
        return null;
      }

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
     * Reset game to initial state
     */
    resetGame() {
      console.log('Resetting game');
      this.init();
      this.gameState.players = [];
      this.gameState.bids = {};
      this.gameState.tricks = {};
      this.gameState.scores = {};
      this.uiState.showFinalScores = false;
    },

    /**
     * Get current round information
     * @returns {Object} Round information
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
     * Classic 13-round game: starts with 13 cards, decrements to 1, then increments back to 13
     * Rounds 1-13: 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1
     * (For rounds beyond 13, pattern would continue: 2, 3, 4... but game is 13 rounds total)
     * @returns {number} Number of cards in current round
     */
    getCardsInRound() {
      const round = this.gameState.currentRound;
      const totalRounds = this.gameState.totalRounds;
      
      // For a 13-round game: round 1 = 13 cards, round 7 = 7 cards, round 13 = 1 card
      // Formula: cards = totalRounds - round + 1
      return totalRounds - round + 1;
    },

    /**
     * Get player information with current game state
     * @returns {Array} Array of player objects with current game data
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
     * Get players sorted by final score (descending)
     * @returns {Array} Array of player objects sorted by score
     */
    getPlayersFinalScores() {
      return this.gameState.players
        .map(player => ({
          ...player,
          totalScore: this.gameState.scores[player.id] || 0
        }))
        .sort((a, b) => b.totalScore - a.totalScore);
    },

    /**
     * Event handling - emit custom events for other components
     * @param {string} eventName - Name of event to emit
     * @param {Object} data - Data to attach to event
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
