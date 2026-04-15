import '../models/game_state.dart';

/// Exception thrown when attempting invalid game flow transitions
class GameFlowException implements Exception {
  final String message;
  GameFlowException(this.message);
  
  @override
  String toString() => 'GameFlowException: $message';
}

/// Manages the progression through game phases and rounds
class GameFlow {
  GameState _gameState;

  /// Creates a new GameFlow instance with initial state
  GameFlow() : _gameState = GameState();

  /// Gets the current game state
  GameState get gameState => _gameState;

  /// Gets the current round number (1-10)
  int get currentRound => _gameState.currentRound;

  /// Gets the current phase
  GamePhase get currentPhase => _gameState.currentPhase;

  /// Checks if the game is complete
  bool get isGameComplete => _gameState.isGameComplete;

  /// Progresses to the next phase in the correct order
  /// Throws GameFlowException if trying to progress when round is incomplete
  void progressToNextPhase() {
    if (isGameComplete) {
      throw GameFlowException('Cannot progress: game is already complete');
    }

    final nextPhase = _getNextPhase(currentPhase);
    _gameState = _gameState.copyWith(currentPhase: nextPhase);
  }

  /// Completes the current round and moves to the next one
  /// Automatically moves to setup phase of next round
  /// Sets game complete flag if round 10 was just completed
  /// Throws GameFlowException if current phase is not scoring
  void completeRound() {
    if (currentPhase != GamePhase.scoring) {
      throw GameFlowException(
        'Cannot complete round: must be in scoring phase, currently in $currentPhase',
      );
    }

    if (currentRound >= 10) {
      // Game is complete after round 10
      _gameState = _gameState.copyWith(
        isGameComplete: true,
      );
    } else {
      // Move to next round
      _gameState = _gameState.copyWith(
        currentRound: currentRound + 1,
        currentPhase: GamePhase.setup,
      );
    }
  }

  /// Resets the game to the initial state
  void restart() {
    _gameState = GameState();
  }

  /// Returns the next phase in sequence: setup → bidding → scoring
  static GamePhase _getNextPhase(GamePhase currentPhase) {
    switch (currentPhase) {
      case GamePhase.setup:
        return GamePhase.bidding;
      case GamePhase.bidding:
        return GamePhase.scoring;
      case GamePhase.scoring:
        throw GameFlowException(
          'Cannot progress from scoring phase. Use completeRound() instead.',
        );
    }
  }
}
