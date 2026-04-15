from game_flow.game_state import GameState
from game_flow.game_phase import GamePhase


class GameFlowManager:
    """Manages overall game flow across multiple rounds and phases."""

    TOTAL_ROUNDS = 10

    def __init__(self):
        """
        Initialize a GameFlowManager with round 1 and SETUP phase.
        """
        self._current_round = 1
        self._game_phase = GamePhase(GameState.SETUP)
        self._is_game_completed = False

    @property
    def current_round(self) -> int:
        """Get the current round number (1-10)."""
        return self._current_round

    @property
    def current_state(self) -> GameState:
        """Get the current game state."""
        return self._game_phase.current_state

    @property
    def is_game_completed(self) -> bool:
        """Check if the game is completed."""
        return self._is_game_completed

    def advance_phase(self) -> GameState:
        """
        Advance to the next phase within the current round.
        
        Returns:
            The new GameState after advancement
        
        Raises:
            ValueError: If trying to advance beyond the last phase before completing the round
        """
        if self._is_game_completed:
            raise ValueError("Cannot advance phase in a completed game")

        try:
            new_state = self._game_phase.advance_phase()
            return new_state
        except ValueError as e:
            raise ValueError(f"Cannot advance phase: {str(e)}")

    def advance_round(self) -> int:
        """
        Advance to the next round if the current round is complete.
        
        Returns:
            The new round number
        
        Raises:
            ValueError: If current round is not complete or game is already completed
        """
        if self._is_game_completed:
            raise ValueError("Cannot advance round: game is already completed")

        if not self._game_phase.is_round_complete():
            raise ValueError(
                f"Cannot advance to next round: current round {self._current_round} "
                f"is not complete (currently in {self._game_phase.current_state.value} phase)"
            )

        if self._current_round >= self.TOTAL_ROUNDS:
            raise ValueError(
                f"Cannot advance beyond round {self.TOTAL_ROUNDS}"
            )

        self._current_round += 1
        self._game_phase.reset_to_setup()
        return self._current_round

    def advance_to_next_round_or_complete(self) -> None:
        """
        Advance to the next round if possible, or mark game as completed if at round 10.
        
        Raises:
            ValueError: If current round is not complete
        """
        if not self._game_phase.is_round_complete():
            raise ValueError(
                f"Cannot advance: current round {self._current_round} "
                f"is not complete (currently in {self._game_phase.current_state.value} phase)"
            )

        if self._current_round >= self.TOTAL_ROUNDS:
            self._is_game_completed = True
        else:
            self.advance_round()

    def restart_game(self) -> None:
        """
        Restart the game by resetting to round 1 and SETUP phase.
        """
        self._current_round = 1
        self._game_phase = GamePhase(GameState.SETUP)
        self._is_game_completed = False

    def get_game_status(self) -> dict:
        """
        Get a comprehensive status of the current game state.
        
        Returns:
            A dictionary containing round, phase, and completion status
        """
        return {
            "current_round": self._current_round,
            "current_phase": self._game_phase.current_state.value,
            "is_game_completed": self._is_game_completed,
            "rounds_remaining": max(0, self.TOTAL_ROUNDS - self._current_round)
        }

    def __str__(self) -> str:
        """Return string representation of the game flow manager."""
        if self._is_game_completed:
            return f"GameFlowManager(Round {self._current_round}/{self.TOTAL_ROUNDS}, GAME_COMPLETED)"
        return f"GameFlowManager(Round {self._current_round}/{self.TOTAL_ROUNDS}, Phase: {self._game_phase.current_state.value})"

    def __repr__(self) -> str:
        """Return detailed string representation."""
        return self.__str__()
