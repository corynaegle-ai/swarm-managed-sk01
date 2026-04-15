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
"""Score calculation engine for Skull King game.

Implements complex scoring rules for bid 1+ and bid 0 scenarios.
"""

from dataclasses import dataclass
from typing import Optional


@dataclass
class ScoreCalculation:
    """Represents a complete score calculation with breakdown.
    
    Attributes:
        base_score: The primary score from bid correctness
        penalty: Negative points for incorrect bids
        bonus: Bonus points awarded only if bid correct
        total: Sum of all score components
    """
    base_score: int
    penalty: int
    bonus: int
    total: int


class SkullKingScoreEngine:
    """Calculates Skull King scores based on bidding and tricks taken."""

    @staticmethod
    def calculate(
        bid: int,
        tricks_taken: int,
        hands_in_round: int,
        bonus_points: int = 0
    ) -> ScoreCalculation:
        """Calculate score for a player's round based on bid and tricks.
        
        Args:
            bid: Number of tricks bid (0 or higher)
            tricks_taken: Actual number of tricks won
            hands_in_round: Number of hands/cards in the round
            bonus_points: Bonus points to award if bid is correct (default 0)
            
        Returns:
            ScoreCalculation object with detailed score breakdown
            
        Raises:
            ValueError: If parameters are invalid
        """
        # Validate inputs
        if bid < 0:
            raise ValueError("Bid cannot be negative")
        if tricks_taken < 0:
            raise ValueError("Tricks taken cannot be negative")
        if hands_in_round <= 0:
            raise ValueError("Hands in round must be positive")
        if bonus_points < 0:
            raise ValueError("Bonus points cannot be negative")

        # Check if bid was correct
        bid_correct = bid == tricks_taken

        if bid == 0:
            # Bid 0 scoring
            if bid_correct:
                # Correct: 10 × hands + bonus
                base_score = 10 * hands_in_round
                penalty = 0
                bonus = bonus_points
            else:
                # Incorrect: -10 × hands
                base_score = 0
                penalty = -10 * hands_in_round
                bonus = 0
        else:
            # Bid 1+ scoring
            if bid_correct:
                # Correct: 20 × tricks taken + bonus
                base_score = 20 * tricks_taken
                penalty = 0
                bonus = bonus_points
            else:
                # Incorrect: -10 × |bid - tricks|
                base_score = 0
                penalty = -10 * abs(bid - tricks_taken)
                bonus = 0

        total = base_score + penalty + bonus

        return ScoreCalculation(
            base_score=base_score,
            penalty=penalty,
            bonus=bonus,
            total=total
        )
