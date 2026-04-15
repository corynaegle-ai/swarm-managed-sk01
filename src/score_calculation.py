"""Skull King score calculation engine."""

from dataclasses import dataclass


@dataclass
class ScoreCalculation:
    """Result object containing score breakdown."""

    base_score: int
    penalty: int
    bonus: int
    total: int


class SkullKingScoreEngine:
    """Engine for calculating Skull King game scores."""

    @staticmethod
    def calculate(
        bid: int,
        tricks_taken: int,
        hands_in_round: int,
        bonus_points: int = 0,
    ) -> ScoreCalculation:
        """Calculate score for a round of Skull King.

        Args:
            bid: Number of tricks bid (0 or 1+)
            tricks_taken: Number of tricks actually taken
            hands_in_round: Number of hands in the current round
            bonus_points: Optional bonus points to award

        Returns:
            ScoreCalculation object with base_score, penalty, bonus, and total

        Raises:
            ValueError: If any input is invalid
        """
        # Input validation
        if bid < 0:
            raise ValueError("Bid cannot be negative")
        if tricks_taken < 0:
            raise ValueError("Tricks taken cannot be negative")
        if hands_in_round <= 0:
            raise ValueError("Hands in round must be positive")
        if bonus_points < 0:
            raise ValueError("Bonus points cannot be negative")

        base_score = 0
        penalty = 0
        bonus = 0

        # Criterion 1 & 2: Bid 1+
        if bid >= 1:
            if tricks_taken == bid:
                # Criterion 1: Correct guess
                base_score = 20 * bid
                # Award bonus only if correct
                bonus = bonus_points if bonus_points > 0 else 0
            else:
                # Criterion 2: Incorrect guess
                penalty = -10 * abs(bid - tricks_taken)
        # Criterion 3 & 4: Bid 0
        else:  # bid == 0
            if tricks_taken == 0:
                # Criterion 3: Correct guess
                base_score = 10 * hands_in_round
                # Award bonus only if correct
                bonus = bonus_points if bonus_points > 0 else 0
            else:
                # Criterion 4: Incorrect guess
                penalty = -10 * hands_in_round

        # Calculate total (Criterion 6)
        total = base_score + penalty + bonus

        return ScoreCalculation(
            base_score=base_score,
            penalty=penalty,
            bonus=bonus,
            total=total,
        )
