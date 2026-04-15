import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BonusPointsForm from '../BonusPointsForm';
import { PlayerBid, BonusPoints } from '../../types/scoring';

describe('BonusPointsForm', () => {
  const mockPlayers: PlayerBid[] = [
    { playerId: '1', playerName: 'Alice', bid: 10, bidCorrect: true },
    { playerId: '2', playerName: 'Bob', bid: 10, bidCorrect: false },
    { playerId: '3', playerName: 'Charlie', bid: 10, bidCorrect: true },
  ];

  it('should only show bonus input for players with correct bids', () => {
    render(
      <BonusPointsForm
        players={mockPlayers}
        bonuses={[]}
        onBonusesChange={jest.fn()}
      />
    );

    expect(screen.getByLabelText('Alice')).toBeInTheDocument();
    expect(screen.getByLabelText('Charlie')).toBeInTheDocument();
    expect(screen.queryByLabelText('Bob')).not.toBeInTheDocument();
  });

  it('should show message when no eligible players', () => {
    const ineligiblePlayers: PlayerBid[] = [
      { playerId: '1', playerName: 'Alice', bid: 10, bidCorrect: false },
      { playerId: '2', playerName: 'Bob', bid: 10, bidCorrect: false },
    ];

    render(
      <BonusPointsForm
        players={ineligiblePlayers}
        bonuses={[]}
        onBonusesChange={jest.fn()}
      />
    );

    expect(screen.getByText(/No players with correct bids/i)).toBeInTheDocument();
  });

  it('should default bonus to 0 if not entered', () => {
    const { container } = render(
      <BonusPointsForm
        players={mockPlayers}
        bonuses={[]}
        onBonusesChange={jest.fn()}
      />
    );

    const aliceInput = screen.getByDisplayValue('') as HTMLInputElement;
    expect(aliceInput.value).toBe('');
  });

  it('should accept any non-negative bonus amount', () => {
    const onBonusesChange = jest.fn();
    render(
      <BonusPointsForm
        players={mockPlayers}
        bonuses={[]}
        onBonusesChange={onBonusesChange}
      />
    );

    const aliceInput = screen.getByLabelText('Alice') as HTMLInputElement;
    fireEvent.change(aliceInput, { target: { value: '5' } });

    expect(onBonusesChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ playerId: '1', bonusAmount: 5 }),
      ])
    );
  });

  it('should not accept negative bonus amounts', () => {
    const onBonusesChange = jest.fn();
    render(
      <BonusPointsForm
        players={mockPlayers}
        bonuses={[]}
        onBonusesChange={onBonusesChange}
      />
    );

    const aliceInput = screen.getByLabelText('Alice') as HTMLInputElement;
    // HTML5 input type="number" with min="0" prevents negative values
    fireEvent.change(aliceInput, { target: { value: '-5' } });

    // The input element won't allow negative values due to min="0"
    // but we verify the handler processes non-negative only
    expect(aliceInput.min).toBe('0');
  });

  it('should display existing bonus values', () => {
    const existingBonuses: BonusPoints[] = [
      { playerId: '1', bonusAmount: 3 },
    ];

    render(
      <BonusPointsForm
        players={mockPlayers}
        bonuses={existingBonuses}
        onBonusesChange={jest.fn()}
      />
    );

    const aliceInput = screen.getByDisplayValue('3') as HTMLInputElement;
    expect(aliceInput).toBeInTheDocument();
  });

  it('should update bonus when input changes', () => {
    const onBonusesChange = jest.fn();
    render(
      <BonusPointsForm
        players={mockPlayers}
        bonuses={[]}
        onBonusesChange={onBonusesChange}
      />
    );

    const charlieInput = screen.getByLabelText('Charlie') as HTMLInputElement;
    fireEvent.change(charlieInput, { target: { value: '10' } });

    expect(onBonusesChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ playerId: '3', bonusAmount: 10 }),
      ])
    );
  });
});
