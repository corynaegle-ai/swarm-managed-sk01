import React, { useState, useEffect } from 'react';
import { PlayerBid, BonusPoints } from '../types/scoring';

interface BonusPointsFormProps {
  /** Players with bids to enter bonuses for */
  players: PlayerBid[];
  /** Current bonus values */
  bonuses: BonusPoints[];
  /** Callback when bonuses change */
  onBonusesChange: (bonuses: BonusPoints[]) => void;
}

/**
 * Component for entering bonus points for players with correct bids
 * Only displays bonus input fields for eligible players (those with correct bids)
 */
export const BonusPointsForm: React.FC<BonusPointsFormProps> = ({
  players,
  bonuses,
  onBonusesChange,
}) => {
  // Filter to only players with correct bids
  const eligiblePlayers = players.filter((p) => p.bidCorrect);

  const handleBonusChange = (playerId: string, value: string) => {
    const numValue = value === '' ? 0 : Math.max(0, parseInt(value, 10) || 0);
    
    const updatedBonuses = [...bonuses];
    const existingIndex = updatedBonuses.findIndex(
      (b) => b.playerId === playerId
    );

    if (existingIndex >= 0) {
      updatedBonuses[existingIndex].bonusAmount = numValue;
    } else {
      updatedBonuses.push({ playerId, bonusAmount: numValue });
    }

    // Remove entries with 0 bonus to keep data clean
    const filteredBonuses = updatedBonuses.filter((b) => b.bonusAmount > 0);
    onBonusesChange(filteredBonuses);
  };

  const getBonusValue = (playerId: string): number => {
    const bonus = bonuses.find((b) => b.playerId === playerId);
    return bonus ? bonus.bonusAmount : 0;
  };

  if (eligiblePlayers.length === 0) {
    return (
      <div className="bonus-points-form">
        <p className="no-eligible-players">
          No players with correct bids to award bonuses.
        </p>
      </div>
    );
  }

  return (
    <div className="bonus-points-form">
      <h3>Award Bonus Points</h3>
      <p className="instructions">
        Enter bonus points for players who bid correctly (non-negative numbers only).
      </p>
      <div className="bonus-fields">
        {eligiblePlayers.map((player) => (
          <div key={player.playerId} className="bonus-field">
            <label htmlFor={`bonus-${player.playerId}`}>
              {player.playerName}
            </label>
            <input
              id={`bonus-${player.playerId}`}
              type="number"
              min="0"
              value={getBonusValue(player.playerId)}
              onChange={(e) => handleBonusChange(player.playerId, e.target.value)}
              placeholder="0"
              className="bonus-input"
            />
            <span className="bonus-unit">points</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BonusPointsForm;
