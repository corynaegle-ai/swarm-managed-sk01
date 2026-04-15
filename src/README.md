# Scoreboard Display Feature

## Overview
A pirate-themed scoreboard component that displays current standings after each round, showing player names, round scores, and total scores with proper sorting and accessibility features.

## Components

### ScoreboardModal
**File**: `src/components/ScoreboardModal.tsx`

Main modal component displaying the scoreboard.

**Features**:
- Displays all players with their current total and round-by-round scores
- Sorts players by total score in descending order
- Highlights the current round with special styling
- Highlights the leading player
- Pirate-themed visual design with gold borders and wooden background
- Modal overlay for focus management
- Accessibility features (ARIA labels, semantic HTML)
- Responsive design for mobile devices

**Props**: None (uses Redux state)

**State Dependencies**:
- `game.isScoreboardOpen`: Controls visibility
- `game.players`: List of players
- `game.currentRound`: Current round number
- `game.roundScores`: Score data by player and round

### ScoreboardButton
**File**: `src/components/ScoreboardButton.tsx`

Button component to manually open the scoreboard.

**Features**:
- Pirate-themed styling matching the modal
- Accessibility labels and title attribute
- Dispatches Redux action to open scoreboard

**Props**:
- `className` (optional): Additional CSS classes

## Hooks

### useScoreboardAutoShow
**File**: `src/hooks/useScoreboardAutoShow.ts`

Custom hook that automatically opens the scoreboard when a round completes.

**Usage**:
```typescript
import useScoreboardAutoShow from './hooks/useScoreboardAutoShow';

const MyComponent = () => {
  useScoreboardAutoShow();
  // Component logic...
};
```

## Redux Store

**File**: `src/store/slices/gameSlice.ts`

Manages game state including:
- Player list
- Round scores
- Current round
- Scoreboard visibility state
- Round completion tracking

**Actions**:
- `setPlayers`: Initialize player list
- `addRoundScore`: Record a player's score for a round
- `completeRound`: Mark round as complete
- `nextRound`: Advance to next round
- `openScoreboard`: Show scoreboard
- `closeScoreboard`: Hide scoreboard
- `resetGame`: Reset all state

## Styling

**File**: `src/components/ScoreboardModal.css`

Pirate-themed CSS includes:
- Gold and brown color scheme (#d4af37, #ffd700, #3d2817)
- Gradient backgrounds with shadow effects
- Pirate symbols (☠, ⚓, ⚔️)
- Smooth animations (fade-in, slide-down, pulse)
- Responsive breakpoints for mobile (768px, 480px)
- Hover and active states for interactivity

## Integration Example

```typescript
import React from 'react';
import ScoreboardButton from './components/ScoreboardButton';
import ScoreboardModal from './components/ScoreboardModal';
import useScoreboardAutoShow from './hooks/useScoreboardAutoShow';

const GamePage = () => {
  useScoreboardAutoShow(); // Auto-show after round completion

  return (
    <div>
      <ScoreboardButton /> {/* Manual access button */}
      <ScoreboardModal /> {/* Display modal when open */}
      {/* Other game components */}
    </div>
  );
};

export default GamePage;
```

## Accessibility

- Semantic HTML with proper `role` attributes
- ARIA labels for all interactive elements
- Keyboard navigation support
- Focus management in modal
- Color contrast meeting WCAG standards
- Responsive font sizing for readability

## Testing

Test files included:
- `src/components/ScoreboardModal.test.tsx`: Modal component tests
- `src/components/ScoreboardButton.test.tsx`: Button component tests
- `src/hooks/useScoreboardAutoShow.test.ts`: Hook tests

**Run tests**:
```bash
npm test
```

## Acceptance Criteria Status

✅ All 6 acceptance criteria satisfied:
1. Display all players with current total scores - SATISFIED
2. Show round-by-round score breakdown - SATISFIED
3. Highlight current round results - SATISFIED
4. Sort players by total score descending - SATISFIED
5. Pirate-themed visual design - SATISFIED
6. Accessible via button and auto-shown after round completion - SATISFIED
