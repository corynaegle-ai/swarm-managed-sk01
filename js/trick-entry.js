// Trick entry form management with Alpine.js

function trickEntryForm() {
  return {
    gameState: null,
    players: [],
    currentRound: 1,
    validationErrors: [],
    remainingTricks: 0,
    isFormValid: false,

    init() {
      // Initialize reference to global gameState
      if (typeof gameState !== 'undefined' && gameState !== null) {
        this.gameState = gameState;
        this.players = this.gameState.players;
        this.currentRound = this.gameState.currentRound;
        this.updateRemainingTricks();
      } else {
        console.error('Global gameState not initialized');
      }
    },

    isBidCorrect(playerId) {
      if (!this.gameState) {
        return false;
      }
      return this.gameState.isBidCorrect(playerId);
    },

    updateBonusPoints(playerId, value) {
      if (!this.gameState) {
        console.error('gameState not initialized');
        return;
      }

      try {
        // Convert empty string to 0, otherwise parse as integer
        let amount = value === '' ? 0 : parseInt(value, 10);

        // Validate is a number
        if (isNaN(amount)) {
          console.error('Invalid bonus amount');
          return;
        }

        // Use the public API with validation
        this.gameState.setBonusPoints(playerId, amount);

        // Trigger reactivity update
        this.$nextTick(() => {
          this.validateForm();
        });
      } catch (error) {
        console.error('Error setting bonus points:', error.message);
      }
    },

    updateRemainingTricks() {
      // Placeholder - implement based on game rules
      // Typically remaining tricks = total tricks - tricks bid
      this.remainingTricks = 0;
    },

    validateForm() {
      this.validationErrors = [];
      this.isFormValid = true;

      // Validate all bids are set
      if (this.players.some(p => p.bid === 0 || p.bid === null)) {
        this.validationErrors.push('All players must have a bid');
        this.isFormValid = false;
      }

      // Validate bonus points are non-negative numbers
      for (const player of this.players) {
        if (player.bonusPoints < 0) {
          this.validationErrors.push(`${player.name} has negative bonus points`);
          this.isFormValid = false;
        }
      }

      return this.isFormValid;
    },

    submitTrickEntry() {
      if (!this.validateForm()) {
        return;
      }

      // Dispatch custom event for parent to handle submission
      const event = new CustomEvent('trickEntrySubmit', {
        detail: {
          round: this.currentRound,
          players: this.players.map(p => ({
            id: p.id,
            name: p.name,
            bid: p.bid,
            tricksWon: p.tricksWon,
            bonusPoints: p.bonusPoints
          }))
        }
      });
      document.dispatchEvent(event);
    }
  };
}
