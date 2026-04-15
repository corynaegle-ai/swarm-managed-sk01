/**
 * Test suite for game state management
 * Tests calculateRoundScores, getPlayerScore, updatePlayerScore, and game state tracking
 */

// Mock the scoring engine
global.calculateScore = function(bid, tricks) {
  if (bid === tricks) {
    return 10 + tricks;
  }
  return Math.max(0, tricks - bid);
};

// Load the game module
const {
  gameState,
  calculateRoundScores,
  getPlayerScore,
  updatePlayerScore,
  getAllScores,
  getRoundData,
  getGameHistory,
  initializeGame,
  resetGameState
} = require('../js/game.js');

describe('Game State Management', () => {
  beforeEach(() => {
    resetGameState();
  });

  describe('Game Initialization', () => {
    test('should initialize game with players and rounds', () => {
      const players = [
        { id: 1, name: 'Player 1' },
        { id: 2, name: 'Player 2' }
      ];
      initializeGame(players, 5);

      expect(gameState.players.length).toBe(2);
      expect(gameState.totalRounds).toBe(5);
      expect(gameState.currentRound).toBe(1);
    });

    test('should initialize empty game scores for each player', () => {
      const players = [
        { id: 1, name: 'Player 1' },
        { id: 2, name: 'Player 2' }
      ];
      initializeGame(players, 3);

      expect(gameState.gameScores[1]).toBe(0);
      expect(gameState.gameScores[2]).toBe(0);
    });

    test('should throw error with no players', () => {
      expect(() => {
        initializeGame([], 5);
      }).toThrow('At least one player is required');
    });

    test('should throw error with invalid rounds', () => {
      const players = [{ id: 1, name: 'Player 1' }];
      expect(() => {
        initializeGame(players, 0);
      }).toThrow('Rounds must be a positive integer');
    });
  });

  describe('Bid Recording', () => {
    beforeEach(() => {
      const players = [
        { id: 1, name: 'Player 1' },
        { id: 2, name: 'Player 2' }
      ];
      initializeGame(players, 3);
    });

    test('should record player bid', () => {
      gameState.recordBid(1, 5);
      expect(gameState.getBid(1)).toBe(5);
    });

    test('should throw error for invalid player', () => {
      expect(() => {
        gameState.recordBid(999, 5);
      }).toThrow('Player not found: 999');
    });

    test('should throw error for negative bid', () => {
      expect(() => {
        gameState.recordBid(1, -1);
      }).toThrow('Invalid bid amount: -1');
    });

    test('should throw error for non-integer bid', () => {
      expect(() => {
        gameState.recordBid(1, 5.5);
      }).toThrow('Invalid bid amount: 5.5');
    });
  });

  describe('Tricks Recording', () => {
    beforeEach(() => {
      const players = [
        { id: 1, name: 'Player 1' },
        { id: 2, name: 'Player 2' }
      ];
      initializeGame(players, 3);
    });

    test('should record tricks taken', () => {
      gameState.recordTricks(1, 3);
      expect(gameState.getTricks(1)).toBe(3);
    });

    test('should throw error for invalid player', () => {
      expect(() => {
        gameState.recordTricks(999, 3);
      }).toThrow('Player not found: 999');
    });

    test('should throw error for negative tricks', () => {
      expect(() => {
        gameState.recordTricks(1, -1);
      }).toThrow('Invalid tricks amount: -1');
    });
  });

  describe('Round Completion', () => {
    beforeEach(() => {
      const players = [
        { id: 1, name: 'Player 1' },
        { id: 2, name: 'Player 2' }
      ];
      initializeGame(players, 3);
    });

    test('should detect incomplete round', () => {
      gameState.recordBid(1, 5);
      expect(gameState.isRoundComplete()).toBe(false);
    });

    test('should detect complete round', () => {
      gameState.recordBid(1, 5);
      gameState.recordBid(2, 3);
      gameState.recordTricks(1, 5);
      gameState.recordTricks(2, 3);
      expect(gameState.isRoundComplete()).toBe(true);
    });
  });

  describe('Round Score Calculation', () => {
    beforeEach(() => {
      const players = [
        { id: 1, name: 'Player 1' },
        { id: 2, name: 'Player 2' }
      ];
      initializeGame(players, 3);
    });

    test('should calculate scores for all players when round is complete', () => {
      gameState.recordBid(1, 5);
      gameState.recordBid(2, 3);
      gameState.recordTricks(1, 5);
      gameState.recordTricks(2, 3);

      const roundScores = calculateRoundScores();

      expect(roundScores[1]).toBe(15); // 10 + 5 for matching bid
      expect(roundScores[2]).toBe(13); // 10 + 3 for matching bid
    });

    test('should throw error when round is incomplete', () => {
      gameState.recordBid(1, 5);
      expect(() => {
        calculateRoundScores();
      }).toThrow('Cannot calculate scores: round is not complete');
    });

    test('should update total game scores', () => {
      gameState.recordBid(1, 5);
      gameState.recordBid(2, 3);
      gameState.recordTricks(1, 5);
      gameState.recordTricks(2, 3);

      calculateRoundScores();

      expect(getPlayerScore(1)).toBe(15);
      expect(getPlayerScore(2)).toBe(13);
    });

    test('should accumulate scores across multiple rounds', () => {
      // Round 1
      gameState.recordBid(1, 5);
      gameState.recordBid(2, 3);
      gameState.recordTricks(1, 5);
      gameState.recordTricks(2, 3);
      calculateRoundScores();

      // Round 2
      gameState.nextRound();
      gameState.recordBid(1, 4);
      gameState.recordBid(2, 2);
      gameState.recordTricks(1, 4);
      gameState.recordTricks(2, 2);
      calculateRoundScores();

      expect(getPlayerScore(1)).toBe(29); // 15 + 14
      expect(getPlayerScore(2)).toBe(25); // 13 + 12
    });
  });

  describe('Player Score Management', () => {
    beforeEach(() => {
      const players = [
        { id: 1, name: 'Player 1' },
        { id: 2, name: 'Player 2' }
      ];
      initializeGame(players, 3);
    });

    test('should get player score', () => {
      updatePlayerScore(1, 25);
      expect(getPlayerScore(1)).toBe(25);
    });

    test('should update player score', () => {
      updatePlayerScore(1, 50);
      expect(getPlayerScore(1)).toBe(50);
    });

    test('should throw error for invalid player ID', () => {
      expect(() => {
        getPlayerScore(999);
      }).toThrow('Player not found: 999');
    });

    test('should throw error for negative score', () => {
      expect(() => {
        updatePlayerScore(1, -10);
      }).toThrow('Invalid score amount: -10');
    });

    test('should get all scores', () => {
      updatePlayerScore(1, 25);
      updatePlayerScore(2, 30);
      const scores = getAllScores();
      expect(scores[1]).toBe(25);
      expect(scores[2]).toBe(30);
    });
  });

  describe('Round Navigation', () => {
    beforeEach(() => {
      const players = [
        { id: 1, name: 'Player 1' },
        { id: 2, name: 'Player 2' }
      ];
      initializeGame(players, 3);
    });

    test('should move to next round', () => {
      expect(gameState.currentRound).toBe(1);
      gameState.nextRound();
      expect(gameState.currentRound).toBe(2);
    });

    test('should throw error when trying to advance past final round', () => {
      gameState.currentRound = 3;
      expect(() => {
        gameState.nextRound();
      }).toThrow('No more rounds available');
    });

    test('should maintain separate round data', () => {
      gameState.recordBid(1, 5);
      gameState.recordTricks(1, 5);
      calculateRoundScores();

      gameState.nextRound();
      expect(gameState.getBid(1)).toBeUndefined();
      expect(gameState.getTricks(1)).toBeUndefined();
    });
  });

  describe('Round Data Retrieval', () => {
    beforeEach(() => {
      const players = [
        { id: 1, name: 'Player 1' },
        { id: 2, name: 'Player 2' }
      ];
      initializeGame(players, 3);
    });

    test('should get current round data', () => {
      gameState.recordBid(1, 5);
      gameState.recordBid(2, 3);
      gameState.recordTricks(1, 5);
      gameState.recordTricks(2, 3);
      calculateRoundScores();

      const roundData = getRoundData();
      expect(roundData.round).toBe(1);
      expect(roundData.bids[1]).toBe(5);
      expect(roundData.bids[2]).toBe(3);
      expect(roundData.tricks[1]).toBe(5);
      expect(roundData.tricks[2]).toBe(3);
    });
  });

  describe('Game History', () => {
    test('should retrieve complete game history', () => {
      const players = [
        { id: 1, name: 'Player 1' },
        { id: 2, name: 'Player 2' }
      ];
      initializeGame(players, 2);
      gameState.recordBid(1, 5);
      gameState.recordBid(2, 3);
      gameState.recordTricks(1, 5);
      gameState.recordTricks(2, 3);
      calculateRoundScores();

      const history = getGameHistory();
      expect(history.players.length).toBe(2);
      expect(history.totalRounds).toBe(2);
      expect(history.currentRound).toBe(1);
      expect(history.gameScores[1]).toBe(15);
    });
  });

  describe('Round Reset', () => {
    beforeEach(() => {
      const players = [
        { id: 1, name: 'Player 1' },
        { id: 2, name: 'Player 2' }
      ];
      initializeGame(players, 3);
    });

    test('should reset current round data', () => {
      gameState.recordBid(1, 5);
      gameState.recordTricks(1, 3);
      gameState.resetCurrentRound();

      expect(gameState.getBid(1)).toBeUndefined();
      expect(gameState.getTricks(1)).toBeUndefined();
    });
  });
});
