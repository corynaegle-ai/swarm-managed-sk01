/**
 * Player Setup Module
 * Handles player form validation, adding/removing players, and game start logic
 */

(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        MIN_PLAYERS: 2,
        MAX_PLAYERS: 8,
        MIN_NAME_LENGTH: 1,
        MAX_NAME_LENGTH: 50
    };
    
    // State
    const state = {
        players: []
    };
    
    // DOM Elements
    const elements = {
        playerNameInput: null,
        addPlayerBtn: null,
        playersList: null,
        playerCount: null,
        startGameBtn: null,
        resetBtn: null,
        inputError: null,
        playerForm: null
    };
    
    /**
     * Initialize the module
     */
    function init() {
        cacheElements();
        attachEventListeners();
        updateUI();
    }
    
    /**
     * Cache DOM elements for better performance
     */
    function cacheElements() {
        elements.playerNameInput = document.getElementById('playerNameInput');
        elements.addPlayerBtn = document.getElementById('addPlayerBtn');
        elements.playersList = document.getElementById('playersList');
        elements.playerCount = document.getElementById('playerCount');
        elements.startGameBtn = document.getElementById('startGameBtn');
        elements.resetBtn = document.getElementById('resetBtn');
        elements.inputError = document.getElementById('inputError');
        elements.playerForm = document.getElementById('playerForm');
        
        if (!elements.playerNameInput || !elements.addPlayerBtn) {
            console.error('Critical DOM elements not found');
        }
    }
    
    /**
     * Attach event listeners
     */
    function attachEventListeners() {
        elements.addPlayerBtn.addEventListener('click', handleAddPlayer);
        elements.startGameBtn.addEventListener('click', handleStartGame);
        elements.resetBtn.addEventListener('click', handleReset);
        elements.playerNameInput.addEventListener('keypress', handleInputKeypress);
        elements.playerNameInput.addEventListener('input', clearInputError);
    }
    
    /**
     * Handle adding a player on button click
     */
    function handleAddPlayer(event) {
        event.preventDefault();
        addPlayer();
    }
    
    /**
     * Handle Enter key in input field
     */
    function handleInputKeypress(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            addPlayer();
        }
    }
    
    /**
     * Clear input error message
     */
    function clearInputError() {
        elements.inputError.textContent = '';
    }
    
    /**
     * Validate player name
     */
    function validatePlayerName(name) {
        const trimmedName = name.trim();
        
        // Check empty
        if (trimmedName.length === 0) {
            return { valid: false, error: 'Player name cannot be empty' };
        }
        
        // Check length
        if (trimmedName.length < CONFIG.MIN_NAME_LENGTH) {
            return { valid: false, error: 'Player name is too short' };
        }
        
        if (trimmedName.length > CONFIG.MAX_NAME_LENGTH) {
            return { valid: false, error: `Player name cannot exceed ${CONFIG.MAX_NAME_LENGTH} characters` };
        }
        
        // Check for duplicates (case-insensitive)
        const isDuplicate = state.players.some(p => 
            p.name.toLowerCase() === trimmedName.toLowerCase()
        );
        
        if (isDuplicate) {
            return { valid: false, error: 'A player with this name already exists' };
        }
        
        // Check player limit
        if (state.players.length >= CONFIG.MAX_PLAYERS) {
            return { valid: false, error: `Maximum of ${CONFIG.MAX_PLAYERS} players reached` };
        }
        
        return { valid: true, error: '' };
    }
    
    /**
     * Add a player to the list
     */
    function addPlayer() {
        const input = elements.playerNameInput.value;
        const validation = validatePlayerName(input);
        
        if (!validation.valid) {
            elements.inputError.textContent = validation.error;
            elements.playerNameInput.focus();
            return;
        }
        
        state.players.push({
            id: Date.now(),
            name: input.trim()
        });
        
        elements.playerNameInput.value = '';
        clearInputError();
        updateUI();
        elements.playerNameInput.focus();
    }
    
    /**
     * Remove a player from the list
     */
    function removePlayer(playerId) {
        state.players = state.players.filter(p => p.id !== playerId);
        updateUI();
    }
    
    /**
     * Handle starting the game
     */
    function handleStartGame(event) {
        event.preventDefault();
        
        if (state.players.length < CONFIG.MIN_PLAYERS) {
            console.error('Cannot start game with less than minimum players');
            return;
        }
        
        // Dispatch custom event or call setup logic
        const event_obj = new CustomEvent('gameStartRequested', {
            detail: {
                players: state.players.map(p => p.name)
            }
        });
        document.dispatchEvent(event_obj);
        
        console.log('Game started with players:', state.players);
    }
    
    /**
     * Handle reset button
     */
    function handleReset(event) {
        event.preventDefault();
        state.players = [];
        elements.playerNameInput.value = '';
        clearInputError();
        updateUI();
        elements.playerNameInput.focus();
    }
    
    /**
     * Update UI elements based on state
     */
    function updateUI() {
        updatePlayerCount();
        updatePlayersList();
        updateButtonStates();
    }
    
    /**
     * Update player count display
     */
    function updatePlayerCount() {
        elements.playerCount.textContent = state.players.length;
    }
    
    /**
     * Update players list display
     */
    function updatePlayersList() {
        elements.playersList.innerHTML = '';
        
        if (state.players.length === 0) {
            const emptyMsg = document.createElement('li');
            emptyMsg.className = 'empty-state';
            emptyMsg.textContent = 'No players added yet';
            elements.playersList.appendChild(emptyMsg);
            return;
        }
        
        state.players.forEach((player, index) => {
            const li = document.createElement('li');
            li.className = 'player-item';
            
            const playerInfo = document.createElement('div');
            playerInfo.className = 'player-item-info';
            
            const playerNumber = document.createElement('div');
            playerNumber.className = 'player-item-number';
            playerNumber.textContent = index + 1;
            
            const playerName = document.createElement('span');
            playerName.className = 'player-item-name';
            playerName.textContent = player.name;
            
            playerInfo.appendChild(playerNumber);
            playerInfo.appendChild(playerName);
            
            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'btn-remove';
            removeBtn.textContent = 'Remove';
            removeBtn.addEventListener('click', () => removePlayer(player.id));
            
            li.appendChild(playerInfo);
            li.appendChild(removeBtn);
            elements.playersList.appendChild(li);
        });
    }
    
    /**
     * Update button states based on current state
     */
    function updateButtonStates() {
        // Add button disabled when max players reached
        const isAtMaxPlayers = state.players.length >= CONFIG.MAX_PLAYERS;
        elements.addPlayerBtn.disabled = isAtMaxPlayers;
        
        // Input disabled when max players reached
        elements.playerNameInput.disabled = isAtMaxPlayers;
        
        // Start button disabled when less than min players
        const hasMinPlayers = state.players.length >= CONFIG.MIN_PLAYERS;
        elements.startGameBtn.disabled = !hasMinPlayers;
    }
    
    /**
     * Get current players (for external access if needed)
     */
    function getPlayers() {
        return state.players.map(p => p.name);
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Export for external use if needed
    window.PlayerSetup = {
        getPlayers: getPlayers
    };
})();
