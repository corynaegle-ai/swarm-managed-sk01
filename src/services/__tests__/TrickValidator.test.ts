/**
 * Unit tests for TrickValidator
 */

import { TrickValidator, TrickEntryData } from '../TrickValidator';

describe('TrickValidator', () => {
  let validator: TrickValidator;

  beforeEach(() => {
    validator = new TrickValidator();
  });

  describe('validateSingleTrick', () => {
    it('should accept valid trick entry', () => {
      const errors = validator.validateSingleTrick(1, 3, [0, 1]);
      expect(errors).toHaveLength(0);
    });

    it('should reject non-integer values', () => {
      const errors = validator.validateSingleTrick(1.5, 3, []);
      expect(errors).toHaveLength(1);
      expect(errors[0].message).toContain('whole number');
    });

    it('should reject negative tricks', () => {
      const errors = validator.validateSingleTrick(-1, 3, []);
      expect(errors).toHaveLength(1);
      expect(errors[0].message).toContain('cannot be negative');
    });

    it('should reject more tricks than round number', () => {
      const errors = validator.validateSingleTrick(5, 3, []);
      expect(errors).toHaveLength(1);
      expect(errors[0].message).toContain('Cannot enter more than 3');
    });

    it('should reject entry exceeding remaining tricks', () => {
      const errors = validator.validateSingleTrick(2, 3, [1, 2]);
      expect(errors).toHaveLength(1);
      expect(errors[0].message).toContain('Only 0 trick(s) remaining');
    });

    it('should allow zero tricks', () => {
      const errors = validator.validateSingleTrick(0, 3, []);
      expect(errors).toHaveLength(0);
    });
  });

  describe('validateAllTricks', () => {
    it('should accept valid complete entries', () => {
      const entries: TrickEntryData[] = [
        { playerName: 'Alice', tricksTaken: 1 },
        { playerName: 'Bob', tricksTaken: 2 },
        { playerName: 'Charlie', tricksTaken: 0 }
      ];
      const errors = validator.validateAllTricks(entries, 3);
      expect(errors).toHaveLength(0);
    });

    it('should reject when total tricks less than round number', () => {
      const entries: TrickEntryData[] = [
        { playerName: 'Alice', tricksTaken: 1 },
        { playerName: 'Bob', tricksTaken: 1 }
      ];
      const errors = validator.validateAllTricks(entries, 3);
      expect(errors).toHaveLength(1);
      expect(errors[0].message).toContain('Total tricks (2) must equal round number (3)');
    });

    it('should reject when total tricks exceeds round number', () => {
      const entries: TrickEntryData[] = [
        { playerName: 'Alice', tricksTaken: 2 },
        { playerName: 'Bob', tricksTaken: 2 },
        { playerName: 'Charlie', tricksTaken: 1 }
      ];
      const errors = validator.validateAllTricks(entries, 3);
      expect(errors).toHaveLength(1);
      expect(errors[0].message).toContain('Total tricks (5) must equal round number (3)');
    });

    it('should reject empty entries array', () => {
      const errors = validator.validateAllTricks([], 3);
      expect(errors).toHaveLength(1);
      expect(errors[0].message).toContain('At least one player entry is required');
    });

    it('should reject duplicate player names', () => {
      const entries: TrickEntryData[] = [
        { playerName: 'Alice', tricksTaken: 1 },
        { playerName: 'Alice', tricksTaken: 2 }
      ];
      const errors = validator.validateAllTricks(entries, 3);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.message.includes('Duplicate'))).toBe(true);
    });

    it('should reject non-integer trick values', () => {
      const entries: TrickEntryData[] = [
        { playerName: 'Alice', tricksTaken: 1.5 },
        { playerName: 'Bob', tricksTaken: 1.5 }
      ];
      const errors = validator.validateAllTricks(entries, 3);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.message.includes('whole number'))).toBe(true);
    });

    it('should reject negative trick values', () => {
      const entries: TrickEntryData[] = [
        { playerName: 'Alice', tricksTaken: -1 },
        { playerName: 'Bob', tricksTaken: 4 }
      ];
      const errors = validator.validateAllTricks(entries, 3);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.message.includes('cannot be negative'))).toBe(true);
    });

    it('should handle four-player games', () => {
      const entries: TrickEntryData[] = [
        { playerName: 'Alice', tricksTaken: 2 },
        { playerName: 'Bob', tricksTaken: 3 },
        { playerName: 'Charlie', tricksTaken: 1 },
        { playerName: 'Diana', tricksTaken: 4 }
      ];
      const errors = validator.validateAllTricks(entries, 10);
      expect(errors).toHaveLength(0);
    });

    it('should reject when non-array passed', () => {
      const errors = validator.validateAllTricks(null as any, 3);
      expect(errors).toHaveLength(1);
      expect(errors[0].message).toContain('must be an array');
    });
  });

  describe('getRemainingTricks', () => {
    it('should calculate remaining tricks correctly', () => {
      const remaining = validator.getRemainingTricks(3, [1]);
      expect(remaining).toBe(2);
    });

    it('should return full round number when no entries', () => {
      const remaining = validator.getRemainingTricks(5, []);
      expect(remaining).toBe(5);
    });

    it('should return zero when all tricks entered', () => {
      const remaining = validator.getRemainingTricks(4, [1, 2, 1]);
      expect(remaining).toBe(0);
    });

    it('should handle multiple previous entries', () => {
      const remaining = validator.getRemainingTricks(10, [2, 3, 1, 2]);
      expect(remaining).toBe(2);
    });
  });
});
