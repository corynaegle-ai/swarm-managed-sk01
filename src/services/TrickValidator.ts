/**
 * TrickValidator - Validates trick entry submissions
 * Ensures tricks taken by players sum to the round number
 */

export interface ValidationError {
  field: string;
  message: string;
}

export interface TrickEntryData {
  playerName: string;
  tricksTaken: number;
}

export class TrickValidator {
  /**
   * Validates a single trick entry
   * @param tricksTaken - Number of tricks taken by player
   * @param roundNumber - Current round number
   * @param previousEntries - Previously entered tricks
   * @returns ValidationError[] - Array of validation errors, empty if valid
   */
  validateSingleTrick(
    tricksTaken: number,
    roundNumber: number,
    previousEntries: number[] = []
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    // Check if tricks taken is a valid number
    if (typeof tricksTaken !== 'number' || !Number.isInteger(tricksTaken)) {
      errors.push({
        field: 'tricksTaken',
        message: 'Tricks taken must be a whole number'
      });
      return errors;
    }

    // Check if tricks taken is non-negative
    if (tricksTaken < 0) {
      errors.push({
        field: 'tricksTaken',
        message: 'Tricks taken cannot be negative'
      });
    }

    // Check if tricks taken exceeds round number
    if (tricksTaken > roundNumber) {
      errors.push({
        field: 'tricksTaken',
        message: `Cannot enter more than ${roundNumber} trick(s) in this round`
      });
    }

    // Check if entry would exceed total available tricks
    const totalPreviouslyEntered = previousEntries.reduce((sum, tricks) => sum + tricks, 0);
    if (totalPreviouslyEntered + tricksTaken > roundNumber) {
      const remainingTricks = roundNumber - totalPreviouslyEntered;
      errors.push({
        field: 'tricksTaken',
        message: `Only ${remainingTricks} trick(s) remaining. You cannot enter ${tricksTaken}`
      });
    }

    return errors;
  }

  /**
   * Validates all trick entries for a round
   * @param entries - Array of trick entries from all players
   * @param roundNumber - Current round number
   * @returns ValidationError[] - Array of validation errors
   */
  validateAllTricks(
    entries: TrickEntryData[],
    roundNumber: number
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    // Check if entries is an array
    if (!Array.isArray(entries)) {
      errors.push({
        field: 'entries',
        message: 'Entries must be an array'
      });
      return errors;
    }

    // Check if at least one entry is present
    if (entries.length === 0) {
      errors.push({
        field: 'entries',
        message: 'At least one player entry is required'
      });
      return errors;
    }

    // Validate individual entries
    let totalTricks = 0;
    const playerNames = new Set<string>();

    entries.forEach((entry, index) => {
      // Check for duplicate player names
      if (playerNames.has(entry.playerName)) {
        errors.push({
          field: `player_${index}`,
          message: `Duplicate player entry: ${entry.playerName}`
        });
      }
      playerNames.add(entry.playerName);

      // Validate individual trick entry
      if (typeof entry.tricksTaken !== 'number' || !Number.isInteger(entry.tricksTaken)) {
        errors.push({
          field: `player_${index}_tricks`,
          message: `Player ${entry.playerName}: tricks must be a whole number`
        });
      } else if (entry.tricksTaken < 0) {
        errors.push({
          field: `player_${index}_tricks`,
          message: `Player ${entry.playerName}: tricks cannot be negative`
        });
      } else if (entry.tricksTaken > roundNumber) {
        errors.push({
          field: `player_${index}_tricks`,
          message: `Player ${entry.playerName}: cannot exceed ${roundNumber} trick(s)`
        });
      } else {
        totalTricks += entry.tricksTaken;
      }
    });

    // Check if total tricks equals round number
    if (totalTricks !== roundNumber && errors.length === 0) {
      errors.push({
        field: 'total',
        message: `Total tricks (${totalTricks}) must equal round number (${roundNumber}). Currently ${roundNumber - totalTricks} trick(s) unaccounted for`
      });
    }

    return errors;
  }

  /**
   * Calculates remaining tricks available
   * @param roundNumber - Current round number
   * @param entriesSoFar - Array of tricks already entered
   * @returns number - Remaining tricks available
   */
  getRemainingTricks(roundNumber: number, entriesSoFar: number[] = []): number {
    const totalEntered = entriesSoFar.reduce((sum, tricks) => sum + tricks, 0);
    return roundNumber - totalEntered;
  }
}
