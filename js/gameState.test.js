/**
 * Test suite for Game State Manager
 * Tests all acceptance criteria and edge cases
 */

// Mock module.exports for Node.js testing environment
if (typeof module === 'undefined') {
  var module = { exports: {} };
}

// Import the module
const gameStateModule = require('./gameState.js');

const {
  initializeGame,
  getCurrentPhase,
  getCurrentRound,
  completePhase,
  canAdvancePhase,
  advancePhase,
  isGameComplete,
  resetGame,
  getGameState,
  PHASES,
  TOTAL_ROUNDS
} = gameStateModule;

// Test utilities
let testsPassed = 0;
let testsFailed = 0;

function test(description, testFn) {
  try {
    testFn();
    console.log(`✓ ${description}`);
    testsPassed++;
  } catch (error) {
    console.error(`✗ ${description}`);
    console.error(`  Error: ${error.message}`);
    testsFailed++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}. Expected ${expected}, got ${actual}`);
  }
}

function assertTrue(condition, message) {
  if (condition !== true) {
    throw new Error(message);
  }
}

function assertFalse(condition, message) {
  if (condition !== false) {
    throw new Error(message);
  }
}

// ============================================================
// ACCEPTANCE CRITERIA TESTS
// ============================================================

console.log('\n=== ACCEPTANCE CRITERIA TESTS ===\n');

// Criterion 1: Game initializes in 'setup' phase at round 1
test('AC1: Game initializes in setup phase at round 1', () => {
  initializeGame();
  assertEqual(getCurrentPhase(), PHASES.SETUP, 'Current phase should be setup');
  assertEqual(getCurrentRound(), 1, 'Current round should be 1');
});

// Criterion 2: Phase progression follows setup → bidding → scoring → next round
test('AC2: Phase progression order is correct (setup → bidding → scoring)', () => {
  initializeGame();
  
  // Start at setup
  assertEqual(getCurrentPhase(), PHASES.SETUP, 'Should start at setup');
  
  // Complete setup and advance
  completePhase();
  assertTrue(advancePhase(), 'Should advance from setup to bidding');
  assertEqual(getCurrentPhase(), PHASES.BIDDING, 'Should be at bidding');
  assertEqual(getCurrentRound(), 1, 'Should still be round 1');
  
  // Complete bidding and advance
  completePhase();
  assertTrue(advancePhase(), 'Should advance from bidding to scoring');
  assertEqual(getCurrentPhase(), PHASES.SCORING, 'Should be at scoring');
  assertEqual(getCurrentRound(), 1, 'Should still be round 1');
});

test('AC2: Phase progression advances to next round after scoring', () => {
  initializeGame();
  
  // Progress to scoring phase
  completePhase();
  advancePhase();
  completePhase();
  advancePhase();
  
  // Complete scoring and advance to next round
  completePhase();
  assertTrue(advancePhase(), 'Should advance to next round');
  assertEqual(getCurrentRound(), 2, 'Should advance to round 2');
  assertEqual(getCurrentPhase(), PHASES.SETUP, 'Should return to setup phase');
});

// Criterion 3: Cannot advance phases until current phase is marked complete
test('AC3: Cannot advance phase without completing current phase', () => {
  initializeGame();
  assertEqual(getCurrentPhase(), PHASES.SETUP, 'Start at setup');
  
  // Try to advance without completing
  assertFalse(canAdvancePhase(), 'Should not be able to advance incomplete phase');
  assertFalse(advancePhase(), 'advancePhase should return false when not complete');
  assertEqual(getCurrentPhase(), PHASES.SETUP, 'Should still be at setup');
});

test('AC3: Can advance phase after completing current phase', () => {
  initializeGame();
  
  completePhase();
  assertTrue(canAdvancePhase(), 'Should be able to advance after completing phase');
  assertTrue(advancePhase(), 'advancePhase should succeed after completing phase');
  assertEqual(getCurrentPhase(), PHASES.BIDDING, 'Should have advanced to bidding');
});

// Criterion 4: Game shows as complete after round 10 scoring phase
test('AC4: Game is incomplete at start', () => {
  initializeGame();
  assertFalse(isGameComplete(), 'Game should not be complete at start');
});

test('AC4: Game is complete after round 10 scoring', () => {
  initializeGame();
  
  // Progress through 10 rounds
  for (let round = 1; round <= TOTAL_ROUNDS; round++) {
    assertEqual(getCurrentRound(), round, `Should be at round ${round}`);
    
    // Setup phase
    assertEqual(getCurrentPhase(), PHASES.SETUP, 'Should be at setup');
    completePhase();
    advancePhase();
    
    // Bidding phase
    assertEqual(getCurrentPhase(), PHASES.BIDDING, 'Should be at bidding');
    completePhase();
    advancePhase();
    
    // Scoring phase
    assertEqual(getCurrentPhase(), PHASES.SCORING, 'Should be at scoring');
    completePhase();
    
    if (round < TOTAL_ROUNDS) {
      assertFalse(isGameComplete(), `Game should not be complete at round ${round} scoring`);
      advancePhase();
    } else {
      // After round 10 scoring
      assertTrue(advancePhase(), 'Should successfully advance from round 10 scoring');
      assertTrue(isGameComplete(), 'Game should be complete after round 10 scoring');
    }
  }
});

// Criterion 5: resetGame() returns to setup phase round 1
test('AC5: resetGame returns to setup phase round 1', () => {
  // Progress game forward
  initializeGame();
  completePhase();
  advancePhase();
  completePhase();
  advancePhase();
  completePhase();
  advancePhase();
  
  // Verify we're no longer at start
  assertEqual(getCurrentRound(), 2, 'Should be at round 2 before reset');
  assertEqual(getCurrentPhase(), PHASES.SETUP, 'Should be at setup before reset');
  
  // Reset
  resetGame();
  
  // Verify reset worked
  assertEqual(getCurrentPhase(), PHASES.SETUP, 'Should be at setup after reset');
  assertEqual(getCurrentRound(), 1, 'Should be at round 1 after reset');
  assertFalse(isGameComplete(), 'Game should not be complete after reset');
});

// ============================================================
// ADDITIONAL EDGE CASE TESTS
// ============================================================

console.log('\n=== ADDITIONAL EDGE CASE TESTS ===\n');

test('Edge case: Multiple resets work correctly', () => {
  for (let i = 0; i < 3; i++) {
    resetGame();
    assertEqual(getCurrentPhase(), PHASES.SETUP, `Reset ${i + 1}: Should be at setup`);
    assertEqual(getCurrentRound(), 1, `Reset ${i + 1}: Should be at round 1`);
  }
});

test('Edge case: Phase completion is reset between rounds', () => {
  initializeGame();
  
  // Complete first round
  completePhase();
  advancePhase();
  completePhase();
  advancePhase();
  completePhase();
  advancePhase();
  
  // Verify phase completion is reset in new round
  assertEqual(getCurrentRound(), 2, 'Should be at round 2');
  assertFalse(canAdvancePhase(), 'New round setup should not be complete');
});

test('Edge case: Cannot advance from round 10 scoring phase without completing', () => {
  initializeGame();
  
  // Fast-forward to round 10 scoring
  for (let round = 1; round < TOTAL_ROUNDS; round++) {
    completePhase();
    advancePhase();
    completePhase();
    advancePhase();
    completePhase();
    advancePhase();
  }
  
  // At round 10 setup
  assertEqual(getCurrentRound(), TOTAL_ROUNDS, 'Should be at round 10');
  
  // Progress to round 10 scoring
  completePhase();
  advancePhase();
  completePhase();
  advancePhase();
  assertEqual(getCurrentPhase(), PHASES.SCORING, 'Should be at round 10 scoring');
  
  // Try to advance without completing
  assertFalse(canAdvancePhase(), 'Should not be able to advance incomplete phase');
  assertFalse(isGameComplete(), 'Game should not be complete yet');
});

test('Module exports all expected functions', () => {
  assertTrue(
    typeof gameStateModule.initializeGame === 'function',
    'Should export initializeGame'
  );
  assertTrue(
    typeof gameStateModule.getCurrentPhase === 'function',
    'Should export getCurrentPhase'
  );
  assertTrue(
    typeof gameStateModule.getCurrentRound === 'function',
    'Should export getCurrentRound'
  );
  assertTrue(
    typeof gameStateModule.completePhase === 'function',
    'Should export completePhase'
  );
  assertTrue(
    typeof gameStateModule.canAdvancePhase === 'function',
    'Should export canAdvancePhase'
  );
  assertTrue(
    typeof gameStateModule.advancePhase === 'function',
    'Should export advancePhase'
  );
  assertTrue(
    typeof gameStateModule.isGameComplete === 'function',
    'Should export isGameComplete'
  );
  assertTrue(
    typeof gameStateModule.resetGame === 'function',
    'Should export resetGame'
  );
});

test('Constants are exported correctly', () => {
  assertTrue(
    gameStateModule.PHASES.SETUP === 'setup',
    'PHASES.SETUP should be setup'
  );
  assertTrue(
    gameStateModule.PHASES.BIDDING === 'bidding',
    'PHASES.BIDDING should be bidding'
  );
  assertTrue(
    gameStateModule.PHASES.SCORING === 'scoring',
    'PHASES.SCORING should be scoring'
  );
  assertEqual(
    gameStateModule.TOTAL_ROUNDS,
    10,
    'TOTAL_ROUNDS should be 10'
  );
});

// ============================================================
// TEST SUMMARY
// ============================================================

console.log(`\n=== TEST SUMMARY ===`);
console.log(`Tests passed: ${testsPassed}`);
console.log(`Tests failed: ${testsFailed}`);
console.log(`Total tests: ${testsPassed + testsFailed}`);

if (testsFailed === 0) {
  console.log('\n✓ All tests passed!');
} else {
  console.log(`\n✗ ${testsFailed} test(s) failed`);
  process.exit(1);
}
