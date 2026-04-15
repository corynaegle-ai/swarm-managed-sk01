/**
 * Trick Entry Form Controller
 * Manages player trick entry with validation
 */

/**
 * Alpine.js component for trick entry form
 */
function trickEntryForm() {
  return {
    currentRound: 1,
    roundNumber: 1,
    trickEntries: {},
    validationErrors: [],
    numPlayers: 0,
    isSubmitting: false,
    submitMessage: '',
    submitMessageType: 'success',

    /**
     * Initialize the trick entry form for a given round
     * @param {number} roundNum - The current round number
     * @param {number} playerCount - Number of players in the game
     */
    init(roundNum, playerCount) {
      this.currentRound = roundNum;
      this.roundNumber = roundNum;
      this.numPlayers = playerCount;
      this.trickEntries = {};
      this.validationErrors = [];
      this.isSubmitting = false;
      this.submitMessage = '';
      
      // Initialize trick entries for each player
      for (let i = 0; i < playerCount; i++) {
        this.$watch(`trickEntries.player${i}`, () => {
          this.validateForm();
        });
      }
      
      this.renderTrickInputs();
    },

    /**
     * Render trick input fields for each player
     */
    renderTrickInputs() {
      const container = document.getElementById('trick-inputs');
      if (!container) return;
      
      container.innerHTML = '';
      
      for (let i = 0; i < this.numPlayers; i++) {
        const playerDiv = document.createElement('div');
        playerDiv.style.marginBottom = '1rem';
        
        const label = document.createElement('label');
        label.htmlFor = `player-${i}-tricks`;
        label.style.display = 'block';
        label.style.marginBottom = '0.5rem';
        label.style.fontWeight = 'bold';
        label.textContent = `Player ${i + 1} Tricks:`;
        
        const input = document.createElement('input');
        input.type = 'number';
        input.id = `player-${i}-tricks`;
        input.min = '0';
        input.max = this.roundNumber;
        input.style.padding = '0.5rem';
        input.style.fontSize = '1rem';
        input.style.width = '100px';
        input.value = this.trickEntries[`player${i}`] || '';
        
        input.addEventListener('input', (e) => {
          this.trickEntries[`player${i}`] = parseInt(e.target.value) || 0;
          this.validateForm();
        });
        
        playerDiv.appendChild(label);
        playerDiv.appendChild(input);
        container.appendChild(playerDiv);
      }
    },

    /**
     * Calculate remaining tricks that can be entered
     * @returns {number} Remaining tricks available
     */
    get remainingTricks() {
      let totalEntered = 0;
      for (let i = 0; i < this.numPlayers; i++) {
        totalEntered += this.trickEntries[`player${i}`] || 0;
      }
      // Prevent negative values
      return Math.max(0, this.roundNumber - totalEntered);
    },

    /**
     * Validate individual trick entry doesn't exceed remaining tricks
     * @param {number} playerIndex - Index of the player
     * @param {number} tricks - Number of tricks entered
     * @returns {boolean} True if valid
     */
    validateTrickEntry(playerIndex, tricks) {
      if (tricks < 0) return false;
      
      // Calculate remaining tricks excluding this player's current entry
      let totalEntered = 0;
      for (let i = 0; i < this.numPlayers; i++) {
        if (i !== playerIndex) {
          totalEntered += this.trickEntries[`player${i}`] || 0;
        }
      }
      
      // Check if this player's entry would exceed the round number
      if (totalEntered + tricks > this.roundNumber) {
        return false;
      }
      
      return true;
    },

    /**
     * Validate that total tricks equals round number
     * @returns {boolean} True if total equals round number
     */
    validateTotalTricks() {
      let total = 0;
      for (let i = 0; i < this.numPlayers; i++) {
        total += this.trickEntries[`player${i}`] || 0;
      }
      return total === this.roundNumber;
    },

    /**
     * Show validation errors
     */
    showValidationErrors() {
      this.validationErrors = [];
      
      // Check individual entries
      for (let i = 0; i < this.numPlayers; i++) {
        const tricks = this.trickEntries[`player${i}`] || 0;
        
        if (tricks < 0) {
          this.validationErrors.push(`Player ${i + 1}: Tricks cannot be negative`);
        }
        
        if (!this.validateTrickEntry(i, tricks)) {
          this.validationErrors.push(`Player ${i + 1}: Entry exceeds remaining tricks available`);
        }
      }
      
      // Check total
      const total = Object.values(this.trickEntries).reduce((sum, val) => sum + (val || 0), 0);
      if (total !== this.roundNumber) {
        this.validationErrors.push(`Total tricks (${total}) must equal round number (${this.roundNumber})`);
      }
    },

    /**
     * Validate the entire form
     */
    validateForm() {
      this.showValidationErrors();
    },

    /**
     * Check if form is valid
     * @returns {boolean} True if form is valid
     */
    get isFormValid() {
      if (this.validationErrors.length > 0) return false;
      
      // All players must have entries
      for (let i = 0; i < this.numPlayers; i++) {
        if (!(this.trickEntries[`player${i}`] >= 0)) {
          return false;
        }
      }
      
      return this.validateTotalTricks();
    },

    /**
     * Submit trick entries and trigger game state update
     * Saves tricks to game state, calculates scores, and advances round
     */
    submitTricks() {
      // Validate form before submission
      this.validateForm();
      
      if (!this.isFormValid) {
        this.submitMessage = 'Please fix validation errors before submitting';
        this.submitMessageType = 'error';
        return;
      }
      
      this.isSubmitting = true;
      this.submitMessage = '';

      try {
        // Create event with trick data to be saved to game state
        const trickSubmissionEvent = new CustomEvent('trickSubmission', {
          detail: {
            round: this.currentRound,
            tricks: { ...this.trickEntries },
            timestamp: new Date().toISOString()
          },
          bubbles: true,
          cancelable: true
        });

        // Dispatch event for game state manager to intercept
        const eventDispatched = document.dispatchEvent(trickSubmissionEvent);
        
        if (eventDispatched) {
          // Event was not prevented, show success feedback
          this.submitMessage = `✓ Tricks submitted successfully for Round ${this.currentRound}`;
          this.submitMessageType = 'success';
          
          // Clear form for next round after brief delay
          setTimeout(() => {
            this.trickEntries = {};
            this.validationErrors = [];
            this.submitMessage = '';
            this.isSubmitting = false;
          }, 2000);
        } else {
          // Event was prevented by handler, likely an error
          this.submitMessage = 'Error submitting tricks. Please try again.';
          this.submitMessageType = 'error';
          this.isSubmitting = false;
        }
      } catch (error) {
        console.error('Error submitting tricks:', error);
        this.submitMessage = `Error: ${error.message}`;
        this.submitMessageType = 'error';
        this.isSubmitting = false;
      }
    },

    /**
     * Reset form for a new round
     * @param {number} roundNum - New round number
     */
    resetForNextRound(roundNum) {
      this.currentRound = roundNum;
      this.roundNumber = roundNum;
      this.trickEntries = {};
      this.validationErrors = [];
      this.submitMessage = '';
      this.isSubmitting = false;
      this.renderTrickInputs();
    }
  };
}

/**
 * Export for testing and external use
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = trickEntryForm;
}
