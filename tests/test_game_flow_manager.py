import pytest
from game_flow.game_state import GameState
from game_flow.game_flow_manager import GameFlowManager


class TestGameFlowManager:
    """Test suite for GameFlowManager class."""

    def test_initialization(self):
        """Test GameFlowManager initialization."""
        manager = GameFlowManager()
        assert manager.current_round == 1
        assert manager.current_state == GameState.SETUP
        assert not manager.is_game_completed

    def test_total_rounds_constant(self):
        """Test that TOTAL_ROUNDS is 10."""
        manager = GameFlowManager()
        assert manager.TOTAL_ROUNDS == 10

    def test_advance_phase(self):
        """Test advancing through phases."""
        manager = GameFlowManager()
        
        assert manager.current_state == GameState.SETUP
        manager.advance_phase()
        assert manager.current_state == GameState.BIDDING
        manager.advance_phase()
        assert manager.current_state == GameState.SCORING

    def test_advance_phase_beyond_scoring_raises_error(self):
        """Test that advancing beyond SCORING in a round raises error."""
        manager = GameFlowManager()
        manager.advance_phase()  # SETUP -> BIDDING
        manager.advance_phase()  # BIDDING -> SCORING
        
        with pytest.raises(ValueError, match="Cannot advance phase"):
            manager.advance_phase()

    def test_advance_round_without_completion_raises_error(self):
        """Test that advancing round without completion raises error."""
        manager = GameFlowManager()
        
        with pytest.raises(ValueError, match="is not complete"):
            manager.advance_round()

    def test_advance_round_after_completion(self):
        """Test advancing round after completing all phases."""
        manager = GameFlowManager()
        manager.advance_phase()  # SETUP -> BIDDING
        manager.advance_phase()  # BIDDING -> SCORING
        
        new_round = manager.advance_round()
        assert new_round == 2
        assert manager.current_round == 2
        assert manager.current_state == GameState.SETUP

    def test_single_round_completion(self):
        """Test completing a single round."""
        manager = GameFlowManager()
        
        # Execute full round
        manager.advance_phase()  # SETUP -> BIDDING
        assert manager.current_state == GameState.BIDDING
        manager.advance_phase()  # BIDDING -> SCORING
        assert manager.current_state == GameState.SCORING
        
        # Verify round is complete
        assert manager._game_phase.is_round_complete()

    def test_advance_to_next_round_or_complete_during_game(self):
        """Test advance_to_next_round_or_complete during game."""
        manager = GameFlowManager()
        manager.advance_phase()  # SETUP -> BIDDING
        manager.advance_phase()  # BIDDING -> SCORING
        
        manager.advance_to_next_round_or_complete()
        assert manager.current_round == 2
        assert not manager.is_game_completed

    def test_advance_to_next_round_or_complete_at_round_10(self):
        """Test advance_to_next_round_or_complete at round 10 completes game."""
        manager = GameFlowManager()
        
        # Fast-forward to round 10
        for round_num in range(1, 10):
            manager.advance_phase()  # SETUP -> BIDDING
            manager.advance_phase()  # BIDDING -> SCORING
            manager.advance_round()
        
        assert manager.current_round == 10
        assert not manager.is_game_completed
        
        # Complete round 10
        manager.advance_phase()  # SETUP -> BIDDING
        manager.advance_phase()  # BIDDING -> SCORING
        manager.advance_to_next_round_or_complete()
        
        assert manager.is_game_completed
        assert manager.current_round == 10

    def test_cannot_advance_phase_in_completed_game(self):
        """Test that advancing phase in completed game raises error."""
        manager = GameFlowManager()
        manager._is_game_completed = True
        
        with pytest.raises(ValueError, match="Cannot advance phase in a completed game"):
            manager.advance_phase()

    def test_cannot_advance_round_in_completed_game(self):
        """Test that advancing round in completed game raises error."""
        manager = GameFlowManager()
        manager._is_game_completed = True
        
        with pytest.raises(ValueError, match="game is already completed"):
            manager.advance_round()

    def test_restart_game(self):
        """Test restarting the game."""
        manager = GameFlowManager()
        manager.advance_phase()
        manager.advance_phase()
        manager.advance_round()
        manager.advance_phase()
        
        manager.restart_game()
        
        assert manager.current_round == 1
        assert manager.current_state == GameState.SETUP
        assert not manager.is_game_completed

    def test_restart_completed_game(self):
        """Test restarting a completed game."""
        manager = GameFlowManager()
        manager._is_game_completed = True
        manager._current_round = 10
        
        manager.restart_game()
        
        assert manager.current_round == 1
        assert manager.current_state == GameState.SETUP
        assert not manager.is_game_completed

    def test_get_game_status(self):
        """Test getting game status."""
        manager = GameFlowManager()
        status = manager.get_game_status()
        
        assert status["current_round"] == 1
        assert status["current_phase"] == "setup"
        assert status["is_game_completed"] is False
        assert status["rounds_remaining"] == 9

    def test_get_game_status_mid_game(self):
        """Test getting game status in the middle of the game."""
        manager = GameFlowManager()
        manager.advance_phase()
        manager.advance_phase()
        manager.advance_round()
        manager.advance_phase()
        
        status = manager.get_game_status()
        
        assert status["current_round"] == 2
        assert status["current_phase"] == "bidding"
        assert status["is_game_completed"] is False
        assert status["rounds_remaining"] == 8

    def test_get_game_status_completed(self):
        """Test getting game status when game is completed."""
        manager = GameFlowManager()
        manager._is_game_completed = True
        manager._current_round = 10
        
        status = manager.get_game_status()
        
        assert status["current_round"] == 10
        assert status["is_game_completed"] is True
        assert status["rounds_remaining"] == 0

    def test_string_representation_ongoing(self):
        """Test string representation during game."""
        manager = GameFlowManager()
        assert "Round 1/10" in str(manager)
        assert "setup" in str(manager)

    def test_string_representation_completed(self):
        """Test string representation when game is completed."""
        manager = GameFlowManager()
        manager._is_game_completed = True
        assert "GAME_COMPLETED" in str(manager)

    def test_full_game_simulation(self):
        """Test simulating a full 10-round game."""
        manager = GameFlowManager()
        
        for round_num in range(1, 11):
            assert manager.current_round == round_num
            assert manager.current_state == GameState.SETUP
            
            # Progress through phases
            manager.advance_phase()
            assert manager.current_state == GameState.BIDDING
            manager.advance_phase()
            assert manager.current_state == GameState.SCORING
            
            # Complete round
            if round_num < 10:
                manager.advance_round()
                assert not manager.is_game_completed
            else:
                manager.advance_to_next_round_or_complete()
                assert manager.is_game_completed

    def test_prevent_exceeding_round_limit(self):
        """Test that we cannot exceed the 10-round limit."""
        manager = GameFlowManager()
        manager._current_round = 10
        manager._game_phase._current_state = GameState.SCORING
        
        with pytest.raises(ValueError, match="Cannot advance beyond round 10"):
            manager.advance_round()
