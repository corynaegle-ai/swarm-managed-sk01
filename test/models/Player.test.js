/**
 * Unit tests for the Player model
 */
const Player = require('../../src/models/Player');

describe('Player Model', () => {
  describe('Constructor', () => {
    test('should create a player with valid id and name', () => {
      const player = new Player('player_1', 'Alice');
      expect(player.getId()).toBe('player_1');
      expect(player.getName()).toBe('Alice');
    });

    test('should trim whitespace from player name', () => {
      const player = new Player('player_1', '  Bob  ');
      expect(player.getName()).toBe('Bob');
    });

    test('should throw error if id is empty', () => {
      expect(() => new Player('', 'Charlie')).toThrow('Player ID must be a non-empty string');
    });

    test('should throw error if id is not a string', () => {
      expect(() => new Player(123, 'David')).toThrow('Player ID must be a non-empty string');
    });

    test('should throw error if name is empty', () => {
      expect(() => new Player('player_1', '')).toThrow('Player name must be a non-empty string');
    });

    test('should throw error if name is not a string', () => {
      expect(() => new Player('player_1', 123)).toThrow('Player name must be a non-empty string');
    });
  });

  describe('Methods', () => {
    test('getId should return player id', () => {
      const player = new Player('player_5', 'Eve');
      expect(player.getId()).toBe('player_5');
    });

    test('getName should return player name', () => {
      const player = new Player('player_6', 'Frank');
      expect(player.getName()).toBe('Frank');
    });

    test('toJSON should return proper object structure', () => {
      const player = new Player('player_7', 'Grace');
      const json = player.toJSON();
      expect(json).toEqual({
        id: 'player_7',
        name: 'Grace'
      });
    });
  });
});
