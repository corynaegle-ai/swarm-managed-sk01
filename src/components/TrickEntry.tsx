/**
 * TrickEntry Component
 * Allows players to enter tricks taken after a round
 */

import React, { useState, useCallback } from 'react';
import { TrickValidator, ValidationError, TrickEntryData } from '../services/TrickValidator';

export interface TrickEntryProps {
  players: string[];
  roundNumber: number;
  onSubmit: (entries: TrickEntryData[]) => void;
  onCancel?: () => void;
}

interface PlayerEntry {
  playerName: string;
  tricksTaken: string; // Keep as string for input field
}

interface ValidationState {
  [key: string]: string; // field name -> error message
}

export const TrickEntry: React.FC<TrickEntryProps> = ({
  players,
  roundNumber,
  onSubmit,
  onCancel
}) => {
  const validator = new TrickValidator();
  const [entries, setEntries] = useState<PlayerEntry[]>(
    players.map(playerName => ({ playerName, tricksTaken: '' }))
  );
  const [validationErrors, setValidationErrors] = useState<ValidationState>({});
  const [globalErrors, setGlobalErrors] = useState<string[]>([]);

  // Calculate remaining tricks
  const getTricksEntered = useCallback((): number[] => {
    return entries
      .map(e => (e.tricksTaken === '' ? 0 : parseInt(e.tricksTaken, 10)))
      .filter(v => !isNaN(v));
  }, [entries]);

  const remainingTricks = roundNumber - getTricksEntered().reduce((a, b) => a + b, 0);

  // Handle input change
  const handleInputChange = (index: number, value: string) => {
    const newEntries = [...entries];
    newEntries[index].tricksTaken = value;
    setEntries(newEntries);
    setValidationErrors({}); // Clear errors on change
    setGlobalErrors([]);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert entries to proper format for validation
    const trickEntries: TrickEntryData[] = entries.map(entry => ({
      playerName: entry.playerName,
      tricksTaken: entry.tricksTaken === '' ? 0 : parseInt(entry.tricksTaken, 10)
    }));

    // Validate all entries
    const errors = validator.validateAllTricks(trickEntries, roundNumber);

    if (errors.length > 0) {
      // Separate errors by type
      const fieldErrors: ValidationState = {};
      const globalErrorList: string[] = [];

      errors.forEach(error => {
        if (error.field === 'total' || error.field === 'entries') {
          globalErrorList.push(error.message);
        } else {
          fieldErrors[error.field] = error.message;
        }
      });

      setValidationErrors(fieldErrors);
      setGlobalErrors(globalErrorList);
      return;
    }

    // If all validations pass, submit
    setValidationErrors({});
    setGlobalErrors([]);
    onSubmit(trickEntries);
  };

  return (
    <div className="trick-entry-container">
      <h2>Enter Tricks Taken - Round {roundNumber}</h2>

      {globalErrors.length > 0 && (
        <div className="error-banner" data-testid="global-errors">
          <h3>Validation Errors</h3>
          <ul>
            {globalErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="remaining-tricks-display" data-testid="remaining-tricks">
        <strong>Remaining Tricks: {remainingTricks}</strong>
        <span className="total-display">Total Round Tricks: {roundNumber}</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="trick-entries">
          {entries.map((entry, index) => (
            <div key={index} className="player-entry" data-testid={`player-entry-${index}`}>
              <label htmlFor={`player-${index}`}>{entry.playerName}</label>
              <input
                id={`player-${index}`}
                type="number"
                min="0"
                max={roundNumber}
                value={entry.tricksTaken}
                onChange={e => handleInputChange(index, e.target.value)}
                placeholder="Enter number"
                data-testid={`player-input-${index}`}
              />
              {validationErrors[`player_${index}_tricks`] && (
                <span className="error-message" data-testid={`error-${index}`}>
                  {validationErrors[`player_${index}_tricks`]}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit" data-testid="submit-button">
            Submit Tricks
          </button>
          {onCancel && (
            <button
              type="button"
              className="btn-cancel"
              onClick={onCancel}
              data-testid="cancel-button"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
