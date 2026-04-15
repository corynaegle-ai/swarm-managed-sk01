import 'package:flutter_test/flutter_test.dart';
import 'package:swarm_managed_sk01/models/game_state.dart';

void main() {
  group('GameState', () {
    test('initializes with default values', () {
      final gameState = GameState();
      expect(gameState.currentRound, equals(1));
      expect(gameState.currentPhase, equals(GamePhase.setup));
      expect(gameState.isGameComplete, isFalse);
    });

    test('initializes with custom values', () {
      final gameState = GameState(
        currentRound: 5,
        currentPhase: GamePhase.bidding,
        isGameComplete: false,
      );
      expect(gameState.currentRound, equals(5));
      expect(gameState.currentPhase, equals(GamePhase.bidding));
      expect(gameState.isGameComplete, isFalse);
    });

    test('copyWith creates new instance with overrides', () {
      final gameState1 = GameState(
        currentRound: 3,
        currentPhase: GamePhase.setup,
      );
      final gameState2 = gameState1.copyWith(
        currentRound: 4,
        currentPhase: GamePhase.bidding,
      );

      expect(gameState2.currentRound, equals(4));
      expect(gameState2.currentPhase, equals(GamePhase.bidding));
      expect(gameState1.currentRound, equals(3)); // Original unchanged
    });

    test('toString returns formatted string', () {
      final gameState = GameState(
        currentRound: 2,
        currentPhase: GamePhase.bidding,
        isGameComplete: false,
      );
      expect(
        gameState.toString(),
        contains('round: 2'),
      );
    });
  });
}
