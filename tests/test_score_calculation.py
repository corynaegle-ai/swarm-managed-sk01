"""Tests for Skull King score calculation engine."""

import pytest
from src.score_calculation import SkullKingScoreEngine, ScoreCalculation


class TestBid1PlusCorrect:
    """Test cases for bid 1+, correct guesses (Criterion 1)."""

    def test_bid_1_correct_1_trick(self):
        """Test bid 1, take 1 trick: score = 20 × 1 = 20."""
        result = SkullKingScoreEngine.calculate(bid=1, tricks_taken=1, hands_in_round=1)
        assert result.base_score == 20
        assert result.penalty == 0
        assert result.bonus == 0
        assert result.total == 20

    def test_bid_3_correct_3_tricks(self):
        """Test bid 3, take 3 tricks: score = 20 × 3 = 60."""
        result = SkullKingScoreEngine.calculate(bid=3, tricks_taken=3, hands_in_round=3)
        assert result.base_score == 60
        assert result.penalty == 0
        assert result.bonus == 0
        assert result.total == 60

    def test_bid_5_correct_5_tricks(self):
        """Test bid 5, take 5 tricks: score = 20 × 5 = 100."""
        result = SkullKingScoreEngine.calculate(bid=5, tricks_taken=5, hands_in_round=5)
        assert result.base_score == 100
        assert result.penalty == 0
        assert result.bonus == 0
        assert result.total == 100


class TestBid1PlusIncorrect:
    """Test cases for bid 1+, incorrect guesses (Criterion 2)."""

    def test_bid_3_took_1_trick(self):
        """Test bid 3, take 1 trick: score = -10 × |3-1| = -20."""
        result = SkullKingScoreEngine.calculate(bid=3, tricks_taken=1, hands_in_round=3)
        assert result.base_score == 0
        assert result.penalty == -20
        assert result.bonus == 0
        assert result.total == -20

    def test_bid_2_took_5_tricks(self):
        """Test bid 2, take 5 tricks: score = -10 × |2-5| = -30."""
        result = SkullKingScoreEngine.calculate(bid=2, tricks_taken=5, hands_in_round=5)
        assert result.base_score == 0
        assert result.penalty == -30
        assert result.bonus == 0
        assert result.total == -30

    def test_bid_4_took_1_trick(self):
        """Test bid 4, take 1 trick: score = -10 × |4-1| = -30."""
        result = SkullKingScoreEngine.calculate(bid=4, tricks_taken=1, hands_in_round=4)
        assert result.base_score == 0
        assert result.penalty == -30
        assert result.bonus == 0
        assert result.total == -30


class TestBid0Correct:
    """Test cases for bid 0, correct guesses (Criterion 3)."""

    def test_bid_0_correct_4_hands(self):
        """Test bid 0, no tricks, 4 hands: score = 10 × 4 = 40."""
        result = SkullKingScoreEngine.calculate(bid=0, tricks_taken=0, hands_in_round=4)
        assert result.base_score == 40
        assert result.penalty == 0
        assert result.bonus == 0
        assert result.total == 40

    def test_bid_0_correct_6_hands(self):
        """Test bid 0, no tricks, 6 hands: score = 10 × 6 = 60."""
        result = SkullKingScoreEngine.calculate(bid=0, tricks_taken=0, hands_in_round=6)
        assert result.base_score == 60
        assert result.penalty == 0
        assert result.bonus == 0
        assert result.total == 60

    def test_bid_0_correct_1_hand(self):
        """Test bid 0, no tricks, 1 hand: score = 10 × 1 = 10."""
        result = SkullKingScoreEngine.calculate(bid=0, tricks_taken=0, hands_in_round=1)
        assert result.base_score == 10
        assert result.penalty == 0
        assert result.bonus == 0
        assert result.total == 10


class TestBid0Incorrect:
    """Test cases for bid 0, incorrect guesses (Criterion 4)."""

    def test_bid_0_wrong_took_1_trick_4_hands(self):
        """Test bid 0, took 1 trick, 4 hands: score = -10 × 4 = -40."""
        result = SkullKingScoreEngine.calculate(bid=0, tricks_taken=1, hands_in_round=4)
        assert result.base_score == 0
        assert result.penalty == -40
        assert result.bonus == 0
        assert result.total == -40

    def test_bid_0_wrong_took_3_tricks_6_hands(self):
        """Test bid 0, took 3 tricks, 6 hands: score = -10 × 6 = -60."""
        result = SkullKingScoreEngine.calculate(bid=0, tricks_taken=3, hands_in_round=6)
        assert result.base_score == 0
        assert result.penalty == -60
        assert result.bonus == 0
        assert result.total == -60

    def test_bid_0_wrong_took_2_tricks_3_hands(self):
        """Test bid 0, took 2 tricks, 3 hands: score = -10 × 3 = -30."""
        result = SkullKingScoreEngine.calculate(bid=0, tricks_taken=2, hands_in_round=3)
        assert result.base_score == 0
        assert result.penalty == -30
        assert result.bonus == 0
        assert result.total == -30


class TestBonusPoints:
    """Test cases for bonus points (Criterion 5)."""

    def test_bonus_awarded_bid_1_correct(self):
        """Test bonus points awarded when bid 1 is correct."""
        result = SkullKingScoreEngine.calculate(
            bid=1, tricks_taken=1, hands_in_round=1, bonus_points=30
        )
        assert result.base_score == 20
        assert result.penalty == 0
        assert result.bonus == 30
        assert result.total == 50

    def test_bonus_awarded_bid_4_correct(self):
        """Test bonus points awarded when bid 4 is correct."""
        result = SkullKingScoreEngine.calculate(
            bid=4, tricks_taken=4, hands_in_round=4, bonus_points=50
        )
        assert result.base_score == 80
        assert result.penalty == 0
        assert result.bonus == 50
        assert result.total == 130

    def test_bonus_not_awarded_bid_1_incorrect(self):
        """Test bonus NOT awarded when bid 1 is incorrect."""
        result = SkullKingScoreEngine.calculate(
            bid=1, tricks_taken=3, hands_in_round=3, bonus_points=30
        )
        assert result.base_score == 0
        assert result.penalty == -20
        assert result.bonus == 0  # Bonus not awarded
        assert result.total == -20

    def test_bonus_not_awarded_bid_0_incorrect(self):
        """Test bonus NOT awarded when bid 0 is incorrect."""
        result = SkullKingScoreEngine.calculate(
            bid=0, tricks_taken=2, hands_in_round=4, bonus_points=40
        )
        assert result.base_score == 0
        assert result.penalty == -40
        assert result.bonus == 0  # Bonus not awarded
        assert result.total == -40

    def test_bonus_awarded_bid_0_correct(self):
        """Test bonus points awarded when bid 0 is correct."""
        result = SkullKingScoreEngine.calculate(
            bid=0, tricks_taken=0, hands_in_round=4, bonus_points=20
        )
        assert result.base_score == 40
        assert result.penalty == 0
        assert result.bonus == 20
        assert result.total == 60


class TestScoreCalculationObject:
    """Test cases for ScoreCalculation return object (Criterion 6)."""

    def test_returns_score_calculation_object(self):
        """Test that function returns ScoreCalculation object."""
        result = SkullKingScoreEngine.calculate(
            bid=2, tricks_taken=2, hands_in_round=3
        )
        assert isinstance(result, ScoreCalculation)
        assert hasattr(result, 'base_score')
        assert hasattr(result, 'penalty')
        assert hasattr(result, 'bonus')
        assert hasattr(result, 'total')

    def test_breakdown_components(self):
        """Test that breakdown includes all components."""
        result = SkullKingScoreEngine.calculate(
            bid=3, tricks_taken=3, hands_in_round=3, bonus_points=25
        )
        # Verify all components are present
        assert result.base_score == 60
        assert result.penalty == 0
        assert result.bonus == 25
        assert result.total == 85
        # Verify math: total should equal sum of components
        assert result.total == result.base_score + result.penalty + result.bonus


class TestEdgeCases:
    """Test edge cases and input validation."""

    def test_invalid_negative_bid(self):
        """Test that negative bid raises ValueError."""
        with pytest.raises(ValueError, match="Bid cannot be negative"):
            SkullKingScoreEngine.calculate(bid=-1, tricks_taken=0, hands_in_round=3)

    def test_invalid_negative_tricks(self):
        """Test that negative tricks raises ValueError."""
        with pytest.raises(ValueError, match="Tricks taken cannot be negative"):
            SkullKingScoreEngine.calculate(bid=0, tricks_taken=-1, hands_in_round=3)

    def test_invalid_zero_hands(self):
        """Test that zero hands raises ValueError."""
        with pytest.raises(ValueError, match="Hands in round must be positive"):
            SkullKingScoreEngine.calculate(bid=0, tricks_taken=0, hands_in_round=0)

    def test_invalid_negative_hands(self):
        """Test that negative hands raises ValueError."""
        with pytest.raises(ValueError, match="Hands in round must be positive"):
            SkullKingScoreEngine.calculate(bid=0, tricks_taken=0, hands_in_round=-1)

    def test_invalid_negative_bonus(self):
        """Test that negative bonus raises ValueError."""
        with pytest.raises(ValueError, match="Bonus points cannot be negative"):
            SkullKingScoreEngine.calculate(
                bid=1, tricks_taken=1, hands_in_round=1, bonus_points=-5
            )

    def test_zero_bid_zero_tricks(self):
        """Test bid 0 with zero tricks (correct edge case)."""
        result = SkullKingScoreEngine.calculate(bid=0, tricks_taken=0, hands_in_round=1)
        assert result.total == 10

    def test_high_bid_high_tricks(self):
        """Test high bid value."""
        result = SkullKingScoreEngine.calculate(bid=13, tricks_taken=13, hands_in_round=13)
        assert result.base_score == 260
        assert result.total == 260
