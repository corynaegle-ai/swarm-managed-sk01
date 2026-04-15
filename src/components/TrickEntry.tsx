import React, { useState, useEffect } from 'react';
import { validateTrickEntries, getTrickEntryErrors } from '../services/trickEntryValidator';
import './TrickEntry.css';

interface Player {
  id: string;
  name: string;
}

interface TrickEntryProps {
  players: Player[];
  roundNumber: number;
  onSubmit: (tricks: Record<string, number>) => void;
}

export const TrickEntry: React.FC<TrickEntryProps> = ({
  players,
  roundNumber,
  onSubmit,
}) => {
  const [tricksByPlayer, setTricksByPlayer] = useState<Record<string, number>>(
    players.reduce((acc, player) => ({ ...acc, [player.id]: 0 }), {})
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate remaining tricks
  const totalEntered = Object.values(tricksByPlayer).reduce((sum, val) => sum + val, 0);
  const remainingTricks = roundNumber - totalEntered;

  // Real-time validation as entries change
  useEffect(() => {
    const validationErrors = getTrickEntryErrors(
      tricksByPlayer,
      roundNumber,
      players.map(p => p.id)
    );
    setErrors(validationErrors);
  }, [tricksByPlayer, roundNumber, players]);

  const handleTrickChange = (playerId: string, value: string) => {
    const numValue = value === '' ? 0 : Math.max(0, parseInt(value) || 0);
    
    // Prevent entering more tricks than available in the round
    if (numValue > roundNumber) {
      setErrors(prev => ({
        ...prev,
        [playerId]: `Cannot exceed ${roundNumber} tricks in this round`,
      }));
      return;
    }

    setTricksByPlayer(prev => ({
      ...prev,
      [playerId]: numValue,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation before submission
    const isValid = validateTrickEntries(
      tricksByPlayer,
      roundNumber,
      players.map(p => p.id)
    );

    if (!isValid) {
      return;
    }

    onSubmit(tricksByPlayer);
  };

  const isFormValid =
    Object.keys(errors).length === 0 &&
    totalEntered === roundNumber &&
    totalEntered > 0;

  return (
    <div className="trick-entry-container">
      <div className="trick-entry-header">
        <h2>Round {roundNumber}: Enter Tricks Taken</h2>
        <div className="tricks-counter">
          <span className="total-label">Total Tricks Entered:</span>
          <span className={`total-value ${totalEntered === roundNumber ? 'valid' : 'invalid'}`}>
            {totalEntered} / {roundNumber}
          </span>
          <span className="remaining-label">Remaining:</span>
          <span className={`remaining-value ${remainingTricks === 0 ? 'complete' : ''}`}>
            {remainingTricks}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="trick-entry-form">
          {players.map(player => (
            <div key={player.id} className="trick-entry-row">
              <label htmlFor={`tricks-${player.id}`} className="player-label">
                {player.name}
              </label>
              <div className="input-wrapper">
                <input
                  id={`tricks-${player.id}`}
                  type="number"
                  min="0"
                  max={roundNumber}
                  value={tricksByPlayer[player.id]}
                  onChange={e => handleTrickChange(player.id, e.target.value)}
                  className={`trick-input ${errors[player.id] ? 'error' : ''}`}
                  aria-label={`Tricks for ${player.name}`}
                  aria-invalid={!!errors[player.id]}
                />
                <span className="max-tricks">max {roundNumber}</span>
              </div>
              {errors[player.id] && (
                <div className="error-message" role="alert">
                  {errors[player.id]}
                </div>
              )}
            </div>
          ))}
        </div>

        {Object.keys(errors).length > 0 && (
          <div className="validation-summary" role="alert">
            <h3>Validation Errors</h3>
            <ul>
              {Object.values(errors).map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {totalEntered !== roundNumber && totalEntered > 0 && (
          <div className="warning-message" role="status">
            Total tricks ({totalEntered}) does not equal round number ({roundNumber})
          </div>
        )}

        <button
          type="submit"
          disabled={!isFormValid}
          className="submit-button"
          aria-disabled={!isFormValid}
        >
          Submit Tricks
        </button>
      </form>
    </div>
  );
};

export default TrickEntry;
