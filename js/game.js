// Game scoring and state management

class GameState {
  constructor() {
    this.players = [];
    this.currentRound = 1;
    this.gameActive = false;
  }

  addPlayer(name) {
    const player = {
      id: this.players.length + 1,
      name: name,
      bid: 0,
      tricksWon: 0,
      bonusPoints: 0,
      score: 0
    };
    this.players.push(player);
    return player;
  }

  getPlayer(playerId) {
    return this.players.find(p => p.id === playerId);
  }

  setBonusPoints(playerId, amount) {
    // Validate input
    if (typeof amount !== 'number' || isNaN(amount)) {
      throw new Error('Bonus amount must be a valid number');
    }

    if (amount < 0) {
      throw new Error('Bonus points cannot be negative');
    }

    const player = this.getPlayer(playerId);
    if (!player) {
      throw new Error(`Player with ID ${playerId} not found`);
    }

    // Check if player's bid was correct
    if (!this.isBidCorrect(playerId)) {
      throw new Error('Bonus points can only be set for players who bid correctly');
    }

    player.bonusPoints = amount;
    return player;
  }

  isBidCorrect(playerId) {
    const player = this.getPlayer(playerId);
    if (!player) {
      return false;
    }
    // Bid is correct when tricksWon matches the bid
    return player.bid === player.tricksWon;
  }

  calculateScore(playerId) {
    const player = this.getPlayer(playerId);
    if (!player) {
      return 0;
    }

    let score = 0;

    // Calculate base score
    if (this.isBidCorrect(playerId)) {
      // If bid is correct: 10 points + 1 point per trick won
      score = 10 + player.tricksWon;
      // Add bonus points only if bid was correct
      score += player.bonusPoints;
    } else {
      // If bid is incorrect: negative absolute difference
      score = -Math.abs(player.bid - player.tricksWon);
    }

    player.score = score;
    return score;
  }

  calculateAllScores() {
    this.players.forEach(player => {
      this.calculateScore(player.id);
    });
  }

  getPlayerStats(playerId) {
    const player = this.getPlayer(playerId);
    if (!player) {
      return null;
    }

    return {
      id: player.id,
      name: player.name,
      bid: player.bid,
      tricksWon: player.tricksWon,
      bidCorrect: this.isBidCorrect(playerId),
      bonusPoints: player.bonusPoints,
      score: player.score
    };
  }

  resetRound() {
    this.players.forEach(player => {
      player.bid = 0;
      player.tricksWon = 0;
      player.bonusPoints = 0;
      player.score = 0;
    });
    this.currentRound += 1;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GameState;
}
