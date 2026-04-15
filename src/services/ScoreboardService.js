/**
 * ScoreboardService
 * 
 * Business logic for scoreboard operations including:
 * - Sorting players by total score
 * - Formatting score data
 * - Calculating statistics
 */

class ScoreboardService {
  /**
   * Get players sorted by total score in descending order
   * @param {Array<Object>} players - Array of player objects with totalScore property
   * @returns {Array<Object>} Sorted array of players
   */
  getSortedPlayers(players) {
    if (!Array.isArray(players)) {
      console.error('Invalid players data provided to ScoreboardService');
      return [];
    }

    return [...players].sort((a, b) => {
      const scoreA = this.getTotalScore(a);
      const scoreB = this.getTotalScore(b);
      return scoreB - scoreA; // Descending order
    });
  }

  /**
   * Get total score for a player with safe null handling
   * @param {Object} player - Player object
   * @returns {number} Total score
   */
  getTotalScore(player) {
    return player?.totalScore || 0;
  }

  /**
   * Get round scores array for a player
   * @param {Object} player - Player object
   * @returns {Array<number>} Array of round scores
   */
  getRoundScores(player) {
    return player?.roundScores || [];
  }

  /**
   * Calculate average score across all rounds
   * @param {Object} player - Player object
   * @returns {number} Average score rounded to 2 decimal places
   */
  getAverageScore(player) {
    const roundScores = this.getRoundScores(player);
    if (roundScores.length === 0) return 0;
    
    const sum = roundScores.reduce((acc, score) => acc + score, 0);
    return Math.round((sum / roundScores.length) * 100) / 100;
  }

  /**
   * Get the highest score in a single round for a player
   * @param {Object} player - Player object
   * @returns {number} Highest round score
   */
  getHighestRoundScore(player) {
    const roundScores = this.getRoundScores(player);
    if (roundScores.length === 0) return 0;
    return Math.max(...roundScores);
  }

  /**
   * Get the lowest score in a single round for a player
   * @param {Object} player - Player object
   * @returns {number} Lowest round score
   */
  getLowestRoundScore(player) {
    const roundScores = this.getRoundScores(player);
    if (roundScores.length === 0) return 0;
    return Math.min(...roundScores);
  }

  /**
   * Get total number of rounds played
   * @param {Array<Object>} players - Array of player objects
   * @returns {number} Number of rounds
   */
  getTotalRounds(players) {
    if (!Array.isArray(players) || players.length === 0) return 0;
    return Math.max(...players.map(p => this.getRoundScores(p).length));
  }

  /**
   * Get player by ID
   * @param {Array<Object>} players - Array of player objects
   * @param {string|number} playerId - Player ID to find
   * @returns {Object|null} Player object or null if not found
   */
  getPlayerById(players, playerId) {
    if (!Array.isArray(players)) return null;
    return players.find(p => p.id === playerId) || null;
  }

  /**
   * Get player rank by ID
   * @param {Array<Object>} players - Array of player objects
   * @param {string|number} playerId - Player ID
   * @returns {number} Player rank (1-indexed), or -1 if not found
   */
  getPlayerRank(players, playerId) {
    const sortedPlayers = this.getSortedPlayers(players);
    const index = sortedPlayers.findIndex(p => p.id === playerId);
    return index === -1 ? -1 : index + 1;
  }

  /**
   * Format score for display
   * @param {number} score - Score to format
   * @returns {string} Formatted score string
   */
  formatScore(score) {
    if (!Number.isInteger(score)) {
      return score.toFixed(2);
    }
    return score.toString();
  }

  /**
   * Get score change from previous round
   * @param {Object} player - Player object
   * @param {number} roundIndex - Round index (0-based)
   * @returns {number} Score in specified round, or 0 if not available
   */
  getRoundScore(player, roundIndex) {
    const roundScores = this.getRoundScores(player);
    return roundScores[roundIndex] || 0;
  }
}

// Export singleton instance
export const scoreboardService = new ScoreboardService();
export default ScoreboardService;
