import pytest
from game_flow.game_state import GameState


class TestGameState:
    """Test suite for GameState enum."""

    def test_game_state_values(self):
        """Test that all expected game states exist."""
        assert GameState.SETUP.value == "setup"
        assert GameState.BIDDING.value == "bidding"
        assert GameState.SCORING.value == "scoring"
        assert GameState.GAME_COMPLETED.value == "game_completed"

    def test_game_state_enum_members(self):
        """Test that all expected enum members exist."""
        states = [GameState.SETUP, GameState.BIDDING, GameState.SCORING, GameState.GAME_COMPLETED]
        assert len(states) == 4

    def test_game_state_comparison(self):
        """Test that game states can be compared."""
        assert GameState.SETUP == GameState.SETUP
        assert GameState.SETUP != GameState.BIDDING
        assert GameState.BIDDING != GameState.SCORING
