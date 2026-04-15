/**
 * Trick Entry Form Component
 * Manages player trick input, validation, and real-time remaining tricks calculation
 */

function trickEntryForm() {
  return {
    // Reactive state
    players: [
      { id: 1, name: 'Player 1', tricks: null },
      { id: 2, name: 'Player 2', tricks: null },
      { id: 3, name: 'Player 3', tricks: null },
      { id: 4, name: 'Player 4', tricks: null },
    ],
    currentRound: 1,
    tricksAvailableThisRound: 13, // Will be set dynamically
    validationErrors: [],

    /**
     * Getter for remaining tricks calculation
     * Subtracts all player trick entries from available tricks
     */
    get remainingTricks() {
      const totalTricksTaken = this.players.reduce((sum, player) => {
        const tricks = parseInt(player.tricks) || 0;
        return sum + (tricks >= 0 ? tricks : 0);
      }, 0);
      return this.tricksAvailableThisRound - totalTricksTaken;
    },

    /**
     * Computed property for form validation
     * Form is valid when:
     * - All players have entered a value
     * - All values are non-negative
     * - Total tricks don't exceed available tricks
     * - No validation errors exist
     */
    get isFormValid() {
      // Check if all players have entered a value
      const allPlayersHaveInput = this.players.every(
        (player) => player.tricks !== null && player.tricks !== ''
      );

      if (!allPlayersHaveInput) {
        return false;
      }

      // Check if all values are non-negative numbers
      const allValidNumbers = this.players.every((player) => {
        const tricks = parseInt(player.tricks);
        return !isNaN(tricks) && tricks >= 0;
      });

      if (!allValidNumbers) {
        return false;
      }

      // Check if total doesn't exceed available tricks
      return this.remainingTricks >= 0 && this.validationErrors.length === 0;
    },

    /**
     * Initialize form for a new round
     * Called when transitioning to trick entry phase
     */
    initializeRound(roundNumber, tricksAvailable, playerList) {
      this.currentRound = roundNumber;
      this.tricksAvailableThisRound = tricksAvailable;

      // Reset players if custom list provided
      if (playerList && Array.isArray(playerList)) {
        this.players = playerList.map((player, index) => ({
          id: player.id || index + 1,
          name: player.name || `Player ${index + 1}`,
          tricks: null,
        }));
      } else {
        // Reset tricks for current players
        this.players.forEach((player) => {
          player.tricks = null;
        });
      }

      this.validationErrors = [];
    },

    /**
     * Validate trick entry
     * Checks for logical errors in the trick entry
     */
    validateTrickEntry() {
      this.validationErrors = [];

      // Check for missing values
      this.players.forEach((player) => {
        if (player.tricks === null || player.tricks === '') {
          this.validationErrors.push(
            `${player.name} must enter the number of tricks taken.`
          );
        }
      });

      // Check for invalid numbers
      this.players.forEach((player) => {
        if (player.tricks !== null && player.tricks !== '') {
          const tricks = parseInt(player.tricks);
          if (isNaN(tricks)) {
            this.validationErrors.push(
              `${player.name}'s trick count must be a valid number.`
            );
          } else if (tricks < 0) {
            this.validationErrors.push(
              `${player.name}'s trick count cannot be negative.`
            );
          }
        }
      });

      // Check if total exceeds available tricks
      if (this.remainingTricks < 0) {
        this.validationErrors.push(
          `Total tricks exceed available tricks (${this.tricksAvailableThisRound}). Reduce entries by ${Math.abs(this.remainingTricks)}.`
        );
      }

      return this.validationErrors.length === 0;
    },

    /**
     * Submit trick entry form
     * Validates and processes trick entries
     */
    submitTrickEntry() {
      // Validate before submission
      if (!this.validateTrickEntry()) {
        console.warn('Trick entry validation failed:', this.validationErrors);
        return;
      }

      // Build submission data
      const trickData = {
        round: this.currentRound,
        tricks: this.players.map((player) => ({
          playerId: player.id,
          playerName: player.name,
          tricksTaken: parseInt(player.tricks),
        })),
        timestamp: new Date().toISOString(),
      };

      // Dispatch custom event for parent component to handle
      const event = new CustomEvent('tricksSubmitted', {
        detail: trickData,
        bubbles: true,
        cancelable: false,
      });
      document.getElementById('trick-entry-form').dispatchEvent(event);

      // Reset form for next round
      this.resetForm();
    },

    /**
     * Reset form to initial state
     */
    resetForm() {
      this.players.forEach((player) => {
        player.tricks = null;
      });
      this.validationErrors = [];
    },

    /**
     * Show the form
     */
    showForm() {
      document.getElementById('trick-entry-form').style.display = 'block';
    },

    /**
     * Hide the form
     */
    hideForm() {
      document.getElementById('trick-entry-form').style.display = 'none';
    },
  };
}
