import 'package:flutter_test/flutter_test.dart';
import 'package:swarm_managed_sk01/models/game_state.dart';
import 'package:swarm_managed_sk01/services/game_flow.dart';

void main() {
  group('GameFlow', () {
    late GameFlow gameFlow;

    setUp(() {
      gameFlow = GameFlow();
    });

    test('initializes with round 1 and setup phase', () {
      expect(gameFlow.currentRound, equals(1));
      expect(gameFlow.currentPhase, equals(GamePhase.setup));
      expect(gameFlow.isGameComplete, isFalse);
    });

    test('progresses through phases in correct order: setup → bidding → scoring',
        () {
      expect(gameFlow.currentPhase, equals(GamePhase.setup));

      gameFlow.progressToNextPhase();
      expect(gameFlow.currentPhase, equals(GamePhase.bidding));

      gameFlow.progressToNextPhase();
      expect(gameFlow.currentPhase, equals(GamePhase.scoring));
    });

    test('completes round and moves to next round setup phase', () {
      gameFlow.progressToNextPhase(); // to bidding
      gameFlow.progressToNextPhase(); // to scoring

      gameFlow.completeRound();
      expect(gameFlow.currentRound, equals(2));
      expect(gameFlow.currentPhase, equals(GamePhase.setup));
    });

    test('rounds progress from 1 to 10', () {
      for (int i = 1; i < 10; i++) {
        expect(gameFlow.currentRound, equals(i));
        gameFlow.progressToNextPhase();
        gameFlow.progressToNextPhase();
        gameFlow.completeRound();
      }
      expect(gameFlow.currentRound, equals(10));
    });

    test('marks game complete after round 10', () {
      // Fast forward to round 10, scoring phase
      for (int i = 0; i < 9; i++) {
        gameFlow.progressToNextPhase();
        gameFlow.progressToNextPhase();
        gameFlow.completeRound();
      }

      // Now at round 10, setup
      expect(gameFlow.currentRound, equals(10));
      gameFlow.progressToNextPhase(); // to bidding
      gameFlow.progressToNextPhase(); // to scoring
      expect(gameFlow.isGameComplete, isFalse);

      gameFlow.completeRound();
      expect(gameFlow.isGameComplete, isTrue);
    });

    test('throws exception when trying to progress from scoring phase', () {
      gameFlow.progressToNextPhase(); // to bidding
      gameFlow.progressToNextPhase(); // to scoring

      expect(
        () => gameFlow.progressToNextPhase(),
        throwsA(isA<GameFlowException>()),
      );
    });

    test('throws exception when completing round not in scoring phase', () {
      expect(
        () => gameFlow.completeRound(),
        throwsA(isA<GameFlowException>()),
      );
    });

    test('throws exception when trying to progress after game complete', () {
      // Fast forward to game completion
      for (int i = 0; i < 10; i++) {
        gameFlow.progressToNextPhase();
        gameFlow.progressToNextPhase();
        gameFlow.completeRound();
      }

      expect(gameFlow.isGameComplete, isTrue);
      expect(
        () => gameFlow.progressToNextPhase(),
        throwsA(isA<GameFlowException>()),
      );
    });

    test('restarts game to initial state', () {
      gameFlow.progressToNextPhase();
      gameFlow.progressToNextPhase();
      gameFlow.completeRound();

      expect(gameFlow.currentRound, equals(2));
      expect(gameFlow.currentPhase, equals(GamePhase.setup));

      gameFlow.restart();
      expect(gameFlow.currentRound, equals(1));
      expect(gameFlow.currentPhase, equals(GamePhase.setup));
      expect(gameFlow.isGameComplete, isFalse);
    });

    test('completes full 10-round game flow', () {
      for (int round = 1; round <= 10; round++) {
        expect(gameFlow.currentRound, equals(round));
        expect(gameFlow.currentPhase, equals(GamePhase.setup));

        // Progress through all phases
        gameFlow.progressToNextPhase();
        expect(gameFlow.currentPhase, equals(GamePhase.bidding));

        gameFlow.progressToNextPhase();
        expect(gameFlow.currentPhase, equals(GamePhase.scoring));

        // Complete the round
        gameFlow.completeRound();

        if (round < 10) {
          expect(gameFlow.isGameComplete, isFalse);
        } else {
          expect(gameFlow.isGameComplete, isTrue);
        }
      }
    });
  });
}
