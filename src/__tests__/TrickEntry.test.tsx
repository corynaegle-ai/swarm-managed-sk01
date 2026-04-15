import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TrickEntry from '../components/TrickEntry';

const mockPlayers = [
  { id: 'player1', name: 'Alice' },
  { id: 'player2', name: 'Bob' },
  { id: 'player3', name: 'Charlie' },
  { id: 'player4', name: 'Diana' },
];

describe('TrickEntry Component', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  describe('Rendering', () => {
    it('should render with correct title and round number', () => {
      render(
        <TrickEntry
          players={mockPlayers}
          roundNumber={4}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.getByText('Round 4: Enter Tricks Taken')).toBeInTheDocument();
    });

    it('should render input fields for each player', () => {
      render(
        <TrickEntry
          players={mockPlayers}
          roundNumber={4}
          onSubmit={mockOnSubmit}
        />
      );

      mockPlayers.forEach(player => {
        expect(screen.getByLabelText(`Tricks for ${player.name}`)).toBeInTheDocument();
      });
    });

    it('should display running total counter', () => {
      render(
        <TrickEntry
          players={mockPlayers}
          roundNumber={4}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.getByText(/Total Tricks Entered:/)).toBeInTheDocument();
      expect(screen.getByText(/Remaining:/)).toBeInTheDocument();
    });
  });

  describe('Trick Entry - Criterion 1: Enter tricks taken for each player', () => {
    it('should allow entering tricks for each player', async () => {
      const user = userEvent.setup();
      render(
        <TrickEntry
          players={mockPlayers}
          roundNumber={4}
          onSubmit={mockOnSubmit}
        />
      );

      const aliceInput = screen.getByLabelText('Tricks for Alice');
      const bobInput = screen.getByLabelText('Tricks for Bob');

      await user.clear(aliceInput);
      await user.type(aliceInput, '2');
      await user.clear(bobInput);
      await user.type(bobInput, '1');

      expect(aliceInput).toHaveValue(2);
      expect(bobInput).toHaveValue(1);
    });

    it('should start with 0 tricks for each player', () => {
      render(
        <TrickEntry
          players={mockPlayers}
          roundNumber={4}
          onSubmit={mockOnSubmit}
        />
      );

      mockPlayers.forEach(player => {
        const input = screen.getByLabelText(`Tricks for ${player.name}`) as HTMLInputElement;
        expect(input.value).toBe('0');
      });
    });
  });

  describe('Trick Entry - Criterion 2: Running total updates as entries made', () => {
    it('should update running total when entries change', async () => {
      const user = userEvent.setup();
      render(
        <TrickEntry
          players={mockPlayers}
          roundNumber={4}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.getByText('0 / 4')).toBeInTheDocument();

      const aliceInput = screen.getByLabelText('Tricks for Alice');
      await user.clear(aliceInput);
      await user.type(aliceInput, '2');

      await waitFor(() => {
        expect(screen.getByText('2 / 4')).toBeInTheDocument();
      });
    });

    it('should update remaining tricks counter', async () => {
      const user = userEvent.setup();
      render(
        <TrickEntry
          players={mockPlayers}
          roundNumber={4}
          onSubmit={mockOnSubmit}
        />
      );

      const aliceInput = screen.getByLabelText('Tricks for Alice');
      await user.clear(aliceInput);
      await user.type(aliceInput, '1');

      await waitFor(() => {
        // Find the remaining value in the counter
        const remainingElements = screen.getAllByText(/^3$/);
        expect(remainingElements.length).toBeGreaterThan(0);
      });
    });

    it('should show remaining tricks decreasing with each entry', async () => {
      const user = userEvent.setup();
      render(
        <TrickEntry
          players={mockPlayers}
          roundNumber={4}
          onSubmit={mockOnSubmit}
        />
      );

      const aliceInput = screen.getByLabelText('Tricks for Alice');
      const bobInput = screen.getByLabelText('Tricks for Bob');

      await user.clear(aliceInput);
      await user.type(aliceInput, '2');

      await waitFor(() => {
        expect(screen.getByText('2 / 4')).toBeInTheDocument();
      });

      await user.clear(bobInput);
      await user.type(bobInput, '1');

      await waitFor(() => {
        expect(screen.getByText('3 / 4')).toBeInTheDocument();
      });
    });
  });

  describe('Trick Entry - Criterion 3: Cannot enter more tricks than available', () => {
    it('should prevent entering more tricks than round number', async () => {
      const user = userEvent.setup();
      render(
        <TrickEntry
          players={mockPlayers}
          roundNumber={4}
          onSubmit={mockOnSubmit}
        />
      );

      const aliceInput = screen.getByLabelText('Tricks for Alice');
      await user.clear(aliceInput);
      await user.type(aliceInput, '5');

      await waitFor(() => {
        expect(screen.getByText(/Cannot exceed/)).toBeInTheDocument();
      });
    });

    it('should show error when exceeding available tricks', async () => {
      const user = userEvent.setup();
      render(
        <TrickEntry
          players={mockPlayers}
          roundNumber={4}
          onSubmit={mockOnSubmit}
        />
      );

      const aliceInput = screen.getByLabelText('Tricks for Alice');
      const bobInput = screen.getByLabelText('Tricks for Bob');

      await user.clear(aliceInput);
      await user.type(aliceInput, '3');
      await user.clear(bobInput);
      await user.type(bobInput, '2');

      await waitFor(() => {
        expect(screen.getByText(/Total tricks.*must equal/)).toBeInTheDocument();
      });
    });

    it('should mark input as error when exceeds limit', async () => {
      const user = userEvent.setup();
      render(
        <TrickEntry
          players={mockPlayers}
          roundNumber={4}
          onSubmit={mockOnSubmit}
        />
      );

      const aliceInput = screen.getByLabelText('Tricks for Alice');
      await user.clear(aliceInput);
      await user.type(aliceInput, '10');

      await waitFor(() => {
        expect(aliceInput).toHaveClass('error');
      });
    });
  });

  describe('Trick Entry - Criterion 4: Total tricks must equal round number', () => {
    it('should disable submit button when total does not equal round number', async () => {
      const user = userEvent.setup();
      render(
        <TrickEntry
          players={mockPlayers}
          roundNumber={4}
          onSubmit={mockOnSubmit}
        />
      );

      const submitButton = screen.getByRole('button', { name: /Submit Tricks/ });
      expect(submitButton).toBeDisabled();

      const aliceInput = screen.getByLabelText('Tricks for Alice');
      await user.clear(aliceInput);
      await user.type(aliceInput, '2');

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
    });

    it('should enable submit button when total equals round number', async () => {
      const user = userEvent.setup();
      render(
        <TrickEntry
          players={mockPlayers}
          roundNumber={4}
          onSubmit={mockOnSubmit}
        />
      );

      const aliceInput = screen.getByLabelText('Tricks for Alice');
      const bobInput = screen.getByLabelText('Tricks for Bob');
      const charlieInput = screen.getByLabelText('Tricks for Charlie');
      const dianaInput = screen.getByLabelText('Tricks for Diana');

      await user.clear(aliceInput);
      await user.type(aliceInput, '1');
      await user.clear(bobInput);
      await user.type(bobInput, '1');
      await user.clear(charlieInput);
      await user.type(charlieInput, '1');
      await user.clear(dianaInput);
      await user.type(dianaInput, '1');

      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /Submit Tricks/ });
        expect(submitButton).not.toBeDisabled();
      });
    });

    it('should show warning when total does not equal round', async () => {
      const user = userEvent.setup();
      render(
        <TrickEntry
          players={mockPlayers}
          roundNumber={4}
          onSubmit={mockOnSubmit}
        />
      );

      const aliceInput = screen.getByLabelText('Tricks for Alice');
      await user.clear(aliceInput);
      await user.type(aliceInput, '2');

      await waitFor(() => {
        expect(screen.getByText(/does not equal/)).toBeInTheDocument();
      });
    });
  });

  describe('Trick Entry - Criterion 5: Show validation errors for invalid entries', () => {
    it('should display validation errors section', async () => {
      const user = userEvent.setup();
      render(
        <TrickEntry
          players={mockPlayers}
          roundNumber={4}
          onSubmit={mockOnSubmit}
        />
      );

      const aliceInput = screen.getByLabelText('Tricks for Alice');
      await user.clear(aliceInput);
      await user.type(aliceInput, '5');

      await waitFor(() => {
        expect(screen.getByText('Validation Errors')).toBeInTheDocument();
      });
    });

    it('should show specific error message for each invalid entry', async () => {
      const user = userEvent.setup();
      render(
        <TrickEntry
          players={mockPlayers}
          roundNumber={4}
          onSubmit={mockOnSubmit}
        />
      );

      const aliceInput = screen.getByLabelText('Tricks for Alice');
      await user.clear(aliceInput);
      await user.type(aliceInput, '6');

      await waitFor(() => {
        expect(screen.getByText(/Cannot exceed 4 tricks/)).toBeInTheDocument();
      });
    });

    it('should clear errors when entry becomes valid', async () => {
      const user = userEvent.setup();
      render(
        <TrickEntry
          players={mockPlayers}
          roundNumber={4}
          onSubmit={mockOnSubmit}
        />
      );

      const aliceInput = screen.getByLabelText('Tricks for Alice');
      
      // First enter invalid value
      await user.clear(aliceInput);
      await user.type(aliceInput, '5');

      await waitFor(() => {
        expect(screen.getByText(/Cannot exceed/)).toBeInTheDocument();
      });

      // Then correct it
      await user.clear(aliceInput);
      await user.type(aliceInput, '2');

      await waitFor(() => {
        // Should still have errors because total doesn't equal round
        // but not about exceeding
        expect(screen.queryByText(/Cannot exceed/)).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should call onSubmit with correct data when valid', async () => {
      const user = userEvent.setup();
      render(
        <TrickEntry
          players={mockPlayers}
          roundNumber={4}
          onSubmit={mockOnSubmit}
        />
      );

      const aliceInput = screen.getByLabelText('Tricks for Alice');
      const bobInput = screen.getByLabelText('Tricks for Bob');
      const charlieInput = screen.getByLabelText('Tricks for Charlie');
      const dianaInput = screen.getByLabelText('Tricks for Diana');

      await user.clear(aliceInput);
      await user.type(aliceInput, '2');
      await user.clear(bobInput);
      await user.type(bobInput, '1');
      await user.clear(charlieInput);
      await user.type(charlieInput, '1');
      await user.clear(dianaInput);
      await user.type(dianaInput, '0');

      const submitButton = screen.getByRole('button', { name: /Submit Tricks/ });

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      await user.click(submitButton);

      expect(mockOnSubmit).toHaveBeenCalledWith({
        player1: 2,
        player2: 1,
        player3: 1,
        player4: 0,
      });
    });

    it('should not submit when validation errors exist', async () => {
      const user = userEvent.setup();
      render(
        <TrickEntry
          players={mockPlayers}
          roundNumber={4}
          onSubmit={mockOnSubmit}
        />
      );

      const aliceInput = screen.getByLabelText('Tricks for Alice');
      await user.clear(aliceInput);
      await user.type(aliceInput, '5');

      const submitButton = screen.getByRole('button', { name: /Submit Tricks/ });
      expect(submitButton).toBeDisabled();

      // Try to click (should be prevented by disabled state)
      await user.click(submitButton);

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Different Round Numbers', () => {
    it('should work with round number of 1', async () => {
      const user = userEvent.setup();
      const singlePlayer = [{ id: 'player1', name: 'Alice' }];
      
      render(
        <TrickEntry
          players={singlePlayer}
          roundNumber={1}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.getByText('Round 1: Enter Tricks Taken')).toBeInTheDocument();

      const input = screen.getByLabelText('Tricks for Alice');
      await user.clear(input);
      await user.type(input, '1');

      const submitButton = screen.getByRole('button', { name: /Submit Tricks/ });

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });

    it('should work with higher round numbers', async () => {
      const user = userEvent.setup();
      const morePlayers = Array.from({ length: 13 }, (_, i) => ({
        id: `player${i}`,
        name: `Player ${i + 1}`,
      }));

      render(
        <TrickEntry
          players={morePlayers}
          roundNumber={13}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.getByText('Round 13: Enter Tricks Taken')).toBeInTheDocument();

      // Enter 13 tricks (one for each player)
      for (let i = 0; i < 13; i++) {
        const input = screen.getByLabelText(`Tricks for Player ${i + 1}`);
        await user.clear(input);
        await user.type(input, '1');
      }

      const submitButton = screen.getByRole('button', { name: /Submit Tricks/ });

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });
  });
});
