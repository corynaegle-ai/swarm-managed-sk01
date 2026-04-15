/**
 * gameFlow.js - Alpine.js component for managing game flow UI
 * Integrates with gameState.js for state management
 * Handles phase transitions, round tracking, and game completion
 */

function gameFlowComponent() {
  return {
    // State
    currentPhase: 'setup',
    currentRound: 1,
    maxRounds: 10,
    phases: ['setup', 'play', 'scoring', 'results'],
    showCompletionScreen: false,
    gameRestarting: false,

    // Initialization
    init() {
      // Initialize with gameState if available
      if (typeof gameStateManager !== 'undefined' && gameStateManager) {
        this.currentPhase = gameStateManager.getCurrentPhase() || 'setup';
        this.currentRound = gameStateManager.getCurrentRound() || 1;
      }
    },

    // Phase Management
    /**
     * Get the current phase
     */
    getCurrentPhase() {
      return this.currentPhase;
    },

    /**
     * Get the current round number
     */
    getCurrentRound() {
      return this.currentRound;
    },

    /**
     * Get all phases for display
     */
    getPhases() {
      return this.phases;
    },

    /**
     * Check if a given phase is the current phase
     */
    isCurrentPhase(phase) {
      return this.currentPhase === phase;
    },

    /**
     * Check if this is the last round
     */
    isLastRound() {
      return this.currentRound >= this.maxRounds;
    },

    /**
     * Check if game is complete
     */
    isGameComplete() {
      return this.showCompletionScreen;
    },

    /**
     * Advance to the next phase
     */
    nextPhase() {
      const currentIndex = this.phases.indexOf(this.currentPhase);
      
      if (currentIndex === -1) {
        console.error(`Unknown phase: ${this.currentPhase}`);
        return;
      }

      if (currentIndex === this.phases.length - 1) {
        // We're at the last phase, move to next round or complete game
        this.nextRound();
      } else {
        // Move to next phase
        this.currentPhase = this.phases[currentIndex + 1];
        this.syncWithGameState();
      }
    },

    /**
     * Advance to the next round
     */
    nextRound() {
      if (this.currentRound >= this.maxRounds) {
        // Game is complete
        this.completeGame();
      } else {
        // Move to next round, reset to setup phase
        this.currentRound += 1;
        this.currentPhase = 'setup';
        this.syncWithGameState();
      }
    },

    /**
     * Complete the game and show completion screen
     */
    completeGame() {
      this.currentPhase = 'results';
      this.showCompletionScreen = true;
      this.syncWithGameState();
    },

    /**
     * Restart the game
     */
    restartGame() {
      this.gameRestarting = true;
      this.currentRound = 1;
      this.currentPhase = 'setup';
      this.showCompletionScreen = false;
      this.syncWithGameState();
      this.gameRestarting = false;
    },

    /**
     * Determine if the next phase button should be visible
     */
    shouldShowNextPhaseButton() {
      // Don't show button during game restart
      if (this.gameRestarting) {
        return false;
      }
      // Always show during normal game flow (not on completion screen)
      return !this.showCompletionScreen;
    },

    /**
     * Get the label for the next phase button
     */
    getNextPhaseButtonLabel() {
      const currentIndex = this.phases.indexOf(this.currentPhase);
      if (currentIndex === this.phases.length - 1) {
        if (this.isLastRound()) {
          return 'Complete Game';
        } else {
          return 'Next Round';
        }
      }
      return 'Next Phase';
    },

    /**
     * Sync state with gameState.js if available
     */
    syncWithGameState() {
      if (typeof gameStateManager !== 'undefined' && gameStateManager) {
        if (gameStateManager.setCurrentPhase && typeof gameStateManager.setCurrentPhase === 'function') {
          gameStateManager.setCurrentPhase(this.currentPhase);
        }
        if (gameStateManager.setCurrentRound && typeof gameStateManager.setCurrentRound === 'function') {
          gameStateManager.setCurrentRound(this.currentRound);
        }
      }
    },

    /**
     * Get CSS class for phase indicator styling
     */
    getPhaseIndicatorClass(phase) {
      const baseClass = 'phase-indicator';
      const isCurrentClass = this.isCurrentPhase(phase) ? 'phase-current' : '';
      return `${baseClass} ${isCurrentClass}`.trim();
    }
  };
}
