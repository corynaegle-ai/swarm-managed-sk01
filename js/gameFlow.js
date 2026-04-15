/**
 * Game Flow Component - Alpine.js
 * Manages game flow UI including phase indicators, round counter, and game completion
 */

function gameFlowComponent() {
  return {
    // Component state
    currentPhase: 'bidding', // 'bidding', 'playing', 'scoring', 'gameOver'
    currentRound: 1,
    maxRounds: 10,
    phases: ['bidding', 'playing', 'scoring'],
    gameOver: false,
    playerScores: {},

    /**
     * Initialize the component
     */
    init() {
      this.loadGameState();
    },

    /**
     * Load game state from gameState.js
     */
    loadGameState() {
      if (typeof gameState !== 'undefined' && gameState) {
        this.currentRound = gameState.getCurrentRound ? gameState.getCurrentRound() : 1;
        this.maxRounds = gameState.getMaxRounds ? gameState.getMaxRounds() : 10;
        this.currentPhase = gameState.getCurrentPhase ? gameState.getCurrentPhase() : 'bidding';
        this.gameOver = gameState.isGameOver ? gameState.isGameOver() : false;
        this.playerScores = gameState.getPlayerScores ? gameState.getPlayerScores() : {};
      }
    },

    /**
     * Get CSS class for phase indicator based on active phase
     * @param {string} phase - The phase to check
     * @returns {string} CSS class string
     */
    getPhaseIndicatorClass(phase) {
      const isActive = this.currentPhase === phase;
      return `phase-indicator ${isActive ? 'active' : ''}`;
    },

    /**
     * Get display text for current phase
     * @returns {string} Human-readable phase text
     */
    getPhaseDisplayText() {
      const phaseText = {
        bidding: 'Bidding Phase',
        playing: 'Playing Phase',
        scoring: 'Scoring Phase',
        gameOver: 'Game Over',
      };
      return phaseText[this.currentPhase] || this.currentPhase;
    },

    /**
     * Get progress percentage for round
     * @returns {number} Progress as percentage (0-100)
     */
    getRoundProgress() {
      return Math.round((this.currentRound / this.maxRounds) * 100);
    },

    /**
     * Move to next phase
     */
    moveToNextPhase() {
      if (this.gameOver) {
        return;
      }

      const currentIndex = this.phases.indexOf(this.currentPhase);

      if (currentIndex < this.phases.length - 1) {
        // Move to next phase in current round
        this.currentPhase = this.phases[currentIndex + 1];
      } else {
        // Current round phases complete, move to next round
        if (this.currentRound < this.maxRounds) {
          this.currentRound++;
          this.currentPhase = 'bidding';
        } else {
          // All rounds complete
          this.currentPhase = 'gameOver';
          this.gameOver = true;
        }
      }

      // Update game state if available
      this.updateGameState();
    },

    /**
     * Check if next phase button should be enabled
     * @returns {boolean} True if button should be enabled
     */
    isNextPhaseButtonEnabled() {
      // Button is disabled if game is over
      if (this.gameOver) {
        return false;
      }

      // Check if current phase is complete via game state
      if (typeof gameState !== 'undefined' && gameState) {
        if (gameState.isPhaseComplete) {
          return gameState.isPhaseComplete(this.currentPhase);
        }
      }

      // Default: button is enabled
      return true;
    },

    /**
     * Get button text for next phase button
     * @returns {string} Button display text
     */
    getNextPhaseButtonText() {
      if (this.currentPhase === 'scoring' && this.currentRound === this.maxRounds) {
        return 'View Final Scores';
      }
      return 'Next Phase';
    },

    /**
     * Update game state with current component state
     */
    updateGameState() {
      if (typeof gameState !== 'undefined' && gameState) {
        if (gameState.setCurrentPhase) {
          gameState.setCurrentPhase(this.currentPhase);
        }
        if (gameState.setCurrentRound) {
          gameState.setCurrentRound(this.currentRound);
        }
      }
    },

    /**
     * Restart the game
     */
    restartGame() {
      this.currentPhase = 'bidding';
      this.currentRound = 1;
      this.gameOver = false;
      this.playerScores = {};

      // Reset game state if available
      if (typeof gameState !== 'undefined' && gameState) {
        if (gameState.resetGame) {
          gameState.resetGame();
        }
      }
    },

    /**
     * Get winner(s) and their score
     * @returns {object} Object with winners array and winningScore
     */
    getWinner() {
      if (!this.gameOver || !this.playerScores) {
        return { winners: [], winningScore: 0 };
      }

      let maxScore = -Infinity;
      const winners = [];

      for (const [playerName, score] of Object.entries(this.playerScores)) {
        if (score > maxScore) {
          maxScore = score;
          winners.length = 0;
          winners.push(playerName);
        } else if (score === maxScore) {
          winners.push(playerName);
        }
      }

      return { winners, winningScore: maxScore };
    },

    /**
     * Get formatted player scores for display
     * @returns {array} Array of {playerName, score} objects sorted by score descending
     */
    getFormattedScores() {
      if (!this.playerScores) {
        return [];
      }

      return Object.entries(this.playerScores)
        .map(([playerName, score]) => ({
          playerName,
          score,
        }))
        .sort((a, b) => b.score - a.score);
    },
  };
}
/**
 * Game Flow UI Component
 * Manages phase transitions, round tracking, and game completion
 * Integrates with gameState.js for state management
 */

function gameFlowComponent() {
  return {
    // State properties
    currentPhase: 'setup',
    currentRound: 1,
    gamePhases: ['setup', 'play', 'scoring', 'results'],
    isGameComplete: false,
    showCompletionScreen: false,
    finalScores: {},
    
    // Initialize component
    init() {
      // Subscribe to game state updates if available
      if (typeof gameStateManager !== 'undefined') {
        this.syncWithGameState();
      }
    },
    
    // Sync with game state
    syncWithGameState() {
      // Get current state from gameState.js
      if (typeof gameStateManager !== 'undefined' && gameStateManager.getCurrentState) {
        const state = gameStateManager.getCurrentState();
        this.currentPhase = state.currentPhase || 'setup';
        this.currentRound = state.currentRound || 1;
      }
    },
    
    // Get human-readable phase name
    getPhaseLabel() {
      const labels = {
        'setup': 'Setup',
        'play': 'Play',
        'scoring': 'Scoring',
        'results': 'Results'
      };
      return labels[this.currentPhase] || this.currentPhase;
    },
    
    // Check if phase transition button should be shown
    shouldShowNextPhaseButton() {
      if (this.isGameComplete) return false;
      if (this.currentPhase === 'setup') return true;
      if (this.currentPhase === 'play') return true;
      if (this.currentPhase === 'scoring') return true;
      if (this.currentPhase === 'results' && this.currentRound < 10) return true;
      return false;
    },
    
    // Transition to next phase
    transitionToNextPhase() {
      const currentIndex = this.gamePhases.indexOf(this.currentPhase);
      
      if (this.currentPhase === 'results') {
        // After results phase, check if game should end
        if (this.currentRound >= 10) {
          this.completeGame();
          return;
        }
        // Otherwise move to next round's setup phase
        this.currentRound += 1;
        this.currentPhase = 'setup';
      } else if (currentIndex < this.gamePhases.length - 1) {
        // Move to next phase within current round
        this.currentPhase = this.gamePhases[currentIndex + 1];
      }
      
      // Update game state if available
      this.updateGameState();
    },
    
    // Update game state in gameState.js
    updateGameState() {
      if (typeof gameStateManager !== 'undefined' && gameStateManager.updatePhase) {
        gameStateManager.updatePhase(this.currentPhase, this.currentRound);
      }
    },
    
    // Check if current round is last round
    isLastRound() {
      return this.currentRound >= 10;
    },
    
    // Check if current phase is the provided phase
    isPhase(phaseName) {
      return this.currentPhase === phaseName;
    },
    
    // Get phase indicator styles
    getPhaseIndicatorClass(phaseName) {
      return this.currentPhase === phaseName 
        ? 'phase-indicator active' 
        : 'phase-indicator';
    },
    
    // Complete the game
    completeGame() {
      this.isGameComplete = true;
      this.showCompletionScreen = true;
      // Gather final scores from game state if available
      if (typeof gameStateManager !== 'undefined' && gameStateManager.getFinalScores) {
        this.finalScores = gameStateManager.getFinalScores();
      }
    },
    
    // Restart game
    restartGame() {
      this.currentPhase = 'setup';
      this.currentRound = 1;
      this.isGameComplete = false;
      this.showCompletionScreen = false;
      this.finalScores = {};
      
      // Reset game state if available
      if (typeof gameStateManager !== 'undefined' && gameStateManager.resetGame) {
        gameStateManager.resetGame();
      }
      
      this.updateGameState();
    },
    
    // Get button label for next phase
    getNextPhaseButtonLabel() {
      if (this.currentPhase === 'results') {
        if (this.currentRound >= 10) {
          return 'View Final Results';
        }
        return `Start Round ${this.currentRound + 1}`;
      }
      return 'Next Phase';
    },
    
    // Format round number with leading zero
    formatRound(round) {
      return String(round).padStart(2, '0');
    }
  };
}

// Export for use in HTML
window.gameFlowComponent = gameFlowComponent;
