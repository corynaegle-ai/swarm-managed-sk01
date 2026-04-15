/**
 * Skull King Scoring Engine
 * Implements core scoring calculation logic for the Skull King card game
 */

/**
 * @typedef {Object} ScoreCalculation
 * @property {number} totalScore - The final score after all calculations
 * @property {number} baseScore - The base score before bonus points
 * @property {number} bonusScore - The bonus points awarded
 * @property {boolean} isCorrectBid - Whether the bid was correct (bid === tricks taken)
 * @property {string} scenario - Description of the scoring scenario applied
 */

/**
 * Calculate the score for a single hand in Skull King based on bid and tricks taken
 *
 * Scoring rules:
 * - Bid 1+, correct: 20 × tricks taken
 * - Bid 1+, incorrect: -10 × |bid - tricks taken|
 * - Bid 0, correct: 10 × hands in round
 * - Bid 0, incorrect: -10 × hands in round
 * - Bonus points: Only added when bid exactly equals tricks taken
 *
 * @param {number} bid - The number of tricks the player bid (0 or higher)
 * @param {number} tricksTaken - The actual number of tricks taken
 * @param {number} handsInRound - The total number of hands/rounds in play
 * @param {number} [bonusPoints=0] - Optional bonus points to add (only if bid is correct)
 * @returns {ScoreCalculation} Object containing totalScore, breakdown details, and scenario info
 * @throws {Error} If parameters are invalid
 */
function calculateScore(bid, tricksTaken, handsInRound, bonusPoints = 0) {
  // Input validation
  if (typeof bid !== 'number' || bid < 0) {
    throw new Error('Invalid bid: must be a non-negative number');
  }
  if (typeof tricksTaken !== 'number' || tricksTaken < 0) {
    throw new Error('Invalid tricksTaken: must be a non-negative number');
  }
  if (typeof handsInRound !== 'number' || handsInRound < 1) {
    throw new Error('Invalid handsInRound: must be a positive number');
  }
  if (typeof bonusPoints !== 'number' || bonusPoints < 0) {
    throw new Error('Invalid bonusPoints: must be a non-negative number');
  }

  // Determine if bid is correct
  const isCorrectBid = bid === tricksTaken;

  // Initialize score components
  let baseScore = 0;
  let bonusScore = 0;
  let scenario = '';

  // Apply scoring rules based on bid type and correctness
  if (bid === 0) {
    // Bid 0 scenario
    if (isCorrectBid) {
      // Bid 0, correct: 10 × hands in round
      baseScore = 10 * handsInRound;
      scenario = 'Bid 0 (correct)';
    } else {
      // Bid 0, incorrect: -10 × hands in round
      baseScore = -10 * handsInRound;
      scenario = 'Bid 0 (incorrect)';
    }
  } else {
    // Bid 1+ scenario
    if (isCorrectBid) {
      // Bid 1+, correct: 20 × tricks taken
      baseScore = 20 * tricksTaken;
      scenario = `Bid ${bid} (correct)`;
    } else {
      // Bid 1+, incorrect: -10 × |bid - tricks taken|
      baseScore = -10 * Math.abs(bid - tricksTaken);
      scenario = `Bid ${bid} (incorrect, off by ${Math.abs(bid - tricksTaken)})`;
    }
  }

  // Add bonus points only if bid is correct
  if (isCorrectBid && bonusPoints > 0) {
    bonusScore = bonusPoints;
  }

  const totalScore = baseScore + bonusScore;

  return {
    totalScore: totalScore,
    baseScore: baseScore,
    bonusScore: bonusScore,
    isCorrectBid: isCorrectBid,
    scenario: scenario
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { calculateScore };
}
