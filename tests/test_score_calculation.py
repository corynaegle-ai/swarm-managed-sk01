"""Test suite for Score Calculation Engine."""

import pytest
from src.scoring.score_calculation import calculate_score, ScoreCalculation


class TestBid1PlusCorrect:
    """Tests for bid 1+, correct outcome."""
    
    def test_bid_2_tricks_2_correct(self):
        """Bid 1+, correct: score = 20 × tricks taken."""
        result = calculate_score(bid=2, tricks_taken=2, hands_in_round=10)
        assert result.bid_correct is True
        assert result.base_score == 40  # 20 * 2
        assert result.total_score == 40
    
    def test_bid_5_tricks_5_correct(self):
        """Bid 1+, correct: score = 20 × tricks taken."""
        result = calculate_score(bid=5, tricks_taken=5, hands_in_round=10)
        assert result.bid_correct is True
        assert result.base_score == 100  # 20 * 5
        assert result.total_score == 100
    
    def test_bid_1_tricks_1_correct(self):
        """Bid 1+, correct: score = 20 × tricks taken."""
        result = calculate_score(bid=1, tricks_taken=1, hands_in_round=10)
        assert result.bid_correct is True
        assert result.base_score == 20  # 20 * 1
        assert result.total_score == 20


class TestBid1PlusIncorrect:
    """Tests for bid 1+, incorrect outcome."""
    
    def test_bid_3_tricks_1_incorrect(self):
        """Bid 1+, incorrect: score = -10 × |bid - tricks|."""
        result = calculate_score(bid=3, tricks_taken=1, hands_in_round=10)
        assert result.bid_correct is False
        assert result.base_score == -20  # -10 * |3 - 1| = -10 * 2
        assert result.total_score == -20
    
    def test_bid_2_tricks_5_incorrect(self):
        """Bid 1+, incorrect: score = -10 × |bid - tricks|."""
        result = calculate_score(bid=2, tricks_taken=5, hands_in_round=10)
        assert result.bid_correct is False
        assert result.base_score == -30  # -10 * |2 - 5| = -10 * 3
        assert result.total_score == -30
    
    def test_bid_4_tricks_0_incorrect(self):
        """Bid 1+, incorrect: score = -10 × |bid - tricks|."""
        result = calculate_score(bid=4, tricks_taken=0, hands_in_round=10)
        assert result.bid_correct is False
        assert result.base_score == -40  # -10 * |4 - 0| = -10 * 4
        assert result.total_score == -40


class TestBid0Correct:
    """Tests for bid 0, correct outcome."""
    
    def test_bid_0_tricks_0_5_hands_correct(self):
        """Bid 0, correct: score = 10 × hands in round."""
        result = calculate_score(bid=0, tricks_taken=0, hands_in_round=5)
        assert result.bid_correct is True
        assert result.base_score == 50  # 10 * 5
        assert result.total_score == 50
    
    def test_bid_0_tricks_0_10_hands_correct(self):
        """Bid 0, correct: score = 10 × hands in round."""
        result = calculate_score(bid=0, tricks_taken=0, hands_in_round=10)
        assert result.bid_correct is True
        assert result.base_score == 100  # 10 * 10
        assert result.total_score == 100
    
    def test_bid_0_tricks_0_1_hand_correct(self):
        """Bid 0, correct: score = 10 × hands in round."""
        result = calculate_score(bid=0, tricks_taken=0, hands_in_round=1)
        assert result.bid_correct is True
        assert result.base_score == 10  # 10 * 1
        assert result.total_score == 10


class TestBid0Incorrect:
    """Tests for bid 0, incorrect outcome."""
    
    def test_bid_0_tricks_2_5_hands_incorrect(self):
        """Bid 0, incorrect: score = -10 × hands in round."""
        result = calculate_score(bid=0, tricks_taken=2, hands_in_round=5)
        assert result.bid_correct is False
        assert result.base_score == -50  # -10 * 5
        assert result.total_score == -50
    
    def test_bid_0_tricks_1_10_hands_incorrect(self):
        """Bid 0, incorrect: score = -10 × hands in round."""
        result = calculate_score(bid=0, tricks_taken=1, hands_in_round=10)
        assert result.bid_correct is False
        assert result.base_score == -100  # -10 * 10
        assert result.total_score == -100
    
    def test_bid_0_tricks_3_3_hands_incorrect(self):
        """Bid 0, incorrect: score = -10 × hands in round."""
        result = calculate_score(bid=0, tricks_taken=3, hands_in_round=3)
        assert result.bid_correct is False
        assert result.base_score == -30  # -10 * 3
        assert result.total_score == -30


class TestBonusPoints:
    """Tests for bonus point application."""
    
    def test_bonus_only_if_bid_correct_bid_1plus(self):
        """Bonus points only added if bid was exactly correct."""
        result = calculate_score(
            bid=3, tricks_taken=3, hands_in_round=10, bonus_points=15
        )
        assert result.bid_correct is True
        assert result.base_score == 60  # 20 * 3
        assert result.bonus_points == 15
        assert result.total_score == 75  # 60 + 15
    
    def test_bonus_not_applied_if_bid_incorrect_bid_1plus(self):
        """Bonus points not added if bid was incorrect."""
        result = calculate_score(
            bid=3, tricks_taken=2, hands_in_round=10, bonus_points=15
        )
        assert result.bid_correct is False
        assert result.base_score == -10  # -10 * |3 - 2|
        assert result.bonus_points == 0
        assert result.total_score == -10
    
    def test_bonus_only_if_bid_correct_bid_0(self):
        """Bonus points only added if bid 0 was exactly correct."""
        result = calculate_score(
            bid=0, tricks_taken=0, hands_in_round=10, bonus_points=20
        )
        assert result.bid_correct is True
        assert result.base_score == 100  # 10 * 10
        assert result.bonus_points == 20
        assert result.total_score == 120  # 100 + 20
    
    def test_bonus_not_applied_if_bid_0_incorrect(self):
        """Bonus points not added if bid 0 was incorrect."""
        result = calculate_score(
            bid=0, tricks_taken=1, hands_in_round=10, bonus_points=20
        )
        assert result.bid_correct is False
        assert result.base_score == -100  # -10 * 10
        assert result.bonus_points == 0
        assert result.total_score == -100


class TestScoreCalculationObject:
    """Tests for ScoreCalculation object structure."""
    
    def test_returns_score_calculation_object(self):
        """Returns ScoreCalculation object with breakdown."""
        result = calculate_score(bid=2, tricks_taken=2, hands_in_round=10)
        assert isinstance(result, ScoreCalculation)
        assert hasattr(result, 'bid')
        assert hasattr(result, 'tricks_taken')
        assert hasattr(result, 'hands_in_round')
        assert hasattr(result, 'base_score')
        assert hasattr(result, 'bonus_points')
        assert hasattr(result, 'total_score')
        assert hasattr(result, 'bid_correct')
    
    def test_score_calculation_values(self):
        """ScoreCalculation object contains correct values."""
        result = calculate_score(
            bid=3, tricks_taken=3, hands_in_round=8, bonus_points=10
        )
        assert result.bid == 3
        assert result.tricks_taken == 3
        assert result.hands_in_round == 8
        assert result.base_score == 60
        assert result.bonus_points == 10
        assert result.total_score == 70
        assert result.bid_correct is True


class TestInputValidation:
    """Tests for input validation and error handling."""
    
    def test_negative_bid_raises_error(self):
        """Negative bid raises ValueError."""
        with pytest.raises(ValueError, match="Bid must be non-negative"):
            calculate_score(bid=-1, tricks_taken=2, hands_in_round=10)
    
    def test_negative_tricks_raises_error(self):
        """Negative tricks taken raises ValueError."""
        with pytest.raises(ValueError, match="Tricks taken must be non-negative"):
            calculate_score(bid=2, tricks_taken=-1, hands_in_round=10)
    
    def test_zero_hands_raises_error(self):
        """Zero hands in round raises ValueError."""
        with pytest.raises(ValueError, match="Hands in round must be positive"):
            calculate_score(bid=2, tricks_taken=2, hands_in_round=0)
    
    def test_negative_hands_raises_error(self):
        """Negative hands in round raises ValueError."""
        with pytest.raises(ValueError, match="Hands in round must be positive"):
            calculate_score(bid=2, tricks_taken=2, hands_in_round=-5)
    
    def test_negative_bonus_raises_error(self):
        """Negative bonus points raises ValueError."""
        with pytest.raises(ValueError, match="Bonus points must be non-negative"):
            calculate_score(
                bid=2, tricks_taken=2, hands_in_round=10, bonus_points=-1
            )
