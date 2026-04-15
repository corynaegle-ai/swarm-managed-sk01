from game_flow.game_state import GameState


class GamePhase:
    """Manages the current game phase and phase transitions."""

    # Define the phase progression order
    PHASE_ORDER = [GameState.SETUP, GameState.BIDDING, GameState.SCORING]

    def __init__(self, initial_state: GameState = GameState.SETUP):
        """
        Initialize a GamePhase with an initial state.
        
        Args:
            initial_state: The initial GameState (default: SETUP)
        
        Raises:
            ValueError: If initial_state is GAME_COMPLETED
        """
        if initial_state == GameState.GAME_COMPLETED:
            raise ValueError("Cannot initialize GamePhase with GAME_COMPLETED state")
        self._current_state = initial_state

    @property
    def current_state(self) -> GameState:
        """Get the current game state."""
        return self._current_state

    def advance_phase(self) -> GameState:
        """
        Advance to the next phase in the progression.
        
        Returns:
            The new GameState after advancement
        
        Raises:
            ValueError: If current state is GAME_COMPLETED or not in valid progression
        """
        if self._current_state == GameState.GAME_COMPLETED:
            raise ValueError("Cannot advance from GAME_COMPLETED state")

        if self._current_state not in self.PHASE_ORDER:
            raise ValueError(f"Current state {self._current_state} not in valid phase progression")

        current_index = self.PHASE_ORDER.index(self._current_state)
        if current_index < len(self.PHASE_ORDER) - 1:
            self._current_state = self.PHASE_ORDER[current_index + 1]
        else:
            # Already at the end of the phase progression
            raise ValueError("Cannot advance beyond the last phase in the round")

        return self._current_state

    def reset_to_setup(self) -> None:
        """
        Reset the current phase back to SETUP for the next round.
        
        Raises:
            ValueError: If current state is not SCORING
        """
        if self._current_state != GameState.SCORING:
            raise ValueError(f"Can only reset to SETUP from SCORING state, current state is {self._current_state}")
        self._current_state = GameState.SETUP

    def is_round_complete(self) -> bool:
        """
        Check if the current round is complete (i.e., at SCORING phase).
        
        Returns:
            True if in SCORING phase, False otherwise
        """
        return self._current_state == GameState.SCORING

    def __str__(self) -> str:
        """Return string representation of the current phase."""
        return f"GamePhase({self._current_state.value})"

    def __repr__(self) -> str:
        """Return detailed string representation."""
        return f"GamePhase(current_state={self._current_state.value})"
