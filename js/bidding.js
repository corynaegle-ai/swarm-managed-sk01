/**
 * Bidding Phase Module
 * Handles bid collection and validation during the bidding phase of the game
 */

// Store current bidding state
let biddingState = {
  roundNumber: 0,
  handCount: 0,
  players: [],
  bids: {},
  validationErrors: {}
};

/**
 * Display the bidding phase UI with round/hand info and input fields for each player
 * @param {number} roundNumber - Current round number
 * @param {number} handCount - Current hand count
 * @param {Array<Object>} players - Array of player objects with id and name properties
 * @returns {void}
 */
function displayBiddingPhase(roundNumber, handCount, players) {
  if (!roundNumber || roundNumber <= 0) {
    console.error('Invalid round number provided to displayBiddingPhase');
    return;
  }

  if (!handCount || handCount <= 0) {
    console.error('Invalid hand count provided to displayBiddingPhase');
    return;
  }

  if (!players || !Array.isArray(players) || players.length === 0) {
    console.error('Invalid players array provided to displayBiddingPhase');
    return;
  }

  // Update bidding state
  biddingState.roundNumber = roundNumber;
  biddingState.handCount = handCount;
  biddingState.players = players;
  biddingState.bids = {};
  biddingState.validationErrors = {};

  // Initialize bids object
  players.forEach(player => {
    biddingState.bids[player.id] = null;
  });

  const appContainer = document.getElementById('app');
  if (!appContainer) {
    console.error('App container not found');
    return;
  }

  // Create bidding phase container
  const biddingContainer = document.createElement('div');
  biddingContainer.id = 'bidding-phase';
  biddingContainer.className = 'bidding-phase';

  // Add header with round and hand info
  const header = document.createElement('div');
  header.className = 'bidding-header';

  const roundInfo = document.createElement('h2');
  roundInfo.textContent = `Round ${roundNumber} - Hand ${handCount}`;
  roundInfo.className = 'bidding-title';
  header.appendChild(roundInfo);

  const instruction = document.createElement('p');
  instruction.textContent = `Enter your bid (0-${roundNumber})`;
  instruction.className = 'bidding-instruction';
  header.appendChild(instruction);

  biddingContainer.appendChild(header);

  // Create form for bid inputs
  const form = document.createElement('form');
  form.id = 'bidding-form';
  form.className = 'bidding-form';

  // Create input field for each player
  players.forEach(player => {
    const playerBidGroup = document.createElement('div');
    playerBidGroup.className = 'bid-input-group';
    playerBidGroup.id = `bid-group-${player.id}`;

    const label = document.createElement('label');
    label.htmlFor = `bid-input-${player.id}`;
    label.textContent = player.name;
    label.className = 'bid-label';
    playerBidGroup.appendChild(label);

    const input = document.createElement('input');
    input.type = 'number';
    input.id = `bid-input-${player.id}`;
    input.name = `bid-${player.id}`;
    input.min = '0';
    input.max = roundNumber;
    input.className = 'bid-input';
    input.placeholder = `0-${roundNumber}`;
    input.dataset.playerId = player.id;

    // Add validation on input/change events
    input.addEventListener('change', function () {
      validateBid(player.id, this.value);
    });

    input.addEventListener('input', function () {
      validateBid(player.id, this.value);
    });

    playerBidGroup.appendChild(input);

    // Create error message container
    const errorMsg = document.createElement('span');
    errorMsg.id = `error-${player.id}`;
    errorMsg.className = 'bid-error';
    playerBidGroup.appendChild(errorMsg);

    form.appendChild(playerBidGroup);
  });

  biddingContainer.appendChild(form);

  // Clear previous content and append bidding phase
  appContainer.innerHTML = '';
  appContainer.appendChild(biddingContainer);
}

/**
 * Validate a bid for a specific player
 * @param {string|number} playerId - The ID of the player
 * @param {number|string} bidValue - The bid value to validate
 * @returns {boolean} - True if bid is valid, false otherwise
 */
function validateBid(playerId, bidValue) {
  const bidNum = parseInt(bidValue, 10);
  const inputElement = document.getElementById(`bid-input-${playerId}`);
  const errorElement = document.getElementById(`error-${playerId}`);

  if (!inputElement || !errorElement) {
    console.error(`Bid input elements not found for player ${playerId}`);
    return false;
  }

  // Check if bid is empty
  if (bidValue === '' || bidValue === null || bidValue === undefined) {
    errorElement.textContent = 'Bid is required';
    biddingState.validationErrors[playerId] = 'Bid is required';
    biddingState.bids[playerId] = null;
    inputElement.classList.add('invalid');
    return false;
  }

  // Check if bid is a valid number
  if (isNaN(bidNum)) {
    errorElement.textContent = 'Bid must be a number';
    biddingState.validationErrors[playerId] = 'Bid must be a number';
    biddingState.bids[playerId] = null;
    inputElement.classList.add('invalid');
    return false;
  }

  // Check if bid is within valid range (0 to round number)
  if (bidNum < 0 || bidNum > biddingState.roundNumber) {
    errorElement.textContent = `Bid must be between 0 and ${biddingState.roundNumber}`;
    biddingState.validationErrors[playerId] = `Bid must be between 0 and ${biddingState.roundNumber}`;
    biddingState.bids[playerId] = null;
    inputElement.classList.add('invalid');
    return false;
  }

  // Bid is valid
  errorElement.textContent = '';
  delete biddingState.validationErrors[playerId];
  biddingState.bids[playerId] = bidNum;
  inputElement.classList.remove('invalid');
  return true;
}

/**
 * Collect all bids from players and validate they are complete
 * @returns {Object|null} - Object with player IDs as keys and bid values, or null if validation fails
 */
function collectAllBids() {
  // Check if all players have entered valid bids
  const allBidsValid = biddingState.players.every(player => {
    const bidValue = biddingState.bids[player.id];
    return bidValue !== null && bidValue !== undefined && !isNaN(bidValue);
  });

  if (!allBidsValid) {
    // Find which players are missing bids and mark them
    biddingState.players.forEach(player => {
      if (biddingState.bids[player.id] === null || biddingState.bids[player.id] === undefined) {
        const inputElement = document.getElementById(`bid-input-${player.id}`);
        const errorElement = document.getElementById(`error-${player.id}`);
        
        if (inputElement && errorElement) {
          inputElement.classList.add('invalid');
          errorElement.textContent = 'Bid is required';
        }
      }
    });
    console.warn('Cannot proceed: not all players have entered valid bids');
    return null;
  }

  // Return copy of collected bids
  return { ...biddingState.bids };
}

/**
 * Get current bidding state (for debugging/testing)
 * @returns {Object} - Current bidding state
 */
function getBiddingState() {
  return { ...biddingState };
}

// Export functions for use in main game flow
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    displayBiddingPhase,
    validateBid,
    collectAllBids,
    getBiddingState
  };
}
