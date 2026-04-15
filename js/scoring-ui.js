/**
 * Scoring UI Component
 * Provides Alpine.js integration for real-time score calculation and display
 * Imports and uses scoring.js and game.js modules
 */

// Import scoring utilities (assumed to be available from scoring.js)
function calculateScore(bid, tricks, baseMultiplier = 10) {
    const baseScore = bid * baseMultiplier;
    let bonus = 0;

    if (bid === tricks) {
        // Bonus for making the exact bid
        bonus = 20;
    } else if (tricks > bid) {
        // Penalty for overtricks
        bonus = -(tricks - bid) * 5;
    } else {
        // Penalty for undertricks
        bonus = -(bid - tricks) * 5;
    }

    return {
        baseScore,
        bonus,
        total: Math.max(0, baseScore + bonus)
    };
}

/**
 * Main scoring app Alpine.js component
 */
function scoringApp() {
    return {
        // State
        players: [
            { name: 'Alice', id: 1 },
            { name: 'Bob', id: 2 },
            { name: 'Charlie', id: 3 },
            { name: 'Diana', id: 4 }
        ],
        currentRound: 1,
        totalRounds: 10,
        maxTricks: 13,
        
        // Form state
        playerBids: [],
        playerTricks: [],
        playerBidErrors: [],
        playerTrickErrors: [],
        globalErrors: [],
        
        // Calculated scores and history
        lastCalculatedScores: [],
        scoreHistory: [],
        
        // Alert state
        alert: {
            show: false,
            type: 'success', // 'success' or 'error'
            message: ''
        },

        /**
         * Initialize component
         */
        init() {
            this.initializePlayerArrays();
        },

        /**
         * Initialize empty arrays for player inputs
         */
        initializePlayerArrays() {
            this.playerBids = new Array(this.players.length).fill(null);
            this.playerTricks = new Array(this.players.length).fill(null);
            this.playerBidErrors = new Array(this.players.length).fill('');
            this.playerTrickErrors = new Array(this.players.length).fill('');
        },

        /**
         * Validate a single player's bid
         */
        validatePlayerBid(index) {
            const bid = this.playerBids[index];
            this.playerBidErrors[index] = '';

            if (bid === null || bid === '') {
                return;
            }

            if (bid < 0) {
                this.playerBidErrors[index] = 'Bid cannot be negative';
                return;
            }

            if (bid > this.maxTricks) {
                this.playerBidErrors[index] = `Bid cannot exceed ${this.maxTricks} tricks`;
                return;
            }

            if (!Number.isInteger(bid)) {
                this.playerBidErrors[index] = 'Bid must be a whole number';
                return;
            }
        },

        /**
         * Validate a single player's tricks taken
         */
        validatePlayerTricks(index) {
            const tricks = this.playerTricks[index];
            this.playerTrickErrors[index] = '';

            if (tricks === null || tricks === '') {
                return;
            }

            if (tricks < 0) {
                this.playerTrickErrors[index] = 'Tricks cannot be negative';
                return;
            }

            if (tricks > this.maxTricks) {
                this.playerTrickErrors[index] = `Tricks cannot exceed ${this.maxTricks}`;
                return;
            }

            if (!Number.isInteger(tricks)) {
                this.playerTrickErrors[index] = 'Tricks must be a whole number';
                return;
            }
        },

        /**
         * Validate all inputs
         */
        validateAllInputs() {
            this.globalErrors = [];

            // Validate all individual inputs
            for (let i = 0; i < this.players.length; i++) {
                this.validatePlayerBid(i);
                this.validatePlayerTricks(i);
            }

            // Check if all players have entries
            const incompleteCount = this.players.filter((_, i) => 
                this.playerBids[i] === null || this.playerTricks[i] === null
            ).length;

            if (incompleteCount > 0) {
                this.globalErrors.push(`${incompleteCount} player(s) missing bid or trick count`);
            }

            // Check for field errors
            const bidErrors = this.playerBidErrors.filter(e => e).length;
            const trickErrors = this.playerTrickErrors.filter(e => e).length;

            if (bidErrors > 0) {
                this.globalErrors.push(`${bidErrors} bid validation error(s)`);
            }

            if (trickErrors > 0) {
                this.globalErrors.push(`${trickErrors} trick validation error(s)`);
            }

            return this.globalErrors.length === 0;
        },

        /**
         * Submit scores for calculation
         */
        submitScores() {
            if (!this.validateAllInputs()) {
                this.showAlert('Please fix the validation errors above', 'error');
                return;
            }

            // Calculate scores
            this.lastCalculatedScores = [];
            
            for (let i = 0; i < this.players.length; i++) {
                const bid = this.playerBids[i];
                const tricks = this.playerTricks[i];
                const scoreCalc = calculateScore(bid, tricks);

                this.lastCalculatedScores.push({
                    playerIndex: i,
                    bid,
                    tricks,
                    ...scoreCalc
                });

                // Add to history
                this.scoreHistory.push({
                    round: this.currentRound,
                    playerName: this.players[i].name,
                    bid,
                    tricks,
                    baseScore: scoreCalc.baseScore,
                    bonus: scoreCalc.bonus,
                    total: scoreCalc.total
                });
            }

            this.showAlert(`Round ${this.currentRound} scores calculated successfully!`, 'success');
        },

        /**
         * Reset form for current round
         */
        resetForm() {
            this.playerBids = new Array(this.players.length).fill(null);
            this.playerTricks = new Array(this.players.length).fill(null);
            this.playerBidErrors = new Array(this.players.length).fill('');
            this.playerTrickErrors = new Array(this.players.length).fill('');
            this.globalErrors = [];
            this.lastCalculatedScores = [];
            this.alert.show = false;
        },

        /**
         * Show alert message
         */
        showAlert(message, type = 'success') {
            this.alert = {
                show: true,
                type,
                message
            };

            // Auto-hide success alerts after 5 seconds
            if (type === 'success') {
                setTimeout(() => {
                    this.alert.show = false;
                }, 5000);
            }
        }
    };
}

// Make the component available globally for Alpine.js
window.scoringApp = scoringApp;