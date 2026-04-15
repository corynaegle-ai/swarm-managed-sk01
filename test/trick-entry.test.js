/**
 * Unit tests for trickEntryForm
 */

const trickEntryForm = require('../js/trick-entry.js');

describe('trickEntryForm', () => {
  let form;
  let mockContainer;

  beforeEach(() => {
    form = trickEntryForm();
    
    // Mock DOM container
    mockContainer = document.createElement('div');
    mockContainer.id = 'trick-inputs';
    document.body.appendChild(mockContainer);
  });

  afterEach(() => {
    if (mockContainer && mockContainer.parentNode) {
      mockContainer.parentNode.removeChild(mockContainer);
    }
  });

  describe('init', () => {
    it('should initialize form with correct round and player count', () => {
      form.init(3, 4);
      expect(form.currentRound).toBe(3);
      expect(form.roundNumber).toBe(3);
      expect(form.numPlayers).toBe(4);
    });

    it('should clear validation errors on init', () => {
      form.validationErrors = ['some error'];
      form.init(1, 2);
      expect(form.validationErrors.length).toBe(0);
    });

    it('should initialize trick entries object', () => {
      form.init(2, 3);
      expect(form.trickEntries).toEqual({});
    });
  });

  describe('validateTrickEntry', () => {
    beforeEach(() => {
      form.init(3, 3);
    });

    it('should reject negative tricks', () => {
      expect(form.validateTrickEntry(0, -1)).toBe(false);
    });

    it('should reject entries exceeding remaining tricks', () => {
      form.trickEntries.player0 = 2;
      form.trickEntries.player1 = 1;
      // Only 0 tricks left in round 3
      expect(form.validateTrickEntry(2, 1)).toBe(false);
    });

    it('should accept valid entries', () => {
      form.trickEntries.player0 = 1;
      form.trickEntries.player1 = 1;
      expect(form.validateTrickEntry(2, 1)).toBe(true);
    });
  });

  describe('validateTotalTricks', () => {
    beforeEach(() => {
      form.init(3, 3);
    });

    it('should return true when total equals round number', () => {
      form.trickEntries.player0 = 1;
      form.trickEntries.player1 = 1;
      form.trickEntries.player2 = 1;
      expect(form.validateTotalTricks()).toBe(true);
    });

    it('should return false when total does not equal round number', () => {
      form.trickEntries.player0 = 2;
      form.trickEntries.player1 = 1;
      form.trickEntries.player2 = 0; // Total is 3, but round is 3... should be true
      expect(form.validateTotalTricks()).toBe(true);
      
      form.trickEntries.player2 = 1; // Now total is 4
      expect(form.validateTotalTricks()).toBe(false);
    });
  });

  describe('remainingTricks', () => {
    beforeEach(() => {
      form.init(5, 3);
    });

    it('should calculate remaining tricks correctly', () => {
      expect(form.remainingTricks).toBe(5);
      
      form.trickEntries.player0 = 2;
      expect(form.remainingTricks).toBe(3);
      
      form.trickEntries.player1 = 1;
      expect(form.remainingTricks).toBe(2);
    });

    it('should not return negative remaining tricks', () => {
      form.trickEntries.player0 = 5;
      form.trickEntries.player1 = 1;
      expect(form.remainingTricks).toBe(0);
    });
  });

  describe('showValidationErrors', () => {
    beforeEach(() => {
      form.init(3, 3);
    });

    it('should detect negative tricks', () => {
      form.trickEntries.player0 = -1;
      form.showValidationErrors();
      expect(form.validationErrors.some(e => e.includes('negative'))).toBe(true);
    });

    it('should detect total mismatch', () => {
      form.trickEntries.player0 = 1;
      form.trickEntries.player1 = 1;
      form.trickEntries.player2 = 0;
      form.showValidationErrors();
      expect(form.validationErrors.some(e => e.includes('must equal'))).toBe(true);
    });

    it('should detect exceeding remaining tricks', () => {
      form.trickEntries.player0 = 3;
      form.trickEntries.player1 = 1;
      form.trickEntries.player2 = 1; // Total 5, exceeds round 3
      form.showValidationErrors();
      expect(form.validationErrors.some(e => e.includes('exceeds'))).toBe(true);
    });
  });

  describe('isFormValid', () => {
    beforeEach(() => {
      form.init(3, 3);
    });

    it('should return false if there are validation errors', () => {
      form.trickEntries.player0 = -1;
      expect(form.isFormValid).toBe(false);
    });

    it('should return false if not all players have entries', () => {
      form.trickEntries.player0 = 1;
      form.trickEntries.player1 = 1;
      // missing player2
      expect(form.isFormValid).toBe(false);
    });

    it('should return true for valid form', () => {
      form.trickEntries.player0 = 1;
      form.trickEntries.player1 = 1;
      form.trickEntries.player2 = 1;
      form.validateForm();
      expect(form.isFormValid).toBe(true);
    });
  });

  describe('submitTricks', () => {
    beforeEach(() => {
      form.init(2, 2);
      form.trickEntries.player0 = 1;
      form.trickEntries.player1 = 1;
    });

    it('should set error message if form is invalid', () => {
      form.trickEntries.player0 = -1;
      form.submitTricks();
      expect(form.submitMessageType).toBe('error');
      expect(form.submitMessage).toContain('validation errors');
    });

    it('should dispatch trickSubmission event with correct data', (done) => {
      document.addEventListener('trickSubmission', (event) => {
        expect(event.detail.round).toBe(1);
        expect(event.detail.tricks).toEqual({ player0: 1, player1: 1 });
        expect(event.detail.timestamp).toBeDefined();
        done();
      });

      form.submitTricks();
    });

    it('should set isSubmitting flag', () => {
      form.submitTricks();
      expect(form.isSubmitting).toBe(true);
    });
  });

  describe('resetForNextRound', () => {
    beforeEach(() => {
      form.init(2, 2);
      form.trickEntries.player0 = 1;
      form.submitMessage = 'Test message';
    });

    it('should update round and round number', () => {
      form.resetForNextRound(3);
      expect(form.currentRound).toBe(3);
      expect(form.roundNumber).toBe(3);
    });

    it('should clear trick entries', () => {
      form.resetForNextRound(3);
      expect(form.trickEntries).toEqual({});
    });

    it('should clear validation errors', () => {
      form.validationErrors = ['error'];
      form.resetForNextRound(3);
      expect(form.validationErrors).toEqual([]);
    });

    it('should clear submit message', () => {
      form.resetForNextRound(3);
      expect(form.submitMessage).toBe('');
    });
  });
});
