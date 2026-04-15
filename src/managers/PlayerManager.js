/**
 * PlayerManager handles the creation, validation, and management of players
 * during the game setup phase
 */
const Player = require('../models/Player');

class PlayerManager {
  constructor() {
    this.players = [];
    this.nextId = 1;
  }

  /**
   * Generate a unique ID for a new player
   * @returns {string} Unique player ID
   */
  generatePlayerId() {
    const id = `player_${this.nextId}`;
    this.nextId++;
    return id;
  }

  /**
   * Add a new player to the game setup
   * @param {string} name - The player's name
   * @returns {Player} The newly created player
   * @throws {Error} If validation fails
   */
  addPlayer(name) {
    // Validate input
    if (!name || typeof name !== 'string') {
      throw new Error('Player name must be a non-empty string');
    }

    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      throw new Error('Player name cannot be empty or whitespace only');
    }

    // Check maximum players constraint
    if (this.players.length >= 8) {
      throw new Error('Cannot add more than 8 players');
    }

    // Create and add the player
    const playerId = this.generatePlayerId();
    const player = new Player(playerId, trimmedName);
    this.players.push(player);

    return player;
  }

  /**
   * Get all players in setup order
   * @returns {Array<Player>} Array of players in the order they were added
   */
  getPlayers() {
    return [...this.players];
  }

  /**
   * Get the number of players currently in setup
   * @returns {number} The count of players
   */
  getPlayerCount() {
    return this.players.length;
  }

  /**
   * Check if the game can be started
   * @returns {boolean} True if there are between 2-8 players, false otherwise
   */
  canStartGame() {
    return this.players.length >= 2 && this.players.length <= 8;
  }

  /**
   * Get a player by ID
   * @param {string} playerId - The unique player ID
   * @returns {Player|null} The player object or null if not found
   */
  getPlayerById(playerId) {
    return this.players.find(player => player.getId() === playerId) || null;
  }

  /**
   * Remove a player by ID
   * @param {string} playerId - The unique player ID
   * @returns {boolean} True if player was removed, false if not found
   */
  removePlayer(playerId) {
    const index = this.players.findIndex(player => player.getId() === playerId);
    if (index !== -1) {
      this.players.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Reset the player setup (clear all players)
   */
  reset() {
    this.players = [];
    this.nextId = 1;
  }

  /**
   * Get all players as JSON
   * @returns {Array<Object>} Array of player JSON objects
   */
  toJSON() {
    return this.players.map(player => player.toJSON());
  }
}

module.exports = PlayerManager;
