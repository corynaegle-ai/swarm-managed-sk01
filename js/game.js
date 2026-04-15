/**
 * Game Manager
 * Handles the main game flow including bidding phase and trick-taking
 */

// Import bidding functionality
import { displayBiddingPhase } from './bidding.js';

class Game {
  constructor(players = []) {
    this.players = players;
    this.currentRound = 1;
    this.maxRounds = 13; // Standard game has 13 rounds
    this.gameState = {
      round: this.currentRound,
      bids: {}, // Store bids for each player
      tricks: {},
      scores: this.initializeScores(),
      isActive: true
    };
  }

  /**
   * Initialize scores for all players
   */
  initializeScores() {
    const scores = {};
    this.players.forEach(player => {
      scores[player.id] = 0;
    });
    return scores;
  }

  /**
   * Start the game and run the main game loop
   */
  async start() {
    try {
      while (this.currentRound <= this.maxRounds && this.gameState.isActive) {
        console.log(`Starting round ${this.currentRound}`);
        
        // Reset bids for this round
        this.gameState.bids = {};
        this.gameState.round = this.currentRound;
        
        // Run bidding phase
        await this.runBiddingPhase();
        
        // Verify all bids were collected
        if (!this.validateAllBidsCollected()) {
          throw new Error('Cannot proceed to trick-taking: incomplete bids');
        }
        
        // Run trick-taking phase
        await this.runTrickTakingPhase();
        
        // Update scores based on bids and tricks
        this.updateScores();
        
        // Advance to next round
        this.currentRound++;
      }
      
      this.endGame();
    } catch (error) {
      console.error('Game error:', error);
      this.gameState.isActive = false;
      throw error;
    }
  }

  /**
   * Run the bidding phase for current round
   * Waits for all players to submit valid bids
   */
  async runBiddingPhase() {
    try {
      console.log('Entering bidding phase for round', this.currentRound);
      
      // Call the bidding phase UI function
      // displayBiddingPhase handles the UI and returns when all bids are collected
      const collectedBids = await displayBiddingPhase(
        this.players,
        this.gameState
      );
      
      // Store bids in game state
      this.gameState.bids = collectedBids;
      
      console.log('Bidding phase complete. Bids:', this.gameState.bids);
    } catch (error) {
      console.error('Error during bidding phase:', error);
      throw error;
    }
  }

  /**
   * Validate that all players have submitted bids
   */
  validateAllBidsCollected() {
    const bidsCount = Object.keys(this.gameState.bids).length;
    const playersCount = this.players.length;
    
    if (bidsCount !== playersCount) {
      console.error(
        `Incomplete bids: ${bidsCount}/${playersCount} players`,
        'Missing bids from players:',
        this.getMissingBidPlayers()
      );
      return false;
    }
    
    // Validate bid values
    for (const [playerId, bid] of Object.entries(this.gameState.bids)) {
      if (typeof bid !== 'number' || bid < 0) {
        console.error(`Invalid bid value for player ${playerId}: ${bid}`);
        return false;
      }
    }
    
    return true;
  }

  /**
   * Get list of players missing bids
   */
  getMissingBidPlayers() {
    const bidPlayerIds = Object.keys(this.gameState.bids);
    return this.players
      .filter(p => !bidPlayerIds.includes(p.id))
      .map(p => p.name || p.id);
  }

  /**
   * Run the trick-taking phase
   * Players play cards according to their bids
   */
  async runTrickTakingPhase() {
    try {
      console.log('Entering trick-taking phase for round', this.currentRound);
      // Trick-taking logic will be implemented in separate function
      // For now, placeholder that acknowledges phase exists
      await new Promise(resolve => setTimeout(resolve, 100));
      console.log('Trick-taking phase complete');
    } catch (error) {
      console.error('Error during trick-taking phase:', error);
      throw error;
    }
  }

  /**
   * Update player scores based on bids and tricks
   */
  updateScores() {
    // Score calculation logic
    // Players get points for correct bids
    // This will be enhanced as game logic develops
    console.log('Scores updated for round', this.currentRound);
  }

  /**
   * End the game and determine winner
   */
  endGame() {
    console.log('Game ended');
    this.gameState.isActive = false;
    // Announce winner or results
  }

  /**
   * Get current game state
   */
  getGameState() {
    return { ...this.gameState };
  }

  /**
   * Get player list
   */
  getPlayers() {
    return [...this.players];
  }
}

// Export for use in other modules
export { Game };
