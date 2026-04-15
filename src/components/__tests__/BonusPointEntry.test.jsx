import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BonusPointEntry from '../BonusPointEntry';

describe('BonusPointEntry', () => {
  const mockOnBonusChange = jest.fn();

  const mockPlayers = [
    { name: 'Player 1', bid: 5 },
    { name: 'Player 2', bid: 10 },
    { name: 'Player 3', bid: 7 }
  ];

  beforeEach(() => {
    mockOnBonusChange.mockClear();
  });

  test('renders bonus input only for players with correct bids', () => {
    const bidTarget = 5;
    render(
      <BonusPointEntry
        players={mockPlayers}
        bidTarget={bidTarget}
        onBonusChange={mockOnBonusChange}
      />
    );

    // Only Player 1 should have a bonus input (bid = 5, target = 5)
    expect(screen.getByText('Player 1')).toBeInTheDocument();
    expect(screen.queryByText('Player 2')).not.toBeInTheDocument();
    expect(screen.queryByText('Player 3')).not.toBeInTheDocument();
  });

  test('accepts non-negative bonus amounts', () => {
    const bidTarget = 5;
    render(
      <BonusPointEntry
        players={mockPlayers}
        bidTarget={bidTarget}
        onBonusChange={mockOnBonusChange}
      />
    );

    const input = screen.getByLabelText(/Player 1/);
    fireEvent.change(input, { target: { value: '10' } });

    expect(mockOnBonusChange).toHaveBeenCalledWith(expect.objectContaining({
      0: 10
    }));
  });

  test('defaults bonus to 0 if not entered', () => {
    const bidTarget = 5;
    render(
      <BonusPointEntry
        players={mockPlayers}
        bidTarget={bidTarget}
        onBonusChange={mockOnBonusChange}
      />
    );

    const input = screen.getByLabelText(/Player 1/);
    expect(input.value).toBe('0');
  });

  test('rejects negative bonus amounts', () => {
    const bidTarget = 5;
    render(
      <BonusPointEntry
        players={mockPlayers}
        bidTarget={bidTarget}
        onBonusChange={mockOnBonusChange}
      />
    );

    const input = screen.getByLabelText(/Player 1/);
    fireEvent.change(input, { target: { value: '-5' } });

    expect(mockOnBonusChange).toHaveBeenCalledWith(expect.objectContaining({
      0: 0
    }));
  });

  test('shows message when no players have correct bids', () => {
    const bidTarget = 99; // No player has this bid
    render(
      <BonusPointEntry
        players={mockPlayers}
        bidTarget={bidTarget}
        onBonusChange={mockOnBonusChange}
      />
    );

    expect(screen.getByText(/No players with correct bids/)).toBeInTheDocument();
  });

  test('updates bonus points when input changes', () => {
    const bidTarget = 5;
    render(
      <BonusPointEntry
        players={mockPlayers}
        bidTarget={bidTarget}
        onBonusChange={mockOnBonusChange}
      />
    );

    const input = screen.getByLabelText(/Player 1/);
    fireEvent.change(input, { target: { value: '25' } });

    expect(mockOnBonusChange).toHaveBeenLastCalledWith(expect.objectContaining({
      0: 25
    }));
  });

  test('handles multiple eligible players', () => {
    const playersMultiple = [
      { name: 'Player 1', bid: 5 },
      { name: 'Player 2', bid: 5 },
      { name: 'Player 3', bid: 7 }
    ];
    const bidTarget = 5;
    render(
      <BonusPointEntry
        players={playersMultiple}
        bidTarget={bidTarget}
        onBonusChange={mockOnBonusChange}
      />
    );

    expect(screen.getByText('Player 1')).toBeInTheDocument();
    expect(screen.getByText('Player 2')).toBeInTheDocument();
    expect(screen.queryByText('Player 3')).not.toBeInTheDocument();
  });

  test('converts empty string to 0', () => {
    const bidTarget = 5;
    render(
      <BonusPointEntry
        players={mockPlayers}
        bidTarget={bidTarget}
        onBonusChange={mockOnBonusChange}
      />
    );

    const input = screen.getByLabelText(/Player 1/);
    fireEvent.change(input, { target: { value: '5' } });
    fireEvent.change(input, { target: { value: '' } });

    expect(mockOnBonusChange).toHaveBeenLastCalledWith(expect.objectContaining({
      0: 0
    }));
  });
});
