// Alpine.js component for trick entry form

function trickEntryForm() {
  return {
    players: [],
    currentRound: 1,
    validationErrors: [],
    remainingTricks: 0,
    isFormValid: false,
    gameState: null,

    init() {
      // Initialize with game state if available
      if (typeof gameState !== 'undefined') {
        this.gameState = gameState;
        this.players = gameState.players;
        this.currentRound = gameState.currentRound;
      }
    },

    isBidCorrect(playerId) {
      if (!this.gameState) {
        return false;
      }
      return this.gameState.isBidCorrect(playerId);
    },

    updateBonusPoints(playerId, value) {
      // Parse the string value to a number
      const amount = parseInt(value, 10);

      // Validate the input
      if (isNaN(amount)) {
        console.error('Invalid bonus points: not a number');
        return;
      }

      if (amount < 0) {
        console.error('Bonus points cannot be negative');
        return;
      }

      // Update the player's bonus points directly
      const player = this.gameState.getPlayer(playerId);
      if (player) {
        player.bonusPoints = amount;
      }
    },

    submitTrickEntry() {
      this.validationErrors = [];

      // Validate all inputs before submission
      if (this.gameState) {
        this.gameState.calculateAllScores();
      }

      // If no validation errors, form is valid
      if (this.validationErrors.length === 0) {
        console.log('Form submitted successfully');
        // Form submission logic here
      }
    }
  };
}
