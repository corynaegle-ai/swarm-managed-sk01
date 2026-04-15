/**
 * Test suite for game state management system
 * Tests phase tracking, round progression, and completion detection
 */

const {
  gameState,
  PHASES,
  GAME_CONFIG,
  initializeGame,
  resetGame,
  completeCurrentPhase,
  advancePhase,
  advanceRound,
  isRoundComplete,
  isGameComplete,
  validatePhaseTransition,
  getGameState,
  getCurrentRound,
  getCurrentPhase,
  isPhaseComplete,
  getNextPhase
} = require('../js/gameState');

// Test utilities
function assert(condition, message) {
  if (!condition) {
    throw new Error(`ASSERTION FAILED: ${message}`);
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`ASSERTION FAILED: ${message}\nExpected: ${expected}\nActual: ${actual}`);
  }
}

function assertDeepEqual(actual, expected, message) {
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  if (actualStr !== expectedStr) {
    throw new Error(`ASSERTION FAILED: ${message}\nExpected: ${expectedStr}\nActual: ${actualStr}`);
  }
}

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (error) {
    console.error(`✗ ${name}`);
    console.error(`  ${error.message}`);
    process.exit(1);
  }
}

// Test suite
console.log('\n=== Game State Management Tests ===\n');

test('Criterion 1: Game state tracks current phase (setup/bidding/scoring)', () => {
  resetGame();
  initializeGame();
  
  assertEqual(getCurrentPhase(), PHASES.SETUP, 'Initial phase should be setup');
  assert(Object.values(PHASES).includes(getCurrentPhase()), 'Current phase should be one of the valid phases');
});

test('Criterion 2: Round counter increments from 1 to 10', () => {
  resetGame();
  initializeGame();
  
  assertEqual(getCurrentRound(), 1, 'Initial round should be 1');
  
  // Test incrementing through all 10 rounds
  for (let i = 1; i < GAME_CONFIG.MAX_ROUNDS; i++) {
    assertEqual(getCurrentRound(), i, `Round should be ${i}`);
    
    // Complete all phases
    completeCurrentPhase();
    advancePhase();
    completeCurrentPhase();
    advancePhase();
    completeCurrentPhase();
    
    // Advance to next round
    advanceRound();
  }
  
  assertEqual(getCurrentRound(), GAME_CONFIG.MAX_ROUNDS, `Final round should be ${GAME_CONFIG.MAX_ROUNDS}`);
});

test('Criterion 3: Phase progression follows setup → bidding → scoring → next round', () => {
  resetGame();
  initializeGame();
  
  // Initial phase
  assertEqual(getCurrentPhase(), PHASES.SETUP, 'Should start at setup');
  
  // Setup → Bidding
  completeCurrentPhase();
  advancePhase();
  assertEqual(getCurrentPhase(), PHASES.BIDDING, 'Should advance to bidding');
  
  // Bidding → Scoring
  completeCurrentPhase();
  advancePhase();
  assertEqual(getCurrentPhase(), PHASES.SCORING, 'Should advance to scoring');
  
  // Scoring → Next round resets to Setup
  completeCurrentPhase();
  advanceRound();
  assertEqual(getCurrentPhase(), PHASES.SETUP, 'After advancing round, phase should reset to setup');
  assertEqual(getCurrentRound(), 2, 'Round should increment to 2');
});

test('Criterion 4: Prevents advancing to next round until current is complete', () => {
  resetGame();
  initializeGame();
  
  // Try to advance round without completing phases
  const result1 = advanceRound();
  assert(!result1.success, 'Should not advance round when phase not complete');
  assert(result1.error !== null, 'Should have error message');
  assertEqual(getCurrentRound(), 1, 'Round should still be 1');
  
  // Complete setup
  completeCurrentPhase();
  const result2 = advanceRound();
  assert(!result2.success, 'Should not advance round when not all phases complete');
  
  // Complete bidding
  advancePhase();
  completeCurrentPhase();
  const result3 = advanceRound();
  assert(!result3.success, 'Should not advance round when scoring not complete');
  
  // Complete scoring
  advancePhase();
  completeCurrentPhase();
  const result4 = advanceRound();
  assert(result4.success, 'Should advance round when all phases complete');
  assertEqual(getCurrentRound(), 2, 'Round should be 2');
});

test('Criterion 5: Detects game completion after round 10', () => {
  resetGame();
  initializeGame();
  
  // Game should not be complete at start
  assert(!isGameComplete(), 'Game should not be complete at start');
  
  // Complete rounds 1-9
  for (let i = 0; i < GAME_CONFIG.MAX_ROUNDS - 1; i++) {
    completeCurrentPhase();
    advancePhase();
    completeCurrentPhase();
    advancePhase();
    completeCurrentPhase();
    advanceRound();
  }
  
  // Should be at round 10
  assertEqual(getCurrentRound(), GAME_CONFIG.MAX_ROUNDS, 'Should be at round 10');
  assert(!isGameComplete(), 'Game should not be complete until round 10 finishes');
  
  // Complete round 10
  completeCurrentPhase();
  advancePhase();
  completeCurrentPhase();
  advancePhase();
  completeCurrentPhase();
  
  // Game should now be complete
  assert(isGameComplete(), 'Game should be complete after round 10 finishes');
});

test('Phase validation prevents invalid transitions', () => {
  resetGame();
  initializeGame();
  
  // Try to skip to scoring without completing setup
  const validation1 = validatePhaseTransition(PHASES.SCORING);
  assert(!validation1.isValid, 'Should not allow jumping to scoring from setup');
  assert(validation1.error !== null, 'Should have error message');
  
  // Complete setup and transition to bidding (should work)
  completeCurrentPhase();
  const validation2 = validatePhaseTransition(PHASES.BIDDING);
  assert(validation2.isValid, 'Should allow valid transition to bidding');
  advancePhase();
  
  // Try to go back to setup
  const validation3 = validatePhaseTransition(PHASES.SETUP);
  assert(!validation3.isValid, 'Should not allow going back to previous phase');
});

test('Round completion requires all phases to be complete', () => {
  resetGame();
  initializeGame();
  
  assert(!isRoundComplete(), 'Round should not be complete at start');
  
  completeCurrentPhase();
  assert(!isRoundComplete(), 'Round should not be complete with only setup done');
  
  advancePhase();
  completeCurrentPhase();
  assert(!isRoundComplete(), 'Round should not be complete with only setup and bidding done');
  
  advancePhase();
  completeCurrentPhase();
  assert(isRoundComplete(), 'Round should be complete when all phases done');
});

test('Game initialization sets proper initial state', () => {
  resetGame();
  const state = initializeGame();
  
  assertEqual(state.currentRound, 1, 'Should initialize to round 1');
  assertEqual(state.currentPhase, PHASES.SETUP, 'Should initialize to setup phase');
  assert(state.isInitialized, 'Should be marked as initialized');
});

test('Getting game state returns immutable copy', () => {
  resetGame();
  initializeGame();
  
  const state1 = getGameState();
  state1.currentRound = 99; // Mutate copy
  
  const state2 = getGameState();
  assertEqual(state2.currentRound, 1, 'Original state should not be affected by mutation of copy');
});

test('Cannot advance past round 10', () => {
  resetGame();
  initializeGame();
  
  // Complete all 10 rounds
  for (let i = 0; i < GAME_CONFIG.MAX_ROUNDS; i++) {
    completeCurrentPhase();
    advancePhase();
    completeCurrentPhase();
    advancePhase();
    completeCurrentPhase();
    
    if (i < GAME_CONFIG.MAX_ROUNDS - 1) {
      advanceRound();
    }
  }
  
  assertEqual(getCurrentRound(), GAME_CONFIG.MAX_ROUNDS, 'Should be at round 10');
  assert(isGameComplete(), 'Game should be complete');
  
  // Try to advance further
  const result = advanceRound();
  assert(!result.success, 'Should not allow advancing past round 10');
});

test('Phase completion tracking is phase-specific', () => {
  resetGame();
  initializeGame();
  
  assert(!isPhaseComplete(PHASES.SETUP), 'Setup should not be complete');
  assert(!isPhaseComplete(PHASES.BIDDING), 'Bidding should not be complete');
  assert(!isPhaseComplete(PHASES.SCORING), 'Scoring should not be complete');
  
  completeCurrentPhase();
  
  assert(isPhaseComplete(PHASES.SETUP), 'Setup should be complete');
  assert(!isPhaseComplete(PHASES.BIDDING), 'Bidding should not be complete');
  assert(!isPhaseComplete(PHASES.SCORING), 'Scoring should not be complete');
});

console.log('\n=== All Tests Passed ✓ ===\n');
