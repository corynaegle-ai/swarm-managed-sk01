/**
 * Unit tests for GameStateManager
 */

const { GameStateManager } = require('../js/game.js');

describe('GameStateManager', () => {
  let gameManager;

  beforeEach(() => {
    gameManager = new GameStateManager();
  });

  describe('initializeGame', () => {
    it('should initialize game with players', () => {
      const players = [
        { name: 'Alice' },
        { name: 'Bob' },
        { name: 'Charlie' }
      ];

      gameManager.initializeGame(players, 13);

      expect(gameManager.gameState.players.length).toBe(3);
      expect(gameManager.gameState.currentRound).toBe(1);
      expect(gameManager.gameState.maxRounds).toBe(13);
      expect(gameManager.isInitialized).toBe(true);
    });

    it('should throw error if no players provided', () => {
      expect(() => gameManager.initializeGame([])).toThrow();
    });

    it('should assign player IDs correctly', () => {
      const players = [{ name: 'Alice' }, { name: 'Bob' }];
      gameManager.initializeGame(players);

      expect(gameManager.gameState.players[0].id).toBe('player0');
      expect(gameManager.gameState.players[1].id).toBe('player1');
    });
  });

  describe('updatePlayerScores', () => {
    beforeEach(() => {
      const players = [
        { name: 'Alice', bid: 2 },
        { name: 'Bob', bid: 1 },
        { name: 'Charlie', bid: 2 }
      ];
      gameManager.initializeGame(players);
    });

    it('should award 10 points when tricks match bid', () => {
      gameManager.updatePlayerScores({
        player0: 2,
        player1: 1,
        player2: 2
      });

      expect(gameManager.gameState.players[0].score).toBe(10);
      expect(gameManager.gameState.players[1].score).toBe(10);
      expect(gameManager.gameState.players[2].score).toBe(10);
    });

    it('should penalize when tricks do not match bid', () => {
      gameManager.updatePlayerScores({
        player0: 3,
        player1: 1,
        player2: 1
      });

      // Alice bid 2, got 3: -|3-2| = -1
      expect(gameManager.gameState.players[0].score).toBe(-1);
      // Bob bid 1, got 1: 10 points
      expect(gameManager.gameState.players[1].score).toBe(10);
      // Charlie bid 2, got 1: -|1-2| = -1
      expect(gameManager.gameState.players[2].score).toBe(-1);
    });

    it('should update tricks taken for each player', () => {
      gameManager.updatePlayerScores({
        player0: 2,
        player1: 0,
        player2: 3
      });

      expect(gameManager.gameState.players[0].tricks).toBe(2);
      expect(gameManager.gameState.players[1].tricks).toBe(0);
      expect(gameManager.gameState.players[2].tricks).toBe(3);
    });

    it('should track round scores', () => {
      gameManager.updatePlayerScores({
        player0: 2,
        player1: 1,
        player2: 2
      });

      expect(gameManager.gameState.players[0].roundScores[0]).toEqual({
        round: 1,
        bid: 2,
        tricks: 2,
        points: 10
      });
    });

    it('should throw error on missing tricks for a player', () => {
      expect(() => {
        gameManager.updatePlayerScores({
          player0: 2,
          player1: 1
          // missing player2
        });
      }).toThrow();
    });
  });

  describe('advanceRound', () => {
    beforeEach(() => {
      const players = [{ name: 'Alice' }, { name: 'Bob' }];
      gameManager.initializeGame(players, 13);
    });

    it('should increment current round', () => {
      expect(gameManager.gameState.currentRound).toBe(1);
      gameManager.advanceRound();
      expect(gameManager.gameState.currentRound).toBe(2);
    });

    it('should reset player bids and tricks', () => {
      gameManager.gameState.players[0].bid = 5;
      gameManager.gameState.players[0].tricks = 3;
      
      gameManager.advanceRound();
      
      expect(gameManager.gameState.players[0].bid).toBe(0);
      expect(gameManager.gameState.players[0].tricks).toBe(0);
    });

    it('should deactivate game when max rounds exceeded', () => {
      gameManager.gameState.maxRounds = 3;
      gameManager.gameState.currentRound = 3;
      
      const result = gameManager.advanceRound();
      
      expect(result).toBe(false);
      expect(gameManager.gameState.gameActive).toBe(false);
    });

    it('should return true when game continues', () => {
      const result = gameManager.advanceRound();
      expect(result).toBe(true);
      expect(gameManager.gameState.gameActive).toBe(true);
    });
  });

  describe('getPlayerScores', () => {
    beforeEach(() => {
      const players = [{ name: 'Alice' }, { name: 'Bob' }];
      gameManager.initializeGame(players);
      gameManager.gameState.players[0].score = 15;
      gameManager.gameState.players[0].bid = 2;
      gameManager.gameState.players[0].tricks = 2;
      gameManager.gameState.players[1].score = 5;
      gameManager.gameState.players[1].bid = 1;
      gameManager.gameState.players[1].tricks = 0;
    });

    it('should return array of player score objects', () => {
      const scores = gameManager.getPlayerScores();
      expect(scores.length).toBe(2);
      expect(scores[0].name).toBe('Alice');
      expect(scores[0].score).toBe(15);
    });

    it('should not return internal data structures', () => {
      const scores = gameManager.getPlayerScores();
      expect(scores[0].roundScores).toBeUndefined();
    });
  });

  describe('getRoundResults', () => {
    beforeEach(() => {
      const players = [{ name: 'Alice', bid: 2 }, { name: 'Bob', bid: 1 }];
      gameManager.initializeGame(players);
      gameManager.updatePlayerScores({ player0: 2, player1: 1 });
    });

    it('should return results for the last completed round', () => {
      const results = gameManager.getRoundResults();
      expect(results.length).toBe(2);
      expect(results[0].bid).toBe(2);
      expect(results[0].tricks).toBe(2);
      expect(results[0].points).toBe(10);
    });

    it('should return results for a specific round', () => {
      gameManager.advanceRound();
      gameManager.gameState.players[0].bid = 3;
      gameManager.updatePlayerScores({ player0: 1, player1: 2 });
      
      const round1Results = gameManager.getRoundResults(1);
      expect(round1Results[0].tricks).toBe(2);
      
      const round2Results = gameManager.getRoundResults(2);
      expect(round2Results[0].tricks).toBe(1);
    });
  });
});
