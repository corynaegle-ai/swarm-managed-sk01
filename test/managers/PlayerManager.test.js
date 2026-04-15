/**
 * Unit tests for the PlayerManager
 */
const PlayerManager = require('../../src/managers/PlayerManager');
const Player = require('../../src/models/Player');

describe('PlayerManager', () => {
  let manager;

  beforeEach(() => {
    manager = new PlayerManager();
  });

  describe('addPlayer', () => {
    test('should add a single player with valid name', () => {
      const player = manager.addPlayer('Alice');
      expect(player).toBeInstanceOf(Player);
      expect(player.getName()).toBe('Alice');
      expect(manager.getPlayerCount()).toBe(1);
    });

    test('should allow adding 2-8 players', () => {
      for (let i = 0; i < 8; i++) {
        manager.addPlayer(`Player${i + 1}`);
      }
      expect(manager.getPlayerCount()).toBe(8);
    });

    test('should throw error when adding more than 8 players', () => {
      for (let i = 0; i < 8; i++) {
        manager.addPlayer(`Player${i + 1}`);
      }
      expect(() => manager.addPlayer('Player9')).toThrow('Cannot add more than 8 players');
    });

    test('should generate unique IDs for each player', () => {
      const player1 = manager.addPlayer('Alice');
      const player2 = manager.addPlayer('Bob');
      const player3 = manager.addPlayer('Charlie');

      expect(player1.getId()).toBe('player_1');
      expect(player2.getId()).toBe('player_2');
      expect(player3.getId()).toBe('player_3');
      expect(player1.getId()).not.toBe(player2.getId());
    });

    test('should throw error when name is empty', () => {
      expect(() => manager.addPlayer('')).toThrow('Player name must be a non-empty string');
    });

    test('should throw error when name is whitespace only', () => {
      expect(() => manager.addPlayer('   ')).toThrow('Player name cannot be empty or whitespace only');
    });

    test('should throw error when name is not a string', () => {
      expect(() => manager.addPlayer(null)).toThrow('Player name must be a non-empty string');
      expect(() => manager.addPlayer(undefined)).toThrow('Player name must be a non-empty string');
      expect(() => manager.addPlayer(123)).toThrow('Player name must be a non-empty string');
    });

    test('should trim whitespace from player names', () => {
      const player = manager.addPlayer('  Alice  ');
      expect(player.getName()).toBe('Alice');
    });
  });

  describe('getPlayers', () => {
    test('should return empty array when no players', () => {
      expect(manager.getPlayers()).toEqual([]);
    });

    test('should return players in setup order (insertion order)', () => {
      manager.addPlayer('Alice');
      manager.addPlayer('Bob');
      manager.addPlayer('Charlie');

      const players = manager.getPlayers();
      expect(players.length).toBe(3);
      expect(players[0].getName()).toBe('Alice');
      expect(players[1].getName()).toBe('Bob');
      expect(players[2].getName()).toBe('Charlie');
    });

    test('should return a copy of the players array', () => {
      manager.addPlayer('Alice');
      const players1 = manager.getPlayers();
      const players2 = manager.getPlayers();
      expect(players1).not.toBe(players2);
      expect(players1).toEqual(players2);
    });
  });

  describe('getPlayerCount', () => {
    test('should return 0 when no players', () => {
      expect(manager.getPlayerCount()).toBe(0);
    });

    test('should return correct count after adding players', () => {
      manager.addPlayer('Alice');
      expect(manager.getPlayerCount()).toBe(1);
      manager.addPlayer('Bob');
      expect(manager.getPlayerCount()).toBe(2);
    });
  });

  describe('canStartGame', () => {
    test('should return false when less than 2 players', () => {
      expect(manager.canStartGame()).toBe(false);
      manager.addPlayer('Alice');
      expect(manager.canStartGame()).toBe(false);
    });

    test('should return true when exactly 2 players', () => {
      manager.addPlayer('Alice');
      manager.addPlayer('Bob');
      expect(manager.canStartGame()).toBe(true);
    });

    test('should return true when 2-8 players', () => {
      for (let i = 0; i < 8; i++) {
        manager.addPlayer(`Player${i + 1}`);
        expect(manager.canStartGame()).toBe(i >= 1); // true from i=1 onwards (2+ players)
      }
    });

    test('should prevent starting game with 0 players', () => {
      expect(manager.canStartGame()).toBe(false);
    });

    test('should prevent starting game with 1 player', () => {
      manager.addPlayer('Alice');
      expect(manager.canStartGame()).toBe(false);
    });
  });

  describe('getPlayerById', () => {
    test('should return null when player not found', () => {
      expect(manager.getPlayerById('nonexistent')).toBeNull();
    });

    test('should return player by id', () => {
      const player = manager.addPlayer('Alice');
      const found = manager.getPlayerById(player.getId());
      expect(found).toBe(player);
      expect(found.getName()).toBe('Alice');
    });
  });

  describe('removePlayer', () => {
    test('should remove player by id', () => {
      const player = manager.addPlayer('Alice');
      expect(manager.getPlayerCount()).toBe(1);
      const removed = manager.removePlayer(player.getId());
      expect(removed).toBe(true);
      expect(manager.getPlayerCount()).toBe(0);
    });

    test('should return false when removing nonexistent player', () => {
      const removed = manager.removePlayer('nonexistent');
      expect(removed).toBe(false);
    });

    test('should remove correct player when multiple exist', () => {
      const player1 = manager.addPlayer('Alice');
      const player2 = manager.addPlayer('Bob');
      const player3 = manager.addPlayer('Charlie');

      manager.removePlayer(player2.getId());
      const players = manager.getPlayers();
      expect(players.length).toBe(2);
      expect(players[0].getName()).toBe('Alice');
      expect(players[1].getName()).toBe('Charlie');
    });
  });

  describe('reset', () => {
    test('should clear all players', () => {
      manager.addPlayer('Alice');
      manager.addPlayer('Bob');
      expect(manager.getPlayerCount()).toBe(2);
      manager.reset();
      expect(manager.getPlayerCount()).toBe(0);
      expect(manager.getPlayers()).toEqual([]);
    });

    test('should reset ID counter', () => {
      manager.addPlayer('Alice');
      const id1 = manager.getPlayers()[0].getId();
      manager.reset();
      manager.addPlayer('Bob');
      const id2 = manager.getPlayers()[0].getId();
      expect(id1).toBe(id2); // Both should be 'player_1'
    });
  });

  describe('toJSON', () => {
    test('should return empty array when no players', () => {
      expect(manager.toJSON()).toEqual([]);
    });

    test('should return JSON representation of all players', () => {
      manager.addPlayer('Alice');
      manager.addPlayer('Bob');
      const json = manager.toJSON();
      expect(json.length).toBe(2);
      expect(json[0].name).toBe('Alice');
      expect(json[1].name).toBe('Bob');
      expect(json[0]).toHaveProperty('id');
      expect(json[1]).toHaveProperty('id');
    });
  });

  describe('Acceptance Criteria Tests', () => {
    test('AC1: Can add 2-8 players with names', () => {
      for (let i = 2; i <= 8; i++) {
        const tempManager = new PlayerManager();
        for (let j = 0; j < i; j++) {
          const player = tempManager.addPlayer(`Player${j + 1}`);
          expect(player).toBeInstanceOf(Player);
          expect(player.getName()).toBe(`Player${j + 1}`);
        }
        expect(tempManager.getPlayerCount()).toBe(i);
      }
    });

    test('AC2: Cannot start game with less than 2 players', () => {
      expect(manager.canStartGame()).toBe(false);
      manager.addPlayer('Alice');
      expect(manager.canStartGame()).toBe(false);
      manager.addPlayer('Bob');
      expect(manager.canStartGame()).toBe(true);
    });

    test('AC3: Cannot add more than 8 players', () => {
      for (let i = 0; i < 8; i++) {
        manager.addPlayer(`Player${i + 1}`);
      }
      expect(manager.getPlayerCount()).toBe(8);
      expect(() => manager.addPlayer('Player9')).toThrow('Cannot add more than 8 players');
      expect(manager.getPlayerCount()).toBe(8);
    });

    test('AC4: Player names are displayed in setup order', () => {
      const names = ['Alice', 'Bob', 'Charlie', 'David', 'Eve'];
      names.forEach(name => manager.addPlayer(name));

      const players = manager.getPlayers();
      players.forEach((player, index) => {
        expect(player.getName()).toBe(names[index]);
      });
    });
  });
});
