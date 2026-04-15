"""Score Calculation Engine for Skull King.

Implements complex scoring rules for bidding outcomes:
- Bid 1+: 20 points per trick if correct, -10 * |bid - tricks| if incorrect
- Bid 0: 10 * hands if correct, -10 * hands if incorrect
- Bonus points only awarded if bid is exactly correct
"""

from dataclasses import dataclass, field
from typing import Optional


@dataclass
class ScoreCalculation:
    """Breakdown of score calculation for a single bid."""
    bid: int
    tricks_taken: int
    hands_in_round: int
    base_score: int
    bonus_points: int = 0
    total_score: int = field(init=False)
    bid_correct: bool = field(init=False)
    
    def __post_init__(self) -> None:
        """Calculate derived fields after initialization."""
        self.bid_correct = (self.bid == self.tricks_taken)
        self.total_score = self.base_score + self.bonus_points


def calculate_score(
    bid: int,
    tricks_taken: int,
    hands_in_round: int,
    bonus_points: int = 0
) -> ScoreCalculation:
    """Calculate score for a bid outcome.
    
    Args:
        bid: Number of tricks bid (0 or higher)
        tricks_taken: Actual number of tricks taken
        hands_in_round: Number of hands in the current round
        bonus_points: Bonus points earned (only applied if bid is correct)
        
    Returns:
        ScoreCalculation object with score breakdown
        
    Raises:
        ValueError: If parameters are invalid
    """
    # Input validation
    if bid < 0:
        raise ValueError(f"Bid must be non-negative, got {bid}")
    if tricks_taken < 0:
        raise ValueError(f"Tricks taken must be non-negative, got {tricks_taken}")
    if hands_in_round <= 0:
        raise ValueError(f"Hands in round must be positive, got {hands_in_round}")
    if bonus_points < 0:
        raise ValueError(f"Bonus points must be non-negative, got {bonus_points}")
    
    bid_correct = (bid == tricks_taken)
    
    if bid == 0:
        # Bid 0: 10 * hands if correct, -10 * hands if incorrect
        base_score = 10 * hands_in_round if bid_correct else -10 * hands_in_round
    else:
        # Bid 1+: 20 * tricks if correct, -10 * |bid - tricks| if incorrect
        base_score = (
            20 * tricks_taken if bid_correct
            else -10 * abs(bid - tricks_taken)
        )
    
    # Bonus points only awarded if bid is exactly correct
    bonus = bonus_points if bid_correct else 0
    
    return ScoreCalculation(
        bid=bid,
        tricks_taken=tricks_taken,
        hands_in_round=hands_in_round,
        base_score=base_score,
        bonus_points=bonus
    )
