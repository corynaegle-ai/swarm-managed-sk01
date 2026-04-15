import { describe, it, expect } from 'vitest';
import { scoreboardService } from '../ScoreboardService';

describe('ScoreboardService', () => {
  const mockPlayers = [
    {
      id: 1,
      name: 'Player 1',
      roundScores: [10, 20, 15],
      totalScore: 45
    },
    {
      id: 2,
      name: 'Player 2',
      roundScores: [15, 25, 20],
      totalScore: 60
    },
    {
      id: 3,
      name: 'Player 3',
      roundScores: [5, 10, 8],
      totalScore: 23
    }
  ];

  describe('getSortedPlayers', () => {
    it('sorts players by total score in descending order', () => {
      const sorted = scoreboardService.getSortedPlayers(mockPlayers);
      
      expect(sorted[0].totalScore).toBe(60);
      expect(sorted[1].totalScore).toBe(45);
      expect(sorted[2].totalScore).toBe(23);
    });

    it('returns empty array for invalid input', () => {
      expect(scoreboardService.getSortedPlayers(null)).toEqual([]);
      expect(scoreboardService.getSortedPlayers(undefined)).toEqual([]);
      expect(scoreboardService.getSortedPlayers('invalid')).toEqual([]);
    });

    it('does not mutate original array', () => {
      const original = [...mockPlayers];
      scoreboardService.getSortedPlayers(mockPlayers);
      
      expect(mockPlayers).toEqual(original);
    });
  });

  describe('getTotalScore', () => {
    it('returns player total score', () => {
      expect(scoreboardService.getTotalScore(mockPlayers[0])).toBe(45);
      expect(scoreboardService.getTotalScore(mockPlayers[1])).toBe(60);
    });

    it('returns 0 for player without totalScore', () => {
      expect(scoreboardService.getTotalScore({})).toBe(0);
      expect(scoreboardService.getTotalScore(null)).toBe(0);
    });
  });

  describe('getRoundScores', () => {
    it('returns array of round scores', () => {
      const scores = scoreboardService.getRoundScores(mockPlayers[0]);
      expect(scores).toEqual([10, 20, 15]);
    });

    it('returns empty array for player without roundScores', () => {
      expect(scoreboardService.getRoundScores({})).toEqual([]);
      expect(scoreboardService.getRoundScores(null)).toEqual([]);
    });
  });

  describe('getAverageScore', () => {
    it('calculates average score correctly', () => {
      const avg = scoreboardService.getAverageScore(mockPlayers[0]);
      expect(avg).toBe(15); // (10 + 20 + 15) / 3 = 15
    });

    it('returns 0 for player with no rounds', () => {
      expect(scoreboardService.getAverageScore({})).toBe(0);
    });

    it('handles single round', () => {
      const player = { roundScores: [25] };
      expect(scoreboardService.getAverageScore(player)).toBe(25);
    });
  });

  describe('getHighestRoundScore', () => {
    it('returns highest round score', () => {
      expect(scoreboardService.getHighestRoundScore(mockPlayers[0])).toBe(20);
      expect(scoreboardService.getHighestRoundScore(mockPlayers[1])).toBe(25);
    });

    it('returns 0 for player with no rounds', () => {
      expect(scoreboardService.getHighestRoundScore({})).toBe(0);
    });
  });

  describe('getLowestRoundScore', () => {
    it('returns lowest round score', () => {
      expect(scoreboardService.getLowestRoundScore(mockPlayers[0])).toBe(10);
      expect(scoreboardService.getLowestRoundScore(mockPlayers[1])).toBe(15);
    });

    it('returns 0 for player with no rounds', () => {
      expect(scoreboardService.getLowestRoundScore({})).toBe(0);
    });
  });

  describe('getTotalRounds', () => {
    it('returns total number of rounds', () => {
      expect(scoreboardService.getTotalRounds(mockPlayers)).toBe(3);
    });

    it('returns 0 for empty players array', () => {
      expect(scoreboardService.getTotalRounds([])).toBe(0);
      expect(scoreboardService.getTotalRounds(null)).toBe(0);
    });

    it('handles players with different round counts', () => {
      const players = [
        { roundScores: [1, 2, 3, 4] },
        { roundScores: [1, 2] }
      ];
      expect(scoreboardService.getTotalRounds(players)).toBe(4);
    });
  });

  describe('getPlayerById', () => {
    it('returns player by ID', () => {
      const player = scoreboardService.getPlayerById(mockPlayers, 1);
      expect(player.name).toBe('Player 1');
    });

    it('returns null if player not found', () => {
      expect(scoreboardService.getPlayerById(mockPlayers, 999)).toBe(null);
    });

    it('returns null for invalid input', () => {
      expect(scoreboardService.getPlayerById(null, 1)).toBe(null);
      expect(scoreboardService.getPlayerById('invalid', 1)).toBe(null);
    });
  });

  describe('getPlayerRank', () => {
    it('returns player rank in sorted order', () => {
      expect(scoreboardService.getPlayerRank(mockPlayers, 2)).toBe(1); // Highest score
      expect(scoreboardService.getPlayerRank(mockPlayers, 1)).toBe(2);
      expect(scoreboardService.getPlayerRank(mockPlayers, 3)).toBe(3); // Lowest score
    });

    it('returns -1 if player not found', () => {
      expect(scoreboardService.getPlayerRank(mockPlayers, 999)).toBe(-1);
    });
  });

  describe('formatScore', () => {
    it('formats integer scores as strings', () => {
      expect(scoreboardService.formatScore(45)).toBe('45');
      expect(scoreboardService.formatScore(0)).toBe('0');
    });

    it('formats decimal scores to 2 decimal places', () => {
      expect(scoreboardService.formatScore(45.5)).toBe('45.50');
      expect(scoreboardService.formatScore(45.123)).toBe('45.12');
    });
  });

  describe('getRoundScore', () => {
    it('returns score for specific round', () => {
      expect(scoreboardService.getRoundScore(mockPlayers[0], 0)).toBe(10);
      expect(scoreboardService.getRoundScore(mockPlayers[0], 1)).toBe(20);
      expect(scoreboardService.getRoundScore(mockPlayers[0], 2)).toBe(15);
    });

    it('returns 0 for non-existent round', () => {
      expect(scoreboardService.getRoundScore(mockPlayers[0], 10)).toBe(0);
      expect(scoreboardService.getRoundScore({}, 0)).toBe(0);
    });
  });
});
