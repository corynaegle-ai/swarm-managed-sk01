/// Enum representing the different phases of a game round
enum GamePhase {
  setup,
  bidding,
  scoring,
}

/// Represents the complete state of the game
class GameState {
  /// Current round number (1-10)
  int currentRound;
  
  /// Current phase in the game
  GamePhase currentPhase;
  
  /// Whether the game is complete (after round 10)
  bool isGameComplete;

  /// Creates a new GameState instance
  GameState({
    this.currentRound = 1,
    this.currentPhase = GamePhase.setup,
    this.isGameComplete = false,
  });

  /// Creates a copy of this GameState with optional overrides
  GameState copyWith({
    int? currentRound,
    GamePhase? currentPhase,
    bool? isGameComplete,
  }) {
    return GameState(
      currentRound: currentRound ?? this.currentRound,
      currentPhase: currentPhase ?? this.currentPhase,
      isGameComplete: isGameComplete ?? this.isGameComplete,
    );
  }

  @override
  String toString() {
    return 'GameState(round: $currentRound, phase: $currentPhase, complete: $isGameComplete)';
  }
}
