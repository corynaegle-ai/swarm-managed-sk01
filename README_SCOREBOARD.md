# Scoreboard Display System

## Overview

This is a comprehensive scoreboard display system for a pirate-themed game application. It shows current standings after each round with player names, round scores, and total scores in a visually appealing, accessible interface.

## Components

### 1. **Scoreboard.vue**
Main scoreboard component that displays all players and their scores.

**Features:**
- Displays all players with current total scores
- Shows round-by-round score breakdown
- Highlights current round results
- Sorts players by total score in descending order
- Pirate-themed visual design
- Fully accessible with semantic HTML and ARIA labels
- Responsive design for mobile and desktop

**Props:**
- `players` (Array): Array of player objects with `id`, `name`, `roundScores`, and `totalScore`
- `currentRound` (Number): Current round number
- `autoShow` (Boolean): Whether to auto-show after round completion

**Events:**
- `scoreboard-shown`: Emitted when scoreboard is displayed
- `scoreboard-closed`: Emitted when scoreboard is closed

**Usage:**
```vue
<Scoreboard
  :players="players"
  :currentRound="currentRound"
  :autoShow="roundComplete"
  @scoreboard-shown="onScoreboardShown"
  @scoreboard-closed="onScoreboardClosed"
/>
```

### 2. **ScoreboardButton.vue**
Button component to toggle scoreboard visibility.

**Features:**
- Pirate-themed styling
- Shows current state (open/closed)
- Accessible with proper ARIA attributes
- Responsive icon and text display

**Props:**
- `isScoreboardOpen` (Boolean): Whether scoreboard is currently visible

**Events:**
- `toggle-scoreboard`: Emitted when button is clicked

**Usage:**
```vue
<ScoreboardButton
  :isScoreboardOpen="scoreboardVisible"
  @toggle-scoreboard="toggleScoreboard"
/>
```

### 3. **ScoreboardService.js**
Business logic service for scoreboard operations.

**Methods:**
- `getSortedPlayers(players)` - Returns players sorted by total score (descending)
- `getTotalScore(player)` - Gets player's total score
- `getRoundScores(player)` - Gets array of round scores
- `getAverageScore(player)` - Calculates average score across rounds
- `getHighestRoundScore(player)` - Gets player's best round
- `getLowestRoundScore(player)` - Gets player's worst round
- `getTotalRounds(players)` - Gets total number of rounds played
- `getPlayerById(players, playerId)` - Finds player by ID
- `getPlayerRank(players, playerId)` - Gets player's rank
- `formatScore(score)` - Formats score for display
- `getRoundScore(player, roundIndex)` - Gets score for specific round

**Usage:**
```javascript
import { scoreboardService } from '@/services/ScoreboardService';

const sortedPlayers = scoreboardService.getSortedPlayers(players);
const rank = scoreboardService.getPlayerRank(players, playerId);
```

## Styling

### Scoreboard.css Features:
- **Pirate Theme**: Wood texture, gold accents, skull symbols
- **Interactive Elements**: Hover effects, animations, visual feedback
- **Responsive Design**: Mobile-first approach with breakpoints at 768px and 480px
- **Accessibility**: High contrast colors, readable fonts, clear visual hierarchy
- **Animations**:
  - Fade-in effect for scoreboard appearance
  - Float animation for skull symbols
  - Pulse effect for top-ranked player
  - Smooth transitions for interactive elements

### Color Scheme:
- **Primary Gold**: `#ffd700` - Rankings, highlights
- **Wood Brown**: `#8B7355`, `#6B5344` - Background
- **Dark Brown**: `#3d2817` - Borders and accents
- **Red Accent**: `#DC143C` - Close button

## Data Structure

**Player Object:**
```javascript
{
  id: 1,
  name: 'Player Name',
  roundScores: [10, 20, 15],  // Array of scores per round
  totalScore: 45               // Sum of all round scores
}
```

## Integration Example

```vue
<template>
  <div class="game-container">
    <ScoreboardButton
      :isScoreboardOpen="scoreboardVisible"
      @toggle-scoreboard="toggleScoreboard"
    />
    
    <Scoreboard
      :players="players"
      :currentRound="currentRound"
      :autoShow="roundComplete"
      @scoreboard-shown="onScoreboardShown"
      @scoreboard-closed="onScoreboardClosed"
    />
  </div>
</template>

<script>
import Scoreboard from '@/components/Scoreboard.vue';
import ScoreboardButton from '@/components/ScoreboardButton.vue';

export default {
  components: {
    Scoreboard,
    ScoreboardButton
  },
  data() {
    return {
      scoreboardVisible: false,
      roundComplete: false,
      currentRound: 1,
      players: [
        {
          id: 1,
          name: 'Captain Hook',
          roundScores: [15, 20],
          totalScore: 35
        },
        {
          id: 2,
          name: 'Blackbeard',
          roundScores: [12, 18],
          totalScore: 30
        }
      ]
    };
  },
  methods: {
    toggleScoreboard() {
      this.scoreboardVisible = !this.scoreboardVisible;
    },
    onScoreboardShown() {
      console.log('Scoreboard is now visible');
    },
    onScoreboardClosed() {
      console.log('Scoreboard is now hidden');
    }
  }
};
</script>
```

## Accessibility Features

1. **Semantic HTML**:
   - Proper use of table elements (`<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>`)
   - Meaningful headings
   - Button elements with proper labels

2. **ARIA Attributes**:
   - `role="main"` on main scoreboard container
   - `role="table"` on standings table
   - `role="row"` on table rows
   - `role="gridcell"` on table cells
   - `scope="col"` on header cells
   - `aria-label` on interactive elements
   - `aria-pressed` on toggle button

3. **Keyboard Navigation**:
   - All interactive elements are keyboard accessible
   - Proper focus management
   - Clear visual focus indicators

4. **Screen Reader Support**:
   - Descriptive labels for all elements
   - Proper table semantics for data presentation
   - Context-aware descriptions via `title` attributes

## Testing

Comprehensive test suites are included:

### Scoreboard.spec.js
- Component rendering and visibility
- Player display and sorting
- Round score highlighting
- Auto-show functionality
- User interactions
- Accessibility features

### ScoreboardService.spec.js
- Sorting and ranking logic
- Score calculations
- Data formatting
- Edge case handling

**Run tests:**
```bash
npm run test
```

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari 14+, Chrome Mobile 90+)

## Performance Considerations

- Efficient sorting with computed properties
- Minimal re-renders through proper Vue reactivity
- CSS animations use GPU acceleration (transform, opacity)
- Scrollable container for large player lists
- Responsive images and icons

## Future Enhancements

- Sorting options (by round, by rank, etc.)
- Player comparison view
- Historical statistics
- Export scores to CSV/PDF
- Animations for score updates
- Sound effects for pirate theme
- Multiplayer tournament support

## License

Built for the Swarm Game Framework
