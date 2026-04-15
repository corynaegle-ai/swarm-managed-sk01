import {
  validateTrickEntries,
  getTrickEntryErrors,
  getRemainingTricks,
  canEnterTricks,
} from '../services/trickEntryValidator';

describe('TrickEntryValidator', () => {
  const players = ['player1', 'player2', 'player3', 'player4'];
  const roundNumber = 4;

  describe('validateTrickEntries', () => {
    it('should return true when tricks sum to round number', () => {
      const tricks = {
        player1: 2,
        player2: 1,
        player3: 1,
        player4: 0,
      };

      const result = validateTrickEntries(tricks, roundNumber, players);
      expect(result).toBe(true);
    });

    it('should return false when tricks do not sum to round number', () => {
      const tricks = {
        player1: 2,
        player2: 1,
        player3: 0,
        player4: 0,
      };

      const result = validateTrickEntries(tricks, roundNumber, players);
      expect(result).toBe(false);
    });

    it('should return false when any player exceeds round number', () => {
      const tricks = {
        player1: 5,
        player2: 0,
        player3: 0,
        player4: 0,
      };

      const result = validateTrickEntries(tricks, roundNumber, players);
      expect(result).toBe(false);
    });

    it('should return false when player has negative tricks', () => {
      const tricks = {
        player1: -1,
        player2: 2,
        player3: 2,
        player4: 1,
      };

      const result = validateTrickEntries(tricks, roundNumber, players);
      expect(result).toBe(false);
    });
  });

  describe('getTrickEntryErrors', () => {
    it('should return empty object when all entries are valid', () => {
      const tricks = {
        player1: 1,
        player2: 1,
        player3: 1,
        player4: 1,
      };

      const errors = getTrickEntryErrors(tricks, roundNumber, players);
      expect(errors).toEqual({});
    });

    it('should include player error when tricks exceed round number', () => {
      const tricks = {
        player1: 5,
        player2: 0,
        player3: 0,
        player4: 0,
      };

      const errors = getTrickEntryErrors(tricks, roundNumber, players);
      expect(errors.player1).toBeDefined();
      expect(errors.player1).toContain('Cannot exceed');
    });

    it('should include total error when sum does not equal round number', () => {
      const tricks = {
        player1: 2,
        player2: 1,
        player3: 0,
        player4: 0,
      };

      const errors = getTrickEntryErrors(tricks, roundNumber, players);
      expect(errors.total).toBeDefined();
      expect(errors.total).toContain('must equal');
    });

    it('should include error for negative tricks', () => {
      const tricks = {
        player1: -1,
        player2: 2,
        player3: 2,
        player4: 1,
      };

      const errors = getTrickEntryErrors(tricks, roundNumber, players);
      expect(errors.player1).toBeDefined();
      expect(errors.player1).toContain('negative');
    });
  });

  describe('getRemainingTricks', () => {
    it('should calculate remaining tricks correctly', () => {
      const tricks = {
        player1: 1,
        player2: 1,
        player3: 0,
        player4: 0,
      };

      const remaining = getRemainingTricks(tricks, roundNumber);
      expect(remaining).toBe(2);
    });

    it('should return round number when no tricks entered', () => {
      const tricks = {
        player1: 0,
        player2: 0,
        player3: 0,
        player4: 0,
      };

      const remaining = getRemainingTricks(tricks, roundNumber);
      expect(remaining).toBe(roundNumber);
    });

    it('should return 0 when all tricks entered', () => {
      const tricks = {
        player1: 1,
        player2: 1,
        player3: 1,
        player4: 1,
      };

      const remaining = getRemainingTricks(tricks, roundNumber);
      expect(remaining).toBe(0);
    });
  });

  describe('canEnterTricks', () => {
    it('should allow valid trick entry', () => {
      const tricks = {
        player1: 1,
        player2: 1,
        player3: 0,
        player4: 0,
      };

      const canEnter = canEnterTricks('player3', 2, tricks, roundNumber);
      expect(canEnter).toBe(true);
    });

    it('should reject negative tricks', () => {
      const tricks = {
        player1: 0,
        player2: 0,
        player3: 0,
        player4: 0,
      };

      const canEnter = canEnterTricks('player1', -1, tricks, roundNumber);
      expect(canEnter).toBe(false);
    });

    it('should reject tricks exceeding round number', () => {
      const tricks = {
        player1: 0,
        player2: 0,
        player3: 0,
        player4: 0,
      };

      const canEnter = canEnterTricks('player1', 5, tricks, roundNumber);
      expect(canEnter).toBe(false);
    });

    it('should reject entry that would exceed round total', () => {
      const tricks = {
        player1: 2,
        player2: 1,
        player3: 1,
        player4: 0,
      };

      const canEnter = canEnterTricks('player4', 2, tricks, roundNumber);
      expect(canEnter).toBe(false);
    });

    it('should allow updating existing entry', () => {
      const tricks = {
        player1: 2,
        player2: 1,
        player3: 1,
        player4: 0,
      };

      const canEnter = canEnterTricks('player1', 1, tricks, roundNumber);
      expect(canEnter).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('should handle round number of 1', () => {
      const tricks = {
        player1: 1,
      };

      const result = validateTrickEntries(tricks, 1, ['player1']);
      expect(result).toBe(true);
    });

    it('should handle round number of 52 (maximum for standard deck)', () => {
      const tricks = Array.from({ length: 52 }, (_, i) => ({
        [`player${i}`]: i === 0 ? 52 : 0,
      })).reduce((acc, obj) => ({ ...acc, ...obj }), {});

      const players = Object.keys(tricks);
      const result = validateTrickEntries(tricks, 52, players);
      expect(result).toBe(true);
    });

    it('should handle missing player entries', () => {
      const tricks = {
        player1: 1,
        player2: 1,
        // player3 and player4 missing
      };

      const errors = getTrickEntryErrors(tricks, roundNumber, players);
      expect(errors.total).toBeDefined();
    });
  });
});
