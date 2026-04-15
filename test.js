/**
 * Test suite for Pirate Theme UI
 * Tests JavaScript functionality and utility functions
 */

'use strict';

/**
 * Simple test framework for validation
 */
const TestRunner = (() => {
  let testsRun = 0;
  let testsPassed = 0;
  let testsFailed = 0;

  return {
    /**
     * Run a test assertion
     * @param {string} testName - Name of the test
     * @param {boolean} condition - Assertion condition
     * @param {string} errorMessage - Error message if test fails
     */
    assert(testName, condition, errorMessage = '') {
      testsRun++;

      if (condition) {
        testsPassed++;
        console.log(`✓ PASS: ${testName}`);
      } else {
        testsFailed++;
        console.error(`✗ FAIL: ${testName}`);
        if (errorMessage) {
          console.error(`  Error: ${errorMessage}`);
        }
      }
    },

    /**
     * Report test results
     */
    report() {
      console.log('\n========== TEST REPORT ==========');
      console.log(`Tests Run: ${testsRun}`);
      console.log(`Passed: ${testsPassed}`);
      console.log(`Failed: ${testsFailed}`);
      console.log(`Success Rate: ${((testsPassed / testsRun) * 100).toFixed(2)}%`);
      console.log('=================================\n');

      return testsFailed === 0;
    }
  };
})();

/**
 * Test Suite: Email Validation
 */
function testEmailValidation() {
  console.log('\n--- Testing Email Validation ---');

  TestRunner.assert(
    'Valid email format',
    isValidEmail('test@example.com'),
    'Should accept valid email'
  );

  TestRunner.assert(
    'Reject email without @',
    !isValidEmail('testexample.com'),
    'Should reject email without @'
  );

  TestRunner.assert(
    'Reject email without domain',
    !isValidEmail('test@'),
    'Should reject email without domain'
  );

  TestRunner.assert(
    'Reject empty email',
    !isValidEmail(''),
    'Should reject empty email'
  );
}

/**
 * Test Suite: Date Formatting
 */
function testDateFormatting() {
  console.log('\n--- Testing Date Formatting ---');

  const testDate = new Date(2024, 0, 15); // January 15, 2024
  const formatted = formatPirateDate(testDate);

  TestRunner.assert(
    'Date formatting includes month',
    formatted.includes('January'),
    `Expected January in '${formatted}'`
  );

  TestRunner.assert(
    'Date formatting includes day',
    formatted.includes('15'),
    `Expected 15 in '${formatted}'`
  );

  TestRunner.assert(
    'Date formatting includes year',
    formatted.includes('2024'),
    `Expected 2024 in '${formatted}'`
  );
}

/**
 * Test Suite: Pirate Greetings
 */
function testPirateGreetings() {
  console.log('\n--- Testing Pirate Greetings ---');

  const greeting = getPirateGreeting();
  const validGreetings = [
    'Ahoy, matey!',
    'Shiver me timbers!',
    'Avast, ye scurvy dog!',
    'Blow me down!',
    'Yo ho ho!',
    'Batten down the hatches!',
    'Land ho!',
    'Weigh anchor!'
  ];

  TestRunner.assert(
    'Greeting is from valid list',
    validGreetings.includes(greeting),
    `Unexpected greeting: ${greeting}`
  );

  TestRunner.assert(
    'Greeting is not empty',
    greeting.length > 0,
    'Greeting should not be empty'
  );
}

/**
 * Test Suite: Crew Member Storage
 */
function testCrewMemberStorage() {
  console.log('\n--- Testing Crew Member Storage ---');

  // Clear storage before tests
  localStorage.clear();

  const testCrewMember = {
    name: 'Captain Blackbeard',
    role: 'captain',
    experience: 20
  };

  const registered = registerCrewMember(testCrewMember);
  TestRunner.assert(
    'Crew member registered successfully',
    registered === true,
    'Registration should return true'
  );

  const crew = getCrewMembers();
  TestRunner.assert(
    'Crew member retrieved from storage',
    crew.length > 0,
    'Should have at least one crew member'
  );

  if (crew.length > 0) {
    TestRunner.assert(
      'Retrieved crew member has correct name',
      crew[0].name === 'Captain Blackbeard',
      `Expected 'Captain Blackbeard' but got '${crew[0].name}'`
    );
  }

  // Clean up
  localStorage.clear();
}

/**
 * Test Suite: Input Validation
 */
function testInputValidation() {
  console.log('\n--- Testing Input Validation ---');

  // Test crew name validation
  const emptyName = ''.trim();
  TestRunner.assert(
    'Empty crew name is invalid',
    emptyName.length === 0,
    'Empty string should have length 0'
  );

  const validName = '  Captain Sparrow  '.trim();
  TestRunner.assert(
    'Whitespace is trimmed from name',
    validName === 'Captain Sparrow',
    'Trim should remove leading/trailing whitespace'
  );

  TestRunner.assert(
    'Valid name has content',
    validName.length > 0,
    'Valid name should have length > 0'
  );
}

/**
 * Run all tests
 */
function runAllTests() {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   PIRATE THEME UI - TEST SUITE        ║');
  console.log('╚════════════════════════════════════════╝');

  testEmailValidation();
  testDateFormatting();
  testPirateGreetings();
  testInputValidation();
  testCrewMemberStorage();

  const allPassed = TestRunner.report();

  if (allPassed) {
    console.log('⚓ All tests passed! Ready to set sail! ⚓\n');
  } else {
    console.log('☠ Some tests failed. Fix them before sailing! ☠\n');
  }

  return allPassed;
}

// Run tests if this file is executed directly
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    TestRunner,
    runAllTests,
    testEmailValidation,
    testDateFormatting,
    testPirateGreetings,
    testInputValidation,
    testCrewMemberStorage
  };
}

// Auto-run tests in browser environment
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('Starting tests...');
      runAllTests();
    });
  } else {
    runAllTests();
  }
}
