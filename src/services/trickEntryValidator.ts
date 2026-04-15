/**
 * Validation service for trick entries
 * Ensures all business rules are enforced for trick submission
 */

/**
 * Validates trick entries against all business rules
 * @param tricksByPlayer - Map of player IDs to tricks entered
 * @param roundNumber - Current round number (also the maximum tricks possible)
 * @param playerIds - List of all player IDs
 * @returns true if all entries are valid, false otherwise
 */
export function validateTrickEntries(
  tricksByPlayer: Record<string, number>,
  roundNumber: number,
  playerIds: string[]
): boolean {
  const errors = getTrickEntryErrors(tricksByPlayer, roundNumber, playerIds);
  return Object.keys(errors).length === 0;
}

/**
 * Gets detailed validation errors for trick entries
 * @param tricksByPlayer - Map of player IDs to tricks entered
 * @param roundNumber - Current round number
 * @param playerIds - List of all player IDs
 * @returns Object mapping player IDs or global keys to error messages
 */
export function getTrickEntryErrors(
  tricksByPlayer: Record<string, number>,
  roundNumber: number,
  playerIds: string[]
): Record<string, string> {
  const errors: Record<string, string> = {};

  // Validate each player's entry
  for (const playerId of playerIds) {
    const tricks = tricksByPlayer[playerId] ?? 0;

    // Check if tricks are negative (shouldn't be, but validate anyway)
    if (tricks < 0) {
      errors[playerId] = 'Tricks cannot be negative';
      continue;
    }

    // Check if tricks exceed the round number
    if (tricks > roundNumber) {
      errors[playerId] = `Cannot exceed ${roundNumber} tricks in round ${roundNumber}`;
      continue;
    }
  }

  // Check total tricks equals round number
  const totalTricks = Object.values(tricksByPlayer).reduce((sum, val) => sum + val, 0);
  if (totalTricks !== roundNumber) {
    errors.total = `Total tricks (${totalTricks}) must equal round number (${roundNumber})`;
  }

  return errors;
}

/**
 * Calculates remaining tricks available for entry
 * @param tricksByPlayer - Map of player IDs to tricks entered
 * @param roundNumber - Current round number
 * @returns Number of tricks remaining to be distributed
 */
export function getRemainingTricks(
  tricksByPlayer: Record<string, number>,
  roundNumber: number
): number {
  const totalEntered = Object.values(tricksByPlayer).reduce((sum, val) => sum + val, 0);
  return roundNumber - totalEntered;
}

/**
 * Checks if a player can enter a specific number of tricks
 * @param playerId - The player's ID
 * @param tricks - Number of tricks to validate
 * @param tricksByPlayer - Current trick entries
 * @param roundNumber - Current round number
 * @returns true if the entry is valid, false otherwise
 */
export function canEnterTricks(
  playerId: string,
  tricks: number,
  tricksByPlayer: Record<string, number>,
  roundNumber: number
): boolean {
  // Tricks cannot be negative
  if (tricks < 0) {
    return false;
  }

  // Tricks cannot exceed round number
  if (tricks > roundNumber) {
    return false;
  }

  // Calculate what total would be if this entry is made
  const currentTotal = Object.values(tricksByPlayer).reduce((sum, val) => sum + val, 0);
  const currentPlayerTricks = tricksByPlayer[playerId] ?? 0;
  const newTotal = currentTotal - currentPlayerTricks + tricks;

  // New total cannot exceed round number
  if (newTotal > roundNumber) {
    return false;
  }

  return true;
}
