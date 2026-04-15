/**
 * Trick Entry Form Component
 * Manages player trick input, validation, and submission
 */

function trickEntryForm() {
  return {
    // Component state
    players: [],
    currentRound: 1,
    tricksAvailableThisRound: 0,
    validationErrors: [],
    shouldDisplayForm: false,
    gameState: null,

    /**
     * Initialize the form for a new round
     * @param {number} roundNumber - Current round number
     * @param {Array} playerList - List of players with {id, name}
     * @param {number} tricksAvailable - Total tricks available in this round
     */
    initializeRound(roundNumber, playerList, tricksAvailable) {
      this.currentRound = roundNumber;
      this.tricksAvailableThisRound = tricksAvailable;
      
      // Initialize players with tricks property
      this.players = playerList.map(player => ({
        ...player,
        tricks: null
      }));
      
      // Clear previous errors and show form
      this.validationErrors = [];
      this.shouldDisplayForm = true;
    },

    /**
     * Hide the trick entry form
     */
    hideForm() {
      this.shouldDisplayForm = false;
    },

    /**
     * Calculate remaining tricks that need to be assigned
     */
    get remainingTricks() {
      const total = this.players.reduce((sum, player) => {
        const tricks = player.tricks === null || player.tricks === '' ? 0 : Number(player.tricks);
        return sum + tricks;
      }, 0);
      return this.tricksAvailableThisRound - total;
    },

    /**
     * Validate that all tricks are accounted for and all players have entered tricks
     */
    validateTrickEntry() {
      this.validationErrors = [];

      // Check all players have entered a value
      this.players.forEach(player => {
        if (player.tricks === null || player.tricks === '') {
          this.validationErrors.push(`${player.name} must enter a trick count`);
        } else if (Number(player.tricks) < 0) {
          this.validationErrors.push(`${player.name}'s tricks cannot be negative`);
        }
      });

      // Check remaining tricks must be exactly 0 (all tricks accounted for)
      if (this.remainingTricks !== 0) {
        if (this.remainingTricks > 0) {
          this.validationErrors.push(
            `${this.remainingTricks} tricks not yet assigned. All tricks must be accounted for.`
          );
        } else {
          this.validationErrors.push(
            `Too many tricks entered (${Math.abs(this.remainingTricks)} over limit). Total cannot exceed ${this.tricksAvailableThisRound}.`
          );
        }
      }
    },

    /**
     * Check if form is valid (can submit)
     */
    get isFormValid() {
      // Must have no validation errors
      // and remaining tricks must be exactly 0
      return this.validationErrors.length === 0 && this.remainingTricks === 0;
    },

    /**
     * Submit trick entry and dispatch event
     */
    submitTrickEntry() {
      // Validate before submission
      this.validateTrickEntry();

      // If validation failed, don't submit
      if (!this.isFormValid) {
        return;
      }

      // Prepare submission data
      const trickData = {
        round: this.currentRound,
        tricks: Object.fromEntries(
          this.players.map(player => [player.id, Number(player.tricks)])
        )
      };

      // Dispatch custom event with trick data
      const formElement = document.getElementById('trick-entry-form');
      if (formElement) {
        const event = new CustomEvent('tricksSubmitted', {
          detail: trickData,
          bubbles: true,
          cancelable: true
        });
        formElement.dispatchEvent(event);
      } else {
        // Fallback: dispatch on document if form element not found
        const event = new CustomEvent('tricksSubmitted', {
          detail: trickData,
          bubbles: true,
          cancelable: true
        });
        document.dispatchEvent(event);
      }

      // Hide form after successful submission
      this.hideForm();
    },

    /**
     * Handle input change for a player's trick count
     * Real-time validation
     */
    handlePlayerInput(playerId) {
      // Validate in real-time as user types
      this.validateTrickEntry();
    }
  };
}
