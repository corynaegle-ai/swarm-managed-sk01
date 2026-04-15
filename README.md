# Trick Entry System

## Overview

This implementation provides a complete trick entry system for card games (like Hearts, Spades, or Bridge) that allows players to enter the number of tricks they won after each round.

## Features

### 1. Enter Tricks Taken for Each Player
- Clean form interface with an input field for each player
- Players can enter 0 or more tricks
- Input fields are labeled with player names

### 2. Running Total of Remaining Tricks
- Displays remaining tricks available in real-time
- Updates dynamically as users make entries
- Shows total tricks needed for the round

### 3. Cannot Enter More Tricks Than Available
- Validation prevents entries exceeding the round number
- Validation prevents total entries exceeding round number
- Clear error messages explain what went wrong

### 4. Total Tricks Must Equal Round Number
- Validates that all tricks sum to the exact round number
- Prevents submission if any tricks are unaccounted for
- Shows how many tricks are still needed

### 5. Validation Errors
- Comprehensive error messages for all validation failures
- Errors clear when user modifies inputs
- Global error banner for summary-level issues
- Field-specific error messages for individual entries

## File Structure

```
src/
├── services/
│   ├── TrickValidator.ts          # Core validation logic
│   └── __tests__/
│       └── TrickValidator.test.ts # Validator unit tests
├── components/
│   ├── TrickEntry.tsx             # React component for trick entry
│   └── __tests__/
│       └── TrickEntry.test.tsx    # Component integration tests
├── styles/
│   └── TrickEntry.css             # Component styling
└── README.md                       # This file
```

## Usage

### Basic Example

```tsx
import { TrickEntry } from './components/TrickEntry';

function RoundPage() {
  const handleSubmit = (entries) => {
    console.log('Tricks submitted:', entries);
    // Process trick entries, update game state, etc.
  };

  return (
    <TrickEntry
      players={['Alice', 'Bob', 'Charlie', 'Diana']}
      roundNumber={4}
      onSubmit={handleSubmit}
      onCancel={() => console.log('Cancelled')}
    />
  );
}
```

### Component Props

```typescript
interface TrickEntryProps {
  players: string[];           // Array of player names
  roundNumber: number;         // Current round (also number of tricks to distribute)
  onSubmit: (entries: TrickEntryData[]) => void;  // Callback on valid submission
  onCancel?: () => void;       // Optional callback for cancellation
}

interface TrickEntryData {
  playerName: string;          // Name of player
  tricksTaken: number;         // Number of tricks won
}
```

## Validation Rules

### Single Trick Validation
- Must be a whole number (integer)
- Must be non-negative (>= 0)
- Cannot exceed round number
- Cannot cause total to exceed round number

### All Tricks Validation
- At least one entry required
- No duplicate player names
- Sum of all tricks must equal round number exactly
- All individual entries must pass single trick validation

## Testing

Both unit tests and integration tests are included:

```bash
# Run all tests
npm test

# Run specific test suite
npm test TrickValidator
npm test TrickEntry
```

### Test Coverage

**TrickValidator tests:**
- Single trick validation (valid entries, invalid values, negatives, exceeding limits)
- All tricks validation (complete entries, under/over totals, duplicates, non-integers)
- Remaining tricks calculation

**TrickEntry component tests:**
- Form rendering with player inputs
- User input handling
- Remaining tricks display updates
- Validation error display and clearing
- Submit and cancel functionality
- Edge cases (zero tricks, different player counts)

## Error Messages

The system provides clear, actionable error messages:

- "Tricks taken must be a whole number"
- "Tricks taken cannot be negative"
- "Cannot enter more than X trick(s) in this round"
- "Only X trick(s) remaining. You cannot enter Y"
- "Total tricks (X) must equal round number (Y). Currently Z trick(s) unaccounted for"
- "Duplicate player entry: [Player Name]"

## Styling

The component includes responsive CSS styling with:
- Clean, modern appearance
- Visual feedback for valid/invalid inputs
- Mobile-friendly responsive design
- Accessible color contrast
- Clear visual hierarchy

## Integration with Game Logic

To integrate with your game state management:

```tsx
const handleTricksSubmitted = (entries: TrickEntryData[]) => {
  // Update player scores
  entries.forEach(entry => {
    const player = gameState.players.find(p => p.name === entry.playerName);
    if (player) {
      player.roundTricks = entry.tricksTaken;
      updatePlayerScore(player);
    }
  });
  
  // Move to next round or end game
  if (currentRound === maxRounds) {
    endGame();
  } else {
    startNextRound();
  }
};
```

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- React 16.8+ (Hooks support)
- TypeScript 4.0+

## Future Enhancements

- Keyboard shortcuts for navigation
- Undo/redo functionality
- Batch entry mode
- Export/import functionality
- Accessibility improvements (ARIA labels)
