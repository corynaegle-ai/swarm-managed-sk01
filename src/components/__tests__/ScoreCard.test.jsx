import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ScoreCard from '../ScoreCard';

describe('ScoreCard', () => {
  const mockOnScoresUpdate = jest.fn();

  const mockPlayers = [
    { name: 'Player 1', bid: 5 },
    { name: 'Player 2', bid: 10 },
    { name: 'Player 3', bid: 7 }
  ];

  beforeEach(() => {
    mockOnScoresUpdate.mockClear();
  });

  test('renders score card with bid target', () => {
    const bidTarget = 5;
    render(
      <ScoreCard
        players={mockPlayers}
        bidTarget={bidTarget}
        onScoresUpdate={mockOnScoresUpdate}
      />
    );

    expect(screen.getByText('Score Card')).toBeInTheDocument();
    expect(screen.getByText('Bid Target:')).toBeInTheDocument();
  });

  test('only counts bonus points when bid was correct', () => {
    const bidTarget = 5;
    const { rerender } = render(
      <ScoreCard
        players={mockPlayers}
        bidTarget={bidTarget}
        onScoresUpdate={mockOnScoresUpdate}
      />
    );

    // Find the bonus input for Player 1 (correct bid)
    const bonusInput = screen.getByLabelText(/Player 1/);
    fireEvent.change(bonusInput, { target: { value: '3' } });

    // Check that Player 1 has correct bid and gets bonus
    const calls = mockOnScoresUpdate.mock.calls;
    const latestCall = calls[calls.length - 1][0];
    const player1Score = latestCall.find(s => s.playerIndex === 0);

    expect(player1Score.bidCorrect).toBe(true);
    expect(player1Score.bonus).toBe(3);
    expect(player1Score.totalScore).toBe(8); // 5 (bid) + 3 (bonus)
  });

  test('does not add bonus for incorrect bids', () => {
    const bidTarget = 5;
    render(
      <ScoreCard
        players={mockPlayers}
        bidTarget={bidTarget}
        onScoresUpdate={mockOnScoresUpdate}
      />
    );

    const calls = mockOnScoresUpdate.mock.calls;
    const latestCall = calls[calls.length - 1][0];
    const player2Score = latestCall.find(s => s.playerIndex === 1);

    expect(player2Score.bidCorrect).toBe(false);
    expect(player2Score.totalScore).toBe(0); // No score for incorrect bid
  });

  test('displays all players in score table', () => {
    const bidTarget = 5;
    render(
      <ScoreCard
        players={mockPlayers}
        bidTarget={bidTarget}
        onScoresUpdate={mockOnScoresUpdate}
      />
    );

    expect(screen.getByText('Player 1')).toBeInTheDocument();
    expect(screen.getByText('Player 2')).toBeInTheDocument();
    expect(screen.getByText('Player 3')).toBeInTheDocument();
  });

  test('shows bonus input only for eligible players', () => {
    const bidTarget = 5;
    render(
      <ScoreCard
        players={mockPlayers}
        bidTarget={bidTarget}
        onScoresUpdate={mockOnScoresUpdate}
      />
    );

    // BonusPointEntry should only show input for Player 1 (bid = 5)
    const bonusSection = screen.getByText('Bonus Points').closest('.bonus-point-entry');
    expect(bonusSection.textContent).toContain('Player 1');
  });

  test('updates scores when bonus changes', () => {
    const bidTarget = 5;
    render(
      <ScoreCard
        players={mockPlayers}
        bidTarget={bidTarget}
        onScoresUpdate={mockOnScoresUpdate}
      />
    );

    const bonusInput = screen.getByLabelText(/Player 1/);
    fireEvent.change(bonusInput, { target: { value: '5' } });

    const calls = mockOnScoresUpdate.mock.calls;
    expect(calls.length).toBeGreaterThan(0);

    const latestCall = calls[calls.length - 1][0];
    const player1Score = latestCall.find(s => s.playerIndex === 0);

    expect(player1Score.totalScore).toBe(10); // 5 (bid) + 5 (bonus)
  });

  test('handles players without bids', () => {
    const playersWithoutBid = [
      { name: 'Player 1', bid: undefined },
      { name: 'Player 2', bid: 5 }
    ];
    const bidTarget = 5;
    render(
      <ScoreCard
        players={playersWithoutBid}
        bidTarget={bidTarget}
        onScoresUpdate={mockOnScoresUpdate}
      />
    );

    const calls = mockOnScoresUpdate.mock.calls;
    const latestCall = calls[calls.length - 1][0];
    const player1Score = latestCall.find(s => s.playerIndex === 0);

    expect(player1Score.bidCorrect).toBe(false);
    expect(player1Score.totalScore).toBe(0);
  });
});
