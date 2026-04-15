/**
 * Player management system for the game
 * Handles player creation, addition, removal, and validation
 */

// In-memory store for players
let players = [];

/**
 * Player class representing a game participant
 */
class Player {
  /**
   * Create a new Player instance
   * @param {string} name - The player's name
   */
  constructor(name) {
    this.id = crypto.randomUUID();
    this.name = name;
    this.score = 0;
  }
}

/**
 * Create a new player instance
 * @param {string} name - The player's name
 * @returns {Player} The newly created player
 */
function createPlayer(name) {
  if (!name || typeof name !== 'string') {
    throw new Error('Player name must be a non-empty string');
  }
  return new Player(name.trim());
}

/**
 * Add a player to the game
 * @param {string} name - The player's name
 * @returns {Player} The added player
 * @throws {Error} If player count limit is exceeded (max 8 players)
 */
function addPlayerToGame(name) {
  if (players.length >= 8) {
    throw new Error('Cannot add player: maximum 8 players allowed');
  }
  const player = createPlayer(name);
  players.push(player);
  return player;
}

/**
 * Remove a player from the game by ID
 * @param {string} id - The player's unique ID
 * @returns {boolean} True if player was removed, false if not found
 */
function removePlayerFromGame(id) {
  const initialLength = players.length;
  players = players.filter(player => player.id !== id);
  return players.length < initialLength;
}

/**
 * Get all current players
 * @returns {Array<Player>} Array of all players in the game
 */
function getPlayers() {
  return [...players];
}

/**
 * Validate that player count is within acceptable range (2-8 players)
 * @returns {boolean} True if player count is 2-8, false otherwise
 */
function validatePlayerCount() {
  return players.length >= 2 && players.length <= 8;
}

// Export functions for use in main application
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Player,
    createPlayer,
    addPlayerToGame,
    removePlayerFromGame,
    getPlayers,
    validatePlayerCount
  };
}
