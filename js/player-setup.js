// Player Setup Form Validation and Management

const MAX_PLAYERS = 8;
const MIN_PLAYERS = 2;

let players = [];

const playerNameInput = document.getElementById('player-name');
const addPlayerBtn = document.getElementById('add-player-btn');
const playersList = document.getElementById('players-list');
const playerCountDisplay = document.getElementById('player-count');
const errorMessageDisplay = document.getElementById('error-message');
const startGameBtn = document.getElementById('start-game-btn');
const playerForm = document.getElementById('player-form');

/**
 * Update the players list display
 */
function updatePlayersList() {
    playersList.innerHTML = '';
    
    if (players.length === 0) {
        // Display empty state - handled by CSS
        return;
    }
    
    players.forEach((player, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'player-item';
        
        const playerText = document.createElement('span');
        playerText.className = 'player-item-text';
        playerText.textContent = player;
        
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'btn btn-danger';
        removeBtn.textContent = 'Remove';
        removeBtn.addEventListener('click', () => removePlayer(index));
        
        listItem.appendChild(playerText);
        listItem.appendChild(removeBtn);
        playersList.appendChild(listItem);
    });
}

/**
 * Update the player count display
 */
function updatePlayerCount() {
    playerCountDisplay.textContent = players.length;
}

/**
 * Update button states based on player count
 */
function updateButtonStates() {
    // Disable add button when max players reached
    addPlayerBtn.disabled = players.length >= MAX_PLAYERS;
    
    // Disable start button when less than min players
    startGameBtn.disabled = players.length < MIN_PLAYERS;
}

/**
 * Validate player name
 * @param {string} name - The player name to validate
 * @returns {string|null} - Error message or null if valid
 */
function validatePlayerName(name) {
    const trimmedName = name.trim();
    
    // Check if empty
    if (!trimmedName) {
        return 'Player name cannot be empty';
    }
    
    // Check if duplicate (case-insensitive)
    const isDuplicate = players.some(
        player => player.toLowerCase() === trimmedName.toLowerCase()
    );
    if (isDuplicate) {
        return 'This player name already exists';
    }
    
    // Check max players
    if (players.length >= MAX_PLAYERS) {
        return `Maximum of ${MAX_PLAYERS} players reached`;
    }
    
    return null;
}

/**
 * Add a new player
 */
function addPlayer() {
    const name = playerNameInput.value.trim();
    const error = validatePlayerName(name);
    
    if (error) {
        errorMessageDisplay.textContent = error;
        playerNameInput.focus();
        return;
    }
    
    // Add player and clear form
    players.push(name);
    playerNameInput.value = '';
    errorMessageDisplay.textContent = '';
    playerNameInput.focus();
    
    // Update UI
    updatePlayersList();
    updatePlayerCount();
    updateButtonStates();
}

/**
 * Remove a player at specific index
 * @param {number} index - Index of player to remove
 */
function removePlayer(index) {
    players.splice(index, 1);
    updatePlayersList();
    updatePlayerCount();
    updateButtonStates();
    playerNameInput.focus();
}

/**
 * Initialize event listeners
 */
function initializeEventListeners() {
    // Add player button click
    addPlayerBtn.addEventListener('click', addPlayer);
    
    // Enter key in input field
    playerNameInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            addPlayer();
        }
    });
    
    // Clear error message when typing
    playerNameInput.addEventListener('input', () => {
        errorMessageDisplay.textContent = '';
    });
    
    // Start game button
    startGameBtn.addEventListener('click', () => {
        if (players.length >= MIN_PLAYERS) {
            // Dispatch custom event or navigate to game
            // For now, just log and alert
            console.log('Starting game with players:', players);
            alert(`Game starting with ${players.length} players: ${players.join(', ')}`);
            // TODO: Navigate to game screen or emit event
        }
    });
    
    // Prevent form submission on Enter
    playerForm.addEventListener('submit', (event) => {
        event.preventDefault();
    });
}

/**
 * Initialize the player setup UI
 */
function initializePlayerSetup() {
    initializeEventListeners();
    updatePlayersList();
    updatePlayerCount();
    updateButtonStates();
    playerNameInput.focus();
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePlayerSetup);
} else {
    initializePlayerSetup();
}