from enum import Enum


class GameState(Enum):
    """Enum representing the possible states of the game."""
    SETUP = "setup"
    BIDDING = "bidding"
    SCORING = "scoring"
    GAME_COMPLETED = "game_completed"
