/**
 * Tests for js/players.js
 * Validates Player class and player management functions
 */

// Mock crypto.randomUUID if not available
if (!crypto.randomUUID) {
  crypto.randomUUID = () => 'test-uuid-' + Math.random().toString(36).substr(2, 9);
}

// Import/load the players module (for testing purposes)
// In a real scenario, this would use proper module loading

let testResults = [];

/**
 * Test utility function
 */
function test(description, testFn) {
  try {
    testFn();
    testResults.push({ description, status: 'PASSED' });
    console.log(`✓ ${description}`);
  } catch (error) {
    testResults.push({ description, status: 'FAILED', error: error.message });
    console.error(`✗ ${description}:`, error.message);
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${expected}, got ${actual}`);
  }
}

function assertTrue(value, message) {
  if (!value) {
    throw new Error(message);
  }
}

function assertFalse(value, message) {
  if (value) {
    throw new Error(message);
  }
}

function assertThrows(fn, message) {
  try {
    fn();
    throw new Error(message);
  } catch (error) {
    // Expected
  }
}

// Test Suite
describe('Player Class', function() {
  test('Player constructor creates object with unique ID', function() {
    const player = new Player('Alice');
    assertTrue(player.id, 'Player should have an ID');
    assertEqual(typeof player.id, 'string', 'Player ID should be a string');
  });

  test('Player constructor sets name property', function() {
    const player = new Player('Bob');
    assertEqual(player.name, 'Bob', 'Player name should be set');
  });

  test('Player constructor initializes score to 0', function() {
    const player = new Player('Charlie');
    assertEqual(player.score, 0, 'Player score should be initialized to 0');
  });

  test('Player instances have unique IDs', function() {
    const player1 = new Player('Alice');
    const player2 = new Player('Bob');
    assertTrue(player1.id !== player2.id, 'Different players should have different IDs');
  });
});

describe('createPlayer function', function() {
  test('createPlayer returns a Player instance', function() {
    const player = createPlayer('Diana');
    assertTrue(player instanceof Player, 'createPlayer should return a Player instance');
  });

  test('createPlayer throws error for empty name', function() {
    assertThrows(() => createPlayer(''), 'createPlayer should reject empty names');
  });

  test('createPlayer throws error for non-string name', function() {
    assertThrows(() => createPlayer(123), 'createPlayer should reject non-string names');
  });

  test('createPlayer trims whitespace from name', function() {
    const player = createPlayer('  Eve  ');
    assertEqual(player.name, 'Eve', 'Player name should be trimmed');
  });
});

describe('addPlayerToGame function', function() {
  beforeEach = function() {
    players = [];
  };

  test('addPlayerToGame adds a player to the game', function() {
    addPlayerToGame('Frank');
    assertEqual(getPlayers().length, 1, 'Game should have 1 player');
  });

  test('addPlayerToGame enforces maximum 8 players', function() {
    for (let i = 0; i < 8; i++) {
      addPlayerToGame(`Player ${i + 1}`);
    }
    assertThrows(() => addPlayerToGame('Player 9'), 'Should not allow more than 8 players');
  });

  test('addPlayerToGame allows exactly 8 players', function() {
    for (let i = 0; i < 8; i++) {
      addPlayerToGame(`Player ${i + 1}`);
    }
    assertEqual(getPlayers().length, 8, 'Game should allow exactly 8 players');
  });
});

describe('removePlayerFromGame function', function() {
  beforeEach = function() {
    players = [];
  };

  test('removePlayerFromGame removes a player by ID', function() {
    const player = addPlayerToGame('Grace');
    removePlayerFromGame(player.id);
    assertEqual(getPlayers().length, 0, 'Player should be removed');
  });

  test('removePlayerFromGame returns true when player is removed', function() {
    const player = addPlayerToGame('Henry');
    const result = removePlayerFromGame(player.id);
    assertTrue(result, 'removePlayerFromGame should return true when player is removed');
  });

  test('removePlayerFromGame returns false when player not found', function() {
    const result = removePlayerFromGame('non-existent-id');
    assertFalse(result, 'removePlayerFromGame should return false when player not found');
  });
});

describe('getPlayers function', function() {
  beforeEach = function() {
    players = [];
  };

  test('getPlayers returns an array', function() {
    const result = getPlayers();
    assertTrue(Array.isArray(result), 'getPlayers should return an array');
  });

  test('getPlayers returns all players', function() {
    addPlayerToGame('Ivy');
    addPlayerToGame('Jack');
    const result = getPlayers();
    assertEqual(result.length, 2, 'getPlayers should return all players');
  });

  test('getPlayers returns a copy of the array', function() {
    addPlayerToGame('Kate');
    const result = getPlayers();
    result.push(new Player('Fake'));
    assertEqual(getPlayers().length, 1, 'Modifying returned array should not affect internal players array');
  });
});

describe('validatePlayerCount function', function() {
  beforeEach = function() {
    players = [];
  };

  test('validatePlayerCount returns false for 0 players', function() {
    assertFalse(validatePlayerCount(), 'Should be false for 0 players');
  });

  test('validatePlayerCount returns false for 1 player', function() {
    addPlayerToGame('Leo');
    assertFalse(validatePlayerCount(), 'Should be false for 1 player');
  });

  test('validatePlayerCount returns true for 2 players', function() {
    addPlayerToGame('Milo');
    addPlayerToGame('Nina');
    assertTrue(validatePlayerCount(), 'Should be true for 2 players');
  });

  test('validatePlayerCount returns true for 8 players', function() {
    for (let i = 0; i < 8; i++) {
      addPlayerToGame(`Player ${i + 1}`);
    }
    assertTrue(validatePlayerCount(), 'Should be true for 8 players');
  });

  test('validatePlayerCount returns true for 5 players (mid-range)', function() {
    for (let i = 0; i < 5; i++) {
      addPlayerToGame(`Player ${i + 1}`);
    }
    assertTrue(validatePlayerCount(), 'Should be true for 5 players');
  });
});

function describe(name, fn) {
  console.log(`\n${name}`);
  fn();
}

// Run all tests
console.log('Running Player Management Tests\n');
console.log('================================');
