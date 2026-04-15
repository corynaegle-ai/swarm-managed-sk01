/**
 * Scoring module for Skull King game
 * Implements core score calculation engine
 */

/**
 * Calculate the score for a round based on bid, tricks taken, and bonus points
 * @param {number} bid - The number of tricks bid (0 or higher)
 * @param {number} tricksTaken - The actual number of tricks taken
 * @param {number} handsInRound - The total number of hands/rounds in play
 * @param {number} [bonusPoints=0] - Bonus points awarded (only applied if bid is correct)
 * @returns {Object} ScoreCalculation object with totalScore, baseScore, bonusScore, and breakdown
 */
function calculateScore(bid, tricksTaken, handsInRound, bonusPoints = 0) {
  // Input validation
  if (typeof bid !== 'number' || bid < 0) {
    throw new Error('Bid must be a non-negative number');
  }
  if (typeof tricksTaken !== 'number' || tricksTaken < 0) {
    throw new Error('Tricks taken must be a non-negative number');
  }
  if (typeof handsInRound !== 'number' || handsInRound < 1) {
    throw new Error('Hands in round must be a positive number');
  }
  if (typeof bonusPoints !== 'number' || bonusPoints < 0) {
    throw new Error('Bonus points must be a non-negative number');
  }

  let baseScore = 0;
  let bonusScore = 0;
  let breakdown = '';

  // Check if bid was correct (exact match)
  const bidCorrect = bid === tricksTaken;

  if (bid === 0) {
    // Bid 0 special rules: 10 points per hand if correct, -10 per hand if wrong
    if (bidCorrect) {
      baseScore = handsInRound * 10;
      bonusScore = bonusPoints;
      breakdown = `Zero bid successful: ${handsInRound} hands × 10 = ${baseScore}, bonus: ${bonusScore}`;
    } else {
      baseScore = handsInRound * -10;
      breakdown = `Zero bid failed: ${handsInRound} hands × -10 = ${baseScore}`;
    }
  } else {
    // Bid 1+: 20 points per trick if correct, -10 per difference if wrong
    if (bidCorrect) {
      baseScore = bid * 20;
      bonusScore = bonusPoints;
      breakdown = `${bid} tricks × 20 = ${baseScore}, bonus: ${bonusScore}`;
    } else {
      const difference = Math.abs(bid - tricksTaken);
      baseScore = -10 * difference;
      breakdown = `Missed by ${difference} tricks: ${baseScore}`;
    }
  }

  const totalScore = baseScore + bonusScore;

  return {
    totalScore: totalScore,
    baseScore: baseScore,
    bonusScore: bonusScore,
    breakdown: breakdown
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { calculateScore };
}
