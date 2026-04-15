import React, { useState, useEffect } from 'react';
import './BonusPointEntry.css';

const BonusPointEntry = ({ players, bidTarget, onBonusChange }) => {
  const [bonusPoints, setBonusPoints] = useState({});

  useEffect(() => {
    // Initialize bonus points for eligible players
    const initialBonusPoints = {};
    players.forEach((player, index) => {
      if (player.bid !== undefined && player.bid === bidTarget) {
        initialBonusPoints[index] = bonusPoints[index] || 0;
      }
    });
    setBonusPoints(initialBonusPoints);
  }, [players, bidTarget]);

  const handleBonusChange = (playerIndex, value) => {
    let numValue = value === '' ? 0 : parseFloat(value);
    
    // Validate: ensure non-negative
    if (isNaN(numValue) || numValue < 0) {
      numValue = 0;
    }

    const updatedBonus = {
      ...bonusPoints,
      [playerIndex]: numValue
    };

    setBonusPoints(updatedBonus);
    onBonusChange(updatedBonus);
  };

  // Only show bonus input for players with correct bids
  const eligiblePlayers = players
    .map((player, index) => ({
      ...player,
      index,
      isEligible: player.bid !== undefined && player.bid === bidTarget
    }))
    .filter(player => player.isEligible);

  if (eligiblePlayers.length === 0) {
    return (
      <div className="bonus-point-entry">
        <p className="no-eligible-players">No players with correct bids</p>
      </div>
    );
  }

  return (
    <div className="bonus-point-entry">
      <h3>Bonus Points</h3>
      <div className="bonus-inputs">
        {eligiblePlayers.map((player) => (
          <div key={player.index} className="bonus-input-group">
            <label htmlFor={`bonus-${player.index}`}>
              {player.name || `Player ${player.index + 1}`}
            </label>
            <input
              id={`bonus-${player.index}`}
              type="number"
              min="0"
              step="1"
              value={bonusPoints[player.index] || 0}
              onChange={(e) => handleBonusChange(player.index, e.target.value)}
              className="bonus-input"
              aria-label={`Bonus points for ${player.name || `Player ${player.index + 1}`}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BonusPointEntry;
