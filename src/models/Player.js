/**
 * Player model for the scorekeeper application
 * Represents a single player with a unique ID and name
 */
class Player {
  /**
   * Create a new Player instance
   * @param {string} id - Unique identifier for the player
   * @param {string} name - Player's name
   */
  constructor(id, name) {
    if (!id || typeof id !== 'string') {
      throw new Error('Player ID must be a non-empty string');
    }
    if (!name || typeof name !== 'string') {
      throw new Error('Player name must be a non-empty string');
    }
    
    this.id = id;
    this.name = name.trim();
  }

  /**
   * Get the player's ID
   * @returns {string} The player's unique ID
   */
  getId() {
    return this.id;
  }

  /**
   * Get the player's name
   * @returns {string} The player's name
   */
  getName() {
    return this.name;
  }

  /**
   * Convert player to JSON representation
   * @returns {Object} JSON representation of the player
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name
    };
  }
}

module.exports = Player;
