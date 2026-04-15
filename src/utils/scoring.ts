import { PlayerBid, BonusPoints, PlayerScore } from '../types/scoring';

/**
 * Calculate player scores including bonus points
 * Bonus points only apply if the player's bid was correct
 * @param bids - Array of player bids
 * @param bonuses - Array of bonus point entries
 * @returns Array of player scores with total scores
 */
export function calculateScores(
  bids: PlayerBid[],
  bonuses: BonusPoints[]
): PlayerScore[] {
  const bonusMap = new Map(bonuses.map((b) => [b.playerId, b.bonusAmount]));

  return bids.map((bid) => {
    // Base score: 1 point if bid is correct, 0 otherwise
    const baseScore = bid.bidCorrect ? 1 : 0;
    
    // Bonus points only count if bid was correct
    const bonusAmount = bid.bidCorrect ? bonusMap.get(bid.playerId) || 0 : 0;
    
    const totalScore = baseScore + bonusAmount;

    return {
      playerId: bid.playerId,
      playerName: bid.playerName,
      bid: bid.bid,
      bidCorrect: bid.bidCorrect,
      bonusPoints: bonusAmount,
      totalScore,
    };
  });
}

/**
 * Validate bonus point entry
 * @param amount - The bonus amount to validate
 * @returns true if valid (non-negative number), false otherwise
 */
export function isValidBonus(amount: number | string): boolean {
  if (typeof amount === 'string') {
    const parsed = parseInt(amount, 10);
    if (isNaN(parsed)) return false;
    amount = parsed;
  }
  return typeof amount === 'number' && amount >= 0 && Number.isInteger(amount);
}

/**
 * Get eligible players for bonus points (those with correct bids)
 * @param bids - Array of player bids
 * @returns Filtered array of players with correct bids
 */
export function getEligibleBonusPlayers(bids: PlayerBid[]): PlayerBid[] {
  return bids.filter((bid) => bid.bidCorrect);
}
