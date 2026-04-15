/**
 * Player class representing a single player in the game
 */
class Player {
  static idCounter = 0;

  /**
   * Create a new Player instance
   * @param {string} name - The player's name
   */
  constructor(name) {
    this.id = Player.generateUniqueId();
    this.name = name;
    this.score = 0;
  }

  /**
   * Generate a unique ID for a player using timestamp and counter
   * @returns {string} A unique player ID
   */
  static generateUniqueId() {
    const timestamp = Date.now();
    const counter = ++Player.idCounter;
    return `player_${timestamp}_${counter}`;
  }

  /**
   * Get the player's data as an object
   * @returns {object} Player data object
   */
  getData() {
    return {
      id: this.id,
      name: this.name,
      score: this.score
    };
  }

  /**
   * Update the player's score
   * @param {number} points - Points to add to the score
   */
  addScore(points) {
    this.score += points;
  }

  /**
   * Reset the player's score
   */
  resetScore() {
    this.score = 0;
  }
}
