/**
 * Component tests for TrickEntry
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TrickEntry } from '../TrickEntry';

describe('TrickEntry Component', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnCancel.mockClear();
  });

  describe('Rendering', () => {
    it('should render trick entry form with player inputs', () => {
      const players = ['Alice', 'Bob', 'Charlie'];
      render(
        <TrickEntry
          players={players}
          roundNumber={3}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.getByText(/Enter Tricks Taken - Round 3/i)).toBeInTheDocument();
      players.forEach(player => {
        expect(screen.getByLabelText(player)).toBeInTheDocument();
      });
    });

    it('should display remaining tricks count', () => {
      render(
        <TrickEntry
          players={['Alice', 'Bob']}
          roundNumber={2}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.getByTestId('remaining-tricks')).toBeInTheDocument();
      expect(screen.getByText(/Remaining Tricks: 2/)).toBeInTheDocument();
    });

    it('should have submit and cancel buttons', () => {
      render(
        <TrickEntry
          players={['Alice']}
          roundNumber={1}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByTestId('submit-button')).toBeInTheDocument();
      expect(screen.getByTestId('cancel-button')).toBeInTheDocument();
    });
  });

  describe('Acceptance Criterion 1: Enter tricks taken for each player', () => {
    it('should allow entering tricks for each player', async () => {
      const players = ['Alice', 'Bob', 'Charlie'];
      render(
        <TrickEntry
          players={players}
          roundNumber={3}
          onSubmit={mockOnSubmit}
        />
      );

      const aliceInput = screen.getByTestId('player-input-0') as HTMLInputElement;
      const bobInput = screen.getByTestId('player-input-1') as HTMLInputElement;
      const charlieInput = screen.getByTestId('player-input-2') as HTMLInputElement;

      await userEvent.type(aliceInput, '1');
      await userEvent.type(bobInput, '1');
      await userEvent.type(charlieInput, '1');

      expect(aliceInput.value).toBe('1');
      expect(bobInput.value).toBe('1');
      expect(charlieInput.value).toBe('1');
    });
  });

  describe('Acceptance Criterion 2: Running total of remaining tricks updates as entries made', () => {
    it('should update remaining tricks as entries are made', async () => {
      render(
        <TrickEntry
          players={['Alice', 'Bob', 'Charlie']}
          roundNumber={3}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.getByText(/Remaining Tricks: 3/)).toBeInTheDocument();

      const aliceInput = screen.getByTestId('player-input-0');
      await userEvent.type(aliceInput, '1');

      await waitFor(() => {
        expect(screen.getByText(/Remaining Tricks: 2/)).toBeInTheDocument();
      });
    });

    it('should decrement remaining tricks with each entry', async () => {
      render(
        <TrickEntry
          players={['Alice', 'Bob']}
          roundNumber={2}
          onSubmit={mockOnSubmit}
        />
      );

      const aliceInput = screen.getByTestId('player-input-0');
      const bobInput = screen.getByTestId('player-input-1');

      // Initial state
      expect(screen.getByText(/Remaining Tricks: 2/)).toBeInTheDocument();

      // After first entry
      await userEvent.type(aliceInput, '1');
      await waitFor(() => {
        expect(screen.getByText(/Remaining Tricks: 1/)).toBeInTheDocument();
      });

      // After second entry
      await userEvent.type(bobInput, '1');
      await waitFor(() => {
        expect(screen.getByText(/Remaining Tricks: 0/)).toBeInTheDocument();
      });
    });
  });

  describe('Acceptance Criterion 3: Cannot enter more tricks than available', () => {
    it('should prevent entry exceeding remaining tricks', async () => {
      const players = ['Alice', 'Bob', 'Charlie'];
      render(
        <TrickEntry
          players={players}
          roundNumber={3}
          onSubmit={mockOnSubmit}
        />
      );

      const aliceInput = screen.getByTestId('player-input-0');
      const bobInput = screen.getByTestId('player-input-1');
      const charlieInput = screen.getByTestId('player-input-2');

      // Enter 2 tricks for Alice
      await userEvent.type(aliceInput, '2');
      await waitFor(() => {
        expect(screen.getByText(/Remaining Tricks: 1/)).toBeInTheDocument();
      });

      // Try to enter 2 tricks for Bob (only 1 remaining)
      await userEvent.type(bobInput, '2');
      await userEvent.click(screen.getByTestId('submit-button'));

      // Should show validation error
      await waitFor(() => {
        const errorElements = screen.queryAllByTestId(/error-/);
        expect(errorElements.length).toBeGreaterThan(0);
        // Check that an error message appears
        expect(screen.getByTestId('global-errors')).toBeInTheDocument();
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should not allow more tricks than round number per player', async () => {
      render(
        <TrickEntry
          players={['Alice', 'Bob']}
          roundNumber={2}
          onSubmit={mockOnSubmit}
        />
      );

      const aliceInput = screen.getByTestId('player-input-0');

      // Try to enter 3 tricks (round is 2)
      await userEvent.type(aliceInput, '3');
      await userEvent.click(screen.getByTestId('submit-button'));

      await waitFor(() => {
        expect(screen.getByTestId('global-errors')).toBeInTheDocument();
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Acceptance Criterion 4: Total tricks must equal round number', () => {
    it('should reject submission when total tricks less than round number', async () => {
      render(
        <TrickEntry
          players={['Alice', 'Bob', 'Charlie']}
          roundNumber={3}
          onSubmit={mockOnSubmit}
        />
      );

      const aliceInput = screen.getByTestId('player-input-0');
      const bobInput = screen.getByTestId('player-input-1');

      // Only enter 2 tricks total (need 3)
      await userEvent.type(aliceInput, '1');
      await userEvent.type(bobInput, '1');
      await userEvent.click(screen.getByTestId('submit-button'));

      await waitFor(() => {
        const errorBanner = screen.getByTestId('global-errors');
        expect(errorBanner).toBeInTheDocument();
        expect(errorBanner).toHaveTextContent(/Total tricks/);
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should accept submission when total tricks equals round number', async () => {
      render(
        <TrickEntry
          players={['Alice', 'Bob', 'Charlie']}
          roundNumber={3}
          onSubmit={mockOnSubmit}
        />
      );

      const aliceInput = screen.getByTestId('player-input-0');
      const bobInput = screen.getByTestId('player-input-1');
      const charlieInput = screen.getByTestId('player-input-2');

      // Enter exactly 3 tricks total
      await userEvent.type(aliceInput, '1');
      await userEvent.type(bobInput, '1');
      await userEvent.type(charlieInput, '1');
      await userEvent.click(screen.getByTestId('submit-button'));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith([
          { playerName: 'Alice', tricksTaken: 1 },
          { playerName: 'Bob', tricksTaken: 1 },
          { playerName: 'Charlie', tricksTaken: 1 }
        ]);
      });
    });
  });

  describe('Acceptance Criterion 5: Show validation errors for invalid entries', () => {
    it('should display validation errors in error banner', async () => {
      render(
        <TrickEntry
          players={['Alice', 'Bob']}
          roundNumber={2}
          onSubmit={mockOnSubmit}
        />
      );

      const aliceInput = screen.getByTestId('player-input-0');

      // Enter invalid amount
      await userEvent.type(aliceInput, '5');
      await userEvent.click(screen.getByTestId('submit-button'));

      await waitFor(() => {
        const errorBanner = screen.getByTestId('global-errors');
        expect(errorBanner).toBeInTheDocument();
        expect(errorBanner).toHaveTextContent(/error|invalid|cannot/i);
      });
    });

    it('should clear errors when user makes changes', async () => {
      render(
        <TrickEntry
          players={['Alice']}
          roundNumber={1}
          onSubmit={mockOnSubmit}
        />
      );

      const aliceInput = screen.getByTestId('player-input-0');

      // Submit invalid entry
      await userEvent.type(aliceInput, '5');
      await userEvent.click(screen.getByTestId('submit-button'));

      await waitFor(() => {
        expect(screen.getByTestId('global-errors')).toBeInTheDocument();
      });

      // Clear the field
      await userEvent.clear(aliceInput);
      await userEvent.type(aliceInput, '1');

      // Errors should be cleared
      await waitFor(() => {
        expect(screen.queryByTestId('global-errors')).not.toBeInTheDocument();
      });
    });
  });

  describe('User interactions', () => {
    it('should call onCancel when cancel button clicked', async () => {
      render(
        <TrickEntry
          players={['Alice']}
          roundNumber={1}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      await userEvent.click(screen.getByTestId('cancel-button'));
      expect(mockOnCancel).toHaveBeenCalled();
    });

    it('should handle zero tricks entry', async () => {
      render(
        <TrickEntry
          players={['Alice', 'Bob']}
          roundNumber={2}
          onSubmit={mockOnSubmit}
        />
      );

      const aliceInput = screen.getByTestId('player-input-0');
      const bobInput = screen.getByTestId('player-input-1');

      // Alice takes 0 tricks, Bob takes 2
      await userEvent.type(aliceInput, '0');
      await userEvent.type(bobInput, '2');
      await userEvent.click(screen.getByTestId('submit-button'));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith([
          { playerName: 'Alice', tricksTaken: 0 },
          { playerName: 'Bob', tricksTaken: 2 }
        ]);
      });
    });
  });
});
