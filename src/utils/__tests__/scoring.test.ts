import {
  calculateScores,
  isValidBonus,
  getEligibleBonusPlayers,
} from '../scoring';
import { PlayerBid, BonusPoints } from '../../types/scoring';

describe('Scoring utilities', () => {
  describe('calculateScores', () => {
    const mockBids: PlayerBid[] = [
      { playerId: '1', playerName: 'Alice', bid: 10, bidCorrect: true },
      { playerId: '2', playerName: 'Bob', bid: 10, bidCorrect: false },
      { playerId: '3', playerName: 'Charlie', bid: 10, bidCorrect: true },
    ];

    it('should calculate base score of 1 for correct bids and 0 for incorrect', () => {
      const scores = calculateScores(mockBids, []);

      expect(scores[0].totalScore).toBe(1); // Alice: correct bid
      expect(scores[1].totalScore).toBe(0); // Bob: incorrect bid
      expect(scores[2].totalScore).toBe(1); // Charlie: correct bid
    });

    it('should only apply bonus points if bid was correct', () => {
      const bonuses: BonusPoints[] = [
        { playerId: '1', bonusAmount: 5 }, // Alice
        { playerId: '2', bonusAmount: 5 }, // Bob (should not be applied)
        { playerId: '3', bonusAmount: 3 }, // Charlie
      ];

      const scores = calculateScores(mockBids, bonuses);

      expect(scores[0].bonusPoints).toBe(5); // Alice gets bonus (bid correct)
      expect(scores[1].bonusPoints).toBe(0); // Bob doesn't get bonus (bid wrong)
      expect(scores[2].bonusPoints).toBe(3); // Charlie gets bonus (bid correct)
    });

    it('should calculate correct total scores with bonuses', () => {
      const bonuses: BonusPoints[] = [
        { playerId: '1', bonusAmount: 5 },
        { playerId: '3', bonusAmount: 3 },
      ];

      const scores = calculateScores(mockBids, bonuses);

      expect(scores[0].totalScore).toBe(6); // 1 (base) + 5 (bonus)
      expect(scores[1].totalScore).toBe(0); // 0 (base) + 0 (no bonus)
      expect(scores[2].totalScore).toBe(4); // 1 (base) + 3 (bonus)
    });

    it('should default bonus to 0 if not entered', () => {
      const bonuses: BonusPoints[] = [
        { playerId: '1', bonusAmount: 5 },
        // No bonus entry for Charlie
      ];

      const scores = calculateScores(mockBids, bonuses);

      expect(scores[2].bonusPoints).toBe(0); // Charlie gets 0 bonus (not entered)
      expect(scores[2].totalScore).toBe(1); // 1 (base) + 0 (bonus)
    });
  });

  describe('isValidBonus', () => {
    it('should accept non-negative numbers', () => {
      expect(isValidBonus(0)).toBe(true);
      expect(isValidBonus(5)).toBe(true);
      expect(isValidBonus(100)).toBe(true);
    });

    it('should reject negative numbers', () => {
      expect(isValidBonus(-1)).toBe(false);
      expect(isValidBonus(-100)).toBe(false);
    });

    it('should reject non-integer numbers', () => {
      expect(isValidBonus(5.5)).toBe(false);
      expect(isValidBonus(3.14)).toBe(false);
    });

    it('should accept string representations of non-negative integers', () => {
      expect(isValidBonus('0')).toBe(true);
      expect(isValidBonus('5')).toBe(true);
      expect(isValidBonus('100')).toBe(true);
    });

    it('should reject invalid string inputs', () => {
      expect(isValidBonus('abc')).toBe(false);
      expect(isValidBonus('-5')).toBe(false);
      expect(isValidBonus('5.5')).toBe(false);
    });
  });

  describe('getEligibleBonusPlayers', () => {
    it('should return only players with correct bids', () => {
      const mockBids: PlayerBid[] = [
        { playerId: '1', playerName: 'Alice', bid: 10, bidCorrect: true },
        { playerId: '2', playerName: 'Bob', bid: 10, bidCorrect: false },
        { playerId: '3', playerName: 'Charlie', bid: 10, bidCorrect: true },
      ];

      const eligible = getEligibleBonusPlayers(mockBids);

      expect(eligible).toHaveLength(2);
      expect(eligible[0].playerName).toBe('Alice');
      expect(eligible[1].playerName).toBe('Charlie');
    });

    it('should return empty array if no players have correct bids', () => {
      const mockBids: PlayerBid[] = [
        { playerId: '1', playerName: 'Alice', bid: 10, bidCorrect: false },
        { playerId: '2', playerName: 'Bob', bid: 10, bidCorrect: false },
      ];

      const eligible = getEligibleBonusPlayers(mockBids);

      expect(eligible).toHaveLength(0);
    });
  });
});
