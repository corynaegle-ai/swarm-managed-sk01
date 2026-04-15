/**
 * PlayerSetupManager handles all player setup UI interactions, form validation,
 * and player list management
 */
class PlayerSetupManager {
  /**
   * Initialize the PlayerSetupManager
   */
  constructor() {
    this.players = [];
    this.playerNameInput = null;
    this.addPlayerBtn = null;
    this.playerListContainer = null;
    this.startGameBtn = null;
    this.playerForm = null;

    this.init();
  }

  /**
   * Initialize the setup manager and attach event listeners
   */
  init() {
    // Get DOM elements
    this.playerForm = document.getElementById('playerForm');
    this.playerNameInput = document.getElementById('playerName');
    this.addPlayerBtn = document.getElementById('addPlayerBtn');
    this.playerListContainer = document.getElementById('playerList');
    this.startGameBtn = document.getElementById('startGameBtn');

    // Verify all required elements exist
    if (!this.playerForm || !this.playerNameInput || !this.addPlayerBtn ||
        !this.playerListContainer || !this.startGameBtn) {
      console.error('One or more required DOM elements not found');
      return;
    }

    // Attach event listeners
    this.playerForm.addEventListener('submit', (e) => this.handleAddPlayer(e));
    this.startGameBtn.addEventListener('click', () => this.handleStartGame());

    // Initial button state
    this.updateStartGameButtonState();
  }

  /**
   * Handle the add player form submission
   * @param {Event} event - The form submission event
   */
  handleAddPlayer(event) {
    event.preventDefault();

    const playerName = this.playerNameInput.value.trim();

    // Validate player name
    if (!this.validatePlayerName(playerName)) {
      return;
    }

    // Check for duplicate names
    if (this.isDuplicateName(playerName)) {
      this.showError('Player name already exists');
      return;
    }

    // Create new player and add to list
    const player = new Player(playerName);
    this.players.push(player);

    // Update UI
    this.renderPlayerList();
    this.playerNameInput.value = '';
    this.playerNameInput.focus();
    this.updateStartGameButtonState();
  }

  /**
   * Validate player name input
   * @param {string} name - The player name to validate
   * @returns {boolean} True if valid, false otherwise
   */
  validatePlayerName(name) {
    if (!name || name.length === 0) {
      this.showError('Please enter a player name');
      return false;
    }

    if (name.length < 2) {
      this.showError('Player name must be at least 2 characters long');
      return false;
    }

    if (name.length > 50) {
      this.showError('Player name must not exceed 50 characters');
      return false;
    }

    // Check for invalid characters (allow alphanumeric, spaces, and some special chars)
    const validNameRegex = /^[a-zA-Z0-9\s\-']+$/;
    if (!validNameRegex.test(name)) {
      this.showError('Player name contains invalid characters');
      return false;
    }

    return true;
  }

  /**
   * Check if a player name already exists
   * @param {string} name - The player name to check
   * @returns {boolean} True if name exists, false otherwise
   */
  isDuplicateName(name) {
    return this.players.some(player => player.name.toLowerCase() === name.toLowerCase());
  }

  /**
   * Show an error message to the user
   * @param {string} message - The error message to display
   */
  showError(message) {
    // Create error element if it doesn't exist
    let errorElement = document.getElementById('playerFormError');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.id = 'playerFormError';
      errorElement.className = 'error-message';
      this.playerForm.insertBefore(errorElement, this.playerForm.firstChild);
    }

    errorElement.textContent = message;
    errorElement.style.display = 'block';

    // Clear error after 3 seconds
    setTimeout(() => {
      errorElement.style.display = 'none';
    }, 3000);
  }

  /**
   * Remove a player from the list
   * @param {string} playerId - The ID of the player to remove
   */
  removePlayer(playerId) {
    this.players = this.players.filter(player => player.id !== playerId);
    this.renderPlayerList();
    this.updateStartGameButtonState();
  }

  /**
   * Render the player list in the UI
   */
  renderPlayerList() {
    // Clear the container
    this.playerListContainer.innerHTML = '';

    if (this.players.length === 0) {
      this.playerListContainer.innerHTML = '<p class="empty-message">No players added yet</p>';
      return;
    }

    // Create list items for each player
    const ul = document.createElement('ul');
    ul.className = 'player-list';

    this.players.forEach((player, index) => {
      const li = document.createElement('li');
      li.className = 'player-item';
      li.dataset.playerId = player.id;

      const playerInfo = document.createElement('div');
      playerInfo.className = 'player-info';
      playerInfo.innerHTML = `
        <span class="player-number">${index + 1}.</span>
        <span class="player-name">${this.escapeHtml(player.name)}</span>
        <span class="player-id">(ID: ${player.id})</span>
      `;

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'remove-player-btn';
      removeBtn.textContent = 'Remove';
      removeBtn.addEventListener('click', () => this.removePlayer(player.id));

      li.appendChild(playerInfo);
      li.appendChild(removeBtn);
      ul.appendChild(li);
    });

    this.playerListContainer.appendChild(ul);
  }

  /**
   * Update the state of the start game button
   */
  updateStartGameButtonState() {
    if (this.players.length < 2) {
      this.startGameBtn.disabled = true;
      this.startGameBtn.title = 'At least 2 players are required to start the game';
    } else {
      this.startGameBtn.disabled = false;
      this.startGameBtn.title = '';
    }
  }

  /**
   * Handle the start game button click
   */
  handleStartGame() {
    // Validate that we have players
    if (this.players.length < 2) {
      this.showError('At least 2 players are required to start the game');
      return;
    }

    // Store players data in sessionStorage for persistence
    try {
      const playersData = this.players.map(player => player.getData());
      sessionStorage.setItem('gamePlayers', JSON.stringify(playersData));
    } catch (error) {
      console.error('Error storing player data:', error);
      this.showError('Error saving player data. Please try again.');
      return;
    }

    // Navigate to the game page
    window.location.href = 'game.html';
  }

  /**
   * Escape HTML special characters to prevent XSS
   * @param {string} text - The text to escape
   * @returns {string} The escaped text
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Get all players data
   * @returns {Array} Array of player data objects
   */
  getPlayersData() {
    return this.players.map(player => player.getData());
  }

  /**
   * Get the number of players
   * @returns {number} The number of players in the setup
   */
  getPlayerCount() {
    return this.players.length;
  }
}

// Initialize the player setup manager when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.playerSetupManager = new PlayerSetupManager();
  });
} else {
  window.playerSetupManager = new PlayerSetupManager();
}
