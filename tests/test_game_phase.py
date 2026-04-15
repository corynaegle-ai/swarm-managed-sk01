import pytest
from game_flow.game_state import GameState
from game_flow.game_phase import GamePhase


class TestGamePhase:
    """Test suite for GamePhase class."""

    def test_initialization_default(self):
        """Test GamePhase initialization with default state."""
        phase = GamePhase()
        assert phase.current_state == GameState.SETUP

    def test_initialization_with_state(self):
        """Test GamePhase initialization with specific state."""
        phase = GamePhase(GameState.BIDDING)
        assert phase.current_state == GameState.BIDDING

    def test_initialization_invalid_state(self):
        """Test GamePhase initialization with GAME_COMPLETED raises error."""
        with pytest.raises(ValueError, match="Cannot initialize GamePhase with GAME_COMPLETED state"):
            GamePhase(GameState.GAME_COMPLETED)

    def test_advance_phase_from_setup(self):
        """Test advancing from SETUP to BIDDING."""
        phase = GamePhase(GameState.SETUP)
        new_state = phase.advance_phase()
        assert new_state == GameState.BIDDING
        assert phase.current_state == GameState.BIDDING

    def test_advance_phase_from_bidding(self):
        """Test advancing from BIDDING to SCORING."""
        phase = GamePhase(GameState.BIDDING)
        new_state = phase.advance_phase()
        assert new_state == GameState.SCORING
        assert phase.current_state == GameState.SCORING

    def test_advance_phase_from_scoring_raises_error(self):
        """Test that advancing from SCORING raises error."""
        phase = GamePhase(GameState.SCORING)
        with pytest.raises(ValueError, match="Cannot advance beyond the last phase in the round"):
            phase.advance_phase()

    def test_phase_progression_sequence(self):
        """Test the complete phase progression sequence."""
        phase = GamePhase(GameState.SETUP)
        assert phase.current_state == GameState.SETUP
        
        phase.advance_phase()
        assert phase.current_state == GameState.BIDDING
        
        phase.advance_phase()
        assert phase.current_state == GameState.SCORING

    def test_reset_to_setup_from_scoring(self):
        """Test reset to SETUP from SCORING."""
        phase = GamePhase(GameState.SCORING)
        phase.reset_to_setup()
        assert phase.current_state == GameState.SETUP

    def test_reset_to_setup_from_invalid_state(self):
        """Test that reset from non-SCORING state raises error."""
        phase = GamePhase(GameState.SETUP)
        with pytest.raises(ValueError, match="Can only reset to SETUP from SCORING state"):
            phase.reset_to_setup()

    def test_is_round_complete_at_setup(self):
        """Test is_round_complete returns False at SETUP."""
        phase = GamePhase(GameState.SETUP)
        assert not phase.is_round_complete()

    def test_is_round_complete_at_bidding(self):
        """Test is_round_complete returns False at BIDDING."""
        phase = GamePhase(GameState.BIDDING)
        assert not phase.is_round_complete()

    def test_is_round_complete_at_scoring(self):
        """Test is_round_complete returns True at SCORING."""
        phase = GamePhase(GameState.SCORING)
        assert phase.is_round_complete()

    def test_string_representation(self):
        """Test string representation of GamePhase."""
        phase = GamePhase(GameState.SETUP)
        assert str(phase) == "GamePhase(setup)"
        assert repr(phase) == "GamePhase(current_state=setup)"

    def test_multiple_rounds_simulation(self):
        """Test simulating multiple round cycles."""
        phase = GamePhase(GameState.SETUP)
        
        for _ in range(3):
            # Simulate one round
            assert phase.current_state == GameState.SETUP
            phase.advance_phase()
            assert phase.current_state == GameState.BIDDING
            phase.advance_phase()
            assert phase.current_state == GameState.SCORING
            
            # Reset for next round
            phase.reset_to_setup()
