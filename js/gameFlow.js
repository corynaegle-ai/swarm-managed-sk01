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
